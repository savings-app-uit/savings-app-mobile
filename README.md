# Savings App - Quản lý chi tiêu với AI

[![GitHub repo size](https://img.shields.io/github/repo-size/savings-app-uit/savings-app-server?style=for-the-badge)](https://github.com/savings-app-uit/)
[![GitHub contributors](https://img.shields.io/github/contributors/savings-app-uit/savings-app-server?style=for-the-badge)](https://github.com/savings-app-uit/savings-app-server/graphs/contributors)

**Savings App** là một hệ thống ứng dụng di động hoàn chỉnh giúp người dùng quản lý chi tiêu cá nhân một cách thông minh. Ứng dụng sử dụng mô hình AI (OCR & Gemini) để tự động quét, nhận dạng và phân loại thông tin từ hóa đơn, giúp quá trình nhập liệu trở nên nhanh chóng và chính xác.

<p align="center">
  <img src="URL_ANH_CHUP_MAN_HINH_1" width="200" alt="Screenshot 1"/>
  <img src="URL_ANH_CHUP_MAN_HINH_2" width="200" alt="Screenshot 2"/>
  <img src="URL_ANH_CHUP_MAN_HINH_3" width="200" alt="Screenshot 3"/>
</p>

## 🚀 Hướng dẫn cài đặt và khởi chạy

Hệ thống bao gồm 3 thành phần chính: **Backend Server**, **AI Model Server**, và **Frontend Mobile App**. Vui lòng làm theo các bước dưới đây để cài đặt và khởi chạy toàn bộ hệ thống.

### 1. Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:

- **Node.js**: Phiên bản `18.x` trở lên
- **Python**: Phiên bản `3.10` trở lên
- **React Native / Expo**: `Expo SDK 53`
- **Tesseract OCR**: Cần được cài đặt trên hệ thống
- **Công cụ**: `pip`, `virtualenv`, `Git`
- **Thiết bị di động**: Android hoặc iOS đã cài đặt sẵn ứng dụng **Expo Go**.

### 2. Cài đặt Backend (Node.js Server)

Server chịu trách nhiệm xử lý logic nghiệp vụ, quản lý người dùng và giao tiếp với database.

**2.1. Sao chép mã nguồn**
```bash
git clone [https://github.com/savings-app-uit/savings-app-server.git](https://github.com/savings-app-uit/savings-app-server.git)
cd savings-app-server
```
**2.2. Cài đặt các gói phụ thuộc**
```bash
npm install
```
**2.3. Cấu hình biến môi trường**
Tạo một file .env ở thư mục gốc savings-app-server và điền các thông tin cấu hình cần thiết.
```bash
# Firebase Service Account
FIREBASE_KEY_PATH=./firebase/serviceAccountKey.json

# JWT Secret for Token Signing
JWT_SECRET=aJ7g!9Zm#T@4&vSdNw3kXp$0uQeLm!rC

# OTP Expiration (in seconds)
OTP_EXPIRE_TIME=300

# Email Configuration
EMAIL_USER=hoanghaiyencbm@gmail.com
EMAIL_PASS=nhxwkyvvnibmsvii

# Server Port
PORT=3001

# Cloudinary
CLOUDINARY_CLOUD_NAME=dvfukrnu5
CLOUDINARY_API_KEY=924876963489893
CLOUDINARY_API_SECRET=w_Oeq8u24WZ7fc5fAeXH3US6of0

# API KEY GEMINI
GEMINI_API_KEY=your_gemini_api_key

# Model Paths (sẽ được cập nhật ở bước sau)
PYTHON_PATH=<đường_dẫn_tuyệt_đối_đến_python_trong_venv>
MODEL_PATH=<đường_dẫn_tuyệt_đối_đến_thư_mục_model>
```
### 3. Cài đặt AI Model (Python)

Mô hình AI chịu trách nhiệm xử lý hình ảnh hóa đơn và phân loại chi tiêu.

**3.1. Sao chép mã nguồn**
```bash
# Đảm bảo bạn đang ở thư mục cha của savings-app-server
git clone [https://github.com/savings-app-uit/savings-app-model.git](https://github.com/savings-app-uit/savings-app-model.git)
cd savings-app-model
```
**3.2. Tạo và kích hoạt môi trường ảo**
```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt môi trường ảo
# Trên Windows:
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate
```
**3.3. Cài đặt các thư viện Python**
```bash
pip install -r requirements.txt
```
**3.4. Cập nhật đường dẫn trong file .env của Backend**
Mở lại file .env trong thư mục savings-app-server.
Cập nhật giá trị cho PYTHON_PATH và MODEL_PATH thành đường dẫn tuyệt đối chính xác trên máy tính của bạn.
Ví dụ PYTHON_PATH: C:\Users\your_user\savings-app\savings-app-model\venv\Scripts\python.exe
Ví dụ MODEL_PATH: C:\Users\your_user\savings-app\savings-app-model
### 4. Cài đặt Frontend (React Native App)

Ứng dụng di động mà người dùng sẽ tương tác.

**4.1. Sao chép mã nguồn**
```bash
# Đảm bảo bạn đang ở thư mục cha của các project
git clone [https://github.com/savings-app-uit/savings-app-mobile.git](https://github.com/savings-app-uit/savings-app-mobile.git)
cd savings-app-mobile
```
**4.2. Cài đặt các gói phụ thuộc**
```bash
npm install
```
**4.3. Cấu hình biến môi trường**
Tạo một file .env ở thư mục gốc savings-app-mobile.
Lấy địa chỉ IP mạng LAN của máy tính đang chạy backend (dùng ipconfig trên Windows hoặc ifconfig trên macOS/Linux).
Thêm nội dung sau vào file .env, thay <ĐỊA_CHỈ_IP_CỦA_BẠN> bằng IP bạn vừa tìm được.
```bash
EXPO_PUBLIC_API_URL=http://<ĐỊA_CHỈ_IP_CỦA_BẠN>:3001
# Ví dụ: EXPO_PUBLIC_API_URL=[http://192.168.1.4:3001](http://192.168.1.4:3001)
```
### 5. Khởi chạy hệ thống
**5.1. Khởi động Backend Server**
- Mở một terminal, di chuyển đến thư mục savings-app-server.
- Chạy lệnh: npm start
- Server sẽ chạy trên cổng 3001.
**5.2. Khởi động Frontend App**
- Mở một terminal khác, di chuyển đến thư mục savings-app-mobile.
- Chạy lệnh: npx expo start
- Một mã QR sẽ xuất hiện trong terminal.
**5.3. Chạy ứng dụng trên điện thoại**
- Đảm bảo điện thoại và máy tính của bạn được kết nối vào cùng một mạng Wi-Fi.
- Mở ứng dụng Expo Go trên điện thoại và quét mã QR.
- Ứng dụng sẽ được tải và khởi chạy.

👥 Đội ngũ phát triển
Dự án này là sản phẩm đồ án của nhóm sinh viên Trường Đại học Công nghệ Thông tin - ĐHQG-HCM.
| MSSV | Tên | Vai trò chính |
| --------- | --------- | --------- |
| 23521544 | Phạm Hà Anh Thư | Team Lead, Frontend Developer |
| 23521847 | Hoàng Hải Yến | Backend Developer (Server) |
| 23521484 | Nguyễn Minh Thiện | AI Engineer (Model) |
| 23521336 | Đặng Phạm Nguyệt Sang | UI/UX Designer, Frontend Developer |
