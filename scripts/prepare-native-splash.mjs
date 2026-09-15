import { chromium } from '@playwright/test';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
const svg = await readFile('release-assets/store/icon-source.svg','utf8');
async function files(dir) { const result=[]; for(const entry of await readdir(dir,{withFileTypes:true})) { const p=join(dir,entry.name); if(entry.isDirectory()) result.push(...await files(p)); else result.push(p); } return result; }
const targets=(await files('android/app/src/main/res')).filter(p=>p.endsWith('/splash.png'));
targets.push(...(await files('ios/App/App/Assets.xcassets')).filter(p=>p.endsWith('.png')));
const browser=await chromium.launch();
try { const page=await browser.newPage({deviceScaleFactor:1});
for(const path of targets) {
 const original=await readFile(path);const width=original.readUInt32BE(16),height=original.readUInt32BE(20);
 const isIcon=path.includes('AppIcon.appiconset');
 const size=isIcon?width:Math.round(Math.min(width,height)*0.22);
 await page.setViewportSize({width,height});
 await page.setContent(`<style>body{margin:0;background:#0b1014;display:grid;place-items:center;width:100vw;height:100vh}svg{width:${size}px;height:${size}px}</style>${svg}`);
 await writeFile(path,await page.screenshot());
}
} finally {await browser.close();}
console.log(`Prepared ${targets.length} native icon/splash assets.`);
