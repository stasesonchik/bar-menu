// === Neon Bar Menu Script ===

// Ждём, пока страница полностью загрузится
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.menu-card');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  // Появление карточек с анимацией
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 150);
  });

  // Клик по карточке → открытие модального окна
  cards.forEach(card => {
    card.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalTitle.textContent = card.querySelector('h3').textContent;
      modalText.textContent = `Описание напитка "${modalTitle.textContent}" здесь.`;
    });
  });

  // Закрытие модального окна
  modalClose.addEventListener('click', () => modal.style.display = 'none');
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.style.display = 'none'; });

  // Неоновый эффект при наведении
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('glow'));
    card.addEventListener('mouseleave', () => card.classList.remove('glow'));
  });
});

// CSS-класс для свечения
const style = document.createElement('style');
style.textContent = `
  .glow {
    box-shadow: 0 0 10px #00ffff,
                0 0 20px #00ffff,
                0 0 40px #00ffff,
                0 0 80px #00ffff;
    transition: box-shadow 0.3s ease;
  }
`;
document.head.appendChild(style);
