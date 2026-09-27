# Hệ thống Quản lý thực tập sản xuất tại doanh nghiệp

Đồ án thực tập tốt nghiệp – Trường Cao đẳng Cơ điện Tây Bắc.
Công nghệ: **Node.js + Express + MongoDB (Mongoose) + PUG**, mô hình **MVC**.

## 1. Cài đặt

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
# Sửa MONGO_URL trong .env nếu dùng MongoDB Atlas
npm run seed              # tạo dữ liệu mẫu
npm run dev               # chạy ở chế độ development
```

Mở http://localhost:3000 – đăng nhập bằng `admin@tybac.edu.vn` / `123456`.

## 2. Cấu trúc thư mục (MVC)

```
config/       Cấu hình DB và hằng số hệ thống
models/       Schema Mongoose – tầng Model
controllers/  Xử lý nghiệp vụ – tầng Controller
routes/       Khai báo đường dẫn, ánh xạ URL -> controller
views/        Giao diện PUG – tầng View
middlewares/  Xác thực (auth) và phân quyền (permission)
validates/    Kiểm tra dữ liệu đầu vào phía server
helpers/      Hàm dùng chung: tìm kiếm, lọc, phân trang
scripts/      Script tạo dữ liệu mẫu
docs/         ERD và tài liệu thiết kế
```

## 3. Luồng xử lý một request

```
Browser -> routes -> middleware (auth, permission) -> validate
        -> controller -> model (Mongoose) -> MongoDB
        -> controller render view PUG -> HTML trả về Browser
```

## 4. Các module của hệ thống

- Đăng nhập / đăng xuất (bcrypt + token trong cookie)
- Phân quyền theo nhóm quyền (Role) và mã quyền
- Quản lý doanh nghiệp (CRUD đầy đủ + lọc + tìm kiếm + phân trang)
- Quản lý đợt thực tập (danh sách, tạo mới, sửa, xóa mềm, chi tiết)
- Phân công HSSV – doanh nghiệp – giáo viên hướng dẫn (nghiệp vụ trọng tâm)
- Nhật ký hướng dẫn theo tuần
- Đánh giá kết quả và bảng tổng hợp kết quả theo đợt
- Màn hình "Nhiệm vụ của tôi" dành cho giáo viên hướng dẫn
- Quản lý danh mục: khoa/phòng, ngành nghề, lớp, giáo viên, HSSV, tài khoản,
  nhóm quyền — dùng chung một controller sinh từ `config/danh-muc.config.js`
- Trang tổng quan (dashboard) thống kê

## 5. Tài liệu đi kèm

- `docs/erd.mermaid` – mô hình dữ liệu ERD


### HƯỚNG DẪN CHẠY
# LẦN DẦU
- Mở thư mục quan-ly-thuc-tap trong VS Code, mở Terminal (Ctrl + ~)
- chạy từng lệnh một
        npm install
Chạy 1–3 phút, xong sẽ có thư mục node_modules.
        copy .env.example .env
        npm run seed
Thành công sẽ in ra khung Tao du lieu mau thanh cong! kèm 3 tài khoản.
        npm run dev
Thấy [DB] Ket noi MongoDB thanh cong và [APP] Server chay tai http://localhost:3000 .
 Mở trình duyệt vào http://localhost:3000, 
 đăng nhập 
 admin@tybac.edu.vn / 123456
 khoa@tybac.edu.vn / 123456
 gv001@tybac.edu.vn / 123456
 gv002@tybac.edu.vn / 123456

# LẦN SAU
1. Mở MongoDB Compass bấm kết nối localhost:27017. Vào được là MongoDB đang chạy

        Nếu lần trước bật bằng dịch vụ: Windows + R → services.msc → chuột phải MongoDB Server → Start.
2. Chạy chương trình

Mở thư mục quan-ly-thuc-tap trong VS Code, mở Terminal, 
chạy:
        npm run dev

 Mở trình duyệt vào http://localhost:3000, 
 đăng nhập 
 admin@tybac.edu.vn / 123456
 khoa@tybac.edu.vn / 123456
 gv001@tybac.edu.vn / 123456
 gv002@tybac.edu.vn / 123456