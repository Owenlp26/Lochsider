const form = document.querySelector('.book-form');
const dateInput = form?.querySelector('input[name="preferred_date"]');
const statusEl = form?.querySelector('.form-status');

if (dateInput) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

form?.addEventListener('submit', () => {
  if (statusEl) statusEl.textContent = 'Opening your email app to send your request...';
});
