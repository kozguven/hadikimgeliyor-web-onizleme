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

/* ===== Hadi Asistan (ön tasarım: kural tabanlı örnek cevaplar) ===== */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var J='index.html#indir';
  // Sıra önemli: daha özel niyetler önce
  var INT=[
    {id:'ucret',k:['ucret','para','fiyat','bedava','paket','uyelik','abonelik','odeme yap','kac lira','tl'],a:'Katılmak ücretsiz; bireysel plan açmak tanıtım döneminde ücretsiz. Paketler yakında açıklanacak.',c:['Bireysel & Ticari','ticari.html']},
    {id:'red',k:['reddet','red','kabul edilmez','onaylanmaz','kabul etmezse','onaylamazsa'],a:'Bir şey olmaz. Başka bir plana talep gönderebilir ya da kendi planını açabilirsin.',c:['Planlara bak','index.html#planlar']},
    {id:'kac_kisi',k:['kac kisi','kisilik','kalabalik','kisi sayisi','kac kisilik'],a:'Bireysel planlar 6 kişiye kadar. Daha kalabalık etkinlikler ticari üyelikle açılır.',c:['Bireysel & Ticari','ticari.html']},
    {id:'bu_aksam',k:['bu aksam','ne yapsam','ne yapalim','oneri','oner','sikildim','canim sikil','bugun','plan var mi','etkinlik var mi'],a:'Mesela bu akşam Moda\'da bir pub planı var, 2 kişi aranıyor:',card:true,c:['Katılma talebi',J]},
    {id:'dating',k:['dating','flort','sevgili','tinder','eslesme','date','romantik','tanisma','arkadas bul'],a:'Hayır. Hadi\'de merkezde kişi değil plan var; aynı şeyi yapmak isteyenler plana katılmak için talep gönderir.',c:['Nasıl Çalışır\'a bak','nasil-calisir.html']},
    {id:'guven',k:['guven','dogrula','sms','sikayet','taciz','tehlike','risk','emniyet'],a:'Telefonlar SMS ile doğrulanır, katılımı plan sahibi onaylar, sohbet yalnız kabul edilenlere açılır. Şikâyet menüsü de var.',c:['Güvenli Buluşma','guvenli-bulusma.html']},
    {id:'ticari',k:['ticari','mekan','organizator','atolye','isletme','marka','kafe sahib','restoran'],a:'6 kişiden kalabalık etkinlikler ticari üyelikle açılır. Ticari ekibimize yazabilirsin.',c:['Ticari üyeliği incele','iletisim.html?tur=ticari#form']},
    {id:'ismarla',k:['ismarl','hesap','kim oder','kim oduyor','odeme','kim ode'],a:'Hesabı plan sahibi belirler: herkes kendi öder, ben ısmarlıyorum ya da birlikte karar veririz.'},
    {id:'plan_ac',k:['plan ac','plan olustur','plan kur','nasil plan','plani ac','plan acar','yayinla','plan yap'],a:'Aktiviteyi, yeri, zamanı, kişi sayısını ve hesap tercihini seç, yayınla. Bir dakikanı alır.',c:['Nasıl Çalışır\'a bak','nasil-calisir.html']},
    {id:'katil',k:['katil','talep','basvur','dahil'],a:'Plana katılma talebi gönder. Plan sahibi onaylarsa plan sohbetine eklenirsin.',c:['Hadi\'ye Katıl',J]},
    {id:'sehir',k:['sehir','istanbul','ankara','izmir','bursa','antalya','eskisehir','nerede','hangi il'],a:'Şu an İstanbul, Ankara ve İzmir\'de. Bursa, Antalya ve Eskişehir yakında.',c:['İstanbul planları','sehir-istanbul.html']},
    {id:'yas',k:['yas ','yas sinir','kac yas','18','yasinda','yasim','genc','cocuk'],a:'Uygulama 18 yaş ve üzeri içindir. Plan sahibi planına yaş aralığı da ekler.'},
    {id:'sohbet',k:['sohbet','mesaj','konus','yazis'],a:'Plan sohbeti yalnız kabul edilen katılımcılara açılır; buluşma detaylarını orada konuşursunuz.'},
    {id:'foto',k:['foto','ani','konum','resim'],a:'Buluşmadan sonra fotoğraflarını Hadi Anıları\'na ekleyebilirsin; konum bilgisi otomatik silinir.'},
    {id:'bildirim',k:['bildirim','sessiz','rahatsiz etme'],a:'Bildirim tercihlerini ve sessiz saatleri sen ayarlarsın.'},
    {id:'indir',k:['indir','uygulama','app store','google play','android','ios','iphone','telefon'],a:'Hadi iOS ve Android\'de. İndir, telefonunu doğrula, başla.',c:['Hadi\'ye Katıl',J]},
    {id:'aktivite',k:['aktivite','kategori','konser','mac','kahve','pub','yuruyus','kosu','kutu oyunu'],a:'Kahveden konsere, maçtan hafta sonu kaçamağına; her plan için bir kategori var.',c:['Aktiviteler','aktiviteler.html']},
    {id:'iletisim',k:['iletisim','destek','e posta','eposta','mail','ulas','yardim'],a:'Ekibimize iletişim sayfasından ulaşabilirsin.',c:['İletişim','iletisim.html']},
    {id:'selam',k:['selam','merhaba','hey','naber','slm'],a:'Selam! Plan, katılım, ücret ya da güvenlik; ne merak ediyorsan sor.'}
  ];
  var BY={}; INT.forEach(function(x){BY[x.id]=x;});
  var FALL={a:'Bunu henüz bilmiyorum; ekibimize iletişim sayfasından sorabilirsin.',c:['İletişim','iletisim.html']};
  function norm(s){
    return (' '+s.toLocaleLowerCase('tr-TR')+' ').replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[âà]/g,'a').replace(/î/g,'i').replace(/û/g,'u').replace(/[^a-z0-9]+/g,' ');
  }
  function match(t){
    var n=norm(t);
    for(var i=0;i<INT.length;i++){ for(var j=0;j<INT[i].k.length;j++){ if(n.indexOf(' '+INT[i].k[j])>-1) return INT[i]; } }
    return FALL;
  }
  function el(tag,cls,txt){var e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e;}
  function card(){
    var a=el('a','mini-tk'); a.href='index.html#planlar';
    a.innerHTML='<img src="../assets/img/pub.jpg" alt="Pubda sohbet eden grup"><span class="tk"><span class="chip" style="--c:#FFE9CA">Pub &amp; Bar</span><b>Moda\'da bir pub</b><span class="tk-s"><span>Bu akşam 20:30</span><span>2 kişi aranıyor</span></span></span>';
    return a;
  }
  function Inst(root){
    var log=root.querySelector('.asst-log'), form=root.querySelector('.asst-form'), inp=form.querySelector('input'), busy=false, still=false;
    function scroll(){ log.scrollTop=log.scrollHeight; }
    function add(cls,text){ var m=el('div','msg '+cls+((reduce||still)?'':' in')); m.appendChild(el('div','b',text)); log.appendChild(m); scroll(); return m; }
    function answer(x){
      var m=add('bot',x.a);
      if(x.card) m.appendChild(card());
      if(x.c){ var a=el('a','act-chip',x.c[0]); a.href=x.c[1]; m.appendChild(a); }
      scroll(); busy=false;
    }
    function ask(text,x,instant){
      if(busy||!text) return; busy=true; still=!!instant;
      add('user',text);
      x=x||match(text);
      if(reduce||instant){ answer(x); return; }
      setTimeout(function(){
        var t=el('div','msg bot typing in'); var b=el('div','b'); b.setAttribute('aria-label','Hadi Asistan yazıyor');
        b.innerHTML='<i></i><i></i><i></i>'; t.appendChild(b); log.appendChild(t); scroll();
        setTimeout(function(){ t.remove(); answer(x); },850+Math.random()*300);
      },250);
    }
    root.querySelectorAll('.asst-chips button').forEach(function(b){
      b.addEventListener('click',function(){ ask(b.textContent,BY[b.getAttribute('data-q')]); });
    });
    form.addEventListener('submit',function(e){ e.preventDefault(); var v=inp.value.trim(); if(!v) return; inp.value=''; ask(v); });
    this.ask=ask;
  }
  var insts=[];
  document.querySelectorAll('[data-asst]').forEach(function(r){ var i=new Inst(r); r._asst=i; insts.push(i); });

  // Yüzen panel
  var fab=document.querySelector('.asst-fab'), panel=document.getElementById('asst-panel');
  function open(){ panel.hidden=false; fab.setAttribute('aria-expanded','true'); var i=panel.querySelector('input'); if(i) i.focus(); }
  function close(){ panel.hidden=true; fab.setAttribute('aria-expanded','false'); fab.focus(); }
  if(fab&&panel){
    fab.addEventListener('click',open);
    panel.querySelector('.asst-close').addEventListener('click',close);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&!panel.hidden) close(); });
    document.querySelectorAll('[data-open-asst]').forEach(function(b){ b.addEventListener('click',open); });
  }
  // ?soru=ucret : mobil.html çerçevesi ve test için hazır soru
  var q=new URLSearchParams(location.search).get('soru');
  if(q&&BY[q]&&insts.length){
    if(document.documentElement.classList.contains('in-frame')){ var g=document.querySelector('[data-asst] .asst-log .msg'); if(g) g.remove(); document.documentElement.classList.add('asst-demo'); }
    var chip=document.querySelector('[data-asst] [data-q="'+q+'"]');
    insts[0].ask(chip?chip.textContent:q,BY[q],true);
  }
  // Ana sayfa bölümü ekrana gelince bir örnek soru kendiliğinden sorulur (ziyaretçi henüz dokunmadıysa)
  else if(!reduce&&insts.length&&'IntersectionObserver' in window&&!document.documentElement.classList.contains('in-frame')){
    var sec=document.querySelector('[data-asst]'), log0=sec.querySelector('.asst-log');
    var io=new IntersectionObserver(function(es){
      if(!es[0].isIntersecting) return; io.disconnect();
      setTimeout(function(){
        if(log0.querySelectorAll('.msg.user').length) return;
        var c=sec.querySelector('[data-q="dating"]')||sec.querySelector('.asst-chips button');
        if(c) insts[0].ask(c.textContent,BY[c.getAttribute('data-q')]);
      },1400);
    },{threshold:.5});
    io.observe(sec);
  }
  window.__hadiAsst={match:function(t){return match(t).id||'fallback';},insts:insts};
})();
