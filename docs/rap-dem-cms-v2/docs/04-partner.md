# Kiểm chứng đối tác trước khi bật tính năng

**Trạng thái hiện tại: chưa xác minh tất cả khả năng tích hợp thực tế.** Không có player, tài liệu SDK, report API, báo cáo thật hoặc môi trường được phép test trong bộ V2. Màn hình và button không phải bằng chứng hỗ trợ.

## Gói thông tin phải nhận

Đầu mối kỹ thuật; domain embed và domain script/media liên quan; URL test phim lẻ/phim bộ; phạm vi được phép thử; tài liệu API/SDK với version; nguồn dự phòng; cấu hình preroll/skip; định nghĩa events; report CSV/API có redaction dữ liệu nhạy cảm; mapping ID, timezone, currency và kỳ chốt.

## Ma trận bằng chứng

| ID | Khả năng | Cách kiểm tra | Bằng chứng cần | Nếu chưa đạt |
|---|---|---|---|---|
| INT-01 | Phát phim nhúng | Embed phim được phép trên Chrome desktop, Android Chrome, iOS Safari; play/pause/fullscreen | Video/screenshot test + URL đã redacted + version trình duyệt | Không bật source |
| INT-02 | Cross-origin events | Listener kiểm origin/source/payload; thử event giả từ origin khác | SDK doc + log event thực và negative test | Watch time / play metrics N/A |
| INT-03 | Preroll | Phát creative test được phép; lỗi/no-fill có trả phim không | Tài liệu cấu hình + network/event log | Feature flag off; yêu cầu quyết định nếu bắt buộc |
| INT-04 | Skip | Thử trước/sau thời điểm cho skip; bấm chỉ khi callback cho phép | API skip + evidence mobile/desktop | Không hiện nút skip giả |
| INT-05 | Đổi nguồn | Hai nguồn cùng phim/tập; source A lỗi; B ready | Test nguồn dự phòng, mapping nội dung | Chỉ một nguồn hợp lệ, không hứa failover |
| INT-06 | Seek / tiếp tục | Chuyển nguồn ở mốc thời gian xác định | Callback seek/get-time và kết quả | Chuyển nguồn có thể về đầu; ghi rõ UX |
| INT-07 | Chuyển tập native | Đi đến mọi tập, không kẹt tập1, mobile cũng dùng được | Phim bộ mẫu và kết quả đủ tập | Chặn publish series; không tự thêm selector |
| INT-08 | Fullscreen / layout | Fullscreen, xoay màn, back, footer/player protection | Video thực tế iOS/Android | Floating off ở WATCH nếu không bảo vệ được |
| INT-09 | Host / CSP / sandbox | Allowlist tối thiểu, không popup điều hướng bất ngờ | Danh sách domain và thử CSP staging | Không cho raw iframe/script mới |
| INT-10 | Metrics / report | Cùng campaign/slot/day đối chiếu file thật với dashboard đối tác | File/API mẫu, definitions, mapping IDs | Revenue N/A; chưa nghiệm thu đối soát |
| INT-11 | Currency / timezone / adjustment | Kỳ có biên ngày, điều chỉnh âm, cập nhật lại báo cáo | Định nghĩa kỳ và 2 file version | Không commit khi chưa rõ |
| INT-12 | Hết hạn / lỗi / rate limit | Token hết hạn, server down, timeout, 429 | Log redacted và trạng thái hiển thị | Graceful error, không bịa play thành công |

Kết quả từng capability chỉ dùng `unverified`, `supported`, `unsupported`. `supported` cần evidenceId, testedAt, adapterVersion, người kiểm và người duyệt. Đổi adapter/domain/SDK phải đánh dấu cần kiểm lại; bằng chứng cũ không tự chứng minh bản mới. Hệ thống không xác nhận quyền khai thác nội dung chỉ vì embed hoạt động.

## Mẫu báo cáo chuẩn hóa để DEV chuẩn bị parser

Mỗi dòng đề xuất: sourceRowId, partnerId, reportDate, sourceTimezone, campaignExternalId, placementExternalId, currency, billableImpressions (nullable), clicks (nullable), grossMinor, adjustmentMinor, reportVersion. Không dùng dấu phân cách hàng nghìn trong số; ngày ISO; currency riêng; lưu nguyên file nguồn. VND sử dụng đơn vị đồng (minor unit exponent=0); ví dụ USD cents cần mapping currency exponent đã xác nhận. Không đoán đơn vị theo cỡ số.

Fixture trong package là **schema mẫu nội bộ**, chưa phải format đối tác đồng ý. Parser adapter phải được xác nhận lại sau khi nhận file thực tế. Nếu đối tác không cung cấp ID dòng ổn định, phải thống nhất khóa tự nhiên và chính sách supersede trước commit dữ liệu.
