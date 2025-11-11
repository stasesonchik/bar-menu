document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.menu-card');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  let descriptions = {};

  // Загружаем JSON с описаниями
  fetch('descriptions.json')
    .then(res => res.json())
    .then(data => descriptions = data)
    .catch(err => console.warn("Не удалось загрузить описания", err));

  // Анимация появления карточек через CSS transition
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  // Клик по карточке → открытие модалки
  cards.forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const id = card.dataset.id;
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalText.innerHTML = descriptions[id] || "Описание недоступно";
      modal.classList.add('show');
    });
  });

  // Закрытие модалки
  modalClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') modal.classList.remove('show'); });
});
