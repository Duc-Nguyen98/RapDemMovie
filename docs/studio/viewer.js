const dialog = el("viewer");
const stage = el("stage");
const surface = el("surface");
const steps = [.1,.16,.25,.33,.5,.67,.85,1,1.25,1.5,2,3,4];
let active, device, sceneIndex=0, interactive=false, frameWidth=1, frameHeight=1;
let level=1, autoFit=true, opener;

function fitScale() {
  return Math.min(1,Math.max(.01,(stage.clientWidth-24)/frameWidth),
    Math.max(.01,(stage.clientHeight-24)/frameHeight));
}
function resize() {
  if (!dialog.open || !active) return;
  if (autoFit) level=fitScale();
  const w=Math.round(frameWidth*level), h=Math.round(frameHeight*level);
  el("work-area").style.width=w+"px";
  el("work-area").style.paddingTop=Math.max(10,(stage.clientHeight-h)/2)+"px";
  el("sheet").style.width=w+"px"; el("sheet").style.height=h+"px";
  surface.style.width=frameWidth+"px"; surface.style.height=frameHeight+"px";
  surface.style.transform="scale("+level+")";
  el("percent").textContent=Math.round(level*100)+"%";
  el("minus").disabled=level<=Math.min(steps[0],fitScale())+.001;
  el("plus").disabled=level>=steps.at(-1);
}
function magnify(up, point) {
  const choices=[...steps,fitScale()].sort((a,b)=>a-b);
  const target=up ? choices.find(s=>s>level+.001) : choices.reverse().find(s=>s<level-.001);
  if (!target) return;
  const rect=stage.getBoundingClientRect(), sheet=el("sheet").getBoundingClientRect();
  const x=point?.clientX ?? rect.left+stage.clientWidth/2;
  const y=point?.clientY ?? rect.top+stage.clientHeight/2;
  const docX=(x-sheet.left)/level, docY=(y-sheet.top)/level;
  autoFit=false; level=target; resize();
  const now=el("sheet").getBoundingClientRect();
  stage.scrollBy(now.left+docX*level-x,now.top+docY*level-y);
}
function fit() { autoFit=true; resize(); stage.scrollTo(0,0); }
function drawImage(photo) {
  const scroll=document.createElement("div");
  scroll.className="device-scroll";
  const rect=photo.rect || [0,0,photo.width,photo.height];
  const [left,top,w,h]=rect;
  const snapshot=!!photo.rect && ["ads","modal"].includes(active.family);
  const ratio=snapshot ? Math.min(frameWidth/w,frameHeight/h) : frameWidth/w;
  const slice=document.createElement("div");
  slice.className="slice"; slice.style.width=w*ratio+"px"; slice.style.height=h*ratio+"px";
  if (snapshot) slice.style.margin=Math.max(0,(frameHeight-h*ratio)/2)+"px auto 0";
  const img=new Image();
  img.alt=active.title+" · "+labels[device]; img.draggable=false;
  img.style.width=photo.width*ratio+"px"; img.style.left=-left*ratio+"px"; img.style.top=-top*ratio+"px";
  img.onerror=()=>{el("view-info").textContent="Không tải được ảnh. Dùng Tải PNG để mở tệp gốc.";};
  img.src=photo.src;
  slice.append(img); scroll.append(slice); surface.replaceChildren(scroll);
}
function syncUrl(method="replaceState") {
  const url=new URL(location.href);
  url.searchParams.set("view",active.id); url.searchParams.set("device",device);
  if (interactive) url.searchParams.set("mode","live"); else url.searchParams.delete("mode");
  if (active.family==="ads" && sceneIndex) url.searchParams.set("scene",sceneIndex);
  else url.searchParams.delete("scene");
  url.hash=active.group;
  if (location.protocol==="file:") {
    const selection=url.searchParams.toString();
    url.search=location.search;
    url.hash=selection;
  }
  history[method]({...history.state,studioOpened:method==="pushState" || !!history.state?.studioOpened},"",url);
}
function paint() {
  const photo=previewFor(active,device,sceneIndex);
  const webFrame=active.group==="web" && device!=="original";
  [frameWidth,frameHeight]=webFrame ? {desktop:[1440,900],tablet:[834,1112],mobile:[390,844]}[device] : [photo.width,photo.height];
  el("view-title").textContent=active.title;
  el("view-group").textContent=groups[active.group];
  const devices=el("devices");
  devices.replaceChildren(...active.devices.map(key=>{
    const button=document.createElement("button");button.textContent=labels[key];
    button.dataset.device=key; button.setAttribute("aria-pressed",String(key===device));
    button.onclick=()=>{
      device=key; paint();syncUrl();
      devices.querySelector('[data-device="'+key+'"]').focus({preventScroll:true});
    };
    return button;
  }));
  el("scene-label").hidden=active.family!=="ads" || device==="original";
  el("scene").value=String(sceneIndex);
  el("original").href=photo.src;
  el("original").download=photo.src.split("/").at(-1);
  el("live").hidden=!active.live;
  el("live").textContent=interactive ? "Quay về ảnh" : "Thử tương tác";
  el("live").setAttribute("aria-pressed",String(interactive));
  if (interactive) {
    const src=cmsRoot+"prototype/index.html#"+active.route;
    let iframe=surface.querySelector("iframe");
    if (!iframe || iframe.getAttribute("src")!==src) {
      iframe=document.createElement("iframe");iframe.title="Prototype CMS · "+active.title;iframe.src=src;
      surface.replaceChildren(iframe);
    }
  } else drawImage(photo);
  const kind=interactive ? "Prototype" : webFrame ? "Mô phỏng từ ảnh" : "Ảnh gốc";
  el("view-info").textContent=kind+" · "+frameWidth+" × "+frameHeight+(webFrame && ["home","watch"].includes(active.family) ? " · Cuộn trong khung" : "");
  fit();
}
function openItem(item,options={}) {
  if (!item) return;
  if (!dialog.open) {
    opener=document.activeElement; dialog.showModal();
    el("close").focus({preventScroll:true});
  }
  active=item;
  device=item.devices.includes(options.device) ? options.device : item.device;
  interactive=!!(item.live && options.live);
  sceneIndex=item.family==="ads" && [1,2].includes(Number(options.scene)) ? Number(options.scene) : 0;
  paint();
  if (options.history) syncUrl(options.history);
}
function walk(delta) {
  const list=filtered.includes(active) ? filtered : catalog.filter(item=>item.group===active.group);
  const target=list[(list.indexOf(active)+delta+list.length)%list.length];
  openItem(target,{device,history:"replaceState"});
}
function setFull(expanded) {
  dialog.classList.toggle("expanded",expanded);
  el("full").textContent=expanded ? "Thoát toàn màn hình" : "Toàn màn hình";
  el("full").setAttribute("aria-pressed",String(expanded));
  requestAnimationFrame(resize);
}
async function fullscreen() {
  const expanded=dialog.classList.contains("expanded");
  setFull(!expanded);
  try {
    if (expanded && document.fullscreenElement) await document.exitFullscreen();
    else if (!expanded && document.fullscreenEnabled) await el("viewer-shell").requestFullscreen();
  } catch { /* The expanded viewer also works on browsers without native fullscreen. */ }
}
document.addEventListener("fullscreenchange",()=>setFull(!!document.fullscreenElement));
function dismiss() {
  if (!dialog.open) return;
  if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
  setFull(false);dialog.close();surface.replaceChildren();active=null;
  if (opener?.isConnected) opener.focus({preventScroll:true});
}
function closeViewer() {
  if (history.state?.studioOpened) { history.back(); return; }
  const url=new URL(location.href);
  ["view","device","scene","mode"].forEach(k=>url.searchParams.delete(k));
  const groupBefore=active?.group;url.hash=groupBefore || "web";
  if (location.protocol==="file:") {url.search=location.search;url.hash="library="+groupBefore;}
  history.replaceState(null,"",url);dismiss();setGroup(groupBefore);
  el("library").scrollIntoView();
}
function restore() {
  const localHash=location.protocol==="file:" && /^(#view=|#library=)/.test(location.hash);
  const params=new URLSearchParams(localHash?location.hash.slice(1):location.search);
  const item=byId.get(params.get("view"));
  if (item) {
    if (group!==item.group) setGroup(item.group);
    openItem(item,{device:params.get("device"),live:params.get("mode")==="live",scene:params.get("scene")});
  } else dismiss();
}
document.addEventListener("click",e=>{
  const link=e.target.closest('a[href^="?view="]');
  if (!link || e.button!==0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  e.preventDefault();
  const id=new URL(link.href).searchParams.get("view");
  openItem(byId.get(id),{history:dialog.open?"replaceState":"pushState"});
});
el("scene").replaceChildren(...scrollStates.map((name,index)=>new Option(name,index)));
el("scene").onchange=()=>{sceneIndex=Number(el("scene").value);paint();syncUrl();};
el("live").onclick=()=>{interactive=!interactive;paint();syncUrl();};
el("prev").onclick=()=>walk(-1);el("next").onclick=()=>walk(1);
el("plus").onclick=()=>magnify(true);el("minus").onclick=()=>magnify(false);el("fit").onclick=fit;
el("full").onclick=fullscreen;el("close").onclick=closeViewer;
dialog.addEventListener("cancel",e=>{e.preventDefault();closeViewer();});
stage.addEventListener("dblclick",e=>{if (!interactive) magnify(true,e);});
let drag;
stage.addEventListener("pointerdown",e=>{
  if (interactive || e.pointerType!=="mouse" || e.button!==0) return;
  const inner=surface.querySelector(".device-scroll");
  drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop,inner,inside:inner?.scrollTop??0};
  stage.setPointerCapture(e.pointerId);
});
stage.addEventListener("pointermove",e=>{
  if (!drag) return;
  stage.scrollLeft=drag.left+drag.x-e.clientX;
  const dy=drag.y-e.clientY;
  stage.scrollTop=drag.top+dy;
  if (drag.inner) drag.inner.scrollTop=drag.inside+(dy-(stage.scrollTop-drag.top))/level;
});
stage.addEventListener("lostpointercapture",()=>{drag=null;});
window.addEventListener("keydown",e=>{
  if (!dialog.open || e.altKey || e.metaKey || e.ctrlKey || e.target.matches("select,input,textarea")) return;
  const commands={"+":()=>magnify(true),"=":()=>magnify(true),"-":()=>magnify(false),"0":fit,
    f:fullscreen,ArrowLeft:()=>walk(-1),ArrowRight:()=>walk(1)};
  if (commands[e.key]) {e.preventDefault();commands[e.key]();}
});
new ResizeObserver(resize).observe(stage);
window.addEventListener("popstate",restore);
restore();
