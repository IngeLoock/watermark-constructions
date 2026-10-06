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
