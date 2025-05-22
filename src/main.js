import axios from 'axios';
import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules';

/* ---------------------  СЕЛЕКТОРИ  --------------------- */
const menuLink = document.querySelectorAll('.header-mobile-navigation a');
const menuContainer = document.querySelector('.js-menu-container');
const body = document.body;
const backdrop = document.querySelector('.backdrop');
const openMenuButton = document.querySelector('.js-open-menu');
const closeMenuButton = document.querySelector('.js-close-menu');
const openBackdropBtn = document.querySelector('.hero-btn');
const closeBackdropBtn = document.querySelector('.modal-close-btn');

/* --- contact-modal --- */
const cEmailInput = document.querySelector('.input-email');
const cEmailError = document.querySelector('.form-input-error');
const cPhoneInput = document.querySelector('.input-number');
const cPhoneError = document.querySelector('.form-input-error-number');
const contactForm = document.querySelector('.form');
const cNameInput = document.querySelector('.input-name');
const cComment = document.querySelector('.modal-comment');

/* --- subscribe-footer --- */
const subscribeForm = document.getElementById('subscribe-form');
const sEmailInput = document.querySelector('.footer-email');
const sEmailError = document.querySelector('.form-input-error-subscribe');

/* ---------------------  API  --------------------- */
const BASE_CONTACTS = 'https://webstudio-server.onrender.com/api/v1/contacts';
const SUBSCRIBE_URL = 'https://webstudio-server.onrender.com/api/subscribe';

/* -------------------  ХЕЛПЕРИ  ------------------- */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

function validateEmail(inputEl, errorEl) {
  const ok = emailRegex.test(inputEl.value.trim());
  errorEl.style.display = ok ? 'none' : 'block';
  inputEl.classList.toggle('valid', ok);
  inputEl.classList.toggle('invalid', !ok);
  return ok;
}

function validatePhone(inputEl, errorEl) {
  const ok = phoneRegex.test(inputEl.value.trim());
  errorEl.style.display = ok ? 'none' : 'block';
  inputEl.classList.toggle('valid', ok);
  inputEl.classList.toggle('invalid', !ok);
  return ok;
}

/* --------------------  МЕНЮ  -------------------- */
openMenuButton.addEventListener('click', () => {
  menuContainer.classList.add('is-open');
  body.classList.add('no-scroll');
});
closeMenuButton.addEventListener('click', () => {
  menuContainer.classList.remove('is-open');
  body.classList.remove('no-scroll');
});
menuLink.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').substring(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    menuContainer.classList.remove('is-open');
    body.classList.remove('no-scroll');
  });
});

/* --------------------  МОДАЛКА  -------------------- */
openBackdropBtn.addEventListener('click', () => {
  backdrop.classList.add('is-open');
  body.classList.add('no-scroll');
});
closeBackdropBtn.addEventListener('click', () => {
  backdrop.classList.remove('is-open');
  body.classList.remove('no-scroll');
});

/* -----------  Валідація контактної форми ---------- */
cEmailInput.addEventListener('input', () =>
  validateEmail(cEmailInput, cEmailError)
);
cPhoneInput.addEventListener('input', () =>
  validatePhone(cPhoneInput, cPhoneError)
);

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const okEmail = validateEmail(cEmailInput, cEmailError);
  const okPhone = validatePhone(cPhoneInput, cPhoneError);
  if (!okEmail || !okPhone) return;

  const payload = {
    name: cNameInput.value.trim(),
    email: cEmailInput.value.trim(),
    phone: cPhoneInput.value.trim(),
    comment: cComment.value.trim(),
  };

  try {
    const { status } = await axios.post(BASE_CONTACTS, payload);
    if (status === 200 || status === 201) {
      alert('Дані успішно надіслані!');
      contactForm.reset();
      [cEmailInput, cPhoneInput].forEach(el => el.classList.remove('valid'));
      backdrop.classList.remove('is-open');
      body.classList.remove('no-scroll');
    } else {
      alert('Сталася помилка, спробуйте пізніше');
    }
  } catch (err) {
    alert(
      'Помилка мережі/сервера: ' + (err.response?.data?.message || err.message)
    );
  }
});

/* -------------  Форма підписки footer -------------- */
sEmailInput.addEventListener('input', () =>
  validateEmail(sEmailInput, sEmailError)
);

subscribeForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateEmail(sEmailInput, sEmailError)) return;

  try {
    const { status } = await axios.post(SUBSCRIBE_URL, {
      email: sEmailInput.value.trim(),
    });
    if (status === 200 || status === 201) {
      alert('Підписка оформлена!');
      subscribeForm.reset();
      sEmailInput.classList.remove('valid');
    }
  } catch (err) {
    alert('Помилка підписки: ' + (err.response?.data?.message || err.message));
  }
});

/* ---------------  Кнопка scroll-up  ---------------- */
const scrollUpBtn = document.querySelector('.scroll-up-btn');
let lastScroll = 0,
  scrollingUp = true;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  scrollUpBtn.classList.toggle(
    'is-active-scroll',
    y > 0 && (y < lastScroll || !scrollingUp)
  );
  scrollingUp = y >= lastScroll;
  if (y === 0 || y + window.innerHeight >= document.body.scrollHeight)
    scrollUpBtn.classList.remove('is-active-scroll');
  lastScroll = y <= 0 ? 0 : y;
});
scrollUpBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ------------------  Swiper  ------------------ */
new Swiper('.swiper', {
  modules: [Navigation, Keyboard, Mousewheel],
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  keyboard: { enabled: true, onlyInViewport: false },
  mousewheel: { invert: true },
  breakpoints: { 768: { slidesPerView: 2 }, 1280: { slidesPerView: 4 } },
  spaceBetween: 32,
});
