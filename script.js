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
