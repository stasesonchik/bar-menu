document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');
  const telegramIcon = document.querySelector('.telegram-icon'); // иконка Telegram

  let descriptions = {};
  fetch('descriptions.json')
    .then(res => res.json())
    .then(data => descriptions = data)
    .catch(() => console.warn("Описание не загружено"));

  const mobileCardsContainer = document.getElementById('mobile-cards');
  const chooseCocktails = document.getElementById('choose-cocktails');
  const chooseShots = document.getElementById('choose-shots');

  const cocktails = [
    {id:'long_island', title:'Unsigned long long island', price:'290₽', img:'assets/images/long_island.jpg'},
    {id:'adren_arina', title:'АдренАрина', price:'249₽', img:'assets/images/adren_arina.jpg'},
    //{id:'sex_na_obscom', title:'Секс на обском', price:'190₽', img:'assets/images/sex_na_obskom.jpg'},
    {id:'chuma', title:'Nagiborosis Contagium', price:'190₽', img:'assets/images/chuma.jpg'},
    {id:'leka_v_praime', title:'Лека в прайме', price:'190', img:'assets/images/leka_v_praime.jpg'},
    {id:'history', title:'Смекалочка', price:'190₽', img:'assets/images/history.jpg'},
    {id:'pivnaya_ryumka', title:'Пивная рюмка из Трёхгорного', price:'190₽', video:'assets/videos/ryumka.mp4'},
    {id:'laguna', title:'Не голубая лагуна', price:'190₽', img:'assets/images/laguna.jpg'}
 ];

  const shots = [
    {id:'p_52', title:'П-52', price:'90', img:'assets/images/p_52.jpg'},
    {id:'Kurator', title:'Хуевый Куратор', price:'149₽ (2 шт)', img:'assets/images/kurator.jpg'},
    {id:'Vkusno', title:'Вкусно', price:'290₽ (6 шт)', img:'assets/images/vkusno.jpg'},
    {id:'Smert', title:'Смерть в саване', price:'290₽ (6 шт)', img:'assets/images/smert2.jpg'},
    {id:'fast_2',title: 'Быстрая Двойка',price: '290₽',img: 'assets/images/fast_2.jpg'}
  ];

  let currentCards = [];
  let topIndex = 0;
  let startX = 0;
  let startY = 0;
  let currentTranslateX = 0;
  let currentTranslateY = 0;

  let currentCategory = ''; // хранит текущую категорию

  function createCard(cardData) {
    const card = document.createElement('div');
    card.className = 'menu-card';

    let mediaContent;
    if (cardData.video) {
      mediaContent = `
        <video autoplay loop muted playsinline class="card-media">
          <source src="${cardData.video}" type="video/mp4">
          Ваш браузер не поддерживает видео.
        </video>
      `;
    } else {
      mediaContent = `<img src="${cardData.img}" alt="${cardData.title}" class="card-media">`;
    }

    card.innerHTML = `
      ${mediaContent}
      <h3>${cardData.title}</h3>
      <p>${cardData.price}</p>
    `;

    card.style.zIndex = currentCards.length;
    card.style.transform = 'scale(1) translateY(0)';
    card.style.opacity = '1';
    card.style.transition = 'none';

    // Модальное окно
    card.addEventListener('click', () => {
      modalTitle.textContent = cardData.title;
      modalText.innerHTML = descriptions[cardData.id] || "Описание недоступно";

      // Изменяем цвет обводки модалки
      if (currentCategory === 'cocktails') {
        modal.querySelector('.modal-content').style.boxShadow = '0 0 20px #00ffff';
      } else if (currentCategory === 'shots') {
        modal.querySelector('.modal-content').style.boxShadow = '0 0 20px #ff5555';
      }

      modal.classList.add('show');
    });

    // Свайп по всей карточке
    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentTranslateX = 0;
      currentTranslateY = 0;
      card.style.transition = 'none';
    });

    card.addEventListener('touchmove', e => {
      const moveX = e.touches[0].clientX - startX;
      const moveY = e.touches[0].clientY - startY;
      currentTranslateX = moveX;
      currentTranslateY = moveY;

      card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.1}deg)`;
    });

    card.addEventListener('touchend', () => {
      const threshold = 100;
      if (Math.abs(currentTranslateX) > threshold) {
        swipeCard(card, currentTranslateX);
      } else {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'translate(0,0) rotate(0deg)';
      }
    });

    return card;
  }

  function swipeCard(card, diffX) {
    const direction = diffX > 0 ? 1 : -1;
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    card.style.transform = `translateX(${direction * 300}px) rotate(${direction * 10}deg)`;
    card.style.opacity = '0';

    card.addEventListener('transitionend', () => {
      card.remove();
      topIndex = (topIndex + 1) % currentCards.length;
      showNextCard();
    }, { once: true });
  }

  function showNextCard() {
    mobileCardsContainer.innerHTML = '';

    const cardData = currentCards[topIndex];
    const topCard = createCard(cardData);
    mobileCardsContainer.appendChild(topCard);

    const nextIndex = (topIndex + 1) % currentCards.length;
    const nextData = currentCards[nextIndex];
    const nextCard = createCard(nextData);
    nextCard.style.transform = 'scale(0.95) translateY(10px)';
    nextCard.style.opacity = '1';
    nextCard.style.zIndex = currentCards.length - 1;
    mobileCardsContainer.insertBefore(nextCard, topCard);
  }

  function updateTheme(category) {
    currentCategory = category; // сохраняем текущую категорию
    document.body.classList.remove('cocktails-theme', 'shots-theme');

    if (category === 'cocktails') {
      document.body.classList.add('cocktails-theme');
      telegramIcon.src = 'assets/images/tg_blue.png'; // синий Telegram
    } else if (category === 'shots') {
      document.body.classList.add('shots-theme');
      telegramIcon.src = 'assets/images/tg_red.png'; // красный Telegram
    }
  }

  const welcomeText = document.getElementById('welcome-text');

  chooseCocktails.addEventListener('click', () => {
    welcomeText.style.display = 'none';
    currentCards = cocktails;
    topIndex = 0;
    updateTheme('cocktails');  
    mobileCardsContainer.innerHTML = '';
    showNextCard();
  });

  chooseShots.addEventListener('click', () => {
    welcomeText.style.display = 'none';
    currentCards = shots;
    topIndex = 0;
    updateTheme('shots');      
    mobileCardsContainer.innerHTML = '';
    showNextCard();
  });

  // Закрытие модалки
  modalClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if(e.target===modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') modal.classList.remove('show'); });
});
