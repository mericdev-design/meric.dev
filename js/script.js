const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  hamburger.classList.toggle('active', !expanded);
  navMenu.classList.toggle('active', !expanded);
});

document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
  hamburger?.setAttribute('aria-expanded', 'false');
  hamburger?.classList.remove('active');
  navMenu?.classList.remove('active');
}));

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('is-scrolled', window.scrollY > 50);
}, { passive: true });

const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const error = document.getElementById('form-error');
let recaptchaWidget;
let submissionPending = false;

window.onloadCallback = () => {
  if (window.grecaptcha && form) {
    recaptchaWidget = window.grecaptcha.render('recaptcha', {
      sitekey: '6LfVOWssAAAAFtvobRhREnIdtngehAkuw-f7dJ9',
      size: 'invisible',
      callback: submitForm,
      'error-callback': () => showError('La vérification anti-robot a échoué. Réessayez ou contactez-nous par email.'),
      'expired-callback': () => { submissionPending = false; }
    });
  }
};

function showError(message) {
  submissionPending = false;
  if (error) { error.textContent = message; error.hidden = false; }
  form?.querySelector('button[type="submit"]')?.removeAttribute('disabled');
}

function submitForm() {
  if (!submissionPending || !form) return;
  form.submit();
}

form?.addEventListener('submit', (event) => {
  if (!form.checkValidity()) return;
  event.preventDefault();
  error.hidden = true;
  submissionPending = true;
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  if (window.grecaptcha && Number.isInteger(recaptchaWidget)) {
    window.grecaptcha.execute(recaptchaWidget);
  } else {
    showError('La vérification anti-robot se charge encore. Veuillez réessayer dans un instant.');
  }
});

if (window.location.hash === '#contact' && document.referrer.includes('formspree')) {
  form.hidden = true;
  success.hidden = false;
}
