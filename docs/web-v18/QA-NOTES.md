# Kiểm tra bộ bàn giao V18
Ngày: 14/11/2026. Trạng thái: bản duyệt, chưa nghiệm thu production.

## Đã kiểm tra
- 9 PNG có tên thống nhất V18: 5 màn chính, 2 board trạng thái quảng cáo theo viewport, 2 board trạng thái chức năng.
- Hero chính dùng “Tối nay xem gì?”; nền modal có eyebrow, hướng dẫn và ô tìm kiếm.
- Footer 5 màn chính có đủ nhóm khám phá, hỗ trợ/chính sách và hợp tác; source of truth là ui-copy.vi.json.
- Không login hội viên, không Premium, không nút Về đầu trang.
- Desktop giữ 3 quảng cáo mỗi bên. Các card nổi tách khỏi ảnh toàn trang sang board trạng thái.
- Nguồn dữ liệu mẫu có 20 ID duy nhất; tham chiếu từ 6 section hợp lệ; 6 quick filters; crop poster nằm trong atlas1024×1536.
- Bộ dữ liệu và ảnh gốc không thay đổi file người dùng trong W18_huy.
- Kích thước/hash từng PNG được đọc trực tiếp trong manifest.json, không lấy từ prompt.
- Ảnh HOME responsive mới là1013×1552 (nguồn1001×1570); modal là1619×971 (nguồn1620×971). Không giữ nguyên kích thước nguồn ở hai file này. Các màn home desktop/watch desktop/watch responsive vẫn1024×1536.

## Giới hạn và sai khác còn lại — không được coi là đã sửa tuyệt đối
1. PNG là chỉnh sửa/tạo thêm bằng ImageGen: poster, hình người, góc cắt và vi ký tự chưa đồng nhất từng pixel. Đặc biệt “Những Ngày Mùa Hạ”, “Đưa Em Về Sài Gòn”, các poster trong board trạng thái còn khác giữa PNG. Không được lấy các phiên bản đó làm nhiều asset cho cùng ID.
2. Một số metadata trên thẻ nhỏ chỉ hiển thị một thể loại, hoặc vi ký tự bị méo. JSON ghi đủ dữ liệu chuẩn. Website phải lấy từ dữ liệu thật và có quy tắc rút gọn/truncate thống nhất, không chép PNG.
3. Board modal đã thêm banner đầu trang và hero mới, nhưng creative nền bị đơn giản hóa và tỷ lệ nền chưa khớp hoàn toàn HOME. Modal trông gần giữa, nhưng căn giữa CSS/resize vẫn phải nghiệm thu trên prototype.
4. Board responsive quảng cáo đang minh họa một ví dụ Quỹ Đạo Cuối, không phải cùng scrollY/nội dung với WATCH Sài Gòn00:00. Các panel là hình trạng thái, không phải screenshot của một website đã chạy hoặc viewport CSS đúng tỷ lệ1:1.
5. Footer mobile trong board trạng thái quảng cáo xếp thành3 cột nhỏ; quy tắc chuẩn trong contract là2 cột link + hợp tác toàn hàng và ảnh HOME/WATCH chính. DEV không dùng board phụ để ghi đè footer.
6. Board phụ có thể hiển thị thời lượng/control native mang tính minh họa; chúng chưa được nhà cung cấp xác nhận, không là cam kết tính năng.
7. “Phim cùng thể loại” trong một số mockup có phim không cùng thể loại với phim chính. DEV lấy từ quan hệ genres trong dữ liệu; nếu không đủ thì đổi nhóm thành “Khám phá thêm”, không gắn nhãn sai.
8. Khoảng trống ngoài viền trang trên một số artboard không phải khoảng cách của website. Chú thích “xem bản khung nhìn” và “Mẫu duyệt” là annotation, không phải footer site.
9. Atlas poster là các vùng thumbnail nhỏ trên ảnh nguồn; đủ tham chiếu prototype nhưng chưa đủ chất lượng asset phát hành. Cần chủ sản phẩm giao/duyệt poster riêng có quyền sử dụng.
10. Không đo doanh thu, không kiểm tra player thật, không chạy QA website. Cần duyệt D02/D03/D05 và xác nhận P01 trước khi bật quảng cáo/series liên quan.

## Nguồn nào quyết định khi khác nhau
- Câu chữ: data/ui-copy.vi.json và ui-copy.vi.txt.
- Tên, năm, thể loại và poster: data/movies.sample.json + source-assets/poster-master.png; catalog-preview.html hiển thị cùng vùng ảnh không sửa.
- Thứ tự section: data/home-sections.json.
- Hành vi/điểm ngắt/kích thước: contract + JSON proposed sau khi chủ sản phẩm duyệt.
- PNG: hướng nhìn và minh họa, không là tài liệu pixel-perfect hoặc bằng chứng đã triển khai.

## Kiểm tra tự động cục bộ
scripts/build-handoff.mjs kiểm tra dữ liệu, sinh trang đọc contract và manifest.
scripts/check-html.mjs kiểm tra HTML ở1440px và390px; kết quả trong qa/html-checks.json; đây là kiểm tra trang bàn giao, không phải web phim.

## Để được chốt triển khai
Có thể giao DEV dựng prototype từ bộ này. Không nên gắn nhãn “thiết kế đã hoàn hảo” hoặc “sẵn sàng ra mắt”.
Cần duyệt quy tắc và dựng các component/data-binding có thể kiểm thử, sau đó nghiệm thu A01–A18 trong contract.

