(function(){
  var root=document.documentElement;
  try{ if(window.self!==window.top) root.classList.add('in-frame'); }catch(e){ root.classList.add('in-frame'); }
  // mobil.html çerçeveleri: ?bolum=x ile önceki bölümler gizlenir (baskıda kaydırma gerekmez)
  var bolum=new URLSearchParams(location.search).get('bolum');
  if(bolum&&root.classList.contains('in-frame')){
    var t=document.getElementById(bolum), m=document.querySelector('main');
    if(t&&m){ while(t.parentElement&&t.parentElement!==m) t=t.parentElement; var n=t.previousElementSibling; while(n){ n.style.display='none'; n=n.previousElementSibling; } }
  }
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hamburger menü
  var mb=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(mb&&nav){
    mb.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      mb.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.focus();} });
  }

  // Dönen "Hadi ..." satırı
  var rot=document.querySelector('.rot');
  if(rot&&!reduce&&!root.classList.contains('in-frame')){
    var pre=rot.querySelector('.p'), w=rot.querySelector('.w');
    var seq=[['Hadi','kahve?'],['Hadi','pub?'],['Hadi','konser?'],['Hadi','maça?'],['Hadi,','kim geliyor?']];
    var i=0;
    function show(){
      w.classList.add('out');
      setTimeout(function(){
        pre.textContent=seq[i][0]; w.textContent=seq[i][1];
        w.classList.remove('out');
        var last=(i===seq.length-1);
        i=(i+1)%seq.length;
        setTimeout(show,last?4200:1900);
      },400);
    }
    setTimeout(show,1600);
  }

  // Plan şeridi okları
  document.querySelectorAll('[data-scroll]').forEach(function(b){
    b.addEventListener('click',function(){
      var t=document.getElementById(b.getAttribute('data-target'));
      if(!t) return;
      t.scrollBy({left:(b.getAttribute('data-scroll')==='next'?1:-1)*Math.min(660,t.clientWidth*.85),behavior:reduce?'auto':'smooth'});
    });
  });

  // İletişim formu (ön tasarım: gönderim yok, başarı durumu gösterilir)
  var f=document.querySelector('form.form');
  if(f){
    var p=new URLSearchParams(location.search).get('tur');
    if(p){ var s=f.querySelector('select'); if(s) s.value=p; }
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!f.checkValidity()){ f.reportValidity(); return; }
      f.classList.add('sent');
      var ok=f.querySelector('.success'); if(ok){ ok.setAttribute('tabindex','-1'); ok.focus(); }
    });
  }

  // Ekranlar menüsü dışarı tıklayınca kapanır
  var sc=document.querySelector('.screens');
  if(sc){ document.addEventListener('click',function(e){ if(sc.open&&!sc.contains(e.target)) sc.open=false; }); }
})();
