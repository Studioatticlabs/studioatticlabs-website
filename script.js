// ============ NAV scroll state ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ============ Mobile nav toggle ============
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  navLinks.style.display = isOpen ? 'none' : 'flex';
  navLinks.style.cssText += isOpen ? '' : `
    position:absolute; top:100%; left:0; right:0;
    flex-direction:column; background:rgba(20,33,21,0.97);
    padding:24px 32px; gap:20px;
  `;
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 900) navLinks.style.display = 'none';
  });
});

// ============ Hero slider ============
const slides = document.querySelectorAll('.hero-slide');
const dotsWrap = document.getElementById('heroDots');
let current = 0;

slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});
const dots = document.querySelectorAll('.hero-dot');

function goToSlide(i) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = i;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

setInterval(() => {
  goToSlide((current + 1) % slides.length);
}, 4500);

// ============ Render-to-Reality compare slider ============
const compare = document.getElementById('compareSlider');
const overlay = document.getElementById('compareOverlay');
const handle = document.getElementById('compareHandle');

function setComparePos(pct) {
  pct = Math.max(2, Math.min(98, pct));
  overlay.style.width = pct + '%';
  handle.style.left = pct + '%';
}

function getPct(clientX) {
  const rect = compare.getBoundingClientRect();
  return ((clientX - rect.left) / rect.width) * 100;
}

let dragging = false;

compare.addEventListener('mousedown', (e) => { dragging = true; setComparePos(getPct(e.clientX)); });
window.addEventListener('mousemove', (e) => { if (dragging) setComparePos(getPct(e.clientX)); });
window.addEventListener('mouseup', () => dragging = false);

compare.addEventListener('touchstart', (e) => { dragging = true; setComparePos(getPct(e.touches[0].clientX)); }, {passive:true});
compare.addEventListener('touchmove', (e) => { if (dragging) setComparePos(getPct(e.touches[0].clientX)); }, {passive:true});
compare.addEventListener('touchend', () => dragging = false);

// init at 50%
setComparePos(50);

// fix overlay image width to match container (for object-fit cover correctness)
function syncOverlayImgWidth() {
  const w = compare.getBoundingClientRect().width;
  overlay.style.setProperty('--ow', w + 'px');
  const img = overlay.querySelector('img');
  img.style.width = w + 'px';
}
window.addEventListener('resize', syncOverlayImgWidth);
syncOverlayImgWidth();

// ============ Render-to-Reality project thumbnails ============
const baseImg = document.getElementById('compareBaseImg');
const overlayImg = document.getElementById('compareOverlayImg');
const thumbs = document.querySelectorAll('.r2r-thumb');

thumbs.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    baseImg.src = thumb.dataset.render;
    overlayImg.src = thumb.dataset.delivered;
    baseImg.alt = thumb.dataset.label + ' render';
    overlayImg.alt = thumb.dataset.label + ' delivered';
    setComparePos(50);
    syncOverlayImgWidth();
  });
});

// ============ FAQ accordion ============
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});
