# 🚀 EX1 – Express + Prisma + PostgreSQL + Docker

## 🧩 Giới thiệu

Đây là một project mẫu sử dụng **Express.js** làm backend framework, **Prisma ORM** để tương tác cơ sở dữ liệu **PostgreSQL**, và **Docker Compose** để dễ dàng chạy toàn bộ môi trường.

Cấu trúc được thiết kế để:

- Dễ phát triển và triển khai
- Hỗ trợ tách biệt môi trường **local** và **Docker**
- Tự động chạy migration và seed khi khởi động container

---

## ⚙️ Công nghệ sử dụng

| Thành phần                  | Phiên bản / Mô tả          |
| --------------------------- | -------------------------- |
| **Node.js**                 | 18 (Alpine)                |
| **Express.js**              | Backend framework          |
| **Prisma ORM**              | ORM hiện đại cho Node.js   |
| **PostgreSQL**              | Cơ sở dữ liệu              |
| **Docker & Docker Compose** | Quản lý môi trường dễ dàng |
| **dotenv**                  | Quản lý biến môi trường    |

---

## 🏗️ Cấu trúc thư mục

├── prisma/
│ ├── schema.prisma # Định nghĩa model & datasource
│ ├── seed.js # Dữ liệu mẫu (seed)
│
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── services/
│ ├── app.js
│ ├── server.js # Entry chính của ứng dụng
│
├── Dockerfile # Cấu hình build ứng dụng
├── docker-compose.yml # Chạy app + PostgreSQL
├── .env # Biến môi trường
├── package.json
└── README.md

---

## 🔧 Cấu hình `.env`

Tạo file `.env` ở thư mục gốc của project với nội dung sau:

```env
# Cấu hình cho môi trường local
DATABASE_URL="postgresql://postgres:root@localhost:5432/prisma_db?schema=public"
PORT=3000
```

> ⚠️ **Lưu ý:**  
> Khi chạy ứng dụng bằng **Docker**, tệp **docker-compose.yml** sẽ tự động cung cấp biến môi trường `DATABASE_URL` vào container.
>
> Nhờ đó, bạn **không cần chỉnh sửa file `.env`** cho Docker — ứng dụng sẽ tự kết nối đến PostgreSQL nội bộ trong mạng Docker (qua host `db:5432`).

---

## 🐳 Chạy ứng dụng với Docker

### 1️⃣ Build và khởi động container

```bash
npm run build
```

Lệnh này thực chất tương đương với:

```bash
docker compose up --build
```

Docker sẽ tự động:

- Build image Node.js và PostgreSQL
- Cài đặt dependencies
- Chạy migration và seed dữ liệu
- Mở port `3000` cho ứng dụng

Sau khi hoàn tất, ứng dụng sẽ chạy tại:  
👉 [http://localhost:3000](http://localhost:3000)

---

### 2️⃣ Chạy lại sau khi đã build

Khi image đã được build sẵn, chỉ cần:

```bash
docker compose up
```

Hoặc nếu muốn rebuild toàn bộ từ đầu (bao gồm xóa container cũ):

```bash
docker compose up --build --force-recreate
```

---

### 3️⃣ Dừng và xoá container

```bash
docker compose down
```

Nếu muốn xoá luôn dữ liệu database (volume):

```bash
docker compose down -v
```

---

## 🧠 Chạy ứng dụng local (không dùng Docker)

1. Đảm bảo PostgreSQL đang chạy ở local (`localhost:5432`)
2. Cập nhật file `.env` cho đúng connection string
3. Cài đặt dependencies:
   ```bash
   npm install
   ```
4. Chạy migration và seed dữ liệu:
   ```bash
   npx prisma migrate dev --name init
   node prisma/seed.js
   ```
5. Khởi động server:
   ```bash
   npm run dev
   ```

---

## 🧰 Các lệnh hữu ích

| Lệnh                | Mô tả                                                  |
| ------------------- | ------------------------------------------------------ |
| `npm run dev`       | Chạy ứng dụng ở chế độ phát triển (nodemon)            |
| `npm start`         | Chạy ứng dụng ở chế độ production                      |
| `npm run build`     | Build và khởi động toàn bộ hệ thống bằng Docker        |
| `npm run clean`     | Xóa node_modules, cache npm, và cài lại dependencies   |
| `npx prisma studio` | Giao diện web để xem và quản lý dữ liệu trong database |

---

## 🧩 Prisma CLI hữu ích

Một số lệnh Prisma thường dùng:

```bash
# Chạy migration
npx prisma migrate dev --name init

# Cập nhật Prisma Client khi thay đổi schema
npx prisma generate

# Truy cập giao diện Prisma Studio
npx prisma studio
```

---

## 🪄 Gợi ý mở rộng

- Tách `.env.local` và `.env.docker` để dễ quản lý biến môi trường giữa local và container.
- Có thể dùng thư viện [dotenv-flow](https://www.npmjs.com/package/dotenv-flow) để tự động chọn file `.env` tương ứng.
- Tích hợp thêm `Swagger` để tự động sinh API docs.
- Thêm `Jest` hoặc `Vitest` cho unit testing.

---

## ✨ Tác giả

👨‍💻 **Kyte Hoang**  
📧 Email: [your-email@example.com]  
🌐 GitHub: [https://github.com/yourusername](https://github.com/yourusername)

---

## 📜 Giấy phép

Phát hành theo giấy phép **MIT License © 2025 Kyte Hoang**
