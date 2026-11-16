# Nghiệm thu và vận hành

## Hai lớp kiểm thử khác nhau

`qa/prototype-results.json`: kết quả đã chạy trên HTML/JS cục bộ, gồm render/overflow, logic mô phỏng và tương tác. Không kiểm DB, xác thực thật, transaction, worker, đối tác, hiệu năng hoặc an toàn production.

`data/uat-cases.json` và tab UAT: ca kiểm thử hệ thống thật. Trạng thái ban đầu “Chưa chạy” hoặc “Chờ đối tác”. Chỉ cập nhật Pass khi có build/environment, người kiểm, thời điểm, actual result và evidence. Nếu còn dependency chưa đạt thì không ghi Pass dù màn thiết kế trông đúng.

## Dữ liệu và trách nhiệm thử

- QA/DEV: chuẩn bị staging tách production; seed 6 vai trò, movie draft/live/expired, hai nguồn thử, campaign exclusive/shared/paused, confirmed booking, invalid CSV, hai thao tác cạnh tranh.
- Người quản nội dung: nghiệm thu metadata, preview, duyệt, publish/rollback và quyền nội dung.
- Người quảng cáo: nghiệm thu inventory, reservation, cap, creative, báo cáo phân phối.
- Finance + Owner: nghiệm thu import, duplicate, reconciliation, lock, payment và export.
- Đầu mối đối tác + DEV: chạy INT-01…12 và ký evidence.
- Owner sản phẩm: duyệt thông số/ngoại lệ, xác nhận phạm vi launch. Tên người phụ trách vẫn để trống, không tự gán cho nhân sự chưa được chỉ định.

## Điều kiện qua từng cổng

| Cổng | Điều kiện |
|---|---|
| G0 — bắt đầu DEV | Duyệt phạm vi P0/P0-C và ưu tiên; review contract; chọn auth/DB/storage/environment; chốt field đang có tranh luận |
| G1 — nội dung trên staging | Auth/RBAC/audit, upload, revision, publish/cache, public filtering, responsive, các trạng thái lỗi chạy thật |
| G2 — quảng cáo | Không race booking, exclusive đúng, cap và protection pass; creative/URL được duyệt; không impression giả |
| G3 — tích hợp | Bằng chứng player/report; nếu thiếu capability bắt buộc phải đổi scope bằng quyết định, không tự bỏ |
| G4 — vận hành | UAT P0 không lỗi nghiêm trọng; diễn tập backup/restore; giám sát và người trực; checklist rollback, secrets, domain/TLS |
| G5 — go-live | Chủ sản phẩm ký build/version cụ thể, danh sách tồn đọng được chấp nhận, cấu hình production được duyệt riêng |

Không cam kết “đạt triển khai production” từ việc hoàn thành file thiết kế. Có thể DEV và test staging theo từng phần, nhưng mọi phụ thuộc phải có trạng thái rõ.

## Kịch bản UAT trọng tâm

Các ca cụ thể có ID, feature, màn, API, tiền điều kiện, dữ liệu, bước, expected, vai trò, mức ưu tiên, trạng thái, người kiểm và evidence trong bảng bàn giao. Bổ sung regression khi backend/partner có behavior khác contract; không ghi đè lịch sử chạy trước.

## Runbook sự cố

### OPS-01: Website/player không phát

1. Support ghi thời điểm, phim/tập/source, browser/device, requestId; không gửi token qua ticket.
2. Admin phân biệt API/publication/player/CDN, xem health và version live. Kiểm thử bằng nguồn được phép, không quét URL ngoài allowlist.
3. Nếu có nguồn dự phòng verified cùng phim/tập, chuyển cấu hình đúng quy trình; nếu không, báo lỗi thân thiện và tắt nguồn hỏng. Không hứa tiếp tục timestamp nếu chưa có seek.
4. DEV xử lý adapter/cache/job; Admin phục hồi có test desktop/mobile; ghi nguyên nhân, thời gian, ảnh hưởng và evidence đóng ticket.

### OPS-02: Quảng cáo che nội dung / đích không phù hợp

1. Ads có thể pause campaign; Admin kill-switch đúng scope, block creative khi cần. Không xóa audit/reservation.
2. Chụp evidence viewport, xác định configVersion, slot/campaign/creative và thời điểm. Không bấm quảng cáo thật để thử CTR.
3. Kiểm cap/mutual exclusion/player/footer/menu/keyboard/fullscreen. Sửa staging, chạy regression.
4. Owner/Admin quyết định bật lại. Người kinh doanh liên hệ đối tác về lịch/đối soát; không tự hứa bồi thường.

### OPS-03: Xuất bản lỗi hoặc sai nội dung

1. Dừng job đang lỗi nếu an toàn, giữ published snapshot tốt trước đó; gỡ khẩn nếu nội dung không được phép.
2. Đối chiếu resourceRevision, review, release, cacheVersion; retry idempotent với cùng nghiệp vụ.
3. Rollback chỉ snapshot hợp lệ theo rights/source hiện tại; không phục hồi nội dung đã blocked/expired.
4. Kiểm web công khai, search/home/watch dùng cùng version. Lưu audit và ca regression.

### OPS-04: Báo cáo tiền lệch / nhập trùng

1. Không confirm/lock kỳ đang lệch. Giữ file gốc private, checksum và source timezone/currency.
2. Finance kiểm row keys, kỳ chồng, adjustment, số net/paid, mapping campaign/slot. Không đổi missing thành 0.
3. Liên hệ đầu mối đối tác qua quy trình ngoài hệ thống; tài liệu này không gửi thay.
4. Supersede/correction theo trạng thái kỳ; kỳ locked dùng bản bổ sung được duyệt. Đóng với report version + người duyệt.

### OPS-05: Tài khoản bị lộ / mất quyền

1. Owner khóa staff, thu hồi sessions; rotate secrets bị ảnh hưởng; audit thời gian và scope.
2. Không tự reset toàn hệ thống hoặc xóa log. Duy trì Owner active cuối cùng qua quy trình break-glass được duyệt.
3. DEV kiểm access logs/IDOR, khôi phục quyền tối thiểu, MFA và cảnh báo. Truy cập lại phải xác minh chính chủ qua quy trình nội bộ.

### OPS-06: Khôi phục dữ liệu

1. Duyệt yêu cầu, phạm vi, backup và người thực hiện; production cần step-up/approval. Sao lưu hiện trạng trước thay đổi.
2. Restore trên isolated staging; kiểm count, FK, revision, reservations không trùng, payment balances, role và secrets references.
3. Chọn cửa sổ production và thông báo nội bộ theo người phụ trách; chạy cutover có rollback rõ.
4. Smoke test public/admin, cache invalidation, jobs và thống kê; không gắn nhãn backup “verified” chỉ vì file tồn tại.

## Lịch vận hành đề xuất

Hằng ngày: hàng đợi lỗi, nguồn phát, lịch bắt đầu/kết thúc QC, rights sắp hết hạn, backup. Hằng tuần: quyền nhân sự, creative/URL, báo cáo lỗi, khoảng trống hoặc xung đột inventory. Hằng kỳ đối tác: import/đối soát/khóa kỳ/xuất báo cáo. Diễn tập restore và review quyền theo lịch được Owner duyệt.

Mục tiêu đề xuất chưa ký: sự cố critical được tiếp nhận trong 15 phút giờ trực; backup mỗi ngày, RPO≤24h/RTO≤4h; raw events 30 ngày, aggregate 13 tháng, audit 365 ngày. Chưa có người trực, năng lực hạ tầng hoặc yêu cầu tuân thủ xác nhận nên **không coi đây là SLA đã cam kết**.
