import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
// Existing Lucide Plane geometry (ISC). Keep the same symbol as the app UI.
const plane = 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z';
const res = 'android/app/src/main/res';
const vector = color => `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="108dp" android:height="108dp" android:viewportWidth="108" android:viewportHeight="108"><group android:translateX="30" android:translateY="30" android:scaleX="2" android:scaleY="2"><path android:pathData="${plane}" android:fillColor="@android:color/transparent" android:strokeColor="${color}" android:strokeWidth="1.8" android:strokeLineCap="round" android:strokeLineJoin="round" /></group></vector>`;
await writeFile(join(res,'drawable/jetsweep_foreground.xml'),vector('#C9AA68'));
await writeFile(join(res,'drawable/jetsweep_monochrome.xml'),vector('#FFFFFF'));
await writeFile(join(res,'values/jetsweep_icon.xml'),'<resources><color name="jetsweep_icon_background">#0B1014</color></resources>');
for (const name of ['ic_launcher','ic_launcher_round']) await writeFile(join(res,`mipmap-anydpi-v26/${name}.xml`),'<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android"><background android:drawable="@color/jetsweep_icon_background"/><foreground android:drawable="@drawable/jetsweep_foreground"/><monochrome android:drawable="@drawable/jetsweep_monochrome"/></adaptive-icon>');
const svg = round => `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">${round ? '<circle cx="50" cy="50" r="46"' : '<rect x="4" y="4" width="92" height="92" rx="23"'} fill="#0b1014" stroke="#c9aa68" stroke-width="1"/><g transform="translate(23 23) scale(2.25)"><path d="${plane}" fill="none" stroke="#c9aa68" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
await mkdir('release-assets/store',{recursive:true});
await writeFile('release-assets/store/icon-source.svg',svg(false));
const browser = await chromium.launch();
try {
 const page=await browser.newPage({deviceScaleFactor:1});
 for (const [density,size] of Object.entries({ldpi:36,mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})) {
  await page.setViewportSize({width:size,height:size});
  for (const round of [false,true]) {
   await page.setContent(`<style>html,body{margin:0;background:transparent}svg{width:100vw;height:100vh}</style>${svg(round)}`);
   await page.screenshot({path:join(res,`mipmap-${density}/ic_launcher${round?'_round':''}.png`),omitBackground:true});
  }
 }
 await page.setViewportSize({width:512,height:512});
 await page.setContent(`<style>body{margin:0;background:#0b1014}svg{width:512px;height:512px}</style>${svg(false)}`);
 await page.screenshot({path:'release-assets/store/play-icon-512.png'});
 const html=`<!doctype html><style>*{box-sizing:border-box}body{margin:0;width:1024px;height:500px;background:#0b1014;color:#e8edf1;display:flex;align-items:center;padding:64px;gap:50px;font-family:Arial,sans-serif}svg{width:210px;flex-shrink:0}h1{font:64px Georgia,serif;margin:0 0 22px;color:#c9aa68}p{font-size:30px;line-height:1.35;margin:0;max-width:540px}.eyebrow{font-size:13px;letter-spacing:4px;margin-bottom:20px;color:#9dafbf}</style>${svg(false)}<main><div class="eyebrow">YOUR AIRPORT DEPARTURE PLAN</div><h1>JetSweep</h1><p>A little buffer.<br>A better trip.</p></main>`;
 await writeFile('release-assets/store/feature-graphic.html',html);
 await page.setViewportSize({width:1024,height:500});await page.setContent(html);
 await page.screenshot({path:'release-assets/store/feature-graphic-1024x500.png'});
 await writeFile('release-assets/store/LUCIDE-LICENSE.txt',await readFile('node_modules/lucide-react/LICENSE','utf8'));
} finally {await browser.close();}
console.log('Prepared native icons, themed vector, Play icon and feature graphic.');
