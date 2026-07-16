# Tài liệu Phân tích Luồng Dữ liệu (Trang chính & Trang /admin)

Bản phân tích chi tiết này chỉ rõ nguồn gốc dữ liệu (Data Source) của toàn bộ ứng dụng Ông Lão AI, phân biệt cụ thể giữa dữ liệu được viết cứng (Hardcoded) trong mã nguồn và dữ liệu động được nạp qua API/Database.

---

## 1. Bản đồ Nguồn dữ liệu Trang chính (Main Client Page)
Trang chính kết xuất giao diện chính của Thiền Đường thông qua tệp [onglao-platform.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao-platform.tsx) và các visual component đi kèm.

| Thành phần chức năng | Loại dữ liệu | Nguồn dữ liệu & Cách thức hoạt động | Tệp mã nguồn liên quan |
| :--- | :--- | :--- | :--- |
| **Danh sách Nhân vật & Hình tướng Lão** | **Hỗn hợp** (API + Hardcode) | Trộn lẫn giữa các Preset mặc định viết cứng (`lao_chat`, `user_chat`, `lao_mac_dinh`, `user_mac_dinh`) với danh sách các nhân vật tự chỉnh sửa do Admin tạo qua API `GET /api/admin/nhan-vat`. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts)<br>- [useVideoExport.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/hooks/useVideoExport.tsx) |
| **Cấu hình hệ thống (Gemini, Momo, Bank)** | **API & DB** | Lấy thông tin cấu hình công khai (API key đã mã hóa dạng `AIzaSy...`, số tài khoản Momo/Ngân hàng và ảnh QR) từ API `GET /api/settings/public`. Dữ liệu lưu trong bảng `SystemSetting` của PostgreSQL. | - [settings.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/lib/settings.ts)<br>- [useAuth.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/hooks/useAuth.ts) |
| **Lựa chọn Trí tuệ AI (GiacNgo Agents)** | **API & Proxy** | Gọi API `GET /api/giacngo/public-ais` qua máy chủ trung gian để lấy danh sách các Agent AI được cấu hình trên cổng Giác Ngộ (mặc định là Agent ID `7`). | - [useAuth.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/hooks/useAuth.ts)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/giacngo/public-ais/route.ts) |
| **Kho Kệ Pháp & Mào Đầu** | **API & DB** | Tải danh sách Kệ pháp được lưu cục bộ trong bảng `Poem` & `Stanza` bằng Prisma, đồng thời nạp và đồng bộ thêm các tài liệu từ GiacNgo Library thông qua API `GET /api/giacngo/library`. | - [usePoemDb.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/hooks/usePoemDb.ts)<br>- [page.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/page.tsx) |
| **Câu mào đầu lúc Lão chờ lâu** | **Hardcoded** | Mảng dữ liệu các câu nói khôi hài khi người dùng im lặng quá 60s/120s (`waiting_long`) được khai báo tĩnh tại hằng số `LAO_GREETINGS_DB`. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts) |
| **Phong cách & Cảm xúc giọng đọc** | **Hardcoded** | Mảng dữ liệu chứa 21+ phong cách cảm xúc giọng đọc (như Trẻ em ngơ ngác, Thanh niên bế tắc, Người già cay đắng...) được định nghĩa tĩnh trong hằng số `VOICE_STYLES`. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts) |
| **Danh sách Nhạc nền (BGM)** | **Hỗn hợp** (API + Hardcode) | Tải 4 bản nhạc mặc định từ mảng `DEFAULT_BGM_LIST` trong hằng số, đồng thời tải danh sách nhạc tùy biến được người dùng upload lên đám mây thông qua IndexedDB cục bộ của trình duyệt. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts)<br>- [useVideoExport.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/hooks/useVideoExport.tsx) |
| **Chủ đề Đạo Diễn AI (AI Topics)** | **Hardcoded** | Danh sách 8 chủ đề mẫu cho tính năng Đạo diễn AI sinh kịch bản được viết cứng trong constants. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts) |
| **Phông nền Video (Video Backgrounds)** | **Hardcoded** | Danh sách phông nền mặc định viết cứng trong hằng số `VIDEO_BACKGROUNDS`. | - [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts) |
| **Hội thoại & Lịch sử tin nhắn** | **API & DB** (Server Actions) | Quản lý lưu trữ, sửa đổi, ghim và xóa các phiên chat cùng tin nhắn tương ứng thông qua Next.js Server Actions trực tiếp vào DB PostgreSQL (bảng `ChatSession` và `ChatMessage`). | - [chat.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/actions/chat.ts)<br>- [SessionsSidebar.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/components/SessionsSidebar.tsx) |

> [!NOTE]
> Để tăng tốc thời gian tải trang ban đầu và đồng bộ hóa ngoại tuyến mượt mà, hệ thống sử dụng IndexedDB (`TamAnMediaDB`) làm nơi lưu trữ đệm (cache) cho các file tài nguyên tĩnh có kích thước lớn (như video, ảnh nhân vật được import cục bộ).

---

## 2. Bản đồ Nguồn dữ liệu Trang quản trị (/admin)
Trang quản trị được thiết lập tại [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx), cung cấp khả năng điều khiển toàn bộ nền tảng.

| Cấu phần dữ liệu quản trị | Loại dữ liệu | Nguồn dữ liệu & Cách thức hoạt động | Tệp mã nguồn liên quan |
| :--- | :--- | :--- | :--- |
| **Cấu hình hệ thống (Settings)** | **API & DB** | Trực tiếp lưu và đọc các tham số như Gemini API Key, Momo Phone, Momo Name, Bank Name, Bank Account, QR Image Url... qua API `/api/admin/settings` (bảng `SystemSetting` trong PostgreSQL). Có cơ chế dự phòng (fallback) đồng bộ lưu vào file cục bộ `src/data/settings.json`. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [settings.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/lib/settings.ts)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/admin/settings/route.ts) |
| **Quản lý Hình Tướng (Voice Persona)** | **API & DB** | Quản lý danh sách các tệp video nghe/nói tương ứng với từng hình tướng, đồng bộ trực tiếp vào bảng `VoicePersona` của PostgreSQL thông qua bộ API `/api/admin/voice-personas`. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/admin/voice-personas/route.ts) |
| **Kho nhân vật (NhanVat)** | **API & DB** | Cấu hình các nhân vật hoạt họa động (gồm bộ assets tỉ lệ Ngang/Dọc dạng JSON lưu các tư thế: binhthuong, vui, buon...). Lưu trữ vào bảng `NhanVat` thông qua API `/api/admin/nhan-vat`. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/admin/nhan-vat/route.ts) |
| **Quản lý Câu mào đầu (Opening Phrase)** | **API & DB** | Quản lý thêm, sửa, xóa, tìm kiếm phân trang và seed dữ liệu mặc định từ bảng `OpeningPhrase` thông qua bộ API `/api/admin/opening-phrases/*`. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/admin/opening-phrases/route.ts) |
| **Danh mục Trạng thái nhân vật** | **API & DB** | Lưu trữ cấu trúc danh mục trạng thái (như `binhthuong`, `vui`, `buon`...) trực tiếp thành chuỗi JSON trong trường `characterStates` của cấu hình hệ thống (bảng `SystemSetting`). | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx) |
| **Tải lên Tài nguyên Media** | **API & Storage** | Toàn bộ tệp tin đa phương tiện (Video/Audio/Ảnh QR) được tải lên thông qua API `/api/admin/upload`, lưu trữ vật lý trong thư mục máy chủ `/public/uploads` và truy xuất qua đường dẫn tĩnh `/uploads/...`. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/admin/upload/route.ts) |
| **Sinh âm thanh mào đầu tự động** | **API (AI)** | Gọi API `/api/tts` để gửi văn bản tới dịch vụ Text-To-Speech (TTS) của Gemini AI, nhận về tệp tin `.wav` đã sinh ra để làm âm thanh mào đầu tương ứng. | - [AdminPage.tsx](file:///e:/CongViec/n8n/stlen/OngLao/src/app/admin/AdminPage.tsx)<br>- [route.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/app/api/tts/route.ts) |

---

## 3. Danh sách các API Endpoint nội bộ của hệ thống
Hệ thống sử dụng các Next.js Route Handlers sau để luân chuyển dữ liệu:

### 3.1. Nhóm API dành cho Quản trị viên (Yêu cầu Token xác thực Admin)
* **`GET /api/admin/settings`**: Lấy cấu hình hệ thống (mask API key).
* **`POST /api/admin/settings`**: Cập nhật cấu hình hệ thống.
* **`POST /api/admin/login`**: Xác thực tài khoản quản trị.
* **`GET /api/admin/voice-personas`**: Lấy danh sách hình tướng audio.
* **`POST /api/admin/voice-personas`**: Cập nhật danh sách hình tướng audio.
* **`GET /api/admin/nhan-vat`**: Lấy danh sách cấu hình nhân vật.
* **`POST /api/admin/nhan-vat`**: Cập nhật danh sách cấu hình nhân vật.
* **`GET /api/admin/opening-phrases`**: Lấy danh sách câu mào đầu phân trang.
* **`POST /api/admin/opening-phrases`**: Tạo mới câu mào đầu.
* **`PUT /api/admin/opening-phrases/[id]`**: Cập nhật thông tin/audio câu mào đầu.
* **`DELETE /api/admin/opening-phrases/[id]`**: Xóa câu mào đầu.
* **`POST /api/admin/opening-phrases/seed`**: Khởi tạo câu mào đầu từ dữ liệu mẫu.
* **`POST /api/admin/upload`**: Lưu tệp tải lên vào thư mục tĩnh `/public/uploads`.

### 3.2. Nhóm API Công khai & Tiện ích
* **`GET /api/settings/public`**: Lấy cấu hình công khai (Momo, Ngân hàng, free limit...) để hiển thị ở trang chủ.
* **`POST /api/tts`**: API chuyển đổi văn bản thành giọng nói (TTS) kết nối trực tiếp với Gemini API/GiacNgo.
* **`GET /api/opening-phrases/random`**: Lấy ngẫu nhiên một câu mào đầu âm thanh hoạt động để Lão nói lúc rảnh.

---

## 4. Nhận xét & Đề xuất kiến nghị tối ưu hóa dữ liệu

> [!WARNING]
> **Các cấu phần dữ liệu cần chuyển dịch ra khỏi Hardcode:**
> 1. **`VOICE_STYLES`**: Danh sách 21+ phong cách cảm xúc giọng đọc đang được viết cứng trong [constants.ts](file:///e:/CongViec/n8n/stlen/OngLao/src/components/onglao/constants.ts). Nên đưa vào bảng `VoiceStyle` đã được định nghĩa trong schema Prisma để Admin có thể thêm bớt phong cách tùy ý mà không cần sửa code.
> 2. **`DEFAULT_BGM_LIST`**: Nên chuyển danh sách nhạc nền mặc định vào bảng `BackgroundMusic` trong PostgreSQL để linh động quản lý kích hoạt/hủy kích hoạt.
> 3. **`LAO_GREETINGS_DB`**: Các câu chào đợi lâu đang được hardcode. Nên đồng bộ chuyển đổi sang hệ thống database hoặc gộp chung với logic của bảng `OpeningPhrase` trong tương lai để Admin dễ kiểm soát văn phong đàm đạo.
