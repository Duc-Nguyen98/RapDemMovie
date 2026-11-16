# Quy tắc quảng cáo và lịch đặt chỗ

## 1. Mô hình áp dụng

Hai cơ chế: **thuê độc quyền một vị trí theo khoảng thời gian** và **chia sẻ theo trọng số khi không có đặt chỗ độc quyền**. Nội dung house là dự phòng đã được duyệt. Không có đấu giá, tối ưu giá động, tự refresh hoặc cam kết doanh thu trong MVP.

Campaign quản lý mục tiêu/lịch/đối tác; Creative quản lý nội dung; Placement xác định vị trí giao diện; Assignment gán creative vào vị trí; Reservation giữ độc quyền. Không dùng một cột priority để thay cả năm đối tượng này.

## 2. Đặt chỗ và chống xung đột

1. Người quảng cáo soạn reservation draft: campaign exclusive, danh sách slot theo thiết bị, startsAt/endsAt, fallback, reason.
2. UI gọi kiểm tra xung đột để gợi ý. Kết quả không giữ chỗ và có thể hết đúng ngay khi người khác xác nhận.
3. Owner/Admin confirm: kiểm quyền, revision, campaign approval, schedule/device/slot và quyền nội dung creative.
4. Trong **một transaction**, khóa các slot theo thứ tự ID cố định; tìm mọi reservation confirmed có `a.start < b.end && b.start < a.end`; có xung đột thì rollback toàn bộ. Cần DB constraint hoặc isolation phù hợp, không chỉ check rồi insert ngoài transaction.
5. “Tất cả thiết bị” được chuẩn hóa thành slot desktop/tablet/mobile. Confirm nhiều slot là all-or-nothing; không âm thầm bán được desktop nhưng bỏ mobile.
6. Chạm biên không trùng: A kết thúc 20/11 00:00, B bắt đầu cùng lúc là hợp lệ. Server dùng UTC; UI hiển thị UTC+7.
7. Campaign pause/blocked/creative lỗi **vẫn giữ reservation**. Chỉ explicit cancel có lý do hoặc thời gian kết thúc mới hết độc quyền. Đổi lịch confirmed: cancel+create thay thế trong transaction, không có khe hở chiếm chỗ giữa chừng.
8. Duplicate submit cùng idempotency key trả kết quả cũ. Hai key khác nhau cạnh tranh một slot: tối đa một confirm thành công, request kia 409 BOOKING_CONFLICT. Audit cả kết quả quan trọng.

## 3. Thứ tự phân phối

| Bước | Điều kiện | Kết quả |
|---|---|---|
| 1 | Kill switch, slot disabled, policy chưa approved, thiết bị không hợp lệ | no_fill, không tạo quảng cáo giả |
| 2 | Có nhiều reservation độc quyền cùng slot/time (dữ liệu lỗi) | fail closed, no_fill, cảnh báo vận hành |
| 3 | Có một reservation confirmed còn hiệu lực | Chỉ xét campaign đó và creative approved cùng campaign |
| 4 | Độc quyền không có creative khả dụng | approved_house nếu reservation cho phép; nếu không collapse. **Không chuyển sang shared trả tiền khác** |
| 5 | Không có reservation | Lọc shared active theo schedule/device/format/approval; chọn theo weight 1–100 |
| 6 | Không có shared hợp lệ | house approved hoặc no_fill |

Với 60/40, xác suất mục tiêu là 0,6/0,4 trên tập đủ điều kiện; không hứa đúng 6/4 ở mỗi 10 lượt. Không đặt hai creative cùng campaign gây sai trọng số mà không có quy tắc: weight thuộc assignment; tổng weight của campaign là tổng assignments hợp lệ. DEV phải ghi rõ khi UI dùng weight theo creative, không gắn nhãn “tỷ trọng campaign” sai.

Quyết định server có decisionId/token ký và configVersion. Một lượt mount là một request; không tự refresh. Nội dung trả về có nhãn “Quảng cáo”/“Tài trợ”, đích HTTPS đã duyệt. Nếu bên thứ ba không cho phép đo visible trong iframe, không bịa số billable.

## 4. Quy tắc trải nghiệm — giá trị đề xuất, cần ký duyệt

| Mục | Đề xuất | Trạng thái |
|---|---|---|
| Modal | Chỉ HOME; chờ ≥3 giây sau route ổn định; tối đa 1/24 giờ và 1/phiên trên trình duyệt | Chờ duyệt thông số |
| Đóng modal | X nhìn gọn nhưng vùng bấm ≥44×44 CSS px; Esc; không khóa bằng đồng hồ giả | Chờ duyệt kích thước vùng bấm |
| Thời gian lỗi ad | Timeout 3 giây; đóng/bỏ slot, không chặn nội dung | Chờ duyệt timeout |
| Floating | Chờ ≥8 giây và scroll ≥25%; đóng thì nghỉ 24 giờ; một slot mobile một lúc | Chờ duyệt |
| Khoảng đáy | 12px + safe-area-inset-bottom; không đè bottom nav/footer/player | Chờ duyệt |
| Loại trừ | Không modal và floating cùng lúc; ẩn floating khi dialog/menu/bàn phím/fullscreen hoặc player/footer giao viewport | Quy tắc an toàn trong contract; cần test thật |
| Mobile | Một banner 320×50 hoặc co theo max-width viewport−32px; không hai popup hai góc đồng thời | Phương án cần chủ sản phẩm chốt |
| Tablet | Chỉ rail khi đủ khoảng ngoài nội dung; còn lại chuyển slot inline đã đăng ký | Chờ duyệt layout/slot |
| Desktop | Rail ngoài nội dung, nhiều slot xếp dọc có khoảng cách; không nhiều fixed chồng nhau | Cần đối chiếu slot registry với frontend V18 |
| Auto refresh | Tắt mặc định | Đề xuất MVP |

Cap key theo site + slot family + policyVersion, không theo campaign để tránh lách cap khi đổi chiến dịch. Tính lượt khi creative đã hiển thị thành công; khi lỗi không đánh dấu impression nhưng có cooldown lỗi trong phiên để không lặp liên tục. Khi storage không khả dụng, giữ cap trong bộ nhớ phiên và chọn mặc định không tăng tần suất. Không fingerprint người xem để đồng bộ thiết bị.

Đóng modal không làm floating xuất hiện ngay: floating vẫn phải đủ delay/scroll và không trong cooldown của policy. Khi quay lại route, cap còn hiệu lực. Đổi route bỏ quảng cáo cũ, không giữ overlay trên màn không được phép.

Các kích thước ở prototype là ví dụ UI CMS. Không thay bộ ảnh website V18, không phải inventory đã được đối tác bán. Số lượng vị trí không bảo đảm doanh thu; đo tỷ lệ tải, viewability nội bộ, tác động trải nghiệm và báo cáo đối tác trước tăng mật độ.

## 5. Preroll và trình phát

Preroll chỉ qua API/SDK/cấu hình được đối tác cho phép và đã có evidence. Skip chỉ khi có event/mốc skip thực. Không phủ banner giả lên iframe rồi tính là video ad. Nếu không hỗ trợ preroll mà đây là yêu cầu bắt buộc ra mắt, phải xin quyết định thay đổi scope/đối tác, không nghiệm thu banner-only là hoàn tất.

## 6. Đo lường, tiền và báo cáo

- Phân biệt request, loaded, visible_internal, click, close, error và billable của đối tác. Events client không phải sổ doanh thu.
- Visible nội bộ đề xuất: ảnh có ≥50% diện tích trong viewport liên tục ≥1 giây khi tab visible; đây là định nghĩa nội bộ cần duyệt, không tự coi là chuẩn tính tiền đối tác.
- Mỗi eventId duy nhất, bind decisionToken, slot/campaign/creative/device/version; server dedupe, rate limit, loại test/bot theo rule đã duyệt. Không trust occurredAt tuyệt đối.
- Báo cáo ghi rõ nguồn, timezone, currency, ngày dữ liệu gần nhất và định nghĩa. Thiếu dữ liệu là N/A, không 0.
- Doanh thu xác nhận từ CSV/API/hợp đồng; payment ledger chỉ tiền đã nhận. Không cộng VND với USD, không quy đổi tỷ giá tự đặt.
- Mô hình giá flat/CPM/CPC/mixed, thuế, phí, kỳ và xử lý chênh lệch chờ thỏa thuận thật. Không ghi giá demo vào hợp đồng production.

## 7. Vận hành khi quảng cáo lỗi

Tắt slot/campaign hoặc kill switch theo mức độ; giữ reservation để không bán trùng; kiểm logs không secret; liên hệ người phụ trách; chỉ bật lại sau test creative/URL/cap. Nếu có nội dung không phù hợp, block creative ngay nhưng không xóa evidence/audit. Không tự hoàn tiền hoặc hứa bồi thường bằng logic hệ thống.
