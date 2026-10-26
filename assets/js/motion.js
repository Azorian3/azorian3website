/* Page-wide motion: heading decode, 3D tilt, dividers, parallax, cursor glow */
(function(){
'use strict';
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce)return;
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var fine=window.matchMedia('(pointer:fine)').matches;

/* 1. heading decode: scramble then lock, letter by letter */
var GL='#$%&0123456789ABCDEFXYZ<>/*';
function decode(el){
  if(el.dataset.decoded)return;el.dataset.decoded=1;
  var nodes=[];(function walk(n){n.childNodes.forEach(function(c){if(c.nodeType===3&&c.nodeValue.trim())nodes.push(c);else if(c.nodeType===1)walk(c)})})(el);
  var finals=nodes.map(function(n){return n.nodeValue});var t0=null,dur=900+Math.min(900,finals.join('').length*18);
  function frame(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);
    nodes.forEach(function(n,i){var f=finals[i],out='';for(var j=0;j<f.length;j++){var ch=f[j];if(ch===' '){out+=' ';continue}var lock=(j/f.length)*.75;var q=(p-lock)/.25;out+=q>=1?ch:(q>0&&Math.random()<q)?ch:GL[Math.floor(Math.random()*GL.length)]}n.nodeValue=out});
    if(p<1)requestAnimationFrame(frame);else nodes.forEach(function(n,i){n.nodeValue=finals[i]})}
  requestAnimationFrame(frame);
}
var hobs=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){decode(e.target);hobs.unobserve(e.target)}})},{threshold:.6});
$$('.sec-head h2, .numbers h2, .contact h2, .band h2, .mission .quote').forEach(function(h){hobs.observe(h)});

/* 2. dashboards: tilt in 3D, flatten when centered */
var frames=$$('.dash .frame');
function tiltFrames(){var vh=window.innerHeight;frames.forEach(function(f){var r=f.getBoundingClientRect();var c=(r.top+r.height/2-vh/2)/vh;var k=Math.max(-1,Math.min(1,c));f.style.transform='perspective(1400px) rotateX('+(k*10)+'deg) translateY('+(k*-18)+'px) scale('+(1-Math.abs(k)*.03)+')';f.style.opacity=String(1-Math.abs(k)*.25)})}
window.addEventListener('scroll',tiltFrames,{passive:true});window.addEventListener('resize',tiltFrames);tiltFrames();

/* 3. cards tilt toward pointer with light sweep */
if(fine){$$('.gcard,.person,.stat,.step').forEach(function(c){c.classList.add('tilt');c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(900px) rotateX('+(-y*8)+'deg) rotateY('+(x*10)+'deg) translateY(-6px)';c.style.setProperty('--sx',(x*100+50)+'%');c.style.setProperty('--sy',(y*100+50)+'%')});c.addEventListener('pointerleave',function(){c.style.transform=''})})}

/* 4. dividers: streams converge into a line */
$$('.divider canvas').forEach(function(cv){
  var ctx=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),W,H,P=[],on=false,prog=0;
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);P=[];for(var i=0;i<90;i++)P.push({x:Math.random()*W,y:Math.random()*H,sp:.4+Math.random()*1.2,ph:Math.random()*6.28})}
  size();window.addEventListener('resize',size);
  new IntersectionObserver(function(es){es.forEach(function(e){on=e.isIntersecting})},{threshold:.1}).observe(cv);
  function draw(now){
    if(on){var r=cv.getBoundingClientRect(),vh=innerHeight;prog=Math.max(0,Math.min(1,1-(r.top+r.height/2)/(vh)));
      ctx.clearRect(0,0,W,H);var mid=H/2;
      ctx.strokeStyle='rgba(95,227,255,'+(.15+prog*.5)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W*.5-W*.5*prog,mid+.5);ctx.lineTo(W*.5+W*.5*prog,mid+.5);ctx.stroke();
      for(var i=0;i<P.length;i++){var p=P[i];p.x+=p.sp;if(p.x>W+10)p.x=-10;var yy=mid+(p.y-mid)*(1-prog)+Math.sin(now*.001+p.ph)*3*(1-prog);ctx.fillStyle=i%7===0?'rgba(95,227,255,.9)':'rgba(140,150,220,.55)';ctx.beginPath();ctx.arc(p.x,yy,i%7===0?1.8:1.1,0,6.283);ctx.fill()}}
    requestAnimationFrame(draw)}
  requestAnimationFrame(draw);
});

/* 5. parallax on numbers background */
var nimg=document.querySelector('.numbers .img');
function px(){if(!nimg)return;var r=nimg.parentNode.getBoundingClientRect();var k=(r.top+r.height/2-innerHeight/2)/innerHeight;nimg.style.transform='translateY('+(k*60)+'px) scale(1.12)'}
window.addEventListener('scroll',px,{passive:true});px();

/* 6. cursor glow */
if(fine){var g=document.createElement('div');g.className='cursor-glow';document.body.appendChild(g);var gx=0,gy=0,tx=0,ty=0;
  window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;g.style.opacity=1});
  window.addEventListener('pointerleave',function(){g.style.opacity=0});
  (function loop(){gx+=(tx-gx)*.18;gy+=(ty-gy)*.18;g.style.transform='translate('+(gx-160)+'px,'+(gy-160)+'px)';requestAnimationFrame(loop)})()}
})();
