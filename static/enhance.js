'use strict';

function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // 로더 시작 - 스크롤 차단
  document.documentElement.style.overflow = 'hidden';
  
  // Lock body position to prevent any pre-existing scroll from applying
  let _lockedScrollY = 0;
  try {
    _lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  } catch (e) {}

  const triggerHeroAnimation = () => {
    const heroTitleAnchor = document.getElementById('heroTitleAnchor');
    const heroFigure = document.querySelector('.hero-figure');
    
    console.log('[Loader] Triggering hero animation:', {
      heroTitleAnchor: !!heroTitleAnchor,
      heroFigure: !!heroFigure,
      readyState: document.readyState
    });
    
    if (heroFigure) {
      // img 자식 요소의 애니메이션을 리셋
      const img = heroFigure.querySelector('img');
      if (img) {
        img.style.animation = 'none';
      }
      void heroFigure.offsetHeight;
      heroFigure.classList.add('loaded');
      setTimeout(() => {
        const img = heroFigure.querySelector('img');
        if (img) {
          img.style.animation = '';
        }
      }, 10);
      console.log('[Loader] Added "loaded" class to heroFigure');
    }
    
    if (heroTitleAnchor) {
      const titleName = heroTitleAnchor.querySelector('.title-name');
      const titleRole = heroTitleAnchor.querySelector('.title-role');
      
      if (titleName) titleName.style.animation = 'none';
      if (titleRole) titleRole.style.animation = 'none';
      
      void heroTitleAnchor.offsetHeight;
      
      heroTitleAnchor.classList.add('loaded');
      
      setTimeout(() => {
        if (titleName) titleName.style.animation = '';
        if (titleRole) titleRole.style.animation = '';
      }, 10);
      
      console.log('[Loader] Added "loaded" class to heroTitleAnchor');
    }
  };

  // Scroll blocking helpers: prevent wheel/touch/key while loader active
  let _scrollBlockerActive = false;
  const _preventScroll = (e) => { e.preventDefault(); return false; };
  const _preventKey = (e) => {
    const code = e.key || e.keyIdentifier || e.keyCode;
    const blocked = [32,33,34,35,36,37,38,39,40];
    if (typeof code === 'string') {
      if ([' ', 'PageDown', 'PageUp', 'End', 'Home', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
        return false;
      }
    } else if (typeof code === 'number') {
      if (blocked.indexOf(code) !== -1) {
        e.preventDefault();
        return false;
      }
    }
  };

  function enableScrollBlockers() {
    if (_scrollBlockerActive) return;
    _scrollBlockerActive = true;
    window.addEventListener('wheel', _preventScroll, { passive: false });
    window.addEventListener('touchmove', _preventScroll, { passive: false });
    window.addEventListener('keydown', _preventKey, { passive: false });
  }

  function disableScrollBlockers() {
    if (!_scrollBlockerActive) return;
    _scrollBlockerActive = false;
    window.removeEventListener('wheel', _preventScroll, { passive: false });
    window.removeEventListener('touchmove', _preventScroll, { passive: false });
    window.removeEventListener('keydown', _preventKey, { passive: false });
  }

  // enable blockers after helpers are defined
  enableScrollBlockers();

  const hide = () => {
    setTimeout(() => {
      loader.classList.add('is-hidden');
      // 로더 종료 - 스크롤 2초간 차단 후 허용
      // (초기 로더에서 이미 차단되어 있으므로 그대로 유지)
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => {
        // 2초 경과 확인 후 고정된 바디 위치 해제하고 원래 스크롤 위치 복원
        try {
          // restore body positioning
          document.body.style.position = '';
          const topVal = document.body.style.top || '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.width = '';
          // restore scroll
          const restoreY = _lockedScrollY || 0;
          window.scrollTo(0, restoreY);
        } catch (e) {}
        document.documentElement.style.overflow = '';
        disableScrollBlockers();
        triggerHeroAnimation();
      }, 2000);
    }, 3200);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hide, { once: true });
  } else {
    hide();
  }
}


function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct.toFixed(2) + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}


function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const targets = 'a, button, .book-card, .chronicle-card, .chronicle-link, .award-item';
  document.querySelectorAll(targets).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


function initReveal() {
  const revealTargets = [
    { selector: '.info-intro-block',    cls: 'reveal'       },
    { selector: '.info-facts',          cls: 'reveal reveal-d1' },
    { selector: '.info-awards-block',   cls: 'reveal reveal-d2' },
    { selector: '.books-copy',          cls: 'reveal'       },
    { selector: '.chronicle-head',      cls: 'reveal'       },
    { selector: '.fact-row',            cls: 'reveal'       },
    { selector: '.award-item',          cls: 'reveal'       },
  ];

  revealTargets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      cls.split(' ').forEach(c => el.classList.add(c));
      if (selector === '.fact-row' || selector === '.award-item') {
        const d = Math.min(i + 1, 5);
        el.classList.add(`reveal-d${d}`);
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}


function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const count    = isMobile ? 10 : 24;

  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 3.5 + 1.2;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 18;
    const duration = Math.random() * 14 + 12;
    const opacity  = Math.random() * 0.35 + 0.08;

    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      animation-duration:${duration}s;
      animation-delay:-${delay}s;
      opacity:${opacity};
    `;
    container.appendChild(p);
  }
}


function initHeroParallax() {
  const img = document.getElementById('heroProfile');
  if (!img) return;

  const update = () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.2) {
      img.style.willChange = 'transform';
      img.style.transform  = `translateY(${scrollY * 0.10}px)`;
    }
  };

  window.addEventListener('scroll', update, { passive: true });
}


function initBookTilt() {
  const cards = document.querySelectorAll('.book-card');

  cards.forEach(card => {
    const cover = card.querySelector('.book-card-cover');
    if (!cover) return;

    card.addEventListener('mousemove', (e) => {
      if (!card.classList.contains('is-active')) return;

      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const y    = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      cover.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      cover.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
      cover.style.transform  = '';
      setTimeout(() => { cover.style.transition = ''; }, 600);
    });

    card.addEventListener('mouseenter', () => {
      cover.style.transition = 'transform 0.12s ease';
    });
  });
}


function typeText(el, text, speed = 22) {
  return new Promise(resolve => {
    el.textContent = '';
    const cursor   = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);

    let i = 0;
    const tick = () => {
      if (i < text.length) {
        if (text[i] === '\n') {
          el.insertBefore(document.createElement('br'), cursor);
        } else {
          el.insertBefore(document.createTextNode(text[i]), cursor);
        }
        i++;
        const jitter = speed + Math.random() * 18;
        setTimeout(tick, jitter);
      } else {
        setTimeout(() => {
          cursor.style.animation = 'none';
          cursor.style.opacity   = '0';
          setTimeout(() => cursor.remove(), 200);
        }, 900);
        resolve();
      }
    };
    tick();
  });
}

function initBookTyping() {
  const cards    = document.querySelectorAll('.book-card');
  const descEl   = document.getElementById('bookPanelDesc');
  const quoteEl  = document.getElementById('bookPanelQuote');
  if (!descEl || !quoteEl) return;

  let typing = false;

  const executeTyping = () => {
    if (typing) return;

    setTimeout(() => {
      const descText  = descEl.textContent.trim();
      const quoteText = quoteEl.textContent.trim();
      if (!descText) return;

      typing = true;
      typeText(descEl, descText, 20).then(() => {
        return typeText(quoteEl, quoteText, 16);
      }).then(() => {
        typing = false;
      });
    }, 60);
  };

  cards.forEach(card => {
    card.addEventListener('bookactivated', executeTyping);
  });
}


function initTimelineLine() {
  const flow = document.querySelector('.chronicle-flow');
  if (!flow) return;

  if (window.matchMedia('(max-width: 980px)').matches) return;

  const line = document.createElement('div');
  line.id = 'timeline-line';
  flow.style.position = 'relative';
  flow.appendChild(line);

  const update = () => {
    const rect     = flow.getBoundingClientRect();
    const winH     = window.innerHeight;
    const scrolled = Math.max(0, winH * 0.55 - rect.top);
    const maxH     = rect.height - 60;
    const ratio    = Math.max(0, Math.min(1, scrolled / maxH));
    line.style.height = (ratio * maxH) + 'px';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}


function initChronicleReveal() {
  document.querySelectorAll('.chronicle-year').forEach(el => {
    const wm   = document.createElement('span');
    wm.className = 'chronicle-year-watermark';
    wm.setAttribute('aria-hidden', 'true');
    wm.textContent = el.textContent.trim();
    el.style.position = 'relative';
    el.appendChild(wm);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.chronicle-card').forEach((card, i) => {
    card.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
    const delay = (i % 4) * 0.07;
    card.style.transitionDelay = delay + 's';
    observer.observe(card);
  });

  document.querySelectorAll('.chronicle-year').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}


function patchDOM() {
  if (!document.getElementById('page-loader')) {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = `
      <svg class="loader-name-svg" viewBox="0 0 340 80" xmlns="http://www.w3.org/2000/svg">
        <!-- 손글씨 느낌의 '백은별' 텍스트 - 테두리 -->
        <text
          x="50%"
          y="62"
          text-anchor="middle"
          font-family="KoPubBatang, serif"
          font-size="54"
          font-weight="300"
          class="loader-stroke"
        >백은별</text>
        <!-- 채우기 애니메이션 -->
        <text
          x="50%"
          y="62"
          text-anchor="middle"
          font-family="KoPubBatang, serif"
          font-size="54"
          font-weight="300"
          class="loader-stroke-fill"
        >백은별</text>
      </svg>
      <p class="loader-sub">WRITER PORTFOLIO</p>
      <div class="loader-bar-wrap">
        <div class="loader-bar-fill"></div>
      </div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
  }

  if (!document.getElementById('scroll-progress')) {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.insertBefore(bar, document.body.firstChild);
  }


  const heroInner = document.getElementById('heroInner');
  if (heroInner && !document.getElementById('hero-particles')) {
    const particles = document.createElement('div');
    particles.id = 'hero-particles';
    heroInner.insertBefore(particles, heroInner.firstChild);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  patchDOM();

  initLoader();
  initScrollProgress();
  initParticles();
  initHeroParallax();
  initBookTilt();
  initBookTyping();
  initTimelineLine();
  initChronicleReveal();

  setTimeout(initReveal, 120);
});
