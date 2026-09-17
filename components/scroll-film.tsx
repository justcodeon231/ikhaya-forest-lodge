"use client";
import { useEffect, useRef } from 'react';

type Manifest={enabled:boolean;count:number;fps:number;desktop:string;mobile:string;stops:{scroll:number;frame:number}[]};
// An optional production film. Disabled manifest keeps the existing photographic journey.
export function ScrollFilm(){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current!;const stage=el.closest('.stage');const ctx=el.getContext('2d',{alpha:false});if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');const abort=new AbortController();
  const cache=new Map<number,HTMLImageElement>();const failed=new Set<number>();const pending=new Map<number,HTMLImageElement>();let config:Manifest|null=null;let target=0;let progress=0;let disposed=false;let ready=false;
  const draw=()=>{if(disposed||reduced.matches||!cache.size)return;if(failed.has(target)){el.style.opacity='0';stage?.classList.remove('film-active');ready=false;return;}let frame=cache.get(target);if(!frame){const nearest=[...cache.keys()].sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];frame=cache.get(nearest)}if(!frame)return;const r=Math.max(el.width/frame.naturalWidth,el.height/frame.naturalHeight);const w=frame.naturalWidth*r,h=frame.naturalHeight*r;ctx.drawImage(frame,(el.width-w)/2,(el.height-h)/2,w,h);if(!ready){ready=true;el.style.opacity='1';stage?.classList.add('film-active')}};
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);el.width=Math.round(el.clientWidth*dpr);el.height=Math.round(el.clientHeight*dpr);draw()};
  const wanted=()=>[target,target+1,target-1,target+2,target-2,target+3,target-3].filter(f=>config&&f>=0&&f<config.count&&!cache.has(f)&&!pending.has(f)&&!failed.has(f));
  const pump=()=>{if(disposed||!config||reduced.matches)return;for(const index of wanted()) {if(pending.size>=3)break;const img=new window.Image();pending.set(index,img);img.onload=()=>{pending.delete(index);if(disposed)return;cache.set(index,img);while(cache.size>8){const farthest=[...cache.keys()].sort((a,b)=>Math.abs(b-target)-Math.abs(a-target))[0];cache.delete(farthest)}draw();pump()};img.onerror=()=>{pending.delete(index);failed.add(index);if(index===target){el.style.opacity='0';stage?.classList.remove('film-active');ready=false}pump()};const pattern=innerWidth<=700?config.mobile:config.desktop;img.src=pattern.replace('{frame}',String(index+1).padStart(4,'0'))}};
  const update=(p:number)=>{progress=Math.max(0,Math.min(1,p));if(!config)return;const filmAlpha=progress>0.08?Math.max(0,1-(progress-0.08)/0.04):1;el.style.opacity=String(ready?filmAlpha:0);if(filmAlpha<0.1){stage?.classList.remove('film-active')}else if(ready){stage?.classList.add('film-active')}if(filmAlpha<=0)return;const stops=config.stops;let a=stops[0],b=stops[stops.length-1];for(let i=1;i<stops.length;i++){if(progress<=stops[i].scroll){a=stops[i-1];b=stops[i];break}}target=Math.round(a.frame+(b.frame-a.frame)*Math.max(0,Math.min(1,(progress-a.scroll)/(b.scroll-a.scroll||1))));target=Math.max(0,Math.min(config.count-1,target));draw();pump()};
  const onProgress=(event:Event)=>update((event as CustomEvent<number>).detail);
  const motionChange=()=>{if(reduced.matches){el.style.opacity='0';stage?.classList.remove('film-active');ready=false}else{resize();update(progress)}};
  window.addEventListener('ikhaya-progress',onProgress);window.addEventListener('resize',resize);reduced.addEventListener('change',motionChange);
  fetch('/sequence/manifest.json',{signal:abort.signal}).then(r=>r.ok?r.json():null).then(value=>{const m=value as Manifest|null;if(!m?.enabled||!Number.isInteger(m.count)||m.count<2||m.count>2000||!m.desktop?.startsWith('/sequence/')||!m.mobile?.startsWith('/sequence/'))return;if(!Array.isArray(m.stops)||m.stops.length<2||m.stops[0].scroll!==0||m.stops.at(-1)?.scroll!==1)return;if(m.stops.some((s,i)=>!Number.isFinite(s.frame)||s.frame<0||s.frame>=m.count||!Number.isFinite(s.scroll)||(i>0&&s.scroll<=m.stops[i-1].scroll)))return;config=m;resize();update(progress)}).catch(()=>{/* Photograph layers remain visible on absent or failed film. */});
  resize();return()=>{disposed=true;stage?.classList.remove('film-active');abort.abort();window.removeEventListener('ikhaya-progress',onProgress);window.removeEventListener('resize',resize);reduced.removeEventListener('change',motionChange);pending.forEach(img=>{img.onload=null;img.onerror=null;img.src=''});cache.clear();pending.clear()};
 },[]);
 return <canvas ref={canvas} className="scroll-film" aria-hidden="true"/>;
}
