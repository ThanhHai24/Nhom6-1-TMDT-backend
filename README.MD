# 💻 PC Store - Node.js Backend & E-Commerce Web App

Chào mừng bạn đến với dự án **PC Store**, một hệ thống Website thương mại điện tử chuyên cung cấp thiết bị phần cứng máy tính, Laptop và linh kiện PC. Dự án được xây dựng dựa trên nền tảng **Node.js**, **Express**, **TypeScript** kết hợp cùng **Prisma ORM** và cơ sở dữ liệu **MySQL**.

Dự án cung cấp đầy đủ chức năng của một trang thương mại điện tử hiện đại, bao gồm cả trang bán hàng (Client) dành cho khách hàng, trang quản trị (Admin Dashboard) phân quyền cho nhân viên và tích hợp dịch vụ bên thứ ba như thanh toán điện tử **VNPAY** cùng dịch vụ vận chuyển **Giao Hàng Nhanh (GHN)**.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Core Technologies
*   **Backend Runtime:** [Node.js](https://nodejs.org/) (v20+ / v22+)
*   **Web Framework:** [Express.js](https://expressjs.com/) (v5.0.1)
*   **Ngôn ngữ lập trình:** [TypeScript](https://www.typescriptlang.org/) (v5.7.3)
*   **Database & ORM:** [Prisma ORM](https://www.prisma.io/) (v6.3.0) kết hợp hệ quản trị cơ sở dữ liệu **MySQL**
*   **View Engine:** [EJS](https://ejs.co/) (Embedded JavaScript templates) với cấu trúc layout [express-ejs-layouts](https://www.npmjs.com/package/express-ejs-layouts)

### Libraries & Integrations
*   **Authentication:** [Passport.js](https://www.passportjs.org/) & `passport-local` (Xác thực đăng nhập tài khoản)
*   **Session Management:** `express-session` lưu trữ phiên đăng nhập trực tiếp vào database qua `@quixo3/prisma-session-store`
*   **File Upload:** `multer` (Xử lý upload ảnh sản phẩm, ảnh đại diện người dùng, banner quảng cáo)
*   **Payment Gateway:** Tích hợp cổng thanh toán trực tuyến **VNPAY** (Sử dụng thư viện `vnpay`)
*   **Shipping Service:** Tích hợp API **Giao Hàng Nhanh (GHN)** tính toán chi phí giao hàng thời gian thực dựa trên vị trí địa lý của khách hàng
*   **Bảo mật:** `bcrypt` dùng để mã hóa mật khẩu người dùng trước khi lưu trữ vào cơ sở dữ liệu.

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Structure)

Dự án được thiết kế theo mô hình kiến trúc MVC (Model - View - Controller) kết hợp Service Layer và định dạng cấu trúc dạng module sạch sẽ:

```text
├── prisma/                  # Cấu hình cơ sở dữ liệu và migrations của Prisma
│   ├── migrations/          # Lịch sử các file SQL migration
│   └── schema.prisma        # File định nghĩa Database Schema chính của dự án
├── public/                  # Các file tĩnh (CSS, JS phía client, Images tải lên)
│   ├── client/              # Asset tĩnh của trang bán hàng (CSS, JS, Fonts...)
│   └── uploads/             # Thư mục lưu ảnh upload (avatars, products, banners...)
├── src/                     # Mã nguồn chính của ứng dụng
│   ├── app.ts               # Điểm khởi đầu khởi chạy ứng dụng (Entry point)
│   ├── config/              # Các cấu hình kết nối db, passport, seed dữ liệu mẫu
│   ├── controllers/         # Nơi điều hướng xử lý logic request/response
│   │   ├── admin/           # Controller trang quản trị
│   │   ├── auth/            # Controller xác thực (login, register...)
│   │   ├── client/          # Controller trang bán hàng khách hàng
│   │   └── api/             # Controller cho các endpoint API (JSON)
│   ├── middleware/          # Các bộ lọc trung gian (Auth check, file upload...)
│   ├── routes/              # Định nghĩa luồng dẫn API và pages (user, admin, api)
│   ├── services/            # Tầng xử lý nghiệp vụ & truy vấn DB qua Prisma Client
│   ├── types/               # Khai báo các interface, kiểu dữ liệu bổ sung trong TS
│   └── views/               # Chứa các file templates EJS (.ejs)
│       ├── StorePage/       # Template giao diện người dùng
│       └── admin/           # Giao diện quản trị Admin Panel
├── .env.example             # File cấu hình môi trường mẫu
├── tsconfig.json            # Cấu hình trình biên dịch TypeScript
└── package.json             # Danh sách phụ thuộc và các câu lệnh khởi chạy script
```

---

## 🌟 Tính Năng Chính Của Hệ Thống

### 1. Trang Bán Hàng (Client Interface)
*   **Trang chủ:** Slideshow banner động, danh sách sản phẩm Hot, sản phẩm mới nhất và sản phẩm nổi bật.
*   **Danh mục sản phẩm:** Phân loại sản phẩm đa cấp (PC, Laptop, Linh kiện, Thiết bị ngoại vi, Tản nhiệt, Phụ kiện) tích hợp tính năng lọc và tìm kiếm nâng cao.
*   **Chi tiết sản phẩm:** Xem thông tin kỹ thuật dưới định dạng JSON cấu trúc, hiển thị chính sách bảo hành, số lượng kho còn lại, đánh giá và nhận xét của khách hàng.
*   **Xây dựng cấu hình PC (Build PC):** Hỗ trợ khách hàng tự chọn cấu hình máy tính phù hợp từ bo mạch chủ, CPU, RAM, VGA, ổ cứng, nguồn... và xuất danh sách mua hàng nhanh chóng.
*   **Giỏ hàng nâng cao:** Quản lý giỏ hàng trực tiếp trong session/database, cho phép cập nhật số lượng, kiểm tra giới hạn tồn kho, xóa sản phẩm và gom đơn nhanh.
*   **Thanh toán tiện lợi:** 
    *   Thanh toán khi nhận hàng (COD).
    *   Thanh toán qua cổng **VNPAY** bảo mật, chuyển khoản ngân hàng bằng mã QR.
    *   Tích hợp tính phí vận chuyển động từ API của **GHN**.
*   **Tài khoản cá nhân:** Thay đổi avatar/thông tin cá nhân, theo dõi danh sách đơn hàng đã đặt, xem chi tiết lịch sử cập nhật trạng thái đơn hàng và hủy đơn hàng đang chờ xác nhận.

### 2. Trang Quản Trị (Admin Dashboard Panel)
*   **Phân quyền chặt chẽ (RBAC):** Gồm các vai trò `ADMIN` (Quản trị viên tối cao), `MANAGER` (Quản lý cửa hàng), `RECEPTIONIST` (Nhân viên tiếp nhận đơn hàng), và `WAREHOUSE` (Nhân viên thủ kho).
*   **Báo cáo & Thống kê:** Biểu đồ doanh thu, số lượng đơn hàng, số lượng khách hàng mới trực quan theo tháng/năm.
*   **Quản lý Danh mục & Thương hiệu:** Thêm, sửa, ẩn/hiển thị danh mục đa cấp, quản lý các hãng sản xuất và nhà cung cấp.
*   **Quản lý Sản phẩm:** Thêm sản phẩm mới kèm upload nhiều ảnh, cấu hình thông số kỹ thuật (Specs), quản lý số lượng tồn kho và ngưỡng cảnh báo hết hàng.
*   **Quản lý Đơn hàng:** Tiếp nhận, cập nhật trạng thái đơn hàng theo quy trình chuẩn từ Chờ duyệt -> Xác nhận -> Đóng gói -> Đang giao -> Đã giao thành công -> Trả hàng/Hủy đơn.
*   **Quản lý Kho hàng:** Nhập kho, xuất kho hàng loạt, thiết lập số lượng thực tế trực tiếp thông qua giao diện Web thân thiện.
*   **Chương trình Khuyến mãi & Coupon:** Tạo mã giảm giá, giới hạn số lượng sử dụng và đặt thời hạn hiệu lực cho các chiến dịch sale.
*   **Quản lý Banner quảng cáo:** Thay đổi linh hoạt các vị trí banner hiển thị ngoài trang chủ (Slideshow, banner trái/phải, banner chân trang).

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### Yêu Cầu Hệ Thống
*   Đã cài đặt **Node.js** (Khuyên dùng v20 hoặc mới hơn).
*   Đã cài đặt hệ quản trị cơ sở dữ liệu **MySQL Server**.

### Các Bước Cài Đặt Chi Tiết

1.  **Clone dự án về máy:**
    ```bash
    git clone https://github.com/ThanhHai24/Nhom6-1-TMDT-backend.git
    cd Nhom6-1-TMDT-backend
    ```

2.  **Cài đặt các gói phụ thuộc (Dependencies):**
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**
    Sao chép file `.env.example` thành `.env`:
    ```bash
    copy .env.example .env
    ```
    Mở file `.env` vừa tạo và cập nhật các thông số cấu hình chính xác:
    ```env
    PORT=8080
    DATABASE_URL="mysql://<username>:<password>@localhost:3306/pcstore"
    
    # Cấu hình API Giao Hàng Nhanh (GHN)
    GHN_TOKEN="your_token_here"
    GHN_SHOP_ID="your_shop_id_here"
    GHN_API_URL="https://dev-online-gateway.ghn.vn"
    ```

4.  **Cấu hình Cơ sở dữ liệu và Migration bằng Prisma:**
    Đẩy cấu trúc bảng lên MySQL và khởi tạo Client truy vấn:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Khởi chạy ứng dụng:**
    Hệ thống tích hợp cơ chế tự động Seed dữ liệu mẫu (như tài khoản Admin mặc định, sản phẩm mẫu, danh mục, thương hiệu...) ngay khi ứng dụng khởi chạy lần đầu tiên.
    
    *   **Chế độ phát triển (Development mode - với Nodemon tự động tải lại):**
        ```bash
        npm run dev
        ```
        hoặc:
        ```bash
        npm start
        ```
    
    *   **Đăng nhập tài khoản quản trị mặc định (nếu sử dụng dữ liệu Seed):**
        *   **Tài khoản:** `admin@example.com` (hoặc email Admin đã cấu hình trong mã nguồn seed)
        *   **Mật khẩu:** `123456`

---

## 🌐 Danh Sách Các Endpoint API Chính (REST API)

Dưới đây là một số API endpoint nội bộ hỗ trợ xử lý không đồng bộ (AJAX) được xây dựng trong hệ thống (`/api`):

### Sản phẩm (Products)
*   `GET /api/products` - Lấy danh sách sản phẩm (có lọc/phân trang).
*   `GET /api/products/by-category` - Lấy sản phẩm theo danh mục.
*   `POST /api/products` - Thêm mới sản phẩm (yêu cầu quyền admin).

### Vận chuyển & Địa lý (Locations & Shipping)
*   `GET /api/locations/provinces` - Lấy danh sách tỉnh/thành phố từ GHN.
*   `GET /api/locations/districts` - Lấy danh sách quận/huyện theo tỉnh.
*   `GET /api/locations/wards` - Lấy danh sách phường/xã theo quận.
*   `POST /api/shipping/fee` - Tính phí vận chuyển thực tế từ GHN.

### Thanh toán VNPay
*   `POST /api/payment/vnpay/create` - Tạo link thanh toán VNPay.
*   `GET /api/check-payment-vnpay` - Xử lý thông tin phản hồi từ VNPay sau khi thanh toán.
*   `GET /api/vnpay-ipn` - Xử lý IPN cập nhật trạng thái đơn hàng phía Server-to-Server.

---

## 👥 Nhóm Thực Hiện
Dự án được phát triển và vận hành bởi **Nhóm 6-1 - Môn Thương mại điện tử (TMĐT)**.
Mọi thắc mắc hoặc báo lỗi vui lòng gửi yêu cầu Pull Request hoặc liên hệ qua email thành viên phát triển.

