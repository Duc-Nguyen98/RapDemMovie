# RẠP ĐÊM — Contract triển khai V18
Ngày lập: 14/11/2026 · Phiên bản tài liệu: V18-draft.1

> Đây là đặc tả sản phẩm/kỹ thuật để bàn giao DEV, không phải hợp đồng pháp lý và không phải biên bản nghiệm thu. Ảnh là mockup bằng ImageGen, chưa cập nhật hoặc kiểm thử website. Các quyết định mang nhãn ĐỀ XUẤT chưa được chủ sản phẩm duyệt.

## 1. Cách đọc và thứ tự ưu tiên
- **ĐÃ CHỐT:** yêu cầu trực tiếp của chủ sản phẩm trong hội thoại.
- **ĐỀ XUẤT:** thông số/giải pháp BA đưa ra trong bộ V18 để duyệt; được dựng ở môi trường mẫu, chưa được tự bật trên production.
- **CHỜ ĐỐI TÁC:** cần tài liệu SDK/API, tên nhà cung cấp và bằng chứng thử nghiệm.
- Khi khác nhau: yêu cầu đã chốt > quyết định được ký duyệt sau đó > JSON nội dung/dữ liệu và contract > hình minh họa PNG.
- DEV dựng text, icon và layout bằng thành phần giao diện thật. Không cắt nguyên trang PNG làm website. Không đọc cỡ chữ, kích thước CSS từ số pixel của ảnh ghép.
- V18 là phiên bản bộ bàn giao; phiên bản ra mắt sản phẩm là MVP. V18 không chứng minh website đã phát hành 18 lần.
- Phạm vi: website công khai + yêu cầu quản trị tối thiểu + tích hợp quảng cáo/trình phát. Không bao gồm xây CDN, transcoding hoặc lưu trữ video.

## 2. Quyết định và điểm phải duyệt
| ID | Nội dung | Trạng thái | Người chốt |
|---|---|---|---|
| C01 | Hero “Tối nay xem gì?”, dòng hướng dẫn “Nhập tên phim hoặc chọn thể loại bên dưới.” | ĐÃ CHỐT | Chủ sản phẩm |
| C02 | Không đăng nhập/đăng ký hội viên, không bán gói, doanh thu quảng cáo | ĐÃ CHỐT | Chủ sản phẩm |
| C03 | Modal chỉ ở trang chủ; màn xem có quảng cáo trước phim, không modal toàn trang | ĐÃ CHỐT về ý định; tích hợp CHỜ ĐỐI TÁC | Chủ sản phẩm + đối tác |
| C04 | Bỏ bộ chọn tập; giữ quyền mở rộng sau | ĐÃ CHỐT | Chủ sản phẩm |
| C05 | Bỏ “Về đầu trang”; X nhìn nhỏ nhưng rõ; footer và bộ dữ liệu dùng chung | ĐÃ CHỐT | Chủ sản phẩm |
| C06 | Không cổng đối tác quảng cáo; quản trị gửi báo cáo | ĐÃ CHỐT | Chủ sản phẩm |
| D01 | Bộ lọc đủ 6 lựa chọn, cuộn ngang khi thiếu chỗ | ĐỀ XUẤT triển khai trong V18 | Chủ sản phẩm |
| D02 | Modal tối đa 1 lần/24 giờ/trình duyệt, đồng thời 1 lần/session | ĐỀ XUẤT | Chủ sản phẩm |
| D03 | Quảng cáo nổi ẩn khi player/footer/modal/menu/dialog hiển thị, đóng thì nghỉ 24 giờ theo vị trí | ĐỀ XUẤT | Chủ sản phẩm |
| D04 | Lưu phim bằng localStorage, không đồng bộ, tối đa 200 phim | ĐỀ XUẤT | Chủ sản phẩm |
| D05 | Ưu tiên bộ điều hướng tập bên trong player đối tác; nếu không có, chưa phát hành phim bộ | CHỜ CHỌN PHƯƠNG ÁN + ĐỐI TÁC | Chủ sản phẩm |
| D06 | Các số đo CSS, thời gian chờ và điểm ngắt dưới đây | ĐỀ XUẤT làm baseline | Chủ sản phẩm + DEV |
| P01 | Preroll, skip, đổi server, sự kiện phát, fullscreen, tập phim | CHỜ ĐỐI TÁC | Đối tác + DEV |

Không tự đánh dấu P01 đạt vì ảnh có nút. Không dùng việc đổi tên file để đánh dấu C01–C06 đã được triển khai.

## 3. Hệ thống màn hình
| ID / route đề xuất | Chức năng và dữ liệu | Trạng thái bắt buộc |
|---|---|---|
| HOME / / | Header, 6 section, hero tìm kiếm, slot quảng cáo, footer | loading, success, section rỗng, ad no-fill |
| SEARCH / /tim-kiem?q= | Tìm theo tên hoặc diễn viên, áp dụng thể loại/loại phim | loading, có kết quả, rỗng, API lỗi |
| CATALOG / /phim-le, /phim-bo, /the-loai, /the-loai/:slug, /moi-cap-nhat | Danh sách có lọc, sắp xếp, xem thêm; /the-loai là danh mục toàn bộ thể loại | loading, có dữ liệu, rỗng, tải thêm lỗi |
| WATCH / /xem/:slug | Thông tin phim, player nhúng, server, lưu, báo lỗi, tắt đèn, đề xuất | chờ phát, tải, preroll nếu hỗ trợ, phát phim, lỗi, không có nguồn |
| SAVED / /da-luu | Danh sách lưu cục bộ và bỏ lưu | có dữ liệu, rỗng, bộ nhớ bị chặn, phim ngừng phát |
| MOBILE-NAV | Drawer: Trang chủ, Phim lẻ, Phim bộ, Thể loại, Phim đã lưu, Hỗ trợ | mở/đóng, focus, Escape |
| REPORT | Dialog chọn loại lỗi, mô tả tùy chọn | nhập, gửi, thành công, lỗi, rate limit |
| SUPPORT / /ho-tro | FAQ và hướng dẫn | nội dung, lỗi tải |
| FEEDBACK / /gop-y | Góp ý chung, không bắt đăng nhập | nhập, xác nhận, lỗi |
| TERMS / /dieu-khoan; PRIVACY / /rieng-tu | Nội dung do chủ sản phẩm cung cấp | có nội dung đã duyệt |
| PARTNER / /hop-tac | Liên hệ hợp tác quảng cáo | thông tin liên hệ hoặc form đã cấu hình |
| NOT-FOUND | Phim/route không tồn tại | 404, link về trang chủ |

Đây là danh mục chức năng. Hai board trạng thái bổ sung không thay thế mọi tổ hợp lỗi/trạng thái kể trên.

## 4. Header, hero, lọc và footer dùng chung
### 4.1 Header
Logo về trang chủ; Trang chủ, Phim lẻ, Phim bộ, Thể loại; icon tìm kiếm; icon phim đã lưu. Không avatar, đăng nhập, đăng ký hoặc gói hội viên. Menu thu gọn theo chỗ thực tế, không theo user-agent. Trạng thái active theo route. Khi route phim bộ chưa được duyệt phát hành theo D05, ẩn entry/section phim bộ khỏi production chứ không để dead link.

### 4.2 Hero và bộ lọc
Nguồn chữ: data/ui-copy.vi.json. H1 chính xác “Tối nay xem gì?”; eyebrow “TÌM PHIM”; hướng dẫn giữ nguyên C01. Placeholder ngắn trên mobile được phép là “Tìm phim, diễn viên…”.
- Cùng 6 mục theo thứ tự: Tất cả, Hành động, Viễn tưởng, Tình cảm, Tâm lý, Phim bộ.
- Tất cả xóa genre và type. Bốn mục thể loại đặt một genre. Phim bộ đặt type=series, xóa genre của quick-filter. Đây là quick-filter loại trừ nhau; trang kết quả có thể thêm bộ lọc độc lập sau.
- Chọn chip điều hướng danh sách kết quả với query đang nhập. Bấm Tìm phim/Enter gửi cùng trạng thái. Query rỗng + Tất cả mở danh sách toàn bộ phim; không giả “không tìm thấy”.
- Đề xuất: trim, Unicode NFC, tìm không phân biệt hoa/thường và dấu; tối đa 100 ký tự, không chạy HTML trong query.
- Responsive: một hàng overflow-x auto; không loại bỏ mục. Hiện chevron khi còn nội dung ngoài khung; focus cuộn mục đang chọn vào tầm nhìn. Chỉ hàng chip được cuộn ngang, không gây tràn toàn trang.
- Danh sách: đề xuất 24 phim/lần, “Xem thêm” tăng trang, giữ thứ tự ổn định; sắp xếp mặc định updated_at giảm dần rồi id. Bộ lọc phản ánh trong URL, Back khôi phục trạng thái.

### 4.3 Footer
**Mọi màn có footer dùng cùng cấu hình, không sao chép thủ công từng màn.**
- Khám phá: Mới cập nhật; Phim lẻ; Phim bộ; Thể loại.
- Hỗ trợ & chính sách: Trung tâm hỗ trợ; Góp ý & báo lỗi; Điều khoản sử dụng; Chính sách riêng tư.
- Hợp tác quảng cáo: “Kết nối thương hiệu với khán giả yêu phim.” + “Liên hệ hợp tác”.
- Brand: RẠP ĐÊM. Tagline: “Khám phá phim hay cho mọi tối.”. Copyright theo năm hiển thị.
- Desktop 4 cột; tablet 3 nhóm dưới hàng logo; mobile 2 cột link và khối hợp tác toàn hàng. Không ẩn liên kết để ép footer thấp.
- Dòng “Mẫu duyệt V18”, nhãn thiết bị và chú thích quy tắc là chú thích bản thiết kế, **không đưa lên website**.

## 5. Dữ liệu và poster dùng chung
data/movies.sample.json chứa 20 phim giả lập, mọi năm 2026; không phải danh mục phim đã mua quyền phát. data/home-sections.json xác định 6 nhóm và thứ tự. Mọi component nhận movieId và tra cùng dữ liệu; không gõ lại tên/thể loại theo màn.
- “Bóng Trên Sông”: Hành động · Chính kịch, artwork phố/cầu ven sông màu cam.
- “Quỹ Đạo Cuối”: Viễn tưởng · Khoa học, artwork trạm quỹ đạo màu xanh; không dùng người lính.
- “Những Ngày Mùa Hạ”: Tình cảm · Chính kịch; “Đèn Khuya”: Tâm lý · Giật gân.
- Không ép “6 tập” lên phim lẻ. episodeCount=null với phim lẻ; số tập giả lập chỉ dành prototype.
- source-assets/poster-master.png là bản gốc giữ nguyên dùng làm atlas tham chiếu; posterRef/cropPx trong JSON chỉ đúng một vùng cho mỗi ID. Cùng ID phải dùng cùng vùng trên mọi màn.
- catalog-preview.html cho xem bộ poster/copy chuẩn từ atlas, không dùng ảnh AI mới sinh làm nguồn chuẩn.
- Atlas có độ phân giải thumbnail thấp, chỉ phục vụ prototype. Trước production phải thay bằng poster riêng đủ chất lượng đã được chủ sản phẩm duyệt, giữ nguyên ID. Không coi các crop này là bộ asset production đã sẵn sàng.
- Các PNG ImageGen có thể diễn giải lại poster/vi ký tự. Khi đối chiếu dữ liệu/asset, JSON và atlas là nguồn chuẩn; không tuyên bố pixel-identical giữa các PNG.

## 6. Đặc tả responsive và token — D06 ĐỀ XUẤT
| Token/quy tắc | Giá trị CSS |
|---|---|
| Font | Noto Sans (bộ ký tự tiếng Việt), fallback system-ui, sans-serif; self-host file hợp lệ khi triển khai |
| Body / phụ / tối thiểu trong component | 16/24; 14/20; không ép label thao tác dưới 12/16 |
| H1 desktop / tablet / mobile | 36/44, 32/40, 26/34; font-weight 700 |
| Tiêu đề section / tên phim | 20/28, 16/22; tên phim tối đa 2 dòng, title đầy đủ cho trợ năng |
| Màu | nền #09090B; panel #171719; text #FAFAFA; phụ #D4D4D8; vàng #FACC15; chữ trên vàng #111111 |
| Khoảng cách | 4, 8, 12, 16, 24, 32, 48; card gap 16 desktop, 12 tablet/mobile |
| Radius | input/button 8; card 12; dialog 16 |
| Chiều rộng | nội dung giữa max 1120; shell có rails max 1536; gutter 16 mobile, 24 tablet/desktop |
| Breakpoints | mobile <768; tablet 768–1023; desktop >=1024; side rails chỉ >=1536 và đủ chỗ |
| Grid phim | 2 cột mobile; 3 tablet; 4 desktop; ảnh 16:9 object-fit cover |
| Player | ưu tiên 16:9; width100%; không dùng chiều cao cố định làm méo trên mobile |
| Header | 64 desktop/tablet, 56 mobile; không giả định sticky nếu chưa test va chạm |
| Close | hình tròn hiển thị 24px, icon X 14px; vùng bấm 44x44px, inset 8px, không chồng CTA |
| Z layers | nội dung0; header100; floating300; menu/report900; backdrop1000; modal1010 |

Đây là số đo CSS đề xuất, không phải số đo đã kiểm chứng từ ảnh. Test tối thiểu 360×800, 390×844, 768×1024, 834×1112, 1024×768, 1366×768, 1536×864, 1920×1080; thêm xoay ngang và zoom 200%. CSS phải tự co, không có cuộn ngang cả trang.

Nút X có vùng bấm rộng hơn hình vẽ. Mục tiêu 44×44 là lựa chọn của dự án; WCAG 2.2 SC2.5.8 mô tả mức tối thiểu 24×24 CSS px và các ngoại lệ, không nên đánh đồng hai số. [Nguồn W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## 7. Inventory quảng cáo và chuyển layout
Nguồn cấu hình: data/ad-policy.proposed.json. Các slot là vị trí có thể bán, không phải cam kết mọi slot luôn có quảng cáo.
| Nhóm | Desktop rộng | Tablet | Mobile |
|---|---|---|---|
| Top inline | 2 | 2 | 1 |
| Side rails | 3 trái + 3 phải; mỗi slot 160×300; chảy theo tài liệu | Không rails | Không rails |
| Home giữa section | 6 vị trí xen nội dung | 3 vị trí | 3 vị trí |
| Watch nội dung | trước player1 + sidebar1 + dưới player3 + giữa đề xuất2 | dưới player3 + giữa đề xuất2 | dưới player3 + giữa đề xuất2 |
| Floating | 2×300×90 | 2×240×72 | 1×min(320,viewport-32)×50 |
| Homepage modal | 1, theo cap | 1 | 1 |
| Preroll | 1 inventory phía player, chỉ khi được xác nhận | Tương tự | Tương tự |

Desktop home tối đa 17 slot gồm modal/floating; desktop watch tối đa 18 gồm preroll. Đây là đếm inventory cấu hình, **không phải số impression hay số quảng cáo đồng thời**. Modal và floating loại trừ nhau. Không cam kết doanh thu từ số slot.

Khi desktop hẹp không đủ rails: tắt 6 rail slot, không nhồi cả 6 xuống nội dung. Nội dung vẫn max1120 và không bị ép nhỏ để giữ quảng cáo. Hai creative cùng vị trí có thể luân phiên theo chiến dịch đã cấu hình; mặc định không tự refresh khi người dùng đứng yên.

Mọi creative có nhãn Tài trợ/Quảng cáo. Không giả nút hệ thống, không auto redirect, không cửa sổ bật thêm khi click đóng. Không phủ lớp click lên nút play/đóng. Lỗi/no-fill bỏ slot có kiểm soát, không chặn chức năng xem/tìm.

## 8. Modal trang chủ — D02 ĐỀ XUẤT
- Chỉ route HOME; chỉ khi document hiển thị, không có menu/dialog, người dùng không nhập tìm kiếm. Sau trang sẵn sàng ít nhất 2 giây, thử tải creative.
- Chỉ mở sau creative tải thành công. Timeout 3 giây: bỏ lần mở, không hiện ô rỗng, ghi ad_error/no_fill. Mỗi session tối đa một lần thử; không lặp retry.
- Cap: tối đa 1 lần mở/24 giờ lăn theo trình duyệt + 1 lần/session; dùng key toàn vị trí, đổi chiến dịch không reset cap. Ghi lastShown khi thật sự mở, không khi fetch.
- X đóng ngay, không countdown. Escape đóng, click backdrop đóng (không click xuyên xuống banner dưới). Đóng không tự mở lại trên Back/refresh trong cap.
- localStorage ghi timestamp; sessionStorage ghi attempt/shown. Nếu storage bị chặn, **không hiển thị modal tự động** để tránh spam không kiểm soát.
- Width min(720px,viewportWidth-32px), mobile viewport-32px; max-height calc(100dvh-32px-safeInsets). Giữ tỉ lệ creative bằng contain, không crop mất nút/nhãn.
- Center theo viewport, không theo chiều dài trang. Khóa scroll nền; khi mở đưa focus vào nút đóng; trap focus; khi đóng trả focus về vị trí hợp lý.
- Không chạy cùng floating. Inline ads phía sau không tương tác được; không ghi là viewable nếu bị modal che.
- Mặc định feature flag false trên production trước khi D02 được duyệt.

Modal theo mẫu APG cần quản lý focus và tương tác nền, không chỉ có hình phủ tối. [Nguồn W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

## 9. Quảng cáo nổi — D03 ĐỀ XUẤT
### 9.1 Điều kiện hiện
Tất cả phải đúng: route HOME/WATCH; creative loaded; chưa đóng slot trong 24 giờ; document visible; đã ở route >=8 giây; đã cuộn >=25% nội dung có thể cuộn; không modal/menu/report; không keyboard; chiều cao viewport >=600px; không fullscreen/PiP/tắt đèn.

Trên WATCH: ẩn nếu bất kỳ phần player hoặc thanh điều khiển/server còn giao với viewport. Trên HOME: ẩn nếu hero tìm kiếm còn giao với viewport. Trên cả hai: ẩn ngay khi bất kỳ phần footer xuất hiện. Không suy ra paused/playing từ ảnh; kiểm tra vị trí wrapper bằng cơ chế giao cắt viewport, và event đối tác nếu có.

### 9.2 Vị trí
- Desktop: left/right16px, bottom16px + safe-area. Tablet: left/right16px, bottom12px + safe-area. Mobile: giữa ngang, bottom8px + safe-area.
- Creative kích thước theo mục7. Close có hit-area44px, nằm trong vùng dành cho control, không mở URL quảng cáo.
- Dải bảo vệ đáy cao creativeHeight + bottomGap + 16px + safeArea. Nội dung cuối phải cuộn tới được phía trên dải; không tạo khối trắng lớn sau footer.
- Bất cứ va chạm với CTA/player/form cần thao tác: tạm ẩn. Không dùng z-index để che lỗi.
- Khi footer xuất hiện: ẩn cả dock, không để footer phía sau quảng cáo. Khi footer ra khỏi viewport và điều kiện vẫn đúng, có thể hiện lại; đây không phải impression mới tự động.
- Người dùng bấm X: ẩn riêng slot đó ngay, persist closedUntil24h; không thay bằng creative khác để né lần đóng.
- Nếu chỉ một trong hai desktop/tablet slot loaded: chỉ hiện slot đó tại góc của nó. Không kéo dãn che nhiều diện tích hơn.
- Không quảng cáo nổi trên SEARCH/SAVED/SUPPORT hoặc trong các dialog. Khi storage không khả dụng: tắt floating tự động.
- Viewport boards là minh họa quy tắc; DEV phải test thật trên trình duyệt, không suy ra vị trí CSS từ tỷ lệ ảnh ghép.

## 10. Player nhúng — CHỜ ĐỐI TÁC
Phải có mẫu embed thật, tài liệu chính thức, tên đơn vị chịu trách nhiệm và allowlist domain trước khi tích hợp.
| Khả năng | Bằng chứng cần | Khi không hỗ trợ |
|---|---|---|
| Preroll | API/SDK hoặc cấu hình đối tác, ad-start/ad-end/ad-error thực | Không giả quảng cáo trong iframe; báo blocker mô hình doanh thu trước phim |
| Skip | skip offset từ đối tác và API được phép | Không vẽ “Bỏ qua” giả; để control native hoặc không hiện |
| Server dự phòng | >=2 nguồn hợp lệ cho cùng phim/tập | Ẩn server#2; không hứa tự động khôi phục vị trí phát |
| Lỗi phát | mã lỗi/event chính thức | Vẫn cho báo lỗi thủ công; timeout chỉ ghi “chưa sẵn sàng”, không kết luận video hỏng |
| play/pause/fullscreen/PiP | callback đã thử | Không hứa điều khiển từ website; dùng control native |
| Chuyển tập | danh sách và điều hướng native hoặc API | Áp dụng gate mục11 |
| Đo quảng cáo/video | log đối soát với nhà cung cấp | Báo “không có dữ liệu”, không suy từ thời gian hiện iframe |

Iframe khác origin có hạn chế truy cập; nhúng URL không có nghĩa website điều khiển được video bên trong. [Nguồn MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy).
- Adapter có capability flags, mặc định false; chỉ bật sau test. Xác thực origin/source/schema khi nhận postMessage; không nhận mọi origin hoặc dựng HTML tùy ý.
- Wrapper states: idle → loading → ready; ready có thể native-preroll → playing nếu partner báo. error có retry/manual report. Không hard-code “skip sau 5s” khi chưa có hợp đồng đối tác.
- Đề xuất wrapper ready timeout10s: thông báo chờ lâu + Thử lại/Báo lỗi; không retry vô hạn. Click thử lại tối đa2 lần tự động trong một thao tác rồi cho hành động thủ công.
- Không chạy cả preroll native và preroll của website nối tiếp nếu chưa có thỏa thuận. Không tạo click-to-play giả dẫn đến quảng cáo.
- “Tắt đèn” chỉ đổi lớp nền website và ẩn quảng cáo nổi; không tuyên bố pause/control iframe.
- Server đổi nguồn phải bảo toàn movieId/episodeId; nếu không seek được thì cảnh báo “Máy chủ mới có thể phát lại từ đầu.”.

## 11. Phim nhiều tập — D05 cần chủ sản phẩm chốt
Yêu cầu bỏ bộ chọn tập được giữ. Không âm thầm thêm dropdown hoặc lưới tập.
- **Phương án đề xuất A:** dùng điều hướng tập bên trong player đối tác. Chỉ phát hành phim bộ nếu người dùng thực sự đến được mọi tập đã xuất bản.
- Nếu player không có điều hướng tập: **phương án B cần duyệt**, MVP chỉ phát phim lẻ; ẩn phim bộ/filter/section trên production. Bộ mockup vẫn có phim bộ để duyệt định hướng, không đồng nghĩa luồng đã hoàn chỉnh.
- Không tự thêm “Tập trước / Tập sau” vì đó là thay đổi quyết định sản phẩm.
- Metadata “Tập1/6tập” chỉ hiển thị khi xác định được episodeId và tổng tập thật. Không dùng số giả trong data mẫu lên production.
- Đây là release blocker cho nội dung phim bộ, không nhất thiết chặn phát hành phim lẻ.

## 12. Lưu phim không tài khoản — D04 ĐỀ XUẤT
Key rapdem.saved.v1, lưu {movieId,savedAt}, không lưu URL nhúng/token hay thông tin nhạy cảm. Tối đa200; vượt giới hạn báo rõ, không xóa âm thầm. Click bookmark/lưu là toggle; thông báo “Đã lưu phim trên trình duyệt này.” / “Đã bỏ lưu phim.”.
- Trang SAVED hiển thị dòng “Chỉ lưu trên trình duyệt này, không đồng bộ thiết bị.”.
- Tải lại vẫn còn nếu storage cho phép. Xóa dữ liệu trình duyệt có thể mất danh sách; chế độ riêng tư không hứa giữ lâu.
- Storage lỗi/đầy: thông báo “Không thể lưu trên trình duyệt này.”, không hiện thành công giả; có thể dùng bộ nhớ tạm nếu gắn nhãn rõ.
- Phim đã ngừng phát: giữ mục với nhãn “Hiện không khả dụng” và nút Bỏ lưu; không tự mở phim khác.
- Nhiều tab cập nhật qua storage event; server không được coi đây là tài khoản người dùng.

localStorage gắn theo origin và có thể bị chặn/xóa; không phải dịch vụ đồng bộ tài khoản. [Nguồn MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## 13. Báo lỗi và trạng thái thiếu
REPORT: loại lỗi bắt buộc (Không phát được / Giật hoặc tải chậm / Sai phim hoặc tập / Âm thanh hoặc phụ đề / Khác); mô tả0–500 ký tự, Khác cần mô tả; không bắt email. Tự đính movieId, episodeId nếu có, serverId, timestamp, mã lỗi partner nếu nhận được; không đính raw embed token hoặc nội dung nhạy cảm.
- Gửi qua backend; disable nút khi gửi, chống gửi lặp. Đề xuất giới hạn5 báo cáo/10phút theo lớp bảo vệ server; cơ chế định danh/rate limit được DEV thiết kế tối thiểu dữ liệu.
- Lỗi mạng giữ nội dung đã nhập, cho thử lại. Thành công trả reportId, toast cảm ơn. Escape/Cancel đóng; đang có nội dung thì xác nhận bỏ.
- Search empty: “Không tìm thấy phim phù hợp.” / “Thử từ khóa khác hoặc xóa bộ lọc.” / Xóa bộ lọc / Về trang chủ.
- Loading: skeleton ở card; spinner player + “Đang tải trình phát…”, không progress% giả.
- Player lỗi: “Không thể tải trình phát.” / Thử lại / Báo lỗi. Đổi máy chủ chỉ nếu có nguồn khác.
- Saved empty: “Bạn chưa lưu phim nào.” / Khám phá phim.
- Menu mobile: khóa tương tác nền, Escape/backdrop/X đóng, focus trả nút menu; không hiện cùng ad modal.
- API lỗi danh sách không được hiển thị thành “0 kết quả”; phân biệt lỗi và rỗng.

## 14. API/data contract tối thiểu — ĐỀ XUẤT
Không gắn framework hoặc database bắt buộc. Đây là interface logic; DEV được ánh xạ stack nhưng giữ ý nghĩa.
| Endpoint | Input | Output/validation |
|---|---|---|
| GET /api/movies | q, genre, type, cursor, limit<=24 | items[], nextCursor, total; cùng Movie schema |
| GET /api/movies/:id | id | Movie + availability + providerCapabilities + sources không lộ secret |
| GET /api/home | locale=vi | sectionId, title, movieIds, slotIds |
| GET /api/ads/eligible | placementId, viewportClass, route | creative hoặc no_fill; không dùng để né cap client |
| POST /api/reports | movieId, episodeId?, serverId?, category, description, clientRequestId | reportId;400/429/5xx rõ; idempotency theo requestId |
| POST /api/ad-events | eventId, eventType, placementId, creativeId, timestamp, context | accepted; dedup eventId; không ghi revenue từ client |
| GET /api/site-config | version | footer, copyVersion, featureFlags, ad policy đã duyệt |

Movie: id, slug, title, year, genres[], type, posterRef, episodeCount?, availability. Sample JSON không chứa URL đối tác thật.
Partner source: id, label, providerId, allowedEmbedUrl, episodeId?, capabilities; server-side kiểm tra domain, không cho nhập javascript: hoặc iframe HTML tùy ý.

## 15. Phân quyền và quản trị tối thiểu
Không có login khách hàng **không đồng nghĩa bỏ xác thực quản trị**. Các vai trò sau là đề xuất, chưa có mockup admin trong bộ ảnh.
| Vai trò | Quyền | Không được |
|---|---|---|
| Khách | xem, tìm, lưu cục bộ, báo lỗi, đóng quảng cáo | vào API quản trị |
| Biên tập nội dung | CRUD metadata/poster, section, nguồn trong allowlist | thay quyền người dùng, script quảng cáo tùy ý |
| Quản lý quảng cáo | chiến dịch, creative, lịch, slot, cap trong cấu hình duyệt, báo cáo | sửa phim/quyền hệ thống |
| Hỗ trợ | xem và xử lý report | xuất secret, sửa quảng cáo |
| Quản trị | cấu hình, quyền, publish/unpublish, nhật ký | bỏ qua kiểm tra dữ liệu/tích hợp |
| Đối tác quảng cáo | nhận file báo cáo do quản trị gửi | không có tài khoản riêng giai đoạn này |

Một người có thể nhiều vai trò nhưng API vẫn kiểm tra server-side. Bắt buộc audit log thay đổi cấu hình chiến dịch/nguồn phát/quyền. Có kill switch modal/floating/preroll integration và rollback phiên bản cấu hình. Báo cáo đối tác không chứa IP/PII thô.

## 16. Đo lường, bảo mật và vận hành
- Tách ad_request, ad_loaded, ad_visible, ad_click, ad_close, ad_error; đếm tải thành công không đồng nghĩa viewable hay có tiền.
- ĐỀ XUẤT đo nội bộ: visible khi >=50% vùng creative trong viewport liên tục1s và document visible, không modal che; chỉ tính một lần mỗi lần mount hợp lệ. Đây là định nghĩa nội bộ, **không khẳng định chuẩn tính tiền của mạng quảng cáo**.
- Không suy doanh thu từ số click client. Revenue/fill/eCPM lấy từ đối tác và gắn kỳ đối soát; dữ liệu chưa có hiển thị N/A.
- Báo cáo tối thiểu theo ngày/placement/device/campaign; lưu UTC, hiển thị múi giờ dự án Asia/Bangkok; ghi rõ timezone trên file.
- Lazy-load slot ngoài màn, kích thước dự phòng ổn định; lỗi quảng cáo không chặn nội dung; không preload tất cả creative đầu trang.
- Không dùng mã quảng cáo chưa duyệt. Allowlist nguồn nhúng, CSP theo nhà cung cấp được thử thực tế; không chấp nhận URL/script từ query người dùng.
- Text escape, kiểm tra file/upload; liên kết ngoài an toàn; server secrets không đưa vào frontend.
- Chủ sản phẩm chịu trách nhiệm xác nhận nguồn phát/poster và điều khoản đối tác đủ điều kiện sử dụng trước production. Đây là gate tài liệu, không kết luận pháp lý đã kiểm chứng.
- Không bảo đảm SEO, hiệu năng, doanh thu hay tuân thủ mạng quảng cáo chỉ từ thiết kế. Đo trên bản build staging với creative thực.

## 17. Checklist nghiệm thu
| ID | Thao tác / điều kiện | Kết quả phải có | Tình trạng bộ bàn giao |
|---|---|---|---|
| A01 | So HOME và nền modal 3 thiết bị | Cùng tiêu đề, hướng dẫn, bộ lọc; modal centered viewport | Review ảnh + test DEV chưa chạy |
| A02 | Đối chiếu footer mọi route | 4 link khám phá + 4 link hỗ trợ + hợp tác | Contract/JSON là chuẩn |
| A03 | Render cùng movieId ở home/watch/search/saved | Cùng title/year/genres/posterRef | Data validation cục bộ; UI chưa chạy |
| A04 | Mobile chip scroll/keyboard | Đến được cả6 mục, không tràn trang | Test DEV chưa chạy |
| A05 | Watch scroll qua player rồi đến footer | Floating hiện/ẩn đúng3 trạng thái | Có board minh họa; test DEV chưa chạy |
| A06 | Modal + floating cùng đủ điều kiện | Chỉ modal; không click xuyên | Test DEV chưa chạy |
| A07 | Đóng modal rồi refresh/Back/mở tab | Cap đúng, không né bằng campaign mới | Test DEV chưa chạy |
| A08 | Storage chặn, ad timeout/no-fill | Không modal/floating tự động; xem phim vẫn hoạt động | Test DEV chưa chạy |
| A09 | Save/reload/other browser/remove | Lưu đúng phạm vi; không hứa sync | Test DEV chưa chạy |
| A10 | Partner không hỗ trợ skip/server/episodes | Không nút giả; feature gate tương ứng | CHỜ ĐỐI TÁC |
| A11 | Input tìm kiếm không kết quả và API lỗi | Hai trạng thái khác nhau | Có board mẫu; test DEV chưa chạy |
| A12 | Báo lỗi double-click/lỗi mạng/429 | Không spam; giữ draft; thông báo đúng | Test DEV chưa chạy |
| A13 | 360px, tablet, desktop, zoom200%, keyboard | Không mất link/CTA; focus rõ; close dễ bấm | Test DEV chưa chạy |
| A14 | Ads visible/click và provider revenue | Không double-count, không bịa doanh thu | CHỜ TÍCH HỢP |
| A15 | Truy cập API admin bằng khách | Bị từ chối server-side; audit đúng | Test DEV chưa chạy |
| A16 | Fullscreen, xoay ngang, keyboard, footer | Không ad nổi che player/form/footer | Test DEV chưa chạy |
| A17 | Series nhiều tập | Truy cập được mọi tập hoặc series bị chặn publish | CHỜ D05/P01 |
| A18 | Tắt kill switch | Overlay dừng, nội dung vẫn dùng được | Test DEV chưa chạy |

## 18. Điều kiện bàn giao và phát hành
Được bắt đầu: dựng component, responsive, layout, data binding, các trạng thái lỗi, mock adapter. Không cần đợi quyết định quảng cáo để dựng shell.
Chưa được tuyên bố hoàn tất: tần suất/cap chưa duyệt; P01 chưa có bằng chứng; D05 chưa chốt; poster production chưa có; staging và nghiệm thu A01–A18 chưa chạy.
Bàn giao DEV phải kèm: 5 màn chính đã sửa, 2 board viewport, 2 board trạng thái, contract HTML/Markdown, JSON text/token/data/policy, atlas tham chiếu và manifest kích thước/hash thực tế.
Không ghi “đã khắc phục triệt để/production-ready” chỉ từ việc có đủ file. Theo dõi các sai khác còn lại trong QA-NOTES.md.

## 19. Câu trả lời cần bổ sung
1. Chủ sản phẩm duyệt hay chỉnh D02/D03 (modal1lần/24h; floating ẩn khi player/footer; đóng nghỉ24h)?
2. Đối tác player là đơn vị nào, có tài liệu SDK/API hoặc embed thử được không?
3. Nếu đối tác không có điều hướng tập, có đồng ý MVP chỉ phát phim lẻ không?

Không có câu trả lời không được hiểu là đồng ý. Các phần chưa duyệt giữ feature flag false khi lên production.

