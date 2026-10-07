(function(){
  var azHareket = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobil.html içindeki çerçeveler: Ekranlar düğmesini gizle
  if (/[?&]cerceve=1/.test(location.search)) {
    document.documentElement.classList.add('cerceve');
    // Baskıda iframe kaydırması çalışmadığı için: hedef bölümden önceki içerik gizlenir
    var hedef = location.hash && document.getElementById(location.hash.slice(1));
    if (hedef && hedef.parentNode && hedef.parentNode.tagName === 'MAIN') {
      var el = hedef.previousElementSibling;
      while (el) { el.style.display = 'none'; el = el.previousElementSibling; }
      window.scrollTo(0, 0);
    }
  }

  // Hamburger
  var md = document.querySelector('.menu-dugme'), menu = document.getElementById('menu');
  if (md && menu) md.addEventListener('click', function(){
    var acik = menu.classList.toggle('acik');
    md.setAttribute('aria-expanded', acik ? 'true' : 'false');
  });

  // Dönen "Hadi ..." kelimesi
  var don = document.querySelector('.don');
  if (don && !azHareket) {
    var k = [' kahve?', ' pub?', ' konser?', ' maça?', ' yürüyüşe?', ', kim geliyor?'], i = k.length - 1;
    setInterval(function(){ i = (i + 1) % k.length; don.textContent = k[i]; }, 1800);
  }

  // Katılma talebi butonları
  document.querySelectorAll('.talep').forEach(function(b){
    b.addEventListener('click', function(){
      var g = b.classList.toggle('gonderildi');
      b.textContent = g ? 'Talebin gönderildi' : 'Katılma talebi';
      b.setAttribute('aria-pressed', g ? 'true' : 'false');
    });
  });

  // İletişim formu
  var f = document.querySelector('form.form');
  if (f) f.addEventListener('submit', function(e){
    e.preventDefault(); f.classList.add('gonderildi');
    var s = f.querySelector('.form-basari'); if (s) { s.setAttribute('tabindex','-1'); s.focus(); }
  });

  // Plan oluştur demosu
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var paneller = demo.querySelectorAll('.panel'), sekmeler = demo.querySelectorAll('.demo-adimlar button');
  var ileri = demo.querySelector('.ileri'), geri = demo.querySelector('.geri'), cubuk = demo.querySelector('.ilerleme b');
  var say = demo.querySelector('.adim-say'), notlar = demo.querySelectorAll('[data-not]');
  var n = paneller.length, simdi = 0, yayinda = false;
  var secim = {kat:'Konser', katc:'var(--konser)', yer:'Harbiye Açıkhava', gun:'Cuma', saat:'21:00', kisi:3, yas:'24–32', hesap:'Birlikte karar veririz'};

  function ozetYaz(){
    var o = demo.querySelector('.ozet'); if (!o) return;
    o.querySelector('.cip').textContent = secim.kat;
    o.querySelector('.cip').style.setProperty('--c', secim.katc);
    o.querySelector('b').textContent = 'Hadi ' + secim.kat.toLowerCase() + ', kim geliyor?';
    o.querySelector('[data-o=yer]').textContent = secim.yer;
    o.querySelector('[data-o=zaman]').textContent = secim.gun + ', ' + secim.saat;
    o.querySelector('[data-o=kisi]').textContent = secim.kisi + ' kişilik grup, ' + (secim.kisi - 1) + ' kişi aranıyor';
    o.querySelector('[data-o=yas]').textContent = secim.yas + ' yaş';
    o.querySelector('[data-o=hesap]').textContent = secim.hesap;
  }
  function git(h){
    simdi = Math.max(0, Math.min(n - 1, h)); yayinda = false;
    paneller.forEach(function(p, j){ p.classList.toggle('akt', j === simdi); });
    demo.querySelector('.basari').hidden = true;
    sekmeler.forEach(function(s, j){
      if (j === simdi) s.setAttribute('aria-current','step'); else s.removeAttribute('aria-current');
      s.classList.toggle('bitti', j < simdi);
    });
    notlar.forEach(function(x, j){ x.hidden = j !== simdi; });
    cubuk.style.width = ((simdi + 1) / n * 100) + '%';
    say.textContent = 'Adım ' + (simdi + 1) + ' / ' + n;
    ileri.textContent = simdi === n - 1 ? 'Yayınla' : 'Devam Et';
    geri.style.visibility = simdi === 0 ? 'hidden' : 'visible';
    ozetYaz();
  }
  sekmeler.forEach(function(s, j){ s.addEventListener('click', function(){ git(j); }); });
  geri.addEventListener('click', function(){ git(simdi - 1); });
  ileri.addEventListener('click', function(){
    if (simdi < n - 1) return git(simdi + 1);
    if (yayinda) return git(0);
    yayinda = true;
    paneller[simdi].classList.remove('akt');
    demo.querySelector('.basari').hidden = false;
    ileri.textContent = 'Yeni plan oluştur';
    sekmeler[simdi].classList.add('bitti');
  });
  // Seçim grupları
  demo.querySelectorAll('[data-grup]').forEach(function(g){
    var ad = g.getAttribute('data-grup');
    g.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){
        g.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed','false'); });
        b.setAttribute('aria-pressed','true');
        secim[ad] = b.getAttribute('data-v');
        if (ad === 'kat') secim.katc = b.getAttribute('data-c');
        ozetYaz();
      });
    });
  });
  var cikti = demo.querySelector('.sayac output');
  demo.querySelectorAll('.sayac button').forEach(function(b){
    b.addEventListener('click', function(){
      secim.kisi = Math.max(2, Math.min(6, secim.kisi + (+b.getAttribute('data-d'))));
      cikti.textContent = secim.kisi; ozetYaz();
    });
  });
  git(0);
})();
