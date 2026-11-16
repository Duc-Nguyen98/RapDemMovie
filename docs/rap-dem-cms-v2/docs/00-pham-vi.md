# Rạp Đêm — Hồ sơ triển khai CMS V2

Ngày lập: 16/11/2026. Phiên bản contract: 2.0.0. Kế thừa website xem phim V18 và danh mục CMS V1.

## Kết luận sử dụng

Bộ này phục vụ duyệt thiết kế, chia việc, ước lượng và triển khai trên staging. **Không phải CMS production đã xây xong hoặc biên bản nghiệm thu.** Có prototype chạy cục bộ, ảnh xuất từ prototype, contract API/dữ liệu, quy tắc quảng cáo, bảng xác minh đối tác, ca nghiệm thu và quy trình vận hành.

V1 và bộ ảnh/handoff website V18 được giữ nguyên. Không sửa website đang hoạt động, không kết nối player, không đặt quảng cáo thật, không gửi email hoặc chuyển tiền.

## Phạm vi đã có xác nhận từ chủ sản phẩm

- Nguồn phát là trình phát nhúng của đối tác; không xây video hosting/transcoding.
- Giai đoạn đầu thu từ quảng cáo; không thu tiền người xem, không bán Premium.
- Không có đăng nhập hội viên/khách, không có portal cho đối tác quảng cáo. Nhân sự vận hành CMS cần đăng nhập riêng.
- Modal quảng cáo ở trang chủ. Màn xem phim có preroll nếu đối tác hỗ trợ và đã kiểm tra; không thêm modal toàn trang ở màn xem phim.
- Không có bộ chọn tập ngoài website trong thiết kế hiện tại. Phim bộ chỉ bật sau khi xác minh điều hướng tập native, hoặc có quyết định thay đổi phạm vi.
- “Lưu phim” nằm trên thiết bị/trình duyệt đang dùng; không đồng bộ thiết bị.
- Chủ sản phẩm đã yêu cầu áp dụng phương án hoàn thiện năm nhóm: thiết kế CMS; dữ liệu/API; lịch và phân phối quảng cáo; kiểm chứng đối tác; nghiệm thu/vận hành.

Việc đồng ý phương án tổng thể **không phải xác nhận riêng** mọi giá trị tần suất quảng cáo, kích thước, giá bán, thời hạn lưu dữ liệu, SLA hoặc công nghệ hạ tầng. Xem sổ quyết định còn mở.

## Bàn giao và giới hạn

| Thành phần | Có trong V2 | Không được suy diễn |
|---|---|---|
| Prototype | Màn CMS với dữ liệu hư cấu, một số luồng thay đổi trạng thái trong bộ nhớ | Không phải frontend đã nối API; đổi vai trò không phải xác thực |
| Ảnh UI | PNG theo viewport thực, kích thước trong manifest | Không phải kích thước toàn bộ trang hoặc bằng chứng responsive trên mọi thiết bị |
| Form | Các form chính dựng riêng; form phụ minh họa có ghi rõ | Không được coi mọi field trong contract đã có widget hoàn thiện |
| API | OpenAPI 3.1.1, DTO, required, enums, roles, errors, revision | Không có server triển khai; cần review kỹ thuật và contract tests trên server thật |
| UAT | Ca kiểm thử, điều kiện, dữ liệu, kết quả mong đợi, ô bằng chứng/người thử | Chưa chạy trên hệ thống thật |
| Player / báo cáo | Checklist và bằng chứng phải thu | Tất cả tích hợp vẫn chưa xác minh |
| Excel | Catalog, màn, quyền, UAT và quyết định | Không tự phê duyệt các dòng chưa có người ký |

Các mã CMS-001…077 giữ nguyên. CMS-078 thêm đặt chỗ độc quyền; CMS-079 thêm kiểm tra xung đột/đồng thời. P1/P2 giữ là sau MVP. Không đưa diễn viên, import catalog, hội viên hoặc thu phí vào P0 chỉ vì có trong danh mục dài hạn.

## Phân chia công việc đề xuất

1. Nền tảng: xác thực nhân sự, quyền, audit, DB, migration, storage private/public, môi trường và CI.
2. Nội dung: metadata chuẩn, tài nguyên, nguồn nhúng, quyền nội dung, duyệt revision, release, public API và cache.
3. Quảng cáo: đối tác, campaign/creative, slot registry, reservation transaction, phân phối, cap, kill switch và events.
4. Vận hành: báo lỗi, task, báo cáo, import, đối soát, payment ledger, export, giám sát và backup.
5. Kiểm chứng: kiểm thử tích hợp đối tác trên staging, bảo mật, UAT và diễn tập sự cố.

Không gán thời lượng hoặc ngân sách giả. DEV ước lượng sau khi review contract, chọn stack và nhận thông tin đối tác. Có thể bắt đầu phần nội dung/CMS trong lúc chờ đối tác, nhưng các tính năng phụ thuộc phải giữ trạng thái bị chặn, không nghiệm thu giả.

## Cách duyệt bản mẫu

Mở `prototype/index.html`. Chọn vai trò thử và trạng thái trên thanh vàng. Dữ liệu được đặt lại khi tải trang; không nhập dữ liệu nhạy cảm. Thử lần lượt: sửa phim → gửi duyệt → đổi vai trò Quản trị → duyệt → xuất bản mẫu; đặt chỗ trùng rồi đổi ngày; tạm dừng chiến dịch; nhập fixture hai lần; hỗ trợ xử lý báo lỗi.

Ngày trên lịch cố định 16–22/11/2026, không phải lịch hiện tại động. Tổng tiền mẫu trên màn đối soát không phải kết quả import fixture hai dòng: đây là hai tình huống UI độc lập và không có sổ kế toán thật.

## Điểm cần cung cấp trước nghiệm thu tích hợp

Tên/domain đối tác, embed được phép test, tài liệu SDK/events/preroll/skip, nguồn dự phòng và phim bộ mẫu, file/API báo cáo thực tế, định nghĩa billable và kỳ/timezone/currency, đầu mối xác nhận; người nghiệm thu, môi trường staging và thông số vận hành được duyệt.
