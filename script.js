/* Мобильное меню */
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
}

/* Кнопка «Подробнее»: показать / скрыть блок */
const showMore = document.querySelector('#showMore');
const moreText = document.querySelector('#moreText');
if (showMore && moreText) {
  showMore.addEventListener('click', () => {
    moreText.classList.toggle('d-none');
    const hidden = moreText.classList.contains('d-none');
    showMore.textContent = hidden ? 'Подробнее' : 'Скрыть';
    showMore.setAttribute('aria-expanded', String(!hidden));
  });
}

/* Форма: проверка полей без перезагрузки + сообщения у полей + Bootstrap modal */
const form = document.querySelector('#contact-form');
if (form) {
  const status = document.querySelector('#form-status');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const messageInput = document.querySelector('#message');

  function showMessage(text, type) {
    status.textContent = text;
    status.className = 'form-status ' + type;
  }

  function setError(input, text) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('field-error')) {
      error = document.createElement('p');
      error.className = 'field-error';
      error.setAttribute('role', 'alert');
      input.insertAdjacentElement('afterend', error);
    }
    error.textContent = text;
    input.classList.toggle('has-error', Boolean(text));
  }

  function checkName() {
    const ok = nameInput.value.trim().length > 0;
    setError(nameInput, ok ? '' : 'Введи своё имя.');
    return ok;
  }

  function checkEmail() {
    const value = emailInput.value.trim();
    let text = '';
    if (!value) text = 'Введи адрес почты.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) text = 'Почта указана некорректно. Пример: name@example.com';
    setError(emailInput, text);
    return !text;
  }

  function checkMessage() {
    const ok = messageInput.value.trim().length > 0;
    setError(messageInput, ok ? '' : 'Напиши сообщение.');
    return ok;
  }

  nameInput.addEventListener('input', checkName);
  emailInput.addEventListener('input', checkEmail);
  messageInput.addEventListener('input', checkMessage);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const okName = checkName();
    const okEmail = checkEmail();
    const okMessage = checkMessage();

    if (!okName || !okEmail || !okMessage) {
      showMessage('Исправь отмеченные поля и попробуй ещё раз.', 'text-danger');
      return;
    }

    const text = `Спасибо, ${nameInput.value.trim()}! Форма демонстрационная и не отправляет данные на сервер.`;
    showMessage(text, 'text-success');
    form.reset();

    const modalEl = document.querySelector('#thanksModal');
    if (modalEl && window.bootstrap) {
      document.querySelector('#thanksModalBody').textContent = text;
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  });
}

/* Динамический блок: карточки активностей из JSON */
const activitiesBox = document.querySelector('#activities');
if (activitiesBox) {
  const errorBox = document.querySelector('#activities-error');
  // Запасные данные: через file:// fetch не работает, сайт не должен оставаться пустым
  const fallback = [
    { title: 'Бег', description: 'Начни с 15 минут в комфортном темпе и добавляй время постепенно.', level: 'Для начинающих' },
    { title: 'Велосипед', description: 'Прогулки на велосипеде снимают напряжение и укрепляют ноги.', level: 'Для всех' },
    { title: 'Плавание', description: 'Мягкая нагрузка на суставы и работа сразу для всего тела.', level: 'Для всех' }
  ];

  function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function render(items) {
    activitiesBox.innerHTML = items.map(item => `
      <article>
        <span>${escapeHtml(item.level)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `).join('');
  }

  fetch('./data/activities.json')
    .then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(render)
    .catch(() => {
      render(fallback);
      errorBox.textContent = 'Не удалось загрузить полный список, показана краткая версия.';
    });
}
