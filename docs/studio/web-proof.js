// Typeset proof of the V18 screens. The unmodified PNG is available alongside it.
const artRoot="studio/web-art/";
const filmById=new Map(webSample.movies.map(f=>[f.id,f]));
const adNames={"bap-nha-rap":"popcorn","den-rap":"lamp","tra-mat":"tea","am-rap":"sound","ve-cuoi-tuan":"ticket","goc-dien-anh":"cinema"};
function textNode(tag,text,className="") {
  const node=document.createElement(tag);
  if (className) node.className=className;
  if (text) node.textContent=text;
  return node;
}
function box(className,...nodes) {
  const node=textNode("div","",className); node.append(...nodes);return node;
}
function photoArt(id,alt="") {
  const img=new Image();img.src=artRoot+id+".webp";img.alt=alt;img.draggable=false;return img;
}
function banner(id,style="") {
  const ad=webSample.copy.ads[id];
  return box("wp-ad "+style,photoArt(adNames[id]),box("wp-ad-copy",textNode("small","TÀI TRỢ"),
    textNode("strong",ad.title),textNode("span",ad.description)),textNode("b",ad.cta+" ›","wp-cta"));
}
function filmCard(id) {
  const movie=filmById.get(id);
  return box("wp-film",photoArt(movie.id),textNode("strong",movie.title),textNode("small",[movie.year,...movie.genres].join(" · ")));
}
function films(title,ids,count) {
  return box("wp-section",box("wp-heading",textNode("h3",title),textNode("small","Xem tất cả →")),
    box("wp-films",...ids.slice(0,count).map(filmCard)));
}
function webHeader(device) {
  const nav=device==="mobile" ? [textNode("b","☰")] : [];
  nav.push(textNode("strong","▰  RẠP ĐÊM"));
  if (device!=="mobile") nav.push(textNode("span","Trang chủ　　 Phim lẻ　　 Phim bộ　　 Thể loại ⌄"));
  const tools=box("wp-tools");
  // Source icons are geometry so their outlines stay sharp at every review scale.
  tools.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';
  nav.push(tools);
  return box("wp-header",...nav);
}
function webFooter() {
  const copy=webSample.copy;
  return box("wp-footer",box("wp-footer-brand",textNode("strong","▰  "+copy.brand.name),textNode("p",copy.brand.tagline)),
    ...copy.footer.map(g=>box("wp-footer-col",textNode("b",g.heading),...g.links.map(a=>textNode("span",a.label)))),
    textNode("small",copy.brand.copyright.replace("{year}","2026")));
}
function makeHome(device) {
  const copy=webSample.copy, hero=copy.hero;
  const topAds=device==="mobile" ? ["bap-nha-rap"] : ["den-rap","ve-cuoi-tuan"];
  const body=box("wp-body",box("wp-banners",...topAds.map(k=>banner(k,"wp-wide"))),
    box("wp-hero",textNode("b",hero.eyebrow),textNode("h2",hero.title),textNode("p",hero.description),
      box("wp-input",textNode("span","⌕　"+hero.placeholder),textNode("b",hero.submit)),
      box("wp-filters",...copy.quickFilters.map(f=>textNode("span",f.label)))));
  const ads=device==="desktop" ? ["tra-mat","am-rap","goc-dien-anh","bap-nha-rap","goc-dien-anh","ve-cuoi-tuan"] :
    ["tra-mat",null,"goc-dien-anh",null,null,device==="mobile"?"den-rap":"am-rap"];
  webSample.sections.forEach((section,i)=>{
    body.append(films(section.title,section.movieIds,device==="mobile"?2:device==="tablet"?3:4));
    if (ads[i]) body.append(banner(ads[i],"wp-strip"));
  });
  body.append(webFooter());return body;
}
function player(space=false) {
  const block=box("wp-player",photoArt(space?"space":"preroll"),textNode("span",space?"Quỹ Đạo Cuối":"ⓘ  Quảng cáo","wp-player-label"));
  if (!space) block.append(textNode("b",webSample.copy.controls.skipAd+" →","wp-skip"));
  block.append(textNode("span","Ⅱ　　 ━━━━━━━━━━━━━　　　 ◖))　 ⛶","wp-controls")); return block;
}
const related=["nhung-ngay-mua-ha","bong-tren-song","quy-dao-cuoi","den-khuya","loi-ve-trong-suong","noi-may-dung-lai"];
function makeWatch(device,adScene) {
  const body=box("wp-body"); const adBoard=Number.isInteger(adScene), little=device==="mobile";
  if (!adBoard || adScene===0) {
    if (!adBoard || device==="desktop") body.append(box("wp-banners",banner(little?"bap-nha-rap":"den-rap","wp-wide"),
      ...(little?[]:[banner("ve-cuoi-tuan","wp-wide")])));
    const space=adBoard && device!=="desktop";
    const detail=box("wp-detail",textNode("small",space?"Trang chủ　›　Phim lẻ":"Trang chủ　›　Phim bộ　›　Tập 1"),
      textNode("h2",space?"Quỹ Đạo Cuối":"Sài Gòn 00:00"),textNode("span",space?"2026 · Viễn tưởng · 2 giờ 14 phút":"2026 · Hành động, Viễn tưởng · 6 tập"));
    const info=box("wp-info",textNode("h3","Thông tin phim"),textNode("p","2026 · Hành động, Viễn tưởng · 6 tập"),
      textNode("p","Một người giao hàng khám phá bí mật giữa Sài Gòn về đêm, mở ra hành trình bảo vệ những người anh yêu thương."),
      textNode("h3","Phim đề xuất"),filmCard(related[0]));
    const center=box("wp-center",detail,player(space),box("wp-buttons",...["Server #1 – Nhanh","Server #2 – Dự phòng"].map(s=>textNode("b",s))),
      box("wp-buttons",...["Lưu phim","Báo lỗi","Tắt đèn"].map(s=>textNode("span",s))));
    if (device==="desktop") body.append(box("wp-watch-row",center,info));else body.append(center);
    body.append(box("wp-banners wp-under",...["bap-nha-rap","tra-mat","am-rap"].map(k=>banner(k,"wp-strip"))));
    if (device!=="desktop") body.append(info);
  }
  const count=little?4:device==="tablet"?6:4;
  body.append(films("Có thể bạn thích",related,count),banner("goc-dien-anh","wp-strip"),
    films("Phim cùng thể loại",["dau-an-vu-tru","ke-du-hanh","bong-toi-so","bien-gioi-xanh"],little?2:3),
    banner("am-rap","wp-strip"));
  if (!adBoard || adScene!==1) body.append(webFooter());
  return body;
}
function rail(ids) {return box("wp-rail",...ids.map(k=>banner(k,"wp-tall")));}
function stateProof(item) {
  const copy=webSample.copy.states;
  const panel=(title,...content)=>box("wp-state",textNode("h2",title),...content);
  if (item.id==="navigation") return box("wp-state-grid",
    panel("Kết quả tìm kiếm",textNode("b","Sài Gòn · 2 kết quả"),filmCard("sai-gon-0000"),filmCard("dua-em-ve-sai-gon")),
    panel("Không có kết quả",textNode("h3",copy.searchEmptyTitle),textNode("p",copy.searchEmptyBody),textNode("b",copy.clearFilters+"　 ·　"+copy.goHome)),
    panel("Danh sách thể loại",films("Phim viễn tưởng",["quy-dao-cuoi","dau-an-vu-tru","vong-lap-24h","ke-du-hanh"],4)),
    panel("Menu mobile",...webSample.copy.navigation.map(n=>textNode("p",n.label))));
  return box("wp-state-grid",panel("Phim đã lưu",textNode("p",copy.savedSubtitle),filmCard("sai-gon-0000"),filmCard("quy-dao-cuoi"),textNode("b",copy.savedEmpty)),
    panel("Báo lỗi phát phim",textNode("p","Không phát được"),textNode("p",webSample.copy.report.descriptionLabel),textNode("b","Hủy　 ·　 Gửi báo lỗi"),textNode("p",copy.reportSuccess)),
    panel("Đang tải",textNode("h3","Sài Gòn 00:00"),player(true),textNode("b",copy.playerLoading)),
    panel("Lỗi phát phim",textNode("h3",copy.playerError),textNode("b","Thử lại　 ·　 Báo lỗi"),textNode("p","Đổi máy chủ · Chỉ hiển thị khi có nguồn dự phòng.")));
}
function nativeWebProof(item,device,scene) {
  const proof=box("web-proof wp-"+device);
  if (!item.family) {proof.append(stateProof(item));return proof;}
  const home=["home","modal"].includes(item.family);
  const body=home?makeHome(device):makeWatch(device,item.family==="ads"?scene:null);
  const columns=box("wp-columns");
  if (device==="desktop") columns.append(rail(["den-rap","tra-mat","am-rap"]));
  columns.append(body);
  if (device==="desktop") columns.append(rail(["bap-nha-rap","ve-cuoi-tuan","goc-dien-anh"]));
  const scroll=box("device-scroll wp-page",webHeader(device),columns);
  if (item.family==="ads" && scene===2) queueMicrotask(()=>{scroll.scrollTop=scroll.scrollHeight;});
  proof.append(scroll);
  if (item.family==="modal") proof.append(box("wp-scrim",box("wp-modal",photoArt("preroll"),textNode("b","▰  TÀI TRỢ","wp-player-label"),textNode("b","×","wp-x"))));
  if (item.family==="ads" && scene===1) proof.append(box("wp-floating",banner("tra-mat","wp-strip"),...(device==="mobile"?[]:[banner("ve-cuoi-tuan","wp-strip")])));
  return proof;
}
