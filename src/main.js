const menuLink = document.querySelectorAll('.header-mobile-navigation a');
const menuContainer = document.querySelector('.js-menu-container');
const body = document.body;
const backdrop = document.querySelector('.backdrop');
const openMenuButton = document.querySelector('.js-open-menu');
const closeMenuButton = document.querySelector('.js-close-menu');
const openBackdropBtn = document.querySelector('.hero-btn');
const closeBackdropBtn = document.querySelector('.modal-close-btn');
const inputEmail = document.querySelector('.input-email');
const errorInput = document.querySelector('.form-input-error');
const inputNumber = document.querySelector('.input-number');
const errorInputNumber = document.querySelector('.form-input-error-number');
const form = document.querySelector('.form');
const inputName = document.querySelector('.input-name');
const inputComment = document.querySelector('.modal-comment');
const inputSubmit = document.querySelector('.footer-email');
const submitBtn = document.querySelector('.footer-btn');
const formSbm = document.querySelector('.form-group');
const BASE_URL = 'http://localhost:3000/todos';
import Swiper from 'swiper';
import 'swiper/css';
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules';
// Открытие меню
openMenuButton.addEventListener('click', () => {
  menuContainer.classList.add('is-open');

  body.classList.add('no-scroll');

  // console.log('Меню открыто');
});

// Закрытие меню
closeMenuButton.addEventListener('click', () => {
  menuContainer.classList.remove('is-open');
  body.classList.remove('no-scroll');
});

menuLink.forEach(link => {
  link.addEventListener('click', e => {
    body.classList.remove('no-scroll');

    e.preventDefault(); // Забороняємо стандартну поведінку браузера
    const targetId = link.getAttribute('href').substring(1); // Отримуємо ID цільового елемента
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Плавний скрол до секції
      targetElement.scrollIntoView({ behavior: 'smooth' });

      // Закриваємо меню після переходу
      menuContainer.classList.remove('is-open');
    }
  });
});

openBackdropBtn.addEventListener('click', () => {
  backdrop.classList.add('is-open');
  body.classList.add('no-scroll');
});

closeBackdropBtn.addEventListener('click', () => {
  backdrop.classList.remove('is-open');
  body.classList.remove('no-scroll');
});

// Валідація email
const validateEmail = () => {
  if (inputEmail.validity.valid) {
    // Пошта валідна
    inputEmail.classList.add('valid');
    inputEmail.classList.remove('invalid');
    errorInput.style.display = 'none';
    return true;
  } else {
    // Пошта некоректна
    inputEmail.classList.remove('valid');
    inputEmail.classList.add('invalid');
    errorInput.style.display = 'block';
    return false;
  }
};

const validateNumber = () => {
  if (inputNumber.validity.valid) {
    inputNumber.classList.add('valid');
    inputNumber.classList.remove('invalid');
    errorInputNumber.style.display = 'none';
    return true;
  } else {
    // Номер некоректна
    inputNumber.classList.remove('valid');
    inputNumber.classList.add('invalid');
    errorInputNumber.style.display = 'block';
    return false;
  }
};

const validateSubmit = () => {
  if (inputSubmit.validity.valid) {
    inputSubmit.classList.add('valid');
    inputSubmit.classList.remove('invalid');
    errorInput.style.display = 'none';
    return true;
  } else {
    inputSubmit.classList.remove('valid');
    inputSubmit.classList.add('invalid');
    errorInput.style.display = 'block';
    return false;
  }
};

// Відслідковування змін в полі вводу
inputEmail.addEventListener('input', validateEmail);
inputNumber.addEventListener('input', validateNumber);
inputSubmit.addEventListener('input', validateSubmit);
// Обробка форми
form.addEventListener('submit', async event => {
  event.preventDefault();

  if (inputEmail.value.trim() === '') {
    errorInput.style.display = 'block';
    errorInput.textContent = 'All fields must be filled';
    return;
  }

  // if (userComment.value.trim() === "") {
  //   errorMsg.style.display = "block";
  //   errorMsg.textContent = "All fields must be filled";
  //   return;
  // } else {
  //   errorMsg.style.display = "none";
  // }

  if (validateEmail() && validateNumber()) {
    const formData = {
      name: inputName.value.trim(),
      email: inputEmail.value.trim(),
      number: inputNumber.value,
      comment: inputComment.value.trim(),
    };

    try {
      const response = await axios.post(BASE_URL, formData);

      if (response.status === 201) {
        form.reset();
        inputEmail.classList.remove('valid', 'invalid'); // Видалення класів після успішного відправлення
        inputNumber.classList.remove('valid', 'invalid');
        backdrop.classList.remove('is-open');
        body.classList.remove('no-scroll');
      }
    } catch (error) {
      iziToast.error({
        message: error.message,
        title: 'Error',
        position: 'center',
      });
    }
  }
});

formSbm.addEventListener('submit', async event => {
  event.preventDefault();
  if (validateSubmit()) {
    const formData = {
      submit: inputSubmit.value.trim(),
    };

    try {
      const response = await axios.post(BASE_URL, formData);

      if (response.status === 201) {
        formSbm.reset();
        inputSubmit.classList.remove('valid', 'invalid'); // Видалення класів після успішного відправлення
      }
    } catch (error) {
      iziToast.error({
        message: error.message,
        title: 'Error',
        position: 'center',
      });
    }
  }
});

//scroll up
const scrollUpBtn = document.querySelector('.scroll-up-btn');
let lastScrollTop = 0; //Запамʼятовуємо останню позицію прокрутки
let isScrollingUp = true; //Перевірка напрямку прокрутки
//Обробник позиції прокрутки
window.addEventListener('scroll', () => {
  let currentTop = window.scrollY;
  //Показуємо кнопки, тільки якщо сторінка прокручена
  if (currentTop > 0) {
    //Сторінка прокручена, кнопки повинні бути видимі
    scrollUpBtn.classList.add('is-active-scroll');
  } else {
    scrollUpBtn.classList.remove('is-active-scroll');
  }
  //Логіка приховання/відображення кнопки "Вгору"
  if (currentTop < lastScrollTop && isScrollingUp) {
    scrollUpBtn.classList.add('is-active-scroll');
    isScrollingUp = false;
  } else if (currentTop > lastScrollTop && !isScrollingUp) {
    scrollUpBtn.classList.remove('is-active-scroll');
    isScrollingUp = true;
  }
  //Логіка приховання кнопки "Вверх" з нижньої та верхньої частин сторінки
  if (
    currentTop === 0 ||
    currentTop + window.innerHeight >= document.body.scrollHeight
  ) {
    scrollUpBtn.classList.remove('is-active-scroll'); //Приховуємо кнопку, якщо ми в самому низу або вгорі
  }
  lastScrollTop = currentTop <= 0 ? 0 : currentTop;
});
//Скрол вгору при кліку на кнопку
scrollUpBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  scrollUpBtn.classList.remove('is-active-scroll');
});

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Keyboard, Mousewheel],
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  keyboard: {
    enabled: true,
    onlyInViewport: false,
  },

  mousewheel: {
    invert: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1280: {
      slidesPerView: 4,
    },
  },

  spaceBetween: 32,
});
