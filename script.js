/* ══════════════════════════════════════════
   2026 INTERACTIONS
══════════════════════════════════════════ */

/* Dot grid — light theme */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildDots() {
    dots = [];
    const spacing = 46;
    const cols = Math.ceil(W / spacing);
    const rows = Math.ceil(H / spacing);
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        dots.push({
          x: c * spacing,
          y: r * spacing,
          alpha: Math.random() * .18 + .03,
          speed: Math.random() * .006 + .002,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 1;
    dots.forEach(d => {
      const a = d.alpha + Math.sin(t * d.speed + d.phase) * .035;
      ctx.beginPath();
      ctx.arc(d.x, d.y, .9, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,70,229,${Math.max(0, a)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  buildDots();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      buildDots();
    }, 120);
  });
})();

/* Navbar + scroll progress */
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scroll-progress');

function updateScrollUI() {
  const y = window.scrollY;
  navbar?.classList.toggle('scrolled', y > 24);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    progress.style.width = `${pct}%`;
  }
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

/* Active section in nav */
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections = [...document.querySelectorAll('section[id], header[id]')];

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  const id = `#${visible.target.id}`;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === id);
  });
}, {
  rootMargin: '-30% 0px -55% 0px',
  threshold: [0.01, .2, .5]
});

sections.forEach(section => sectionObserver.observe(section));

/* Burger menu */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu?.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  });
});

/* Scroll reveal */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), Math.min(i * 55, 260));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* Cursor glow */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  let gx = window.innerWidth / 2;
  let gy = window.innerHeight / 2;
  let tx = gx, ty = gy;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');

  function animateGlow() {
    gx += (tx - gx) * .12;
    gy += (ty - gy) * .12;
    glow.style.left = `${gx}px`;
    glow.style.top = `${gy}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* Publication card spotlight */
document.querySelectorAll('.pub-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});

/* Subtle 3D tilt for the hero orbit card */
const orbitCard = document.querySelector('.orbit-card');
if (orbitCard && window.matchMedia('(pointer:fine)').matches) {
  orbitCard.addEventListener('mousemove', (e) => {
    const r = orbitCard.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5;
    const py = (e.clientY - r.top) / r.height - .5;
    orbitCard.style.transform =
      `rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-2px)`;
  });
  orbitCard.addEventListener('mouseleave', () => {
    orbitCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/* Carousel */
const slideTrack = document.querySelector('.carousel-slide');
const slideImgs = document.querySelectorAll('.carousel-slide img');
let slideIndex = 0;

function moveSlide(step = 1) {
  if (!slideTrack || !slideImgs.length) return;
  slideIndex = (slideIndex + step + slideImgs.length) % slideImgs.length;
  const imgW = slideImgs[0].clientWidth;
  const gap = 16;
  slideTrack.style.transform = `translateX(${-(slideIndex * (imgW + gap))}px)`;
}
window.moveSlide = moveSlide;

let autoPlay;
function startAutoplay() {
  if (!slideImgs.length) return;
  clearInterval(autoPlay);
  autoPlay = setInterval(() => moveSlide(1), 5000);
}
startAutoplay();

const carouselEl = document.getElementById('carousel');
carouselEl?.addEventListener('mouseenter', () => clearInterval(autoPlay));
carouselEl?.addEventListener('mouseleave', startAutoplay);

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lightImg = lightbox?.querySelector('img');
const lbClose = lightbox?.querySelector('.lb-close');

slideImgs.forEach(img => {
  img.addEventListener('click', () => {
    if (!lightbox || !lightImg) return;
    lightImg.src = img.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}
lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
