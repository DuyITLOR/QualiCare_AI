# QualiCare AI - Monorepo

Hệ thống giám sát sức khỏe chim cút thông minh với AI

## 🏗️ Cấu trúc Monorepo

```
QualiCare_AI/
├── client/          # React + TypeScript + Vite frontend
├── server/          # Express + TypeScript backend
├── devices/         # PlatformIO ESP32 code
└── MedQA/          # Medical QA knowledge base
```

## 🚀 Yêu cầu

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0
- **Database**: PostgreSQL (Prisma)

## 📦 Cài đặt

```bash
# Cài pnpm nếu chưa có
npm install -g pnpm

# Cài đặt tất cả dependencies
pnpm install
```

## 🛠️ Development

### Chạy tất cả services cùng lúc:

```bash
pnpm dev
```

### Chạy riêng từng service:

**Client:**

```bash
pnpm dev:client
# hoặc
cd client && pnpm dev
```

**Server:**

```bash
pnpm dev:server
# hoặc
cd server && pnpm dev
```

## 🏗️ Build

```bash
# Build tất cả
pnpm build

# Build riêng
pnpm build:client
pnpm build:server
```

## 🔧 Database Setup

```bash
# Generate Prisma Client
pnpm prisma:generate

# Run migrations
pnpm migrate
```

## 📝 Scripts

- `pnpm dev` - Chạy cả client và server trong dev mode
- `pnpm build` - Build production
- `pnpm typecheck` - Type checking cho tất cả packages
- `pnpm lint` - Lint tất cả code
- `pnpm clean` - Xóa node_modules và build files

## 🌍 Environment Variables

### Server (.env)

```env
PORT=5050
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### Client (.env)

```env
VITE_API_BASE="http://localhost:5050"
```

## 🧰 Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Chart.js

### Backend

- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Google Gemini AI

### DevOps

- pnpm workspaces
- ESLint
- TypeScript

## 📱 Devices (ESP32)

Xem hướng dẫn chi tiết trong `devices/README.md`

## 🤝 Contributing

1. Fork repo
2. Tạo branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT
