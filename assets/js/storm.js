/* Chaos to order: scattered spend data snaps into a governed spend chart */
(function(){
'use strict';
var cv=document.getElementById('storm');if(!cv)return;
var hero=cv.closest('.hero'),ctx=cv.getContext('2d'),dpr=Math.min(2,window.devicePixelRatio||1),W,H,T0,t,state='chaos',formed=false;
var VEND=['ACME INDUSTRIAL','Acme Ind.','ACME INDUSTRIAL LLC','Grainger','GRAINGER INC','W.W. Grainger','Fastenal','FASTENAL CO','Uline','ULINE INC','Sysco','SYSCO FOODS','Dell','DELL TECHNOLOGIES','Staples','STAPLES INC.'];
var INV=['INV-48213','PO 7731900','INV-48213 DUP','PO 7731900','#A-10021','INV 00917','PO 7732410','INV-55100','#A-10021 DUP','PO 7731988'];
var AMT=['$4,812.00','$12,940.22','$4,812.00','$218.90','$97,400.00','$1,205.55','$12,940.22','$3,330.00','$67.12','$218.90','$41,090.00','$806.44'];
var TAGS=['NON-PO','LATE 41d','DUP','OFF-CONTRACT','PPV +6.2%','MISCODED','MAVERICK','NO PO','PAID 2x','UNCLASSIFIED'];
var N=190,P=[];
function rnd(a,b){return a+Math.random()*(b-a)}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function mk(i){
  var k=Math.random(),txt,kind;
  if(k<.3){txt=pick(VEND);kind='v'}else if(k<.55){txt=pick(AMT);kind='a'}else if(k<.75){txt=pick(INV);kind='i'}else{txt=pick(TAGS);kind='t'}
  return {i:i,txt:txt,kind:kind,x:rnd(0,W),y:rnd(0,H),vx:rnd(-.6,.6),vy:rnd(-.4,.4),a:rnd(-.5,.5),va:rnd(-.01,.01),s:rnd(.75,1.25),ph:rnd(0,6.28),tx:0,ty:0,ta:0,ts:1,bar:-1,alpha:rnd(.35,.9)}
}
function size(){W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);cv.style.width=W+'px';cv.style.height=H+'px';if(!P.length){for(var i=0;i<N;i++)P.push(mk(i))}layoutTargets()}
/* chart target: on the right half (desktop) or lower half (mobile) */
var CH={bars:12,vals:[],x:0,y:0,w:0,h:0};
function layoutTargets(){
  var mob=W<860;
  CH.w=mob?W*.86:Math.min(560,W*.42);CH.h=mob?H*.26:Math.min(320,H*.38);
  CH.x=mob?(W-CH.w)/2:W-CH.w-Math.max(40,(W-1180)/2+24);CH.y=mob?H*.62:H*.52-CH.h/2+56;
  if(!CH.vals.length){var v=[];for(var i=0;i<CH.bars;i++)v.push(rnd(.3,1));v.sort(function(a,b){return b-a});CH.vals=v}
  var per=Math.floor(N*.7/CH.bars),bw=CH.w/CH.bars,gap=bw*.3,idx=0;
  for(var b=0;b<CH.bars;b++){var bh=CH.h*CH.vals[b];for(var j=0;j<per;j++){var p=P[idx++];p.bar=b;p.tx=CH.x+b*bw+gap/2+rnd(2,bw-gap-2);p.ty=CH.y+CH.h-rnd(2,bh-2);p.ta=0;p.ts=.55}}
  /* the rest form a thin grid / axis dots and labels */
  for(;idx<N;idx++){var p=P[idx];p.bar=-1;var row=idx%6;p.tx=CH.x+rnd(0,CH.w);p.ty=CH.y+CH.h+14+row*10;p.ta=0;p.ts=.45;p.alpha=.25}
}
size();window.addEventListener('resize',size);
var mouse={x:-1e4,y:-1e4};hero.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
hero.addEventListener('pointerleave',function(){mouse.x=-1e4;mouse.y=-1e4});
var FONT={v:'500 13px "JetBrains Mono"',a:'500 15px "JetBrains Mono"',i:'400 12px "JetBrains Mono"',t:'600 11px "Sora"'};
var COL={chaos:{v:'rgba(200,205,220,',a:'rgba(255,122,122,',i:'rgba(160,170,200,',t:'rgba(255,170,90,'},order:'rgba(95,227,255,'};
var CHAOS_MS=3400,FORM_MS=1700;
function phase(){var e=t-T0;if(e<CHAOS_MS)return {s:'chaos',k:0};if(e<CHAOS_MS+FORM_MS)return {s:'form',k:(e-CHAOS_MS)/FORM_MS};return {s:'order',k:1}}
function easeIO(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
function draw(now){
  t=now;if(!T0)T0=now;var ph=phase(),k=easeIO(Math.min(1,ph.k));
  ctx.clearRect(0,0,W,H);
  if(ph.s!=='chaos'&&!formed&&ph.k>.85){formed=true;hero.classList.add('formed')}
  for(var n=0;n<P.length;n++){var p=P[n];
    if(ph.s==='chaos'){
      p.x+=p.vx+Math.sin(now*.001+p.ph)*.4;p.y+=p.vy+Math.cos(now*.0013+p.ph)*.3;p.a+=p.va;
      var dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<160){p.x+=dx/d*2.2;p.y+=dy/d*2.2}
      if(p.x<-120)p.x=W+120;if(p.x>W+120)p.x=-120;if(p.y<-40)p.y=H+40;if(p.y>H+40)p.y=-40;
      p.cx=p.x;p.cy=p.y;p.ca=p.a;p.cs=p.s;
    }else{
      /* lerp with per particle stagger */
      var st=(p.i%23)/23*.35,kk=Math.max(0,Math.min(1,(k-st)/(1-st)));kk=easeIO(kk);
      p.cx=p.x+(p.tx-p.x)*kk;p.cy=p.y+(p.ty-p.y)*kk;p.ca=p.a*(1-kk);p.cs=p.s+(p.ts-p.s)*kk;
      if(ph.s==='order'){p.cx=p.tx+Math.sin(now*.0008+p.ph)*.6;p.cy=p.ty+Math.cos(now*.001+p.ph)*.6;var dx=p.cx-mouse.x,dy=p.cy-mouse.y,d=Math.hypot(dx,dy);if(d<90){var f=(90-d)/90*18;p.cx+=dx/d*f;p.cy+=dy/d*f}}
    }
    var kBlend=ph.s==='chaos'?0:(ph.s==='order'?1:k);
    ctx.save();ctx.translate(p.cx,p.cy);ctx.rotate(p.ca);ctx.scale(p.cs,p.cs);
    ctx.font=FONT[p.kind];
    if(kBlend<1){ctx.globalAlpha=p.alpha*(1-kBlend);ctx.fillStyle=COL.chaos[p.kind]+'1)';ctx.fillText(p.txt,0,0)}
    if(kBlend>0){ctx.globalAlpha=(p.bar>=0?.95:.5)*kBlend;ctx.fillStyle=COL.order+'1)';
      if(p.bar>=0){ctx.beginPath();ctx.arc(0,0,2.2,0,6.283);ctx.fill()}else{ctx.beginPath();ctx.arc(0,0,1.2,0,6.283);ctx.fill()}}
    ctx.restore();
  }
  /* order phase: draw bar outlines, baseline, labels */
  if(ph.s!=='chaos'){
    var g=k;ctx.save();ctx.globalAlpha=g;
    ctx.strokeStyle='rgba(95,227,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CH.x,CH.y+CH.h+.5);ctx.lineTo(CH.x+CH.w,CH.y+CH.h+.5);ctx.stroke();
    var bw=CH.w/CH.bars,gap=bw*.3;
    for(var b=0;b<CH.bars;b++){var bh=CH.h*CH.vals[b]*g,x=CH.x+b*bw+gap/2,y=CH.y+CH.h-bh;
      var grd=ctx.createLinearGradient(0,y,0,CH.y+CH.h);grd.addColorStop(0,'rgba(95,227,255,.22)');grd.addColorStop(1,'rgba(111,125,255,.02)');ctx.fillStyle=grd;ctx.fillRect(x,y,bw-gap,bh);
      ctx.strokeStyle=b<3?'rgba(95,227,255,.9)':'rgba(95,227,255,.4)';ctx.strokeRect(x+.5,y+.5,bw-gap-1,bh-1);if(b<3){ctx.save();ctx.shadowColor='rgba(95,227,255,.6)';ctx.shadowBlur=18;ctx.strokeRect(x+.5,y+.5,bw-gap-1,bh-1);ctx.restore()}
      if(b<3){ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='500 11px "JetBrains Mono"';ctx.textAlign='center';ctx.fillText(['$1.9M','$1.2M','$640K'][b],x+(bw-gap)/2,y-9)}
    }
    ctx.textAlign='left';ctx.fillStyle='rgba(170,178,196,.9)';ctx.font='500 10px "JetBrains Mono"';ctx.fillText('SAVINGS BY CATEGORY  ·  PRICED  ·  OWNED',CH.x,CH.y-34);
    ctx.textAlign='right';ctx.fillStyle='rgba(95,227,255,.9)';ctx.fillText('24 KPIs  ·  10 DAYS',CH.x+CH.w,CH.y-34);
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
window.stormReplay=function(){T0=0;formed=false;hero.classList.remove('formed');P.forEach(function(p){p.x=rnd(0,W);p.y=rnd(0,H);p.a=rnd(-.5,.5)})};
})();
