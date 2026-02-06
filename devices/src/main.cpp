#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "HX711.h"
#include "DHT.h"  
#include "MQ135.h"  
#include <math.h> 
#include <ArduinoJson.h>  
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <WiFi.h>

const char* ssid = "hehehe";      //Wifi connect
const char* password = "12345678";   //Password

const char* mqtt_server = "700e6c8c95b64d528be62f3aef6394ae.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_username = "QuailcareAI"; //User
const char* mqtt_password = "Abcd1234"; //Password
//--------------------------------------------------
WiFiClientSecure espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];


// ---- Pin map ----

// LCD
#define I2C_SDA   21
#define I2C_SCL   22
#define LCD_ADDR  0x27   

// HX711
#define LOADCELL_DOUT_PIN 16
#define LOADCELL_SCK_PIN   4
float kg = NAN;

// DHT11
#define DHT_PIN   25
#define DHTTYPE  DHT11
static float tC = NAN, h = NAN;

// Relay quạt
#define RELAY_FAN_PIN 26
const bool RELAY_ACTIVE_LOW = true; 

// MQ135
#define MQ135_PIN 34
#define EMA_ALPHA (1.0f/480.0f)
MQ135 AirQ(MQ135_PIN);
float co_ppm = NAN;
int aqi_percent;

static float co8h_ema = NAN;
static uint32_t lastSecMs = 0;   // thời gian cập nhật CO mỗi giây
static float co_sum = 0;
static uint16_t co_n = 0;

// Wind Sensor
#define WIND_PIN 15
float Level = NAN;
float analogWind = NAN;

// LCD
LiquidCrystal_I2C lcd(LCD_ADDR, 16, 2);
HX711 scale;
DHT dht(DHT_PIN, DHTTYPE);

// timer for lcd
const uint32_t PAGE_PERIOD_MS = 2000;   
uint8_t currentPage = 0;                
uint32_t lastPageSwitchMs = 0;

float CALIBRATION_FACTOR = 2280.0f;   
const float FAN_ON_C  = 30.0f;        
const float FAN_OFF_C = 27.0f;        

bool fanOn = false;

// ================= PROTOTYPE =================
void lcdPrint16(uint8_t row, const String &s);
void setRelay(uint8_t pin, bool on);
void ReadDHT11();
void ReadLoadCell();
void ReadMQ135();
void ReadWind();
void UpdateFanByTemp();
void MonitorLCD();
void WindInit();

void setup_wifi();
void reconnect();
void callback(char* topic, byte* payload, unsigned int length);
void publishMessage(const char* topic, String payload, boolean retained);


// =============================================

void lcdPrint16(uint8_t row, const String &s) {
  char buf[17];
  snprintf(buf, sizeof(buf), "%-16.16s", s.c_str());
  lcd.setCursor(0, row);
  lcd.print(buf);
}

void setRelay(uint8_t pin, bool on) {
  pinMode(pin, OUTPUT);
  if (RELAY_ACTIVE_LOW) digitalWrite(pin, on ? LOW : HIGH);
  else                  digitalWrite(pin, on ? HIGH : LOW);
}

void WindInit() {
  analogSetPinAttenuation(WIND_PIN, ADC_11db);  
}

void setup() {
  Serial.begin(115200);
  delay(50);

  setup_wifi();
  espClient.setInsecure();
  client.setServer(mqtt_server, mqtt_port);
  client.setBufferSize(512);
  client.setCallback(callback);
  
  // I2C + LCD
  Wire.begin(I2C_SDA, I2C_SCL);
  lcd.init();
  lcd.backlight();

  lcdPrint16(0, "Init sensors...");
  lcdPrint16(1, "Please wait");

  // Relay quạt
  setRelay(RELAY_FAN_PIN, false);

  // DHT
  dht.begin();
  
  // MQ135
  pinMode(MQ135_PIN, INPUT);

  // WIND 
  pinMode(WIND_PIN, INPUT);
  WindInit();

  // HX711
  pinMode(LOADCELL_SCK_PIN, OUTPUT);
  digitalWrite(LOADCELL_SCK_PIN, LOW);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale(CALIBRATION_FACTOR);

  if (!scale.wait_ready_timeout(3000)) {
    Serial.println("[ERR] HX711 NOT READY. Check wiring.");
    lcdPrint16(0, "HX711 NOT READY");
    lcdPrint16(1, "Check wiring   ");
  } else {
    lcdPrint16(0, "Taring...");
    lcdPrint16(1, "Remove weights ");
    scale.tare(10);
    lcdPrint16(0, "Tare done      ");
    lcdPrint16(1, "Ready          ");
    delay(600);
  }
}
unsigned long timeUpdata=millis();
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Duy trì kết nối MQTT

  // Đọc cảm biến liên tục để cập nhật biến toàn cục
  ReadDHT11();
  UpdateFanByTemp();
  ReadLoadCell();
  ReadMQ135();
  ReadWind();
  MonitorLCD();

  // --- GỬI DỮ LIỆU LÊN MQTT MỖI 5 GIÂY ---
  static unsigned long lastPublishTime = 0;
  if (millis() - lastPublishTime > 5000) { 
    lastPublishTime = millis();
    StaticJsonDocument<256> doc;
    
    doc["temp"] = isnan(tC) ? 0 : tC;
    doc["humi"] = isnan(h) ? 0 : h;
    doc["mq135"] = aqi_percent;
    doc["wind"] = isnan(Level) ? 0 : Level;
    doc["weight"] = isnan(kg) ? 0 : kg;
    doc["fan"] = fanOn ? "ON" : "OFF";

    char mqtt_message[256];
    serializeJson(doc, mqtt_message);

    publishMessage("  s", mqtt_message, true);
  }

  delay(10); 
}

// ================== SENSOR FUNCTIONS ===================

void ReadDHT11(){
  static uint32_t lastDhtMs = 0;
  if (millis() - lastDhtMs >= 1000) {
    lastDhtMs = millis();
    h  = dht.readHumidity();
    tC = dht.readTemperature(); // °C
  }
}

void ReadLoadCell(){
  static uint32_t lastDbg = 0;

  if (!scale.is_ready()) {
    if (millis() - lastDbg > 1000) {
      lastDbg = millis();
      Serial.print("[HX711] NOT READY, DOUT=");
      Serial.println(digitalRead(LOADCELL_DOUT_PIN)); // thường sẽ là 1
    }
    return;
  }

  float v = scale.get_units(5);
  Serial.print("[HX711] raw kg=");
  Serial.println(v, 3);

  if (!isnan(v)) {
    if (v < -0.02f) v = 0;
    kg = v;
  }
}


void ReadMQ135() {
  float current_ppm = AirQ.getPPM(); 
  

  co_ppm = current_ppm;

  aqi_percent = map((long)co_ppm, 400, 2000, 0, 100);
  if (aqi_percent < 0) aqi_percent = 0;
  if (aqi_percent > 100) aqi_percent = 100;

  Serial.print("PPM: "); Serial.print(co_ppm);
  Serial.print(" | AQI (Scale 0-100): "); Serial.println(aqi_percent);
  
}


void ReadWind(){
  static uint32_t lastWindMs = 0;  
  if (millis() - lastWindMs < 250) return; 
  lastWindMs = millis();

  analogWind = analogRead(WIND_PIN);
  float outvoltage = analogWind * (3.3 / 4095.0);
  Serial.print("Dien ap = ");
  Serial.print(outvoltage);
  Serial.println("V");

  Level = 60/3.3 * outvoltage; // Wind speed level ~ voltage
  Serial.print("Cap do gio ");
  Serial.println(Level);
}

void UpdateFanByTemp() {
  bool dhtOK = !(isnan(h) || isnan(tC));
  if (dhtOK) {
    if (!fanOn && tC >= FAN_ON_C)  fanOn = true;
    if (fanOn  && tC <= FAN_OFF_C) fanOn = false;
    setRelay(RELAY_FAN_PIN, fanOn);
  }
}

void MonitorLCD(){
  // --- In Serial ---
  Serial.print("T=");
  if (isnan(tC)) Serial.print("NaN");
  else           Serial.print(tC, 1);
  Serial.print("C  H=");
  if (isnan(h))  Serial.print("NaN");
  else           Serial.print(h, 0);
  Serial.print("%  AQI=");           
  if (aqi_percent < 0)   Serial.print("NA"); 
  else           Serial.print(aqi_percent, 0);  
  Serial.print("%  Fan=");
  Serial.print(fanOn ? "ON" : "OFF");
  Serial.print("  W=");
  if (isnan(kg)) Serial.print("NA");
  else           Serial.print(kg, 3);
  Serial.println(" kg");

  // IN LCD
  if (!isnan(tC) && !isnan(h)) {
    char l0[17];
    snprintf(l0, sizeof(l0), "T:%4.1fC H:%2.0f%%", tC, h);
    lcdPrint16(0, l0);
  } else {
    lcdPrint16(0, "DHT11 ERROR    ");
  }

  if (millis() - lastPageSwitchMs >= PAGE_PERIOD_MS) {
    lastPageSwitchMs = millis();
    currentPage ^= 1; 
  }
  
  char l1[17];
  if (currentPage == 0) {
    // Trang A: Weight + Fan
    if (!isnan(kg)) snprintf(l1, sizeof(l1), "W:%5.3fkg F:%s", kg, fanOn ? "ON " : "OFF");
    else            snprintf(l1, sizeof(l1), "W:NA      F:%s", fanOn ? "ON " : "OFF");
  } else {
    // Trang B: MQ135 + Wind
    float mq = isnan(aqi_percent) ? -1 : aqi_percent;
    float wd = isnan(Level)  ? -1 : Level;
    if (mq < 0 || wd < 0) snprintf(l1, sizeof(l1), "MQ:NA   Wd:NA  ");
    else                  snprintf(l1, sizeof(l1), "MQ:%4.0f Wd:%4.0f", mq, wd);
  }
  lcdPrint16(1, l1);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
//------------Connect to MQTT Broker-----------------------------
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientID =  "ESPClient-";
    clientID += String(random(0xffff),HEX);
    if (client.connect(clientID.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      client.subscribe("esp32/client");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
//-----Call back Method for Receiving MQTT massage---------
void callback(char* topic, byte* payload, unsigned int length) {
  String incommingMessage = "";
  for(int i=0; i<length;i++) incommingMessage += (char)payload[i];
  Serial.println("Massage arived ["+String(topic)+"]"+incommingMessage);
}
//-----Method for Publishing MQTT Messages---------
void publishMessage(const char* topic, String payload, boolean retained){
  if (client.publish(topic, payload.c_str(), retained)) {
    Serial.print("Published [");
    Serial.print(topic);
    Serial.print("]: ");
    Serial.println(payload);
  } else {
    Serial.println("Publish failed! Check connection or buffer size.");
  }
}
