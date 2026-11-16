RẠP ĐÊM — BỘ BÀN GIAO V18 (BẢN DUYỆT)
Ngày: 14/11/2026

1. Giải nén rồi mở index.html để xem toàn bộ ảnh và tài liệu.
2. images/: 9 PNG — 5 màn chính, 2 board quảng cáo theo khung nhìn, 2 board trạng thái.
3. contract/DEV-CONTRACT-V18.html: tài liệu dễ đọc, có mục lục; Markdown cùng nội dung để DEV quản lý.
4. data/: text tiếng Việt, dữ liệu phim, section, token và quy tắc quảng cáo (những file proposed chưa được duyệt).
5. catalog-preview.html + source-assets/poster-master.png: một nguồn poster tham chiếu cho prototype. Chưa phải asset production.
6. manifest.json: kích thước PNG và SHA-256 đo thực tế; không suy kích thước CSS từ ảnh.
7. QA-NOTES.md: các sai khác còn lại, phạm vi kiểm tra và điều kiện trước triển khai production.
8. prompts/: prompt đã dùng với ImageGen tích hợp, gồm các lượt sửa cục bộ.

Tất cả ảnh gốc W18_huy được giữ nguyên. Bộ này không sửa website đang chạy.
Quy tắc chưa duyệt/khả năng chưa được đối tác xác nhận KHÔNG được xem là đã chốt.
Chủ sản phẩm cần duyệt cap quảng cáo, cách chuyển tập; cung cấp tài liệu player đối tác.

Không chép text từ PNG. Không dùng từng poster diễn giải trong ảnh AI làm nhiều asset cho cùng movieId.
Không đánh dấu toàn bộ checklist DEV đã đạt chỉ vì bộ file đã đủ.

Chạy scripts/build-handoff.mjs và check-html.mjs cần Node và các package marked/playwright; đường dẫn runtime trong script là của máy tạo bộ bàn giao, không phải yêu cầu stack website.
