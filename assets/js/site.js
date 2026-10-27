/* Watermark Constructions, shared behaviour */
(function(){
  const hdr=document.querySelector('header');
  const burger=document.querySelector('.burger');
  const menu=document.querySelector('.mobile-menu');
  function onScroll(){ if(hdr) hdr.classList.toggle('scrolled',scrollY>60); }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(burger&&menu){
    burger.addEventListener('click',()=>{
      const open=!menu.classList.contains('open');
      menu.classList.toggle('open',open); burger.classList.toggle('open',open);
      document.body.classList.toggle('menu-open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.classList.remove('open');document.body.classList.remove('menu-open')}));
  }

  /* dropdowns: tap to open on touch devices, hover on desktop */
  const coarse=matchMedia('(hover: none)').matches;
  document.querySelectorAll('.nav>ul>li.has-sub>a').forEach(a=>{
    a.addEventListener('click',e=>{
      const li=a.parentElement;
      if(coarse&&!li.classList.contains('open')){e.preventDefault();document.querySelectorAll('.nav>ul>li.open').forEach(x=>x.classList.remove('open'));li.classList.add('open')}
    });
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.nav>ul>li.has-sub'))document.querySelectorAll('.nav>ul>li.open').forEach(x=>x.classList.remove('open'))});

  /* hero headline line reveal */
  setTimeout(()=>{document.querySelectorAll('h1').forEach(h=>h.classList.add('go'))},150);

  /* staggered reveals: every direct child of .rv-group, plus anything already tagged .rv */
  const els=[];
  document.querySelectorAll('.rv-group').forEach(g=>{[...g.children].forEach(c=>{if(!c.classList.contains('rv')){c.classList.add('rv')}})});
  document.querySelectorAll('.rv').forEach(el=>els.push(el));
  const groups=new Map();
  els.forEach(el=>{const g=el.closest('section,.section,.cta-band,.page-hero,footer')||document.body;if(!groups.has(g))groups.set(g,[]);el.dataset.rvi=groups.get(g).length;groups.get(g).push(el)});
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target;
    el.style.transitionDelay=(Math.min(+el.dataset.rvi,8)*0.09)+'s';
    el.classList.add('in'); io.unobserve(el);
  }),{threshold:.1});
  els.forEach(el=>{ if(el.closest('.page-hero')){ setTimeout(()=>{el.style.transitionDelay=(+el.dataset.rvi*0.14)+'s';el.classList.add('in')},500) } else io.observe(el) });

  /* counters */
  const nums=[...document.querySelectorAll('[data-count]')];
  nums.forEach(el=>{
    const t=+el.dataset.count;
    const str=el.dataset.nogroup?String(t):t.toLocaleString('en-AU');
    el.textContent='';
    [...str].forEach((ch,i)=>{
      if(!/[0-9]/.test(ch)){const sp=document.createElement('span');sp.textContent=ch;el.appendChild(sp);return}
      const col=document.createElement('span');col.className='dcol';
      const strip=document.createElement('span');strip.className='dstrip';
      let digits='';for(let r=0;r<2;r++)digits+='0123456789';digits+='0123456789'.slice(0,+ch+1);
      [...digits].forEach(d=>{const dd=document.createElement('span');dd.textContent=d;strip.appendChild(dd)});
      strip.style.transitionDuration=(2.0+i*0.22)+'s';
      strip.dataset.end=digits.length-1;
      col.appendChild(strip);el.appendChild(col);
    });
  });
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting||e.target.dataset.done)return;
    e.target.dataset.done=1;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      e.target.querySelectorAll('.dstrip').forEach(st=>{st.style.transform=`translateY(${-st.dataset.end}em)`});
    }));
  }),{threshold:.35});
  nums.forEach(n=>cio.observe(n.closest('.bignum')||n));

  /* case study filters */
  const filters=document.querySelectorAll('.filter');
  if(filters.length){
    const cards=document.querySelectorAll('.cs[data-cat]');
    const empty=document.querySelector('.empty-note');
    filters.forEach(f=>f.addEventListener('click',()=>{
      filters.forEach(x=>x.classList.remove('active')); f.classList.add('active');
      const cat=f.dataset.filter; let shown=0;
      cards.forEach(c=>{const on=cat==='all'||c.dataset.cat===cat;c.classList.toggle('hidden',!on);if(on)shown++});
      if(empty){empty.classList.toggle('show',shown===0); if(shown===0){empty.querySelector('[data-cat-name]').textContent=f.textContent.trim()}}
    }));
  }
})();
/* hero body copy matches the width of the heading on desktop */
(function(){
  var hero=document.querySelector('.hero-match'); if(!hero) return;
  var h=hero.querySelector('h1'), p=hero.querySelector('.inner-wide>p'); if(!h||!p) return;
  function fit(){
    if(window.innerWidth<1000){p.style.maxWidth='';return}
    var w=0; h.querySelectorAll('.li').forEach(function(l){var r=document.createRange();r.selectNodeContents(l);var b=r.getBoundingClientRect();if(b.width>w)w=b.width});
    if(w) p.style.maxWidth=Math.ceil(w)+'px';
  }
  fit(); window.addEventListener('resize',fit); window.addEventListener('load',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
})();
/* page hero headings: shrink slightly (then wrap) rather than ever being cut off */
(function(){
  var hs=document.querySelectorAll('.page-hero h1'); if(!hs.length) return;
  function clipped(h){var c=false;h.querySelectorAll('.lm').forEach(function(l){var li=l.querySelector('.li');if(li&&li.scrollWidth>l.clientWidth+1)c=true});return c}
  function fit(){
    hs.forEach(function(h){
      h.style.fontSize='';h.classList.remove('wrap-h1');
      if(!clipped(h)) return;
      var base=parseFloat(getComputedStyle(h).fontSize),f=1;
      while(clipped(h)&&f>0.74){f-=0.04;h.style.fontSize=(base*f)+'px'}
      if(clipped(h)){h.style.fontSize='';h.classList.add('wrap-h1')}
    });
  }
  fit(); window.addEventListener('load',fit); window.addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
})();

/* parallax: full-bleed banner images drift slower than the page */
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items=[];
  document.querySelectorAll('.page-hero > .bg').forEach(function(e){items.push({el:e,mode:'t'})});
  var hb=document.querySelector('.hero-bg'); if(hb) items.push({el:hb,mode:'t'});
  var ab=document.querySelector('.about-hero'); if(ab) items.push({el:ab,mode:'pos'});
  if(!items.length) return;
  var small=window.matchMedia('(max-width:760px)'), ticking=false;
  function update(){
    ticking=false; var vh=window.innerHeight;
    items.forEach(function(it){
      var host=it.mode==='t'?it.el.parentElement:it.el, r=host.getBoundingClientRect();
      if(r.bottom<-120||r.top>vh+120) return;
      var d=(r.top+r.height/2)-vh/2;
      if(it.mode==='t'){
        if(small.matches&&host.classList.contains('hero-split')){it.el.style.translate='';return}
        var max=r.height*0.07, y=Math.max(-max,Math.min(max,-d*0.09));
        it.el.style.translate='0 '+y.toFixed(1)+'px';
      }else{
        if(small.matches){it.el.style.backgroundPosition='';return}
        var p=Math.max(0,Math.min(100,50+d/16));
        it.el.style.backgroundPosition='0 0, 50% '+p.toFixed(1)+'%';
      }
    });
  }
  function req(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',req,{passive:true}); window.addEventListener('resize',req); window.addEventListener('load',req);
  update();
})();

(function(){
  /* swipe rows on phones: progress bar under each row */
  var rows=document.querySelectorAll('.trust-row,.fgrid,.svc-strip,.cs-grid,.media-grid2,.deck,.ogrid');
  rows.forEach(function(r){
    if(r.children.length<2)return;
    r.classList.add('mrow');
    var bar=document.createElement('div');bar.className='car-bar';bar.setAttribute('aria-hidden','true');
    var i=document.createElement('i');bar.appendChild(i);r.parentNode.insertBefore(bar,r.nextSibling);
    function u(){var sw=r.scrollWidth,cw=r.clientWidth;if(sw<=cw+2){bar.classList.add('none');return}bar.classList.remove('none');
      i.style.width=(cw/sw*100)+'%';i.style.left=(r.scrollLeft/sw*100)+'%'}
    r.addEventListener('scroll',function(){requestAnimationFrame(u)},{passive:true});
    window.addEventListener('resize',u);window.addEventListener('load',u);u();
  });
  /* long event timelines: show the first six on phones */
  document.querySelectorAll('.tl-cols').forEach(function(t){
    var n=t.children.length;if(n<=8)return;
    t.classList.add('tl-clip');
    var b=document.createElement('button');b.type='button';b.className='tl-more';
    b.innerHTML='Show all '+n+' events';
    b.addEventListener('click',function(){var o=t.classList.toggle('tl-open');b.innerHTML=o?'Show fewer events':'Show all '+n+' events';if(!o)t.scrollIntoView({block:'start'})});
    t.parentNode.insertBefore(b,t.nextSibling);
  });
})();
(function(){
  var mq=window.matchMedia('(max-width:760px)');
  var cols=document.querySelectorAll('.footer-card .foot-grid>div:not(.foot-brand)');
  cols.forEach(function(c){
    var h=c.querySelector('h4');if(!h)return;
    h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');
    function t(){if(!mq.matches)return;var o=c.classList.toggle('open');h.setAttribute('aria-expanded',o?'true':'false')}
    h.addEventListener('click',t);
    h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}});
    c.classList.add('fa');
  });
})();

(function(){
  document.querySelectorAll('.mobile-menu .group').forEach(function(g){
    var s=g.querySelector(':scope>span');if(!s)return;
    s.setAttribute('role','button');s.setAttribute('tabindex','0');s.setAttribute('aria-expanded','false');
    function t(){var o=g.classList.toggle('open');s.setAttribute('aria-expanded',o?'true':'false')}
    s.addEventListener('click',t);
    s.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}});
  });
})();

(function(){
  /* swipe rows advance on their own on phones; pause while someone is touching them */
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var mq=window.matchMedia('(max-width:760px)');
  var rows=document.querySelectorAll('.mrow,.vals-track');
  rows.forEach(function(r){
    var visible=false,hold=false,resume;
    function scrollable(){return mq.matches&&r.scrollWidth>r.clientWidth+4}
    function step(){
      if(!visible||hold||document.hidden||!scrollable())return;
      if(r.scrollLeft+r.clientWidth>=r.scrollWidth-6){r.scrollTo({left:0,behavior:'smooth'});return}
      var base=r.getBoundingClientRect().left+parseFloat(getComputedStyle(r).paddingLeft||0);
      var kids=r.children,next=null;
      for(var i=0;i<kids.length;i++){var d=kids[i].getBoundingClientRect().left-base;if(d>8){next=d;break}}
      if(next===null){r.scrollTo({left:0,behavior:'smooth'});return}
      r.scrollBy({left:next,behavior:'smooth'});
    }
    function pause(){hold=true;clearTimeout(resume)}
    function later(){clearTimeout(resume);resume=setTimeout(function(){hold=false},6000)}
    ['touchstart','pointerdown','wheel','mouseenter','focusin'].forEach(function(e){r.addEventListener(e,pause,{passive:true})});
    ['touchend','touchcancel','pointerup','mouseleave','focusout'].forEach(function(e){r.addEventListener(e,later,{passive:true})});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting},{threshold:.5}).observe(r)}else{visible=true}
    setInterval(step,r.classList.contains('trust-row')?2600:4200);
  });
})();
