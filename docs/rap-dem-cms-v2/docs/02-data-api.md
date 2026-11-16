# Contract dữ liệu, API và phân quyền

## Tài liệu chuẩn

`api/openapi.json` là hợp đồng máy đọc được dùng để review/generate client, **chưa có server**. `data/data-dictionary.json` liệt kê field và ràng buộc từ cùng schema; bảng HTML được sinh từ nguồn đó. `data/permission-actions.json` liệt kê quyền theo operation. Không duy trì ba danh sách field độc lập bằng tay.

Contract dùng [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html), không khẳng định đây là phiên bản mới nhất. Lỗi dùng `application/problem+json` với các field chuẩn và extension code/fieldErrors/requestId theo [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).

## Quan hệ và nguồn dữ liệu chuẩn

| Quan hệ | Cardinality / ràng buộc |
|---|---|
| Staff ↔ Role | N–N; ít nhất một Owner active; không tự nâng quyền; tài khoản locked thu hồi phiên |
| Movie ↔ Taxonomy | N–N; genre active, không xóa taxonomy đang dùng; country/language chuẩn hóa |
| Movie → Episode → Source | 1–N; unique(movieId,season,number); Source trỏ cùng phim/tập; movie lẻ episodeId=null |
| Provider → Source | 1–N; exact-host allowlist; nguồn disabled/expired không trả public |
| Asset → Movie/Creative | Nơi sử dụng phải tra cứu trước archive; không sửa bitmap đang live tại cùng key |
| Resource → Review → Release | Review gắn revision bất biến; release từ review approved; public chỉ đọc published snapshot |
| AdPartner → Campaign → Creative | 1–N; creative thuộc campaign; chỉnh creative đã duyệt phải duyệt revision mới |
| Campaign → Reservation → Placement | Exclusive; mỗi slot/thiết bị không được có hai khoảng confirmed chồng nhau |
| Campaign / Creative → Assignment → Placement | Chỉ cùng campaign, format, device và kích thước hợp lệ |
| RevenueImport → Statement → Payment allocation | Import committed; cùng partner/kỳ/currency; allocation không vượt tiền nhận/công nợ |
| Report → Staff / Movie / Source | Người nhận active; source phải thuộc phim/tập được báo |
| AuditEvent / Job | Audit bất biến, job idempotent có correlationId; không trả token |

DB vật lý do DEV chọn nhưng phải có khóa ngoại, unique constraints và transaction cho các bất biến. Hạn chế xóa cứng; archive/withdraw khác nhau. Audit và báo cáo tiền không được xóa để “sửa tổng”.

## Quy ước request / response

- Admin `/admin/v2`, public `/api/v2`; public không trả draft, internal notes, rights evidence, finance, credentials.
- ID ổn định do server sinh; slug duy nhất; mutation không được nhận readOnly field. Patch chỉ thay field gửi lên, validate trên bản merged, null chỉ khi schema cho phép. Empty patch bị chặn.
- Input text normalize trim/NFC; HTML chỉ allowlist ở nội dung trang, sanitize server; render text bằng textContent/template escape. Required không đồng nghĩa mọi chuỗi được phép rỗng: các ràng buộc nghiệp vụ dưới đây vẫn bắt buộc.
- Timestamp RFC3339 có offset, lưu UTC; hiển thị UTC+7. Các khoảng đều `[start,end)`. Start < end; không đoán timezone từ máy nhân viên.
- GET entity trả `ETag: "revision"`; update/action gửi `If-Match`. Sai version trả 412 STALE_REVISION, thiếu trả 428. UI giữ nội dung đang nhập để so sánh. Cơ chế này tránh lost update theo [MDN If-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/If-Match).
- Mutation admin (trừ auth) dùng Idempotency-Key. Đề xuất TTL 24 giờ; cùng actor/route/key/payload trả kết quả cũ, khác payload trả 409 IDEMPOTENCY_CONFLICT. Không dùng key để bỏ qua kiểm quyền mới.
- List dùng cursor opaque, limit mặc định 25/tối đa 100 admin; public tối đa 24. Sort ổn định createdAt DESC,id DESC (kho phim public recent theo publishedAt,id). Cursor phải ràng filters/sort, không đưa SQL tùy ý từ client.
- 201: bản ghi đã tạo; 202: tác vụ đã nhận, cần đọc job; 200: hoàn tất operation sync. Lỗi không được giả 200 với rỗng.
- 400 sai cấu trúc, 401 chưa auth, 403 cấm, 404 không tồn tại/không lộ ngoài scope, 409 lịch/state/duplicate, 422 field/business, 429 rate limit, 503 tích hợp unavailable. Không trả stack trace hoặc secrets.
- Request ghi dữ liệu phải có correlationId ở server và audit actor/action/resource/revision/reason. Đáp ứng lỗi có requestId để hỗ trợ.

## Xác thực và quyền

Cookie staff session `Secure`, `HttpOnly`, `SameSite=Strict`; TLS bắt buộc. Mutation kiểm X-CSRF-Token gắn session và Origin allowlist. CORS không wildcard với credentials. Login/reset rate-limit, phản hồi không tiết lộ email tồn tại. MFA bắt buộc cho Owner/Admin và quyền nhạy cảm; hành động restore/secret/role/tài chính yêu cầu step-up theo chính sách được duyệt. Session đề xuất 30 phút idle/12 giờ tuyệt đối, challenge 5 phút, reset token 15 phút một lần — vẫn chờ chốt.

Áp dụng deny-by-default, kiểm quyền mọi request và từng đối tượng, không chỉ ẩn nút; theo [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html). Vai trò là grant tối đa, còn object scope/field/state có thể giảm quyền.

| Vai trò | Có thể | Không được |
|---|---|---|
| Owner | Quyền toàn hệ thống, quản lý vai trò; override có lý do/audit | Xóa Owner active cuối cùng; sửa audit; giả bằng chứng đối tác |
| Admin | Duyệt/xuất bản, nội dung, dừng QC, đối soát, vận hành | Tự nâng Owner, tự gán quyền vượt grant, xem plaintext secret |
| Editor | Soạn metadata, ảnh, cấu hình nháp, gửi duyệt; nguồn trong phạm vi | Duyệt/publish trực tiếp, verify rights/capability, tiền và phân quyền |
| Ads | Soạn campaign/creative/assignment/reservation; tạm dừng campaign | Duyệt, activate, confirm/cancel reservation, thay system slot hoặc chi tiền |
| Finance | Nhập báo cáo, lập kỳ, ghi payment draft, xuất báo cáo theo partner | Tự confirm/lock kỳ; confirm/reverse payment; sửa nội dung phim |
| Support | Ticket được giao, ghi chú, yêu cầu gỡ | Gỡ trực tiếp, đọc tiền, đổi nguồn/chiến dịch |

Phiếu do chính người duyệt tạo: chỉ Owner được override với selfApproval=true và lý do. Admin không tự duyệt. Staff invitation role grant phải là tập con quyền cấp của actor. Finance chỉ đọc/download file revenue_csv, không quyền phát/hợp đồng riêng nếu chưa được cấp. Task/notification/session theo own/assigned; không sửa session người khác trừ action thu hồi của staff đúng quyền.

## Ràng buộc nghiệp vụ ngoài JSON Schema

1. Movie: title 1–200, slug đúng pattern unique, year 1888…năm hiện tại+5, ít nhất 1 genre trước submit; poster clean và quyền có evidence trước publish. Related IDs tối đa 12, không chính nó, không duplicate. Khi quyền hết hạn, job ngừng public và invalidate cache; không chờ nhân sự gỡ thủ công.
2. Episode: chỉ cho series; nguồn phim bộ trỏ tập tồn tại. Gate episodeNavigation=supported có evidence còn hiệu lực theo adapter version. Chưa đạt thì chặn publish series bằng CAPABILITY_UNVERIFIED.
3. Source: HTTPS exact-host, không userinfo/IP private/localhost; không follow redirect sang host khác; kiểm egress và timeout khi backend test. Client không được tải URL tùy ý thay server. Health phải từ kiểm tra thật; iframe load không chứng minh playback.
4. Asset: ảnh JPG/PNG/WebP ≤5MB đề xuất; validate chữ ký/MIME/dimensions, scan/quarantine; không raw JS/SVG/HTML. Private evidence PDF/ảnh, revenue CSV qua endpoint riêng. Server quyết định private/public theo purpose; không cho client đổi evidence thành public. Asset đã dùng/live không archive/ghi đè. Download private audit + URL ngắn hạn.
5. Review: submit tạo review pending gắn revision. Update resource đang in_review bị chặn; phải reject/withdraw review về draft. Bản approved muốn sửa tạo revision mới và reset approval. Không cho patch status.
6. Publish: review approved current revision + rights verified còn hạn + source ready + capability gates. Worker ghi release/public snapshot và outbox, invalidate cache; mọi node đọc version thống nhất. Không hoàn tất nếu cache/viewer chưa xác nhận version. Rollback chọn snapshot đã approved nhưng vẫn phải kiểm quyền, lịch và nguồn hiện hành.
7. Page/SiteConfig/HomeSection: cùng review/release. Mode manual chỉ movieIds; mode rule chỉ rule; tránh hai nguồn cạnh tranh. Chỉ public phim đã published và còn khả dụng. Hero/footer/filter IDs dùng chung.
8. Campaign/creative/assignment/reservation: xem rulebook quảng cáo. Confirm reservation cần active/approved/scheduled campaign exclusive, chứa trọn lịch reservation, slot canonical hợp lệ. Reservation confirmed không patch lịch; cancel và tạo mới trong transaction nếu cần đổi. Không sửa assignment của campaign active để bypass duyệt.
9. CSV: lưu bản nguồn private, checksum SHA-256; unique partner+checksum và unique partner+sourceRowId+period+currency. Cần mapping mẫu thật trước go-live; chặn duplicate/unknown slot/out-of-period/wrong currency. Validate không ghi tiền; commit atomic; file sai có lỗi từng dòng. Không tự thay dòng lỗi bằng 0.
10. Statement: server tính gross từ committed imports cùng scope, điều chỉnh có chứng từ/lý do; net=gross+adjustment không âm; paid từ allocations confirmed; due=net−paid. Input gross phải khớp tổng nguồn hoặc bị từ chối; client không tự xác nhận tiền. Khóa kỳ cấm sửa; correction là bản bổ sung có dấu vết, không sửa import cũ.
11. Payment: không chuyển tiền. Reference unique theo partner; amount>0; cùng currency; tổng allocation≤amount và≤công nợ. Confirm/reverse Owner, có bằng chứng/lý do; reverse tạo bút toán đối ứng, không xóa. Không khóa kỳ khi nhập nhằng số liệu chưa giải trình.
12. Report: other cần description; không bắt email; dedupe clientRequestId, rate limit chống spam. Resolve cần resolution; sửa role support chỉ report được giao. Takedown request tạo task, chưa gỡ; action gỡ dành owner/admin có audit.
13. Export: partner và thời gian bắt buộc, giới hạn phạm vi, escaping CSV formula (`= + - @`), link riêng tư có hạn. Không bao gồm số tiền đối tác khác.
14. SystemSettings: environment do deploy quyết định, không cho UI đổi staging thành production; settings approved cần owner quyết định, có version/audit. Secret write-only, redact log và export. Không có API edit/delete audit.

## State machine và action

| Đối tượng | Chuyển trạng thái được phép |
|---|---|
| Movie editorial | draft → in_review → approved; reject → draft; approved edit → draft revision mới |
| Movie publication | unpublished/withdrawn → scheduled/publishing → live; lỗi → failed/degraded; withdraw từ live/scheduled/publishing; restore chỉ draft, không tự live |
| Review | pending → approved/rejected/superseded; quyết định sau đó bất biến |
| Release | queued → publishing → live/degraded/failed; retry failed/degraded; rollback tạo job phục hồi snapshot hợp lệ, release cũ marked rolled_back; cancel chỉ queued |
| Campaign | draft → in_review → approved → scheduled/active; active ↔ paused (resume recheck); active/paused → ended/blocked; blocked/ended không tự resume |
| Creative | draft → in_review → approved/rejected; reject sửa → draft; block dừng ngay; thay nội dung cần revision mới |
| Reservation | draft → confirmed → cancelled/completed; completed theo thời gian; không tự giải phóng khi campaign pause |
| Report | new → triaged → in_progress → resolved → closed; resolved/closed → in_progress có reason |
| RevenueImport | uploaded → validated/invalid; validated → committed; committed → superseded chỉ khi chưa khóa kỳ và có replacement hợp lệ |
| Statement | draft → in_review → confirmed → locked; không reverse trực tiếp qua patch |
| Payment | draft → confirmed → reversed; immutable sau confirm |
| Job | queued → running → succeeded/failed; retry bounded; vượt số lần → dead_letter |

Các trạng thái server-managed không nằm trong DTO patch. `data/state-machines.json` là bảng máy đọc hỗ trợ triển khai; mô phỏng JS không bao phủ transaction/locking/worker thật.

## Ví dụ lỗi trùng lịch

```json
{"type":"urn:rapdem:problem:booking-conflict","title":"Vị trí đã được đặt","status":409,"detail":"Khoảng thời gian giao với đặt chỗ đã xác nhận.","instance":"/admin/v2/reservations/demo/confirm","code":"BOOKING_CONFLICT","requestId":"request-demo-001","fieldErrors":[{"field":"placementIds","message":"HOME_TOP_DESKTOP đã có đặt chỗ trong khoảng đã chọn."}]}
```

DEV phải review schema với lựa chọn DB/auth thực tế và chạy contract tests trước đóng băng RC. Các test cấu trúc trên tệp không chứng minh chống race, IDOR, upload độc hại hoặc an toàn production.
