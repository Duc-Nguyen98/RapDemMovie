const el = id => document.getElementById(id);
const byId = new Map(catalog.map(item=>[item.id,item]));
const search = el("search");
let group = "web";
let limit = 12;
let filtered = [];

function searchKey(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replaceAll("đ","d");
}
function makeCard(item) {
  const link = document.createElement("a");
  link.className = "card";
  link.href = "?view="+item.id+"#"+item.group;
  link.dataset.view = item.id;
  const preview = document.createElement("div");
  preview.className = "preview";
  const img = new Image();
  img.loading = "lazy"; img.decoding = "async"; img.alt = ""; img.src = item.thumb;
  preview.append(img);
  const text = document.createElement("div");
  text.className = "card-text";
  const caption = document.createElement("small");
  const title = document.createElement("strong");
  const arrow = document.createElement("b");
  caption.textContent = item.caption; title.textContent = item.title;
  arrow.textContent = "↗"; arrow.setAttribute("aria-hidden","true");
  text.append(caption,title,arrow); link.append(preview,text);
  return link;
}
function renderCards() {
  const term = searchKey(search.value.trim());
  filtered = catalog.filter(item=>item.group===group && searchKey([item.title,item.caption,item.route].join(" ")).includes(term));
  const list = el("cards");
  list.replaceChildren(...filtered.slice(0,limit).map(makeCard));
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.textContent = "Không tìm thấy màn hình. Hãy thử từ khóa khác.";
    list.append(empty);
  }
  el("more").hidden = filtered.length<=limit;
  el("count").textContent = filtered.length+" thiết kế trong bộ "+groups[group];
  document.querySelectorAll("[data-group]").forEach(link=>{
    if (link.dataset.group===group) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
}
function setGroup(value) {
  if (!Object.hasOwn(groups,value)) return;
  if (group !== value) { search.value=""; limit=12; }
  group=value; renderCards();
}
search.addEventListener("input",()=>{limit=12;renderCards();});
el("more").onclick = ()=>{
  const firstNew=filtered[limit];
  limit+=18; renderCards();
  if (firstNew) document.querySelector('[data-view="'+firstNew.id+'"]')?.focus({preventScroll:true});
};
function followAnchor() {
  const hash=location.hash.slice(1);
  if (Object.hasOwn(groups,hash)) {
    setGroup(hash);
    if (!new URLSearchParams(location.search).has("view")) el("library").scrollIntoView();
  }
}
document.querySelectorAll('a[href="#web"],a[href="#cms"],a[href="#flows"]').forEach(link=>{
  link.addEventListener("click",()=>{setGroup(link.hash.slice(1));el("library").scrollIntoView();});
});
renderCards();
followAnchor();
window.addEventListener("hashchange",followAnchor);
