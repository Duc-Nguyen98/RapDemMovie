# Rạp Đêm CMS V2

Mở `index.html` để xem toàn bộ bàn giao. Có thể mở trực tiếp bằng Chrome/Edge, không cần chạy server.

- `prototype/index.html`: giao diện tương tác bằng dữ liệu mẫu trong bộ nhớ. Tải lại trang sẽ đặt lại. Không nhập mật khẩu, API key, URL riêng tư hoặc số liệu thật.
- `gallery.html` và `images/`: PNG xuất từ HTML/CSS theo viewport; xem manifest để biết kích thước thật. Ba sơ đồ vận hành có artboard 1600×1000.
- `docs/`: đặc tả nghiệp vụ, quy tắc quảng cáo, quyền, UAT và runbook dạng HTML.
- `api/openapi.json`: contract thiết kế; không có backend server triển khai trong gói này.
- `data/`: catalog, schema dictionary, màn, mapping, UAT, quyết định và fixture.
- Workbook: danh mục, màn, quyền API, UAT, quyết định cần chốt và tích hợp. Ô vàng để người phụ trách cập nhật, không tự coi đã duyệt.
- `qa/`: kết quả kiểm tra prototype/cấu trúc tệp. Không phải nghiệm thu production.

Ngày phiên bản 16/11/2026. Không thay đổi CMS V1 hoặc web Rạp Đêm V18.

Điểm còn mở: thông tin đối tác player/report; thông số quảng cáo; inventory CSS; luồng phim bộ; auth/hosting/retention/SLA; người nghiệm thu và quyết định go-live. Xem `docs/11-decisions.html`.

MVP không có hội viên, thu phí người xem hay portal đối tác. Phim nhúng từ đối tác; không video hosting/transcoding. Modal ở HOME; preroll WATCH chỉ sau xác minh. Giá và doanh thu trong prototype là mẫu hoặc N/A.

Trong gói ZIP bàn giao không kèm thư viện runtime hay chương trình dựng/tạo ảnh. Các file HTML/CSS/JS của prototype và JSON contract là nguồn có thể đọc và chỉnh sửa; không cần runtime tác giả để mở xem.
