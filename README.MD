# 🖥️ PC Store - Backend E-commerce System

<p align="center">
  Một hệ thống backend mạnh mẽ và hoàn chỉnh cho website thương mại điện tử chuyên cung cấp thiết bị công nghệ: PC, Laptop, Linh kiện và Thiết bị ngoại vi.
</p>

## 📌 Giới thiệu

**PC Store Backend** được xây dựng dựa trên kiến trúc MVC, cung cấp các RESTful APIs và giao diện Server-side rendering (EJS) phục vụ cho việc quản lý, vận hành một cửa hàng máy tính trực tuyến. Hệ thống giải quyết các bài toán cốt lõi trong TMĐT từ việc quản lý hệ thống phân cấp danh mục phức tạp, kho hàng, cho tới giỏ hàng, đặt hàng và quá trình giao nhận hàng hóa.

## 🚀 Tính năng nổi bật

### 🔐 Phân quyền & Bảo mật (Role-based Access Control)
- Hệ thống quản lý đa vai trò linh hoạt: `ADMIN`, `MANAGER`, `RECEPTIONIST`, `WAREHOUSE`, và `CUSTOMER`.
- Bảo mật xác thực bằng **JWT (JSON Web Token)** kết hợp với thuật toán **bcrypt** để băm mật khẩu, đảm bảo an toàn tối đa cho dữ liệu người dùng.

### 🛍️ Quản lý Sản phẩm & Kho hàng
- **Sản phẩm (Products):** Quản lý chi tiết thông tin, giá nhập (cost), giá bán (price), quản lý mức tồn kho thấp (low stock threshold), và các nhãn dán nổi bật (Hot, New, Featured).
- **Phân loại chuyên sâu:** Hỗ trợ Danh mục đa cấp (Category cấp cha/cấp con), cùng với thông tin Thực thể Thương hiệu (Brand) và Nhà cung cấp (Supplier).

### 🛒 Quản lý Đơn hàng & Thanh toán
- Quy trình vòng đời đơn hàng khép kín qua các trạng thái: `PENDING` ➡️ `CONFIRMED` ➡️ `PROCESSING` ➡️ `SHIPPED` ➡️ `DELIVERED`. Theo dõi sát sao tình trạng đổi trả (`RETURNED`) hay huỷ đơn (`CANCELLED`).
- Tích hợp đối tác vận chuyển (Shipping Providers), hỗ trợ nhà vận tải lưu mã vận đơn (Tracking Number) và kết quả đối soát.
- Hỗ trợ hiển thị nhiều phương thức thanh toán: COD, Chuyển khoản ngân hàng, VNPAY, MOMO.

### 🎁 Công cụ Marketing & Chăm sóc khách hàng
- Quản lý và theo dõi thông tin đánh giá / bình luận từ người dùng đối với các sản phẩm (Reviews).
- Hỗ trợ xây dựng chiến dịch Khuyến mãi (Promotions) & Mã giảm giá (Coupons).
- Tính năng Danh sách sản phẩm yếu thích (Wishlist) dành cho khách hàng lưu trữ ngắn hạn mong muốn mua sắm.

## 🛠️ Công nghệ sử dụng

- **Môi trường & Ngôn ngữ gốc:** Node.js, Express.js cơ sở, viết hoàn toàn bằng **TypeScript**.
- **Cơ sở dữ liệu:** MySQL tích hợp cùng **Prisma ORM** cho khả năng truy vấn dễ dàng, có type-safety mạnh mẽ.
- **Template Engine:** EJS (Sử dụng cho các trang quản trị web admin dashboard, view detail, form email,...).
- **Công cụ hỗ trợ thêm:** `dotenv` (quản trị biến môi trường), `multer` (upload hình ảnh/files), `uuid`, `nodemon`.

## 📂 Cơ sở dữ liệu (Database Schema Core)

Hệ thống được thiết kế với sự gắn kết Relational DB cao:
- **Ngữ cảnh User Account**: `User`, `Role`
- **Ngữ cảnh Product & Inventory**: `Category`, `Brand`, `Supplier`, `Product`, `Review`, `Wishlist`
- **Ngữ cảnh Sales & Orders**: `Order`, `OrderItem`
- **Ngữ cảnh Logistics**: `ShippingProvider`, `ShippingOrder`
- **Ngữ cảnh Payments & Marketing**: `Promotion`, `Coupon`, `Payment`, `BankAccount`

## ⚙️ Hướng dẫn cài đặt (Installation)

### 1. Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/en) (Phiên bản v18+ trở lên).
- Hệ quản trị [MySQL Server](https://dev.mysql.com/downloads/mysql/).

### 2. Clone mã nguồn & Cài đặt thư viện
```bash
git clone https://github.com/ThanhHai24/Nhom6-1-TMDT-backend.git
cd Nhom6-1-TMDT-backend
npm install
```

### 3. Cấu hình biến môi trường (.env)
Tạo tệp tin `.env` nằm tại thư mục gốc của dự án, và nhập các cấu hình tương tự như dưới để phù hợp với thông tin kết nối Db tại máy tính của bạn:
```bash
# Sửa lại user, password, port, và db_name cho khớp với CSDL cục bộ của bạn
DATABASE_URL="mysql://root:password123@localhost:3306/pcstore"

# Key bảo mật cho JSON Web Token
JWT_SECRET="your_jwt_secret_key_here"

# Cổng localhost chạy ứng dụng
PORT=3000
```

### 4. Khởi tạo Cơ sở dữ liệu bằng Prisma ORM
Chạy lệnh migration để Prisma tự làm việc với MySQL và khởi tạo toàn bộ cấu trúc các bảng:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Khởi chạy Ứng dụng
Để chạy web ở mode Development (Reload liên tục khi lưu file):
```bash
npm run dev
```
Lúc này bạn sẽ có thể tương tác với backend tải thử tại `http://localhost:3000`.

---

## 👨‍💻 Tác giả

**Thanh Hải**
- Trang cá nhân GitHub: [https://github.com/ThanhHai24](https://github.com/ThanhHai24)
