(function(){
'use strict';
var FORM_EMAIL='contact@azorian3.com';
var $=function(s,c){return (c||document).querySelector(s)};
var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

/* progress + nav state */
var prog=$('.progress'),nav=$('.nav');
function onScroll(){
  var h=document.documentElement,max=h.scrollHeight-h.clientHeight;
  prog.style.width=(max>0?(h.scrollTop/max*100):0)+'%';
  nav.classList.toggle('scrolled',h.scrollTop>40);
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* active link */
var links=$$('.nav a.lnk'),secs=links.map(function(a){return $(a.getAttribute('href'))}).filter(Boolean);
new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'}).observe&&secs.forEach(function(s){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'}).observe(s)});

/* mobile nav */
var burger=$('.burger'),mnav=$('.mnav');
burger.addEventListener('click',function(){var o=mnav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
$$('a',mnav).forEach(function(a){a.addEventListener('click',function(){mnav.classList.remove('open')})});

/* reveal */
var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.12});
$$('.rv').forEach(function(el){ro.observe(el)});

/* counters */
function ease(t){return 1-Math.pow(1-t,3)}
function count(el){
  var raw=el.getAttribute('data-count'),suf=el.getAttribute('data-suffix')||'',end=parseFloat(raw),t0=null,dur=1600;
  function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);el.textContent=Math.round(end*ease(p))+(p===1?suf:'');if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
}
var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){count(e.target);co.unobserve(e.target)}})},{threshold:.5});
$$('[data-count]').forEach(function(el){co.observe(el)});

/* cost of waiting ticker: synthetic, $2B spend base leaking 0.6% = $12M/yr */
var tick=$('#costTick'),perSec=12000000/(365*24*3600),base=Date.now(),start=0;
function fmt(n){var d=Math.floor(n),c=Math.round((n-d)*100);return '$'+d.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')+'.'+(c<10?'0':'')+c}
function tickFn(){if(tick){tick.firstChild.nodeValue=fmt(start+(Date.now()-base)/1000*perSec)}requestAnimationFrame(tickFn)}
tickFn();

/* sparkline */
(function(){var p=$('#sparkPath'),f=$('#sparkFill');if(!p)return;var pts=[],n=40,y=30;for(var i=0;i<n;i++){y+=(Math.random()-.42)*6;y=Math.max(8,Math.min(50,y));pts.push([i*(300/(n-1)),y])}
var d=pts.map(function(q,i){return (i?'L':'M')+q[0].toFixed(1)+' '+(54-q[1]).toFixed(1)}).join(' ');p.setAttribute('d',d);f.setAttribute('d',d+' L300 54 L0 54 Z')})();

/* card glow follows pointer */
$$('.gcard').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')})});

/* accordions */
$$('.acc').forEach(function(b){b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);$('#'+b.getAttribute('aria-controls')).classList.toggle('open',!o)})});

/* embed scaling */
function fitEmbeds(){$$('.embed').forEach(function(box){var f=$('iframe',box),base=parseInt(f.getAttribute('data-h'),10),w=box.clientWidth,s=Math.min(1,w/980);f.style.width='980px';f.style.height=base+'px';f.style.transform='scale('+s+')';box.style.height=Math.round(base*s)+'px'})}
window.addEventListener('resize',fitEmbeds);fitEmbeds();
window.addEventListener('message',function(e){var t=e.data&&e.data.type;if(t==='cs-contact')location.hash='#contact';if(t==='cs-showcase')location.hash='#spend-reports'});

/* hero canvas: drifting data field */
(function(){
  var cv=$('#field');if(!cv)return;var ctx=cv.getContext('2d'),W,H,pts=[],mouse={x:-9999,y:-9999},dpr=Math.min(2,window.devicePixelRatio||1);
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(W*H/9000);pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.4,c:Math.random()})}
  size();window.addEventListener('resize',size);
  cv.parentNode.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});
  cv.parentNode.addEventListener('pointerleave',function(){mouse.x=-9999;mouse.y=-9999});
  var t=0;
  function draw(){
    t+=.004;ctx.clearRect(0,0,W,H);
    var cx=W*.62+Math.sin(t*.7)*W*.06,cy=H*.5+Math.cos(t*.5)*H*.06;
    for(var i=0;i<pts.length;i++){var p=pts[i];
      var dx=cx-p.x,dy=cy-p.y,d=Math.hypot(dx,dy)||1;p.vx+=dx/d*.0025;p.vy+=dy/d*.0025;
      var mx=p.x-mouse.x,my=p.y-mouse.y,md=Math.hypot(mx,my);if(md<140){p.vx+=mx/md*.12;p.vy+=my/md*.12}
      p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;
      if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20;if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;
    }
    ctx.lineWidth=.6;
    for(var i=0;i<pts.length;i++){for(var j=i+1;j<pts.length;j++){var a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y;if(Math.abs(dx)>110||Math.abs(dy)>110)continue;var d2=dx*dx+dy*dy;if(d2<12100){var al=(1-d2/12100)*.35;ctx.strokeStyle='rgba(111,125,255,'+al+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
    for(var i=0;i<pts.length;i++){var p=pts[i];var g=p.c>.8;ctx.fillStyle=g?'rgba(95,227,255,.95)':'rgba(170,180,255,.7)';ctx.beginPath();ctx.arc(p.x,p.y,g?p.r+.6:p.r,0,6.283);ctx.fill();if(g){ctx.fillStyle='rgba(95,227,255,.12)';ctx.beginPath();ctx.arc(p.x,p.y,p.r*5,0,6.283);ctx.fill()}}
    requestAnimationFrame(draw);
  }
  draw();
})();

/* forms via FormSubmit */
function toast(m){var t=$('.toast');t.textContent=m;t.classList.add('show');setTimeout(function(){t.classList.remove('show')},3800)}
$$('form[data-form]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();
  var em=$('input[type=email]',f);if(!em.value||!/.+@.+\..+/.test(em.value)){toast('Please enter a valid email.');em.focus();return}
  var req=$('input[required]:not([type=email])',f);if(req&&!req.value&&req.type!=='checkbox'){toast('Please fill in the required fields.');req.focus();return}
  var fd=new FormData(f);fd.append('_subject',f.getAttribute('data-form')==='contact'?'Website contact: azorian3.com':'Newsletter signup: azorian3.com');fd.append('_captcha','false');fd.append('_template','table');
  var btn=$('button[type=submit]',f);btn.disabled=true;
  fetch('https://formsubmit.co/ajax/'+FORM_EMAIL,{method:'POST',headers:{'Accept':'application/json'},body:fd}).then(function(r){return r.json()}).then(function(){f.reset();toast('Thanks. We reply within two business days.')}).catch(function(){toast('Could not send. Email us directly.')}).finally(function(){btn.disabled=false});
})});

})();
