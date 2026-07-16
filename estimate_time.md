# Bảng Ước Lượng Thời Gian Triển Khai (Estimate Time / Mandays)
## Dự án: Ông Lão Platform (Next.js + PostgreSQL)
### Vai trò thực hiện: Junior Developer

Bảng dưới đây phân rã chi tiết các đầu việc, công nghệ áp dụng và số ngày công (mandays) ước tính để chuyển đổi ứng dụng "Ông Lão Platform" từ file TSX độc lập thành hệ thống Full-Stack hoàn chỉnh.

---

### 📊 BẢNG PHÂN RÃ CÔNG VIỆC & MANDAYS

| ID | Hạng mục công việc (Task Description) | Chi tiết kỹ thuật / Công nghệ | Ước tính (Ngày) | Trạng thái |
|:---|:---|:---|:---:|:---:|
| **1** | **Thiết lập Database & Môi trường** | | **2.0** | **Hoàn thành** |
| 1.1 | Cài đặt Prisma ORM & Cấu hình DB URL | PostgreSQL local, `.env`, `prisma.ts` singleton | 0.5 | Hoàn thành |
| 1.2 | Thiết kế Schema Prisma tối ưu | Thiết kế Enums (Role, MessageRole, FavoriteType) & Quan hệ các bảng | 0.5 | Hoàn thành |
| 1.3 | Viết Script Seed dữ liệu mẫu | Nạp danh sách Thơ kệ, Tri thức, Nhạc nền mặc định, Voice Styles từ file gốc | 1.0 | Hoàn thành |
| **2** | **Xây dựng Backend (Server Actions & APIs)** | | **5.0** | **Hoàn thành** |
| 2.1 | Server Actions cho Chat History | `createChatSession`, `saveChatMessage`, `getChatSessions`, `deleteChatSession` | 1.5 | Hoàn thành |
| 2.2 | Server Actions cho Tri thức Giác Ngộ (RAG) | `getGiacNgoList`, `saveGiacNgo`, `deleteGiacNgo`, `saveAllGiacNgo` | 1.5 | Hoàn thành |
| 2.3 | Server Actions cho Prompt Template | `getActivePrompt`, `savePromptTemplate` | 1.0 | Hoàn thành |
| 2.4 | Server Actions cho Thơ kệ & Nhạc nền | `getPoems`, `getBgmStyles` | 1.0 | Hoàn thành |
| **3** | **Tích hợp UI & Refactor Giao diện (Frontend)** | | **2.5** | **Hoàn thành** |
| 3.1 | Phân tách cấu trúc file giao diện sạch | Đưa component chính vào `components/tam-an-platform.tsx`, page.tsx làm Server Component | 0.5 | Hoàn thành |
| 3.2 | Tích hợp load thơ kệ & tri thức động | Thay thế các mảng tĩnh client-side bằng dữ liệu nạp từ Props phía Server | 1.0 | Hoàn thành |
| 3.3 | Đồng bộ hóa lịch sử chat & RAG | Thay thế IndexedDB bằng cách gọi các Server Actions cập nhật PostgreSQL | 1.0 | Hoàn thành |
| **4** | **Kiểm thử & Xử lý lỗi (Testing & Bug Fixes)** | | **2.5** | **Đang tiến hành** |
| 4.1 | Fix lỗi cú pháp & biên dịch | Sửa các lỗi import thiếu (ví dụ: `getFirestore` cho Firebase) | 0.5 | Hoàn thành |
| 4.2 | Viết kiểm thử tự động (Unit Test) | Cấu hình và viết Unit Test cho các Server Actions bằng Vitest | 1.0 | Chờ triển khai |
| 4.3 | Kiểm thử luồng tích hợp E2E | Cấu hình và chạy thử nghiệm Playwright E2E mô phỏng hội thoại | 1.0 | Chờ triển khai |
| | **TỔNG CỘNG THỜI GIAN ƯỚC TÍNH** | | **12.0** | |

---

### 📝 GHI CHÚ QUAN TRỌNG CHO JUNIOR DEV

1. **Tuân thủ đúng thiết kế Schema**:
   - Sử dụng đúng các **Enums** (`MessageRole`, `FavoriteType`, `Role`) khi thao tác dữ liệu qua Server Actions, tuyệt đối không dùng String tự do để đảm bảo tính toàn vẹn của dữ liệu trong Postgres.
2. **Cơ chế Đồng bộ Chat**:
   - Việc sinh giọng đọc (audio URL) diễn ra bất đồng bộ sau khi AI trả lời chữ. Do đó, cần luôn lưu tin nhắn chữ trước (audioUrl = null) và gọi `upsert` cập nhật `audioUrl` sau khi tệp âm thanh được tạo thành công để tránh lỗi mất tin nhắn khi người dùng tắt âm thanh.
3. **Cơ chế Fallback Prompt**:
   - Khi tải Prompt Template động từ DB, luôn thiết lập cơ chế fallback về `DEFAULT_SYSTEM_PROMPT` trong code nếu DB trống hoặc lỗi kết nối.
