/* Watermark Constructions: enquiry forms.
   Set data-endpoint on a form (Formspree URL, WordPress REST route, etc.) to send for real.
   With no endpoint the form runs in preview mode: it shows the thank you state and sends nothing. */
(function(){
  var map={insurance:'Insurance Repair',aged:'Aged Care',commercial:'Commercial',careers:'Careers'};
  var sel=document.querySelector('form.bigform select[name=service]');
  var t=new URLSearchParams(location.search).get('type');
  if(sel&&t&&map[t]){sel.value=map[t]}
  if(sel){
    var ins=sel.form.querySelector('.ins-fields');
    var tog=function(){if(ins)ins.style.display=sel.value==='Insurance Repair'?'':'none'};
    sel.addEventListener('change',tog);tog();
  }
  document.querySelectorAll('form.bigform').forEach(function(form){
    var hp=document.createElement('input');
    hp.type='text';hp.name='company_website';hp.tabIndex=-1;hp.autocomplete='off';hp.className='hp';hp.setAttribute('aria-hidden','true');
    form.appendChild(hp);
    form.setAttribute('novalidate','');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return}
      var btn=form.querySelector('.fsubmit');
      var done=function(preview,failed){
        var box=document.createElement('div');box.className='form-done';box.setAttribute('role','status');
        if(failed){
          box.innerHTML='<h3>That did not go through.</h3><p>Please call us on <a href="tel:1300377792">1300 377 792</a> or email <a href="mailto:admin@watermarkconstructions.com.au">admin@watermarkconstructions.com.au</a> and we will help straight away.</p>';
        }else{
          box.innerHTML='<h3>Thanks, we have your message.</h3><p>A member of the team will be in touch within one business day. If it is urgent, or a Make Safe emergency, please call <a href="tel:1300377792">1300 377 792</a> now, any time.</p>'+(preview?'<p class="preview-note">Preview only: this form is not connected yet, so nothing was sent.</p>':'');
        }
        form.style.display='none';form.parentNode.insertBefore(box,form.nextSibling);box.scrollIntoView({block:'center',behavior:'smooth'});
      };
      if(hp.value){done(false);return}
      var ep=form.dataset.endpoint;
      if(!ep){done(true);return}
      if(btn){btn.disabled=true;btn.textContent='Sending...'}
      var data={};new FormData(form).forEach(function(v,k){if(k!=='company_website')data[k]=v});
      data.page=location.href;
      fetch(ep,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)throw 0;done(false)}).catch(function(){done(false,true)});
    });
  });
})();
