(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const sculpture = document.querySelector('#sculpture');
  const year = document.querySelector('#current-year');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible mobile navigation.
  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    mobileNav.hidden = true;
  };

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      mobileNav.hidden = isOpen;
    });

    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', event => {
      if (menuButton.getAttribute('aria-expanded') !== 'true') return;
      if (!mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 780) closeMenu();
    }, { passive: true });
  }

  // Reveal content as it enters the viewport. Reduced-motion users see content immediately.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Keep desktop navigation's active state aligned to the visible section.
  if ('IntersectionObserver' in window && navLinks.length && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Gentle pointer-driven tilt for the hero portrait; skipped on touch and for reduced motion.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (sculpture && finePointer && !reducedMotion) {
    const heroArt = sculpture.closest('.hero-art');
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const renderTilt = () => {
      frame = 0;
      sculpture.style.transform = `perspective(900px) rotateX(${pointerY * -5}deg) rotateY(${pointerX * 7}deg)`;
    };

    heroArt.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = window.requestAnimationFrame(renderTilt);
    }, { passive: true });

    heroArt.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      if (!frame) frame = window.requestAnimationFrame(renderTilt);
    }, { passive: true });
  }

  // Light / dark theme. The initial theme is set by an inline script in <head> (no flash).
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const applyTheme = theme => {
    root.setAttribute('data-theme', theme);
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#14110e' : '#f5f0e6');
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
      themeButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      applyTheme(next);
      try { localStorage.setItem('tb-theme', next); } catch (e) { /* storage unavailable */ }
      window.setTimeout(() => root.classList.remove('theme-anim'), 500);
    });
  }

  // Follow the OS setting until the visitor makes an explicit choice.
  const followSystem = event => {
    let saved = null;
    try { saved = localStorage.getItem('tb-theme'); } catch (e) { /* ignore */ }
    if (!saved) applyTheme(event.matches ? 'dark' : 'light');
  };
  if (systemDark.addEventListener) systemDark.addEventListener('change', followSystem);

  // Cover page: the header stays hidden on launch and slides in once the visitor scrolls past the hero.
  if (root.classList.contains('cover-nav')) {
    const hero = document.querySelector('.hero');
    let ticking = false;
    const updateNav = () => {
      ticking = false;
      const threshold = Math.min((hero ? hero.offsetHeight : window.innerHeight) * 0.55, 480);
      const show = window.scrollY > threshold;
      if (show === root.classList.contains('nav-on')) return;
      root.classList.toggle('nav-on', show);
      if (!show) closeMenu();
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateNav); }
    }, { passive: true });
    window.addEventListener('resize', updateNav, { passive: true });
    updateNav();
  }

  // Disable decorative pointer effects on touch and lower-capability layouts.
  // All navigation and content remains available without JavaScript animations.
})();
