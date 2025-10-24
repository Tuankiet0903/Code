# Sử dụng image Node.js chính thức (nhẹ, ổn định)
FROM node:20-bullseye

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file cấu hình npm trước (tận dụng cache)
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn còn lại
COPY . .

# Expose cổng ứng dụng (ví dụ Express chạy ở 3000)
EXPOSE 3000

RUN npx prisma generate

# Lệnh khởi động ứng dụng
CMD ["npm", "start"]
