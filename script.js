// ============================================================
//  DAFTAR PROYEK: edit di sini untuk menambah proyek & gambar.
//  Taruh file gambar di folder "gambar/", lalu tulis namanya.
//  Gambar pertama jadi sampul kartu; semua gambar muncul di galeri.
//  kategori: "aplikasi", "game", atau "web"
// ============================================================
const PROYEK = [
  { judul: "Translator_app", kategori: "aplikasi", tahun: 2026,
    deskripsi: "Aplikasi translator eng-ing sederhana untuk Android.",
    gambar: ["gambar/IMG_20261021_104527.png", "gambar/IMG_20261021_105052.jpg"], link: "#" },
  { judul: "web grupparasetboy", kategori: "web", tahun: 2025,
    deskripsi: "Ini adalah web yang saya rancang dengan tujuan menyimpan berbagai memori dari grup pertemanan yang saya buat. web ini menjadi salah satu web yg berhasil saya hosting dan masih berjalan sampai sekarang",
    gambar: ["gambar/IMG_20261021_142421.jpg", "gambar/IMG_20261021_142654.jpg"], link: "#" },
      { judul: "Mini game", kategori: "Game", tahun: 2026,
    deskripsi: "Mini game ini saya buat sebagai produk sampingan, pelepas kebosanan",
    gambar: ["gambar/IMG_20261022_003325.jpg"], link: "#" },
  ];

const root = document.documentElement;
const bolehGerak = !matchMedia('(prefers-reduced-motion: reduce)').matches;

// ----- Kartu proyek -----
const grid = document.querySelector('#grid');
PROYEK.forEach((p, i) => {
  const kartu = document.createElement('article');
  kartu.className = 'kartu';
  kartu.dataset.kategori = p.kategori;
  kartu.dataset.reveal = '';
  kartu.style.setProperty('--i', i % 3);
  const ada = p.gambar.length > 0;
  kartu.innerHTML = `
    <button type="button" class="kartu-btn" aria-label="Lihat ${p.judul}">
      <figure class="thumb${ada ? '' : ' kosong'}" data-huruf="${p.judul.charAt(0)}">
        ${ada ? `<img src="${p.gambar[0]}" alt="" loading="lazy">` : ''}
      </figure>
      <span class="isi">
        <span class="judul">${p.judul}</span>
        <span class="deskripsi">${p.deskripsi}</span>
        <span class="meta">${p.kategori}, ${p.tahun}${ada ? `, ${p.gambar.length} foto` : ''}</span>
      </span>
    </button>`;
  const img = kartu.querySelector('img');
  if (img) img.addEventListener('error', () => img.parentElement.classList.add('kosong'));
  kartu.querySelector('button').addEventListener('click', () => bukaGaleri(p));
  grid.appendChild(kartu);
});

// ----- Filter dengan animasi -----
const tombolFilter = document.querySelectorAll('.filter button');
tombolFilter.forEach((tombol) => tombol.addEventListener('click', () => {
  const pilihan = tombol.dataset.filter;
  tombolFilter.forEach((b) => b.setAttribute('aria-pressed', String(b === tombol)));
  let n = 0;
  grid.querySelectorAll('.kartu').forEach((k) => {
    const cocok = pilihan === 'semua' || k.dataset.kategori === pilihan;
    k.hidden = !cocok;
    if (cocok) {
      k.style.setProperty('--i', n++);
      k.classList.remove('baru'); void k.offsetWidth; k.classList.add('baru');
    }
  });
}));

// ----- Galeri (lightbox) -----
const lb = document.querySelector('#lightbox');
const lbImg = document.querySelector('#lb-img');
const lbNo = document.querySelector('#lb-no');
const lbPrev = document.querySelector('#lb-prev');
const lbNext = document.querySelector('#lb-next');
const lbLink = document.querySelector('#lb-link');
let aktif = null, pos = 0;

function tampilFoto() {
  const g = aktif.gambar;
  lbImg.hidden = g.length === 0;
  if (g.length) { lbImg.src = g[pos]; lbImg.alt = `${aktif.judul}, foto ${pos + 1}`; }
  lbNo.textContent = g.length ? `${pos + 1} / ${g.length}` : '';
  lbPrev.disabled = lbNext.disabled = g.length < 2;
}
function bukaGaleri(p) {
  aktif = p; pos = 0;
  document.querySelector('#lb-judul').textContent = p.judul;
  document.querySelector('#lb-desk').textContent = p.deskripsi;
  lbLink.href = p.link || '#';
  lbLink.hidden = !p.link || p.link === '#';
  tampilFoto();
  lb.showModal();
}
function geser(d) {
  const n = aktif.gambar.length;
  if (n < 2) return;
  pos = (pos + d + n) % n;
  tampilFoto();
}
lbPrev.addEventListener('click', () => geser(-1));
lbNext.addEventListener('click', () => geser(1));
document.querySelector('#lb-tutup').addEventListener('click', () => lb.close());
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') geser(-1);
  if (e.key === 'ArrowRight') geser(1);
});

// ----- Muncul saat di-scroll -----
const io = new IntersectionObserver((daftar) => daftar.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('tampil'); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el) => {
  if (bolehGerak) io.observe(el); else el.classList.add('tampil');
});

// ----- Progres scroll + parallax bola -----
let menunggu = false;
addEventListener('scroll', () => {
  if (menunggu) return;
  menunggu = true;
  requestAnimationFrame(() => {
    const maks = root.scrollHeight - innerHeight;
    root.style.setProperty('--p', maks > 0 ? scrollY / maks : 0);
    if (bolehGerak) root.style.setProperty('--sy', scrollY);
    menunggu = false;
  });
}, { passive: true });

// ----- Nama di hero: lapisan pink mengikuti pointer -----
const hero = document.querySelector('#hero');
if (bolehGerak && hero) {
  hero.addEventListener('pointermove', (e) => {
    const k = hero.getBoundingClientRect();
    hero.style.setProperty('--dx', `${7 + ((e.clientX - k.left) / k.width - 0.5) * 28}px`);
    hero.style.setProperty('--dy', `${4 + ((e.clientY - k.top) / k.height - 0.5) * 18}px`);
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.removeProperty('--dx'); hero.style.removeProperty('--dy');
  });
}

// ----- Teks mengetik di intro -----
const kata = ['aplikasi Android', 'game dan mod', 'website dengan gaya sendiri'];
const ketik = document.querySelector('#ketik');
if (bolehGerak && ketik) {
  let k = 0, h = 0, hapus = false;
  (function jalan() {
    const w = kata[k];
    ketik.textContent = w.slice(0, h);
    if (!hapus && h === w.length) { hapus = true; return setTimeout(jalan, 1600); }
    if (hapus && h === 0) { hapus = false; k = (k + 1) % kata.length; }
    h += hapus ? -1 : 1;
    setTimeout(jalan, hapus ? 35 : 70);
  })();
}

// ----- Pita berjalan: gandakan isi agar putarannya mulus -----
const jalur = document.querySelector('#jalur');
if (jalur) jalur.innerHTML += jalur.innerHTML;

// ----- Tahun footer -----
const tahunEl = document.querySelector('#tahun');
if (tahunEl) tahunEl.textContent = new Date().getFullYear();

// ============================================================
//  MINI GAME: SKY JUMP (VERSI MINI & MINIMALIS)
// ============================================================
const cvs = document.getElementById('skyCanvas');
if (cvs) {
  const ctx = cvs.getContext('2d');
  const scoreTxt = document.getElementById('sj-score');

  cvs.width = 380;
  cvs.height = 180;

  let W = cvs.width;
  let H = cvs.height;
  let score = 0;

  // Karakter Rubik Dibuat Lebih Kecil
  const player = {
    x: W / 2 - 10,
    y: H - 60,
    w: 20,
    h: 20,
    vx: 0,
    vy: -7.5,
    gravity: 0.32,
    jumpPower: -8.2,
    facing: 'right'
  };

  // Awan Latar Belakang Mini
  const clouds = [
    { x: 50, y: 30, speed: 0.3, w: 60, h: 20 },
    { x: 200, y: 80, speed: 0.5, w: 50, h: 18 },
    { x: 320, y: 130, speed: 0.25, w: 70, h: 22 }
  ];

  let platforms = [];

  function initGame() {
    score = 0;
    if (scoreTxt) scoreTxt.textContent = '0';
    player.x = W / 2 - 10;
    player.y = H - 50;
    player.vx = 0;
    player.vy = player.jumpPower;

    platforms = [];
    platforms.push({ x: W / 2 - 25, y: H - 20, w: 50, h: 8 });
    
    for (let i = 1; i < 4; i++) {
      platforms.push({
        x: Math.random() * (W - 50) + 10,
        y: H - (i * 42),
        w: 42,
        h: 8
      });
    }
  }

  function drawCloud(c) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.strokeStyle = '#1b1848';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.h / 1.2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(c.x + c.w * 0.4, c.y - c.h * 0.4, c.h * 0.9, Math.PI, Math.PI * 2);
    ctx.arc(c.x + c.w * 0.8, c.y, c.h / 1.2, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);

    ctx.fillStyle = '#ff5fa2';
    ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
    ctx.strokeStyle = '#1b1848';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-player.w / 2, -player.h / 2, player.w, player.h);

    // Kisi-kisi Rubik Mini
    ctx.beginPath();
    ctx.moveTo(-player.w / 2 + 6.6, -player.h / 2); ctx.lineTo(-player.w / 2 + 6.6, player.h / 2);
    ctx.moveTo(-player.w / 2 + 13.3, -player.h / 2); ctx.lineTo(-player.w / 2 + 13.3, player.h / 2);
    ctx.moveTo(-player.w / 2, -player.h / 2 + 6.6); ctx.lineTo(player.w / 2, -player.h / 2 + 6.6);
    ctx.moveTo(-player.w / 2, -player.h / 2 + 13.3); ctx.lineTo(player.w / 2, -player.h / 2 + 13.3);
    ctx.strokeStyle = 'rgba(27, 24, 72, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Mata Kecil
    ctx.fillStyle = '#1b1848';
    const eo = player.facing === 'right' ? 1.5 : -1.5;
    ctx.fillRect(-3 + eo, -2, 1.5, 2.5);
    ctx.fillRect(1.5 + eo, -2, 1.5, 2.5);

    ctx.restore();
  }

  function update() {
    clouds.forEach(c => {
      c.x -= c.speed;
      if (c.x < -80) c.x = W + 80;
    });

    player.vy += player.gravity;
    player.y += player.vy;
    player.x += player.vx;

    if (player.x < -player.w) player.x = W;
    if (player.x > W) player.x = -player.w;

    if (player.vy > 0) {
      platforms.forEach(p => {
        if (
          player.x + player.w > p.x &&
          player.x < p.x + p.w &&
          player.y + player.h >= p.y &&
          player.y + player.h <= p.y + p.h + 6
        ) {
          player.vy = player.jumpPower;
        }
      });
    }

    if (player.y < H / 2.5) {
      const diff = H / 2.5 - player.y;
      player.y = H / 2.5;
      score += Math.floor(diff);
      if (scoreTxt) scoreTxt.textContent = score;

      platforms.forEach(p => {
        p.y += diff;
        if (p.y > H + 15) {
          p.y = -10;
          p.x = Math.random() * (W - 50) + 10;
        }
      });
    }

    if (player.y > H + 30) {
      initGame();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    clouds.forEach(c => drawCloud(c));

    platforms.forEach(p => {
      ctx.fillStyle = '#2b3fd6';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.strokeStyle = '#1b1848';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#ffd84a';
      ctx.fillRect(p.x + 1.5, p.y + 1.5, p.w - 3, 2);
    });

    drawPlayer();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'a', 'A'].includes(e.key)) { player.vx = -4; player.facing = 'left'; }
    if (['ArrowRight', 'd', 'D'].includes(e.key)) { player.vx = 4; player.facing = 'right'; }
  });
  window.addEventListener('keyup', e => {
    if (['ArrowLeft', 'a', 'A', 'ArrowRight', 'd', 'D'].includes(e.key)) player.vx = 0;
  });

  cvs.addEventListener('touchstart', e => {
    const rect = cvs.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    player.vx = x < rect.width / 2 ? -4 : 4;
  }, { passive: true });
  
  cvs.addEventListener('touchend', () => { player.vx = 0; });

  initGame();
  loop();
}
