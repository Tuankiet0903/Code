🏗️ Tạo bảng / cột mới trong DB	
    npx prisma migrate dev --name <tên_migration>	
        Prisma sinh file migration SQL và áp dụng lên DB.
🧹 Xóa DB và chạy lại từ đầu
	npx prisma migrate reset
	    Dùng khi bạn muốn làm sạch DB (dev mode).
🧠 Chỉ cập nhật Prisma Client (không đụng DB)
	npx prisma generate
    	Khi bạn chỉ thay đổi generator hoặc muốn refresh types.
🧩 Muốn preview SQL mà không apply
	npx prisma migrate diff
    	So sánh schema với DB hiện tại.