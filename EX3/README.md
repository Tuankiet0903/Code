# 🛒 SmartShop API

SmartShop API là backend được xây dựng bằng **ExpressJS**, cung cấp các API cho hệ thống thương mại điện tử bao gồm:

- Đăng nhập / đăng ký người dùng
- Quản lý sản phẩm & danh mục
- Giỏ hàng
- Quản trị viên (admin)
- Tích hợp Redis caching và Swagger documentation

---

## 🚀 Tính năng chính

- **ExpressJS + Node.js**
- **PostgreSQL / MySQL** (qua Prisma ORM)
- **Redis cache** để tăng tốc truy vấn
- **Swagger UI** mô tả API
- **Winston logger** + **Morgan** để ghi lại toàn bộ hoạt động của server
- **Log xoay theo ngày (daily rotate)** — mỗi ngày tạo 1 file log riêng
- **Bắt lỗi toàn cục:** bao gồm lỗi API, Promise chưa xử lý, crash ứng dụng

---

## 📂 Cấu trúc thư mục

```
src/
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── products.js
│   ├── cart.js
│   └── user.js
├── middleware/
│   └── auth.js
├── utils/
│   ├── logger.js          # Winston cấu hình log theo ngày
│   └── morganLogger.js    # Ghi log request
├── swagger.js
├── app.js                 # Express config, middleware, route
└── server.js              # Chạy server + bắt lỗi toàn cục
```

---

## ⚙️ Cài đặt & Chạy dự án

### 1️⃣ Cài đặt dependencies

```bash
npm install
```

### 2️⃣ Tạo file môi trường `.env`

```env
PORT= 3000
DATABASE_URL= "your database url"
REDIS_URL= "your redis url"
```

### 3️⃣ Chạy server

```bash
npm run start
```

Server chạy tại:  
👉 http://localhost:3000  
Swagger docs:  
👉 http://localhost:3000/api-docs

---

## 💻 Môi trường phát triển

| Thành phần         | Phiên bản khuyến nghị |
| ------------------ | --------------------- |
| Node.js            | ≥ 18.x                |
| npm                | ≥ 9.x                 |
| PostgreSQL / MySQL | ≥ 13.x                |
| Redis              | ≥ 6.x                 |

---

## 🧩 Giấy phép

MIT License © 2025 SmartShop Backend
