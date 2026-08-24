/* ══════════════════════════════════════════
   CANVAS BACKGROUND — dot grid
══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / 40);
    const rows = Math.ceil(H / 40);
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        dots.push({ x: c * 40, y: r * 40, alpha: Math.random() * .4 + .05, speed: Math.random() * .008 + .003, phase: Math.random() * Math.PI * 2 });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 1;
    dots.forEach(d => {
      const a = d.alpha + Math.sin(t * d.speed + d.phase) * .1;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${Math.max(0, a)})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  buildDots();
  draw();
  window.addEventListener('resize', () => { resize(); buildDots(); });
})();

/* ══════════════════════════════════════════
   NAVBAR — scroll state
══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ══════════════════════════════════════════
   BURGER MENU
══════════════════════════════════════════ */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ══════════════════════════════════════════
   CAROUSEL
══════════════════════════════════════════ */
const slideTrack = document.querySelector('.carousel-slide');
const slideImgs  = document.querySelectorAll('.carousel-slide img');
let   slideIndex = 0;

function moveSlide(step = 1) {
  slideIndex = (slideIndex + step + slideImgs.length) % slideImgs.length;
  const imgW  = slideImgs[0].clientWidth;
  const gap   = 16;
  slideTrack.style.transform = `translateX(${-(slideIndex * (imgW + gap))}px)`;
}

let autoPlay = setInterval(() => moveSlide(1), 5000);
const carouselEl = document.getElementById('carousel');
carouselEl.addEventListener('mouseenter', () => clearInterval(autoPlay));
carouselEl.addEventListener('mouseleave', () => { autoPlay = setInterval(() => moveSlide(1), 5000); });

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lightImg  = lightbox.querySelector('img');
const lbClose   = lightbox.querySelector('.lb-close');

slideImgs.forEach(img => {
  img.addEventListener('click', () => {
    lightImg.src = img.src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.style.overflow = '';
}
lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
