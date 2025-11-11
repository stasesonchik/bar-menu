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
    .then(data => descriptions = data);

  // Появление карточек с анимацией
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 150);
  });

  // Клик по карточке → открытие модального окна
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.id;
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalText.innerHTML = descriptions[id] || "Описание недоступно";
      modal.classList.add('show');
    });

    card.addEventListener('mouseenter', () => card.classList.add('glow'));
    card.addEventListener('mouseleave', () => card.classList.remove('glow'));
  });

  // Закрытие модалки
  modalClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if(e.target === modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') modal.classList.remove('show'); });
});
