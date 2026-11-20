// Мобильная навигация
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });
}

// Кнопка «Подробнее»: показать или скрыть дополнительный текст
const showMoreButton = document.querySelector('#showMore');
const moreText = document.querySelector('#moreText');

if (showMoreButton && moreText) {
  showMoreButton.addEventListener('click', () => {
    const isHidden = moreText.hidden;
    moreText.hidden = !isHidden;
    showMoreButton.setAttribute('aria-expanded', String(isHidden));
    showMoreButton.innerHTML = isHidden ? 'Скрыть <span>−</span>' : 'Подробнее <span>＋</span>';
  });
}

// Проверка формы без перезагрузки страницы
const form = document.querySelector('#contact-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');
    const status = document.querySelector('#form-status');

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (name.length < 2 || !emailField.validity.valid || !email || message.length < 5) {
      status.textContent = 'Проверьте заполнение: укажите имя, корректный email и сообщение не короче 5 символов.';
      status.classList.add('form-error');
      status.classList.remove('form-success');
      return;
    }

    status.textContent = `Спасибо, ${name}! Форма заполнена правильно. Это демонстрационная отправка: данные не передаются на сервер.`;
    status.classList.add('form-success');
    status.classList.remove('form-error');
    form.reset();
  });
}

// Получение карточек направлений из JSON без перезагрузки страницы
const projectList = document.querySelector('#project-list');
const projectsError = document.querySelector('#projects-error');

if (projectList) {
  fetch('./data/projects.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось получить файл с данными.');
      }
      return response.json();
    })
    .then((projects) => {
      projectList.replaceChildren();

      projects.forEach((project) => {
        const card = document.createElement('article');
        card.className = 'project-card';

        const tag = document.createElement('span');
        tag.className = 'project-tag';
        tag.textContent = project.tag;

        const title = document.createElement('h3');
        title.textContent = project.title;

        const description = document.createElement('p');
        description.textContent = project.description;

        card.append(tag, title, description);
        projectList.append(card);
      });
    })
    .catch((error) => {
      projectList.replaceChildren();
      if (projectsError) {
        projectsError.textContent = 'Не удалось загрузить направления. Обновите страницу позднее.';
      }
      console.error(error);
    });
}
