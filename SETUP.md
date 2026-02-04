# 🚀 Hướng dẫn Setup QualiCare AI

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (khuyến nghị >= 9.0.0)
- **PostgreSQL**: >= 14
- **Git**: Latest version

## 🔧 Bước 1: Clone Repository

```bash
git clone https://github.com/DuyITLOR/QualiCare_AI.git
cd QualiCare_AI
```

## 📦 Bước 2: Cài đặt pnpm

```bash
# Cài pnpm globally
npm install -g pnpm

# Hoặc dùng npm
npm install -g pnpm@latest
```

## 🗄️ Bước 3: Setup Database

### Tạo PostgreSQL Database

```bash
# Đăng nhập PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE qualicare_db;

# Tạo user (optional)
CREATE USER qualicare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE qualicare_db TO qualicare_user;

# Exit
\q
```

## ⚙️ Bước 4: Cấu hình Environment Variables

### Server

```bash
cd server
cp .env.example .env
```

Chỉnh sửa file `server/.env`:

```env
PORT=5050
DATABASE_URL="postgresql://qualicare_user:your_password@localhost:5432/qualicare_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
GEMINI_API_KEY="your-gemini-api-key"
```

### Client

```bash
cd ../client
cp .env.example .env
```

File `client/.env` mặc định:

```env
VITE_API_BASE="http://localhost:5050"
```

## 📚 Bước 5: Cài đặt Dependencies

Từ thư mục root:

```bash
cd ..
pnpm install
```

Lệnh này sẽ tự động:

- Cài đặt dependencies cho tất cả workspaces
- Generate Prisma Client
- Setup monorepo

## 🗃️ Bước 6: Setup Database Schema

```bash
# Run Prisma migrations
pnpm --filter server migrate

# Hoặc
cd server
pnpm migrate
```

## 🧪 Bước 7: Test Setup

### Test TypeScript compilation

```bash
# From root
pnpm typecheck
```

### Test Server

```bash
# Terminal 1 - Start server
pnpm dev:server

# Kiểm tra: http://localhost:5050/health
# Nên thấy: {"status":"OK","message":"QuailCare AI Server is running"}
```

### Test Client

```bash
# Terminal 2 - Start client
pnpm dev:client

# Mở browser: http://localhost:5173
```

## 🚀 Bước 8: Chạy Full Stack

Từ thư mục root, chạy cả client và server:

```bash
pnpm dev
```

Hoặc chạy riêng:

```bash
# Terminal 1 - Server
pnpm dev:server

# Terminal 2 - Client
pnpm dev:client
```

## 📱 Bước 9: Setup IoT Devices (Optional)

Xem hướng dẫn trong `devices/README.md`

## 🔍 Troubleshooting

### Lỗi "Cannot find module"

```bash
pnpm install
pnpm --filter server generate
```

### Lỗi Database connection

- Kiểm tra PostgreSQL đang chạy
- Xác nhận DATABASE_URL trong `.env`
- Test connection: `psql postgresql://...`

### Lỗi Port đã được sử dụng

```bash
# Tìm process đang dùng port 5050
lsof -i :5050

# Kill process
kill -9 <PID>
```

### Lỗi Prisma

```bash
cd server
pnpm prisma generate
pnpm prisma migrate dev
```

## 🎯 Next Steps

1. ✅ Tạo tài khoản qua `/register` endpoint
2. ✅ Login và lấy JWT token
3. ✅ Test chat với AI
4. ✅ Connect IoT devices (optional)

## 📚 Useful Commands

```bash
# Development
pnpm dev                    # Chạy tất cả
pnpm dev:client             # Chỉ client
pnpm dev:server             # Chỉ server

# Build
pnpm build                  # Build tất cả
pnpm build:client           # Build client
pnpm build:server           # Build server

# Database
pnpm prisma:generate        # Generate Prisma Client
pnpm migrate               # Run migrations

# Type checking
pnpm typecheck             # Check types tất cả packages

# Linting
pnpm lint                  # Lint code

# Clean
pnpm clean                 # Xóa node_modules và build files
```

## 🌟 Production Deployment

Xem hướng dẫn deployment trong `DEPLOYMENT.md` (coming soon)

## 💬 Support

Nếu gặp vấn đề, hãy:

1. Check issues trên GitHub
2. Tạo issue mới với log chi tiết
3. Liên hệ qua email/Discord

---

Happy Coding! 🎉
