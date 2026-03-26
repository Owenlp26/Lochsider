const form = document.querySelector('.book-form');
const dateInput = form?.querySelector('input[name="preferred_date"]');
const status = form?.querySelector('.form-status');

if (dateInput) {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  dateInput.min = now.toISOString().split('T')[0];
}

if (form && status) {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      status.textContent = 'Please complete all required fields before sending your request.';
      return;
    }

    status.textContent = 'Opening your email app to send your booking request...';

    setTimeout(() => {
      status.textContent = 'If your email app did not open, please email hello@lochsidecreative.com.';
    }, 3000);
  });
}
