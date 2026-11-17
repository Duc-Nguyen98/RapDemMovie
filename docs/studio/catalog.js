const labels = {desktop: "PC", tablet: "Tablet", mobile: "Điện thoại", original: "Ảnh gốc"};
const groups = {web: "Web xem phim · V18", cms: "CMS quản trị · V2", flows: "Sơ đồ luồng"};
const cmsRoot = "rap-dem-cms-v2/";
const webRoot = "web-v18/images/rap-dem_";
const boards = {
  "home-desktop": ["home_desktop",1024,1536],
  "home-responsive": ["home_tablet-mobile",1013,1552],
  "watch-desktop": ["watch_desktop",1024,1536],
  "watch-responsive": ["watch_tablet-mobile",1024,1536],
  modal: ["home_modal-responsive",1619,971],
  "ads-desktop": ["ads_desktop_viewports",1024,1536],
  "ads-responsive": ["ads_responsive_viewports",1024,1536],
  navigation: ["states_search-navigation",1536,1024],
  saved: ["states_saved-player",1199,1312]
};
// Pixel rectangles in the original PNG. Each rectangle isolates one device or scroll state.
const panels = {
  home: {
    desktop: ["home-desktop",[30,48,965,1170]],
    tablet: ["home-responsive",[54,86,566,1225]],
    mobile: ["home-responsive",[660,108,304,1170]]
  },
  watch: {
    desktop: ["watch-desktop",[45,40,930,1226]],
    tablet: ["watch-responsive",[88,85,543,1220]],
    mobile: ["watch-responsive",[663,80,273,1186]]
  },
  modal: {
    desktop: ["modal",[23,141,774,684]],
    tablet: ["modal",[828,139,441,685]],
    mobile: ["modal",[1307,145,288,622]]
  },
  ads: {
    desktop: ["ads-desktop",[64,111,889,525],[64,720,894,354],[64,1165,888,267]],
    tablet: ["ads-responsive",[90,119,522,425],[88,622,522,412],[98,1132,521,265]],
    mobile: ["ads-responsive",[674,129,264,413],[670,624,261,409],[676,1139,256,257]]
  }
};
const scrollStates = ["Trình phát đang hiển thị", "Đã cuộn qua trình phát", "Footer xuất hiện"];
const webDefinitions = [
  ["home-desktop","Trang chủ","PC","home","desktop"],
  ["home-responsive","Trang chủ responsive","Tablet và điện thoại","home","tablet"],
  ["modal","Modal trang chủ","Ba thiết bị","modal","desktop"],
  ["watch-desktop","Xem phim","PC","watch","desktop"],
  ["watch-responsive","Xem phim responsive","Tablet và điện thoại","watch","tablet"],
  ["ads-desktop","Quảng cáo khi cuộn","PC · 3 trạng thái","ads","desktop"],
  ["ads-responsive","Quảng cáo khi cuộn responsive","Tablet và điện thoại · 3 trạng thái","ads","mobile"],
  ["navigation","Tìm kiếm và điều hướng","Bảng trạng thái",null,"original"],
  ["saved","Lưu phim và lỗi phát","Bảng trạng thái",null,"original"]
];
function board(id) {
  const [file,width,height] = boards[id];
  return {src: webRoot + file + "_v18.png", width, height};
}
const extraTitles = {
  "state-loading": "Trạng thái đang tải", "state-empty": "Trạng thái rỗng",
  "state-error": "Lỗi hệ thống", "state-forbidden": "Truy cập bị từ chối",
  "state-success": "Thao tác thành công", "reservation-conflict": "Trùng lịch đặt chỗ",
  "confirm-dialog": "Hộp thoại xác nhận", "navigation-drawer": "Menu điều hướng"
};
const catalog = webDefinitions.map(([id,title,caption,family,device]) => ({
  id,title,caption,family,device,group:"web",thumb:"studio/thumbs/"+id+".webp",
  devices: family ? [...Object.keys(panels[family]),"original"] : ["original"]
}));
for (const [route,title,devices] of cmsIndex) {
  const id = "cms-"+route;
  catalog.push({id,route,title:title || extraTitles[route],caption:devices.map(d=>labels[d]).join(" · "),
    group:"cms",devices,device:devices[0],live:!!title,thumb:"studio/thumbs/"+id+".webp"});
}
for (const [slug,title] of [["01-viewer-flow","Luồng người xem"],["02-cms-flow","Luồng vận hành CMS"],["03-combined-flow","Kết nối CMS và web"]]) {
  catalog.push({id:slug,title,group:"flows",caption:"Sơ đồ hệ thống",devices:["original"],device:"original",
    src:cmsRoot+"images/rap-dem_cms-v2_"+slug+".png",thumb:"studio/thumbs/"+slug+".webp"});
}
function previewFor(item, device, sceneIndex) {
  if (item.group === "flows") return {src:item.src,width:1600,height:1000};
  if (item.group === "cms") {
    const [width,height] = {desktop:[1440,1000],tablet:[1024,1000],mobile:[390,844]}[device];
    return {src:cmsRoot+"images/rap-dem_cms-v2_"+item.route+"_"+device+".png",width,height};
  }
  if (device === "original") return board(item.id);
  const [id,...rects] = panels[item.family][device];
  return {...board(id), rect:rects[sceneIndex] || rects[0]};
}
