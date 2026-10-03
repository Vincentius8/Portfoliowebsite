

(() => {
  const root = document.documentElement;
  const THEME_KEY = 'jvp-theme';
  const PAPER = { light: '#fbfbfc', dark: '#0b0d11' };
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const storage = {
    get() {
      try { return localStorage.getItem(THEME_KEY); } catch { return null; }
    },
    set(value) {
      try {
        if (value) localStorage.setItem(THEME_KEY, value);
        else localStorage.removeItem(THEME_KEY);
      } catch {  }
    },
  };

  
  
  document.addEventListener('touchstart', () => {}, { passive: true });

  

  const systemTheme = () => (systemDark.matches ? 'dark' : 'light');
  const activeTheme = () => root.dataset.theme || systemTheme();
  const themeButtons = document.querySelectorAll('[data-theme-set]');

  function paintThemeState() {
    const theme = activeTheme();
    themeButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeSet === theme));
    });
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', PAPER[theme]);
    });
  }

  function setTheme(theme) {
    if (theme === activeTheme()) return;
    const apply = () => {
      
      if (theme === systemTheme()) {
        delete root.dataset.theme;
        storage.set(null);
      } else {
        root.dataset.theme = theme;
        storage.set(theme);
      }
      paintThemeState();
    };

    if (reducedMotion.matches) return apply();
    if (document.startViewTransition) {
      document.startViewTransition(apply);
      return;
    }
    root.classList.add('theme-fading');
    apply();
    window.setTimeout(() => root.classList.remove('theme-fading'), 360);
  }

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeSet));
  });

  systemDark.addEventListener('change', () => {
    if (!storage.get()) paintThemeState();
  });

  paintThemeState();

  

  const header = document.querySelector('[data-header]');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      header?.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('mobile-menu');
  const outside = [document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
  const desktop = window.matchMedia('(min-width: 64em)');

  const isOpen = () => toggle?.getAttribute('aria-expanded') === 'true';

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    root.classList.add('menu-open');
    outside.forEach((el) => { el.inert = true; });
    menu.querySelector('a, button')?.focus({ preventScroll: true });
  }

  function closeMenu({ restoreFocus = true } = {}) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    root.classList.remove('menu-open');
    outside.forEach((el) => { el.inert = false; });
    if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu({ restoreFocus: false });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) closeMenu();
    });

    
    menu.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...menu.querySelectorAll('a, button')];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        toggle.focus();
      }
    });

    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && !event.shiftKey && isOpen()) {
        event.preventDefault();
        menu.querySelector('a, button')?.focus();
      }
    });

    desktop.addEventListener('change', (event) => {
      if (event.matches && isOpen()) closeMenu({ restoreFocus: false });
    });
  }

  

  
  
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(navLinks.map((a) => [a.hash.slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(entry.target.id)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((section) => spy.observe(section));
  }

  
  
  

  const revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length && 'IntersectionObserver' in window && !reducedMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealables.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('will-reveal');
        io.observe(el);
      }
    });
  }

  

  const copyStatus = document.querySelector('[data-copy-status]');
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    const idle = btn.textContent;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        const field = Object.assign(document.createElement('textarea'), { value: text });
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;opacity:0';
        document.body.append(field);
        field.select();
        ok = document.execCommand('copy');
        field.remove();
      }
      if (!ok) {
        
        const link = btn.parentElement?.querySelector('a');
        if (link) window.getSelection()?.selectAllChildren(link);
      }
      const shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘C' : 'Ctrl+C';
      btn.textContent = ok ? 'copied' : `press ${shortcut}`;
      btn.classList.toggle('is-done', ok);
      if (copyStatus) copyStatus.textContent = ok ? 'Email address copied to clipboard.' : '';
      window.setTimeout(() => {
        btn.textContent = idle;
        btn.classList.remove('is-done');
      }, 2200);
    });
  });

  

  const clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    const tz = clocks[0].dataset.tz || 'Asia/Manila';
    let format;
    try {
      format = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz });
    } catch {
      format = null;
    }
    const tick = () => {
      if (!format) return;
      const time = format.format(new Date());
      clocks.forEach((el) => { el.textContent = `${time} ${el.dataset.suffix || ''}`.trim(); });
    };
    tick();
    const now = new Date();
    window.setTimeout(() => {
      tick();
      window.setInterval(tick, 60_000);
    }, (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50);
  }

  

  const gridToggle = document.querySelector('[data-grid-toggle]');
  let overlay;
  gridToggle?.addEventListener('click', () => {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'grid-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `<div class="wrap grid">${'<span></span>'.repeat(12)}</div>`;
      document.body.append(overlay);
      overlay.getBoundingClientRect();
    }
    const on = gridToggle.getAttribute('aria-pressed') !== 'true';
    gridToggle.setAttribute('aria-pressed', String(on));
    overlay.classList.toggle('is-on', on);
  });

  

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
