const heroInner = document.getElementById('heroInner');
const heroProfile = document.getElementById('heroProfile');
const heroTitleAnchor = document.getElementById('heroTitleAnchor');
const root = document.documentElement;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function placeHeroTitleAnchor() {
  const heroRect = heroInner.getBoundingClientRect();
  const imgRect = heroProfile.getBoundingClientRect();
  if (!imgRect.width || !imgRect.height) return;

  const imgLeft = imgRect.left - heroRect.left;
  const imgTop = imgRect.top - heroRect.top;
  const imgWidth = imgRect.width;
  const imgHeight = imgRect.height;

  const isMobile = window.innerWidth <= 768;

  const headCenterX = imgLeft + imgWidth * 0.5;
  const headCenterY = imgTop + imgHeight * (isMobile ? 0.185 : 0.175);

  const titleSize = clamp(
    imgWidth * (isMobile ? 0.17 : 0.19),
    isMobile ? 38 : 54,
    isMobile ? 62 : 110
  );

  const anchorWidth = titleSize * (isMobile ? 3.8 : 4.8);
  const anchorHeight = titleSize * (isMobile ? 1.9 : 2.3);

  let anchorX = headCenterX;
  let anchorY = headCenterY + imgHeight * (isMobile ? -0.01 : -0.015);

  const padX = isMobile ? 12 : 24;
  const padY = isMobile ? 8 : 12;

  anchorX = clamp(anchorX, anchorWidth / 2 + padX, heroRect.width - anchorWidth / 2 - padX);
  anchorY = clamp(anchorY, anchorHeight / 2 + padY, heroRect.height - anchorHeight / 2 - padY);

  root.style.setProperty('--anchor-x', `${anchorX}px`);
  root.style.setProperty('--anchor-y', `${anchorY}px`);
  root.style.setProperty('--anchor-size', `${titleSize}px`);
}

const lenis = new Lenis({
  duration: 1.05,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
  autoRaf: true
});

let resizeTimer;

function refreshHeroLayout() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    placeHeroTitleAnchor();
    requestAnimationFrame(placeHeroTitleAnchor);
  }, 20);
}

if (heroProfile.complete) {
  placeHeroTitleAnchor();
  requestAnimationFrame(placeHeroTitleAnchor);
  setTimeout(placeHeroTitleAnchor, 60);
} else {
  heroProfile.addEventListener('load', () => {
    placeHeroTitleAnchor();
    requestAnimationFrame(placeHeroTitleAnchor);
    setTimeout(placeHeroTitleAnchor, 60);
  });
}

window.addEventListener('resize', refreshHeroLayout);
window.addEventListener('orientationchange', refreshHeroLayout);
window.addEventListener('load', () => {
refreshHeroLayout();

});