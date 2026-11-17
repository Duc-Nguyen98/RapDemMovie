# Rạp Đêm · Thư viện thiết kế

[Mở thư viện trên GitHub Pages](https://duc-nguyen98.github.io/RapDemMovie/)

Bộ thiết kế tạm duyệt dành cho DEV và Designer gồm web xem phim V18 và CMS quản trị V2. Có thể mở `docs/index.html` trên máy để duyệt ngoại tuyến.

| Nội dung | Tài liệu |
| --- | --- |
| Web xem phim V18 | [9 ảnh thiết kế gốc](docs/web-v18/images/) · [Đặc tả hành vi](docs/web-v18/contract/DEV-CONTRACT-V18.md) |
| Sơ đồ | [Người xem](docs/rap-dem-cms-v2/images/rap-dem_cms-v2_01-viewer-flow.png) · [CMS](docs/rap-dem-cms-v2/images/rap-dem_cms-v2_02-cms-flow.png) · [Tổng thể](docs/rap-dem-cms-v2/images/rap-dem_cms-v2_03-combined-flow.png) |
| CMS V2 | [Prototype trên Pages](https://duc-nguyen98.github.io/RapDemMovie/rap-dem-cms-v2/prototype/) · [Bộ màn hình](docs/rap-dem-cms-v2/images/) · [OpenAPI](docs/rap-dem-cms-v2/api/openapi.json) |
| Triển khai và nghiệm thu | [Bảng Excel](docs/rap-dem-cms-v2/rap-dem_cms-v2_trien-khai-va-nghiem-thu.xlsx) · [Bộ CMS ngoại tuyến](docs/downloads/) |

Prototype chạy trong trình duyệt bằng dữ liệu mẫu. Các hạng mục cần xác nhận với đối tác và kết quả nghiệm thu thực tế được theo dõi trong hồ sơ CMS.

Trong trình xem web V18, **Bản dựng chữ nét** sử dụng nội dung trong đặc tả và hình cắt từ mẫu duyệt. Chọn **Đối chiếu PNG** để kiểm tra bố cục cùng kích thước thiết bị, hoặc **Ảnh gốc** để xem cả bảng thiết kế. Nút **1:1** đặt mỗi pixel ảnh đang xem vào một pixel vật lý của màn hình.

Ảnh xem CMS và sơ đồ trong `docs/studio/hd` được chụp từ HTML ở mật độ 3×. Để cập nhật sau khi sửa nguồn, chạy `npm install` trong `tools`, sau đó `npx playwright install chromium` và `npm run hd`. Lệnh `npm run web-art` đồng bộ chữ và hình tham chiếu cho bản dựng V18.
