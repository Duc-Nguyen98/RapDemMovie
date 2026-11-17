const fs=require("node:fs/promises");
const path=require("node:path");
const sharp=require("sharp");
const root=path.resolve(__dirname,"../docs");
const web=path.join(root,"web-v18");
const target=path.join(root,"studio/web-art");
async function run(){
  await fs.mkdir(target,{recursive:true});
  const read=async name=>JSON.parse(await fs.readFile(path.join(web,"data",name),"utf8"));
  const {movies}=await read("movies.sample.json");
  const crop=async(file,name,[left,top,width,height])=>sharp(file).extract({left,top,width,height}).webp({lossless:true}).toFile(path.join(target,name+".webp"));
  const atlas=path.join(web,"source-assets/poster-master.png");
  for(const movie of movies) await crop(atlas,movie.id,movie.poster.cropPx);
  const image=key=>path.join(web,"images/rap-dem_"+key+"_v18.png");
  for(const [key,board,rect] of [
    ["popcorn","home_tablet-mobile",[833,122,115,80]],["lamp","home_desktop",[377,97,126,75]],
    ["ticket","home_desktop",[789,102,105,68]],["tea","watch_desktop",[535,636,88,88]],
    ["sound","watch_desktop",[783,635,106,86]],["cinema","watch_desktop",[699,201,180,89]],
    ["preroll","watch_desktop",[135,290,534,222]],["space","ads_responsive_viewports",[103,178,500,166]]
  ]) await crop(image(board),key,rect);
  const data={movies:movies.map(({id,title,year,genres,episodeCount})=>({id,title,year,genres,episodeCount})),
    sections:(await read("home-sections.json")).sections,copy:await read("ui-copy.vi.json")};
  await fs.writeFile(path.join(target,"sample.js"),"// Text and film IDs from the V18 design contract.\nconst webSample = "+JSON.stringify(data,null,2)+";\n");
}
run().catch(e=>{console.error(e);process.exitCode=1;});
