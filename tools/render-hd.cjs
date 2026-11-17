const fs = require("node:fs/promises");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const {chromium} = require("playwright");
const sharp = require("sharp");
const docs = path.resolve(__dirname,"../docs");
const cms = path.join(docs,"rap-dem-cms-v2");
const target = path.join(docs,"studio/hd");
const base = pathToFileURL(path.join(cms,"prototype/index.html")).href;
async function run() {
  const screens = JSON.parse(await fs.readFile(path.join(cms,"data/screens.json"),"utf8"));
  await fs.mkdir(target,{recursive:true});
  const browser = await chromium.launch();
  async function batch(device,width,height) {
    const p = await browser.newPage({viewport:{width,height},deviceScaleFactor:3});
    const visit = async (route,roleName="owner") => {
      await p.goto(base+"#"+route);
      await p.locator("h1:visible,h2:visible").first().waitFor();
      const role = p.locator("#demo-role");
      if (await role.count()) await role.selectOption(roleName);
      await p.evaluate(()=>document.fonts.ready);
    };
    const capture = async name => {
      await p.evaluate(()=>document.querySelector("#toast")?.classList.remove("visible"));
      const png = await p.screenshot({animations:"disabled"});
      await sharp(png).webp({lossless:true,effort:2}).toFile(path.join(target,name+".webp"));
    };
    if (!process.argv.includes("--extras")) for (const {route} of screens) {await visit(route);await capture(route+"_"+device);}
    if (device==="desktop") {
      await visit("dashboard","admin");
      for (const state of ["loading","empty","error","forbidden","success"]) {
        await p.locator("#demo-state").selectOption(state);
        await capture("state-"+state+"_desktop");
      }
      await p.locator("#demo-state").selectOption("normal");
      await visit("reservation-new","admin");await p.locator('[data-action="confirm-booking"]').first().click();await capture("reservation-conflict_desktop");
      await visit("campaigns","admin");await p.locator('[data-action="pause-campaign"]').first().click();await capture("confirm-dialog_desktop");
      await p.setViewportSize({width:1600,height:1000});
      for (const slug of ["01-viewer-flow","02-cms-flow","03-combined-flow"]) {
        await p.goto(pathToFileURL(path.join(cms,"docs",slug+".html")).href);await capture(slug);
      }
    }
    if (device==="mobile") {await visit("dashboard","admin");await p.locator('[data-action="menu"]').first().click();await capture("navigation-drawer_mobile");}
    await p.close();
    console.log("Complete",device);
  }
  try {await Promise.all([batch("desktop",1440,1000),batch("tablet",1024,1000),batch("mobile",390,844)]);}
  finally {await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
