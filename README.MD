# 🖥️ PC Store - Node.js E-commerce Website

## 📌 Giới thiệu

**PC Store** là một website thương mại điện tử chuyên bán:

* Máy tính (PC, Laptop)
* Linh kiện máy tính (CPU, GPU, RAM,...)
* Thiết bị ngoại vi (màn hình, chuột, bàn phím,...)

Dự án được xây dựng bằng **Node.js + Express + Prisma + MySQL** theo kiến trúc MVC, hướng đến việc học tập và phát triển hệ thống thực tế.

---

## 🚀 Công nghệ sử dụng

### 🔧 Backend

* Node.js
* Express.js
* Prisma ORM
* MySQL

### 🎨 Frontend

* EJS (Template Engine)

### 🛠️ Công cụ khác

* Nodemon (auto reload)
* TypeScript
* dotenv (quản lý biến môi trường)
* bcrypt (mã hóa mật khẩu)
* multer (upload file)
* uuid (tạo ID)

---

## 📂 Cấu trúc thư mục

```
src/
│── controllers/     # Xử lý logic
│── models/          # Định nghĩa dữ liệu
│── routes/          # Định tuyến
│── views/           # Giao diện EJS
│── middlewares/     # Middleware
│── utils/           # Helper functions
│── config/          # Cấu hình (DB, env,...)
│── app.ts           # Entry point
```

---

## ⚙️ Cài đặt & chạy dự án

### 1. Clone repo

```bash
git clone https://github.com/ThanhHai24/Nhom6-1-TMDT-backend.git
cd ECOM-PCSTORE-NodeJS
```

---

### 2. Cài đặt dependencies

```bash
npm install
```

---

### 3. Cấu hình môi trường

Tạo file `.env`:

```env
DATABASE_URL=""
PORT=
```

---

### 4. Setup database (Prisma)

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 5. Chạy project

#### 👉 Dev mode

```bash
npm run dev
```

#### 👉 Debug mode

```bash
npm run start:debug
```

---

## 🌿 Git Workflow

Dự án sử dụng mô hình branch:

* `main`: Production
* `develop`: Development
* `feature/*`: Tính năng riêng

Ví dụ:

* `feature/auth`
* `feature/product`
* `feature/cart`

---

## ✨ Tính năng chính

* 🔐 Xác thực người dùng (đăng ký / đăng nhập)
* 🛒 Giỏ hàng
* 📦 Quản lý sản phẩm
* 🏷️ Danh mục sản phẩm
* 📸 Upload hình ảnh sản phẩm
* 👨‍💼 Admin dashboard (đang phát triển)

---

## 📸 Demo (đang cập nhật)

> Thêm ảnh giao diện tại đây

---

## 📌 Hướng phát triển

* Thanh toán online (VNPay, MoMo)
* Tích hợp chatbot AI tư vấn sản phẩm
* Hệ thống đánh giá & bình luận
* Tối ưu SEO & hiệu năng

---

## 👨‍💻 Tác giả

* **Thanh Hải**
* GitHub: https://github.com/ThanhHai24

---

## 📄 License

ISC License

---

## ⭐ Ghi chú

Dự án được thực hiện phục vụ:

* Học tập
* Thực tập cơ sở
* Portfolio cá nhân

Nếu thấy hữu ích, hãy ⭐ repo nhé!
