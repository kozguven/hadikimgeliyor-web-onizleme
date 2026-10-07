(function(){
  var html=document.documentElement;
  var azHareket=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var headless=/HeadlessChrome/.test(navigator.userAgent);
  var cerceve=window.self!==window.top;
  if(!azHareket&&!headless&&!cerceve){html.classList.add('oynat');}

  // Dönen kelime
  var k=document.querySelector('.donen .kelime');
  if(k&&!azHareket&&!headless&&!cerceve){
    var sozler=['kahve','pub','konser','maça','yürüyüşe','kaçamağa'];var i=0;
    setInterval(function(){i=(i+1)%sozler.length;k.textContent=sozler[i];},1800);
  }

  // Hamburger
  var hb=document.querySelector('.hamburger'),menu=document.getElementById('menu');
  if(hb&&menu){hb.addEventListener('click',function(){var a=menu.classList.toggle('acik');hb.setAttribute('aria-expanded',a?'true':'false');});}

  // Ekranlar
  var ek=document.querySelector('.ekranlar');
  if(ek){var b=ek.querySelector('button');b.addEventListener('click',function(){var a=ek.classList.toggle('acik');b.setAttribute('aria-expanded',a?'true':'false');});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){ek.classList.remove('acik');b.setAttribute('aria-expanded','false');}});}

  // İletişim formu (demo)
  var f=document.querySelector('form.form');
  if(f){f.addEventListener('submit',function(e){e.preventDefault();f.classList.add('gonderildi');var s=f.querySelector('.basari');if(s){s.focus();}});}

  // Katılma talebi (demo)
  document.querySelectorAll('[data-talep]').forEach(function(btn){btn.addEventListener('click',function(e){e.preventDefault();btn.textContent='Talebin gönderildi';btn.classList.remove('btn-ana');btn.classList.add('btn-lac');});});
})();
