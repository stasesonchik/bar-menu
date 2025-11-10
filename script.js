// === Neon Bar Menu Script ===

// Ждём, пока страница полностью загрузится
document.addEventListener("DOMContentLoaded", () => {
  console.log("Neon Bar Menu Loaded!");

  // Находим все карточки меню
  const cards = document.querySelectorAll('.menu-card');

  // Плавное появление карточек при загрузке
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 150); // задержка между карточками
  });

  // Эффект неонового блика при наведении
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('glow');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('glow');
    });
  });
});

// Дополнительный неоновый эффект через CSS-класс
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
