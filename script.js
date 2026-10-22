/* ===================================
   MOBILE NAV TOGGLE
   =================================== */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const setMenu = (open) => {
  mobileMenu?.classList.toggle('open', open);
  navToggle?.classList.toggle('open', open);
  navToggle?.setAttribute('aria-expanded', open);
  navToggle?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};

navToggle?.addEventListener('click', () => {
  setMenu(!mobileMenu.classList.contains('open'));
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
    setMenu(false);
    navToggle?.focus();
  }
});

/* ===================================
   FAQ ACCORDION
   =================================== */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===================================
   SCROLL REVEAL
   =================================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const inView = (el, cb, opts = { threshold: 0.2 }) => {
  const io = new IntersectionObserver(entries => entries.forEach(e => cb(e, io)), opts);
  io.observe(el);
};

/* ===================================
   HEADLINE REVEALS
   Split headings on their <br>s and slide each line up into view
   =================================== */
if (!reduceMotion) {
  document.querySelectorAll('main h1, main h2:not(.visually-hidden):not(.footer-heading), .signoff-title').forEach(h => {
    const lines = h.innerHTML.split(/<br\s*\/?>/i);
    h.innerHTML = lines.map(l => `<span class="split-line"><span>${l.trim()}</span></span>`).join('');
    h.classList.add('is-split');
    inView(h, (e, io) => {
      if (e.isIntersecting) { h.classList.add('in-view'); io.unobserve(h); }
    }, { threshold: 0.3 });
  });
}

/* ===================================
   HERO MONOGRAM TURNS WITH SCROLL
   =================================== */
const badge = document.querySelector('.hero-badge');
if (badge && !reduceMotion) {
  badge.classList.add('is-scroll-linked');
  let ticking = false;
  const turn = () => {
    badge.style.setProperty('--turn', `${window.scrollY * 0.18}deg`);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(turn); ticking = true; }
  }, { passive: true });
}

/* ===================================
   DEVICE MOCKUPS PLAY WHILE ON SCREEN
   =================================== */
document.querySelectorAll('.device-stage').forEach(stage => {
  inView(stage, (e) => stage.classList.toggle('is-playing', e.isIntersecting), { threshold: 0.35 });
});

/* ===================================
   PROCESS TIMELINE FILLS AS YOU SCROLL
   =================================== */
const timeline = document.querySelector('.timeline');
if (timeline) {
  const fill = () => {
    const r = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
    timeline.style.setProperty('--progress', p.toFixed(3));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(fill), { passive: true });
  fill();
}

/* ===================================
   COUNT-UP NUMBERS
   =================================== */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const fmt = (n) => n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  if (reduceMotion || Number.isNaN(target)) return;
  // The real number stays in place until the animation actually starts
  inView(el, (e, io) => {
    if (!e.isIntersecting) return;
    io.unobserve(el);
    el.textContent = fmt(0);
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, { threshold: 0.5 });
});

/* ===================================
   MAGNETIC BUTTONS (desktop)
   =================================== */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.btn-light, .btn-dark, nav .cta').forEach(btn => {
    btn.classList.add('is-magnetic');
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', `${(e.clientX - r.left - r.width / 2) * 0.22}px`);
      btn.style.setProperty('--my', `${(e.clientY - r.top - r.height / 2) * 0.32}px`);
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}

/* ===================================
   FOOTER YEAR
   =================================== */
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ===================================
   ENQUIRY FORM
   =================================== */
const form = document.getElementById('bookForm');
const dateInput = form?.querySelector('input[name="preferred_date"]');
const serviceChecks = form ? Array.from(form.querySelectorAll('#serviceChecks input')) : [];

if (dateInput) {
  // Local date, so it isn't a day off around midnight during BST
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const pad = (n) => String(n).padStart(2, '0');
  dateInput.min = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
}

// "Enquire about …" buttons on the services page pre-tick the matching service
const preselect = new URLSearchParams(location.search).get('service');
serviceChecks.forEach(box => {
  if (box.dataset.service === preselect) box.checked = true;
});

// At least one service must be chosen
const validateServices = () => {
  const anyChecked = serviceChecks.some(box => box.checked);
  serviceChecks[0]?.setCustomValidity(anyChecked ? '' : 'Please choose at least one service.');
};
serviceChecks.forEach(box => box.addEventListener('change', validateServices));
validateServices();
