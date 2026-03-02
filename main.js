/* ============================================================
   LAKE COMO PRIVATE CONCIERGE — JavaScript
   Micro-interactions, scroll reveals, navigation, cursor
   ============================================================ */

(function () {
  'use strict';

  /* ── Custom Cursor ─────────────────────────────────────── */
  const cursor = document.body;
  let cursorX = 0, cursorY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!raf) {
      raf = requestAnimationFrame(moveCursor);
    }
  });

  function moveCursor() {
    document.documentElement.style.setProperty('--cx', cursorX + 'px');
    document.documentElement.style.setProperty('--cy', cursorY + 'px');
    raf = null;
  }

  // Override pseudo-element cursor with a real element for interactivity
  const cursorDot = document.createElement('div');
  cursorDot.id = 'cursor-dot';
  cursorDot.style.cssText = `
    position: fixed;
    width: 10px; height: 10px;
    background: #C9A86C;
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, background 0.3s, opacity 0.3s;
    mix-blend-mode: difference;
    top: 0; left: 0;
  `;
  const cursorRing = document.createElement('div');
  cursorRing.id = 'cursor-ring';
  cursorRing.style.cssText = `
    position: fixed;
    width: 36px; height: 36px;
    border: 1px solid rgba(201, 168, 108, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: width 0.15s ease, height 0.15s ease, border-color 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let ringX = 0, ringY = 0;
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top  = e.clientY + 'px';
    // Smooth ring follow
    ringX += (e.clientX - ringX) * 0.12;
    ringY += (e.clientY - ringY) * 0.12;
  });

  function updateRing() {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(updateRing);
  }
  requestAnimationFrame(updateRing);

  // Scale on hover
  document.querySelectorAll('a, button, .service-card, .partner-type, .pillar, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.width  = '20px';
      cursorDot.style.height = '20px';
      cursorRing.style.width  = '56px';
      cursorRing.style.height = '56px';
      cursorRing.style.borderColor = 'rgba(201, 168, 108, 0.9)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.width  = '10px';
      cursorDot.style.height = '10px';
      cursorRing.style.width  = '36px';
      cursorRing.style.height = '36px';
      cursorRing.style.borderColor = 'rgba(201, 168, 108, 0.5)';
    });
  });

  /* ── Navigation ─────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  navBurger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav-open');
    navBurger.setAttribute('aria-expanded', open);
    if (open) {
      navLinks.style.cssText = `
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 80px; left: 0; right: 0; bottom: 0;
        background: rgba(8,8,8,0.98);
        backdrop-filter: blur(20px);
        align-items: center;
        justify-content: center;
        gap: 40px;
        z-index: 999;
        animation: fadeIn 0.3s ease;
      `;
    } else {
      navLinks.removeAttribute('style');
    }
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-open');
      navLinks.removeAttribute('style');
    });
  });

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .philosophy-content, .philosophy-visual, ' +
    '.pillar, .partner-type, .price-card, .extra-svc, ' +
    '.modality, .contact-detail-item, .section-tag, ' +
    '.section-title, .section-intro, .partner-modalities'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = (i % 4) * 0.1;
    el.style.transitionDelay = delay + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));

  /* ── Smooth Anchor Scrolling ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[data-i]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollY) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('data-i') === current
        ? 'var(--gold)' : '';
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ── Hero Parallax ──────────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${s * 0.25}px)`;
      }
    }, { passive: true });
  }

  /* ── Contact Form ───────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('form-submit');
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending…';

      // Simulate sending (2s delay)
      setTimeout(() => {
        form.style.cssText = 'opacity:0; pointer-events:none; transition: opacity 0.5s ease;';
        setTimeout(() => {
          form.style.display = 'none';
          formSuccess.classList.add('visible');
        }, 500);
      }, 2000);
    });
  }

  /* ── Marquee Pause on Hover ─────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── Number Counter Animation ───────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const small = el.querySelector('small');
        const suffix = small ? small.textContent : '';
        const rawText = el.textContent.replace(suffix, '').trim();
        const isZero = rawText === '0';
        const target = isZero ? 0 : parseFloat(rawText);

        if (!isNaN(target) && !isZero) {
          let start = 0;
          const duration = 1800;
          const step = timestamp => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.innerHTML = current + (small ? `<small>${suffix}</small>` : '');
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

  /* ── Gold shimmer on section titles ────────────────────── */
  document.querySelectorAll('.section-title em, .hero-title em').forEach(el => {
    el.style.cssText += `
      background: linear-gradient(90deg, #C9A86C, #E8CFA0, #C9A86C, #9A7A4A, #C9A86C);
      background-size: 300%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: goldShimmer 6s linear infinite;
    `;
  });

  const shimmerStyle = document.createElement('style');
  shimmerStyle.textContent = `
    @keyframes goldShimmer {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;
  document.head.appendChild(shimmerStyle);

  /* ── Page Loader ────────────────────────────────────────── */
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.style.cssText = `
    position: fixed; inset: 0;
    background: #080808;
    z-index: 100000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 24px;
    transition: opacity 0.8s ease;
  `;
  loader.innerHTML = `
    <div style="font-family:'Cinzel',serif; font-size:28px; color:#C9A86C; letter-spacing:8px;">LC</div>
    <div style="width:120px; height:1px; background:rgba(201,168,108,0.2); position:relative; overflow:hidden;">
      <div id="loader-bar" style="position:absolute; top:0; left:0; height:100%; background:#C9A86C; width:0; transition:width 1.2s ease;"></div>
    </div>
    <div style="font-size:9px; letter-spacing:4px; text-transform:uppercase; color:#555;">Lake Como Private Concierge</div>
  `;
  document.body.appendChild(loader);

  // Animate loader bar
  setTimeout(() => {
    document.getElementById('loader-bar').style.width = '100%';
  }, 100);

  // Hide loader
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }, 1400);
  });

  console.log('%cLake Como Private Concierge', 'font-family:serif; font-size:20px; color:#C9A86C;');
  console.log('%cAll rights reserved. Unauthorized access is prohibited.', 'color:#555; font-size:10px;');

})();
