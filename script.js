document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');

  let descriptions = {};
  fetch('descriptions.json')
    .then(res => res.json())
    .then(data => descriptions = data)
    .catch(() => console.warn("Описание не загружено"));

  const mobileCardsContainer = document.getElementById('mobile-cards');
  const chooseCocktails = document.getElementById('choose-cocktails');
  const chooseShots = document.getElementById('choose-shots');

  const cocktails = [
    {id:'long_island', title:'Unsigned long long island', price:'300₽', img:'assets/images/long_island.jpg'},
    {id:'adren_arina', title:'АдренАрина', price:'250₽', img:'assets/images/adren_arina.jpg'},
    {id:'sex_na_obscom', title:'Секс на обском', price:'250₽', img:'assets/images/sex_na_obskom.jpg'},
    {id:'leka_v_prime', title:'Лека в прайме', price:'200₽', img:'assets/images/leka_v_praime.jpg'},
    {id:'history', title:'История', price:'200₽', img:'assets/images/histori.jpg'},
    {id:'pivnaya_ryumka', title:'Пивная рюмка из Трёхгорного', price:'150₽', img:'assets/images/ryumka.jpg'},
    {id:'getero_laguna', title:'Гетеросексуальная лагуна', price:'150₽', img:'assets/images/laguna.jpg'}
  ];

  const shots = [
    {id:'p_52', title:'П-52', price:'100₽', img:'assets/images/p_p2.jpg'},
    {id:'Kurator', title:'Хуевый Куратор', price:'150₽ (2 шт)', img:'assets/images/kurator.jpg'},
    {id:'Vkusno', title:'Вкусно', price:'300₽ (6 шт)', img:'assets/images/vkusno.jpg'},
    {id:'Smert', title:'Смерть в саване', price:'300₽ (6 шт)', img:'assets/images/smert.jpg'}
  ];

  let currentCards = [];
  let topIndex = 0;
  let startX = 0;
  let startY = 0;
  let currentTranslateX = 0;
  let currentTranslateY = 0;

  function createCard(cardData) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="${cardData.img}" alt="${cardData.title}">
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
      const threshold = 100; // минимальное смещение для перелистывания
      if(Math.abs(currentTranslateX) > threshold) {
        swipeCard(card, currentTranslateX);
      } else {
        // Возврат на место
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

    // Верхняя карточка
    const cardData = currentCards[topIndex];
    const topCard = createCard(cardData);
    mobileCardsContainer.appendChild(topCard);

    // Следующая карточка (под ней)
    const nextIndex = (topIndex + 1) % currentCards.length;
    const nextData = currentCards[nextIndex];
    const nextCard = createCard(nextData);
    nextCard.style.transform = 'scale(0.95) translateY(10px)';
    nextCard.style.opacity = '1';
    nextCard.style.zIndex = currentCards.length - 1;
    mobileCardsContainer.insertBefore(nextCard, topCard);
  }

function updateTheme(category) {
  document.body.classList.remove('cocktails-theme', 'shots-theme');

  if (category === 'cocktails') {
    document.body.classList.add('cocktails-theme');
  } else if (category === 'shots') {
    document.body.classList.add('shots-theme');
  }
}


const welcomeText = document.getElementById('welcome-text');

chooseCocktails.addEventListener('click', () => {
  welcomeText.style.display = 'none'; // скрываем приветствие
  currentCards = cocktails;
  topIndex = 0;
  updateTheme('cocktails');  
  mobileCardsContainer.innerHTML = '';
  showNextCard();
});

chooseShots.addEventListener('click', () => {
  welcomeText.style.display = 'none'; // скрываем приветствие
  currentCards = shots;
  topIndex = 0;
  updateTheme('shots');      
  mobileCardsContainer.innerHTML = '';
  showNextCard();
});



  chooseCocktails.addEventListener('click', () => {
    currentCards = cocktails;
    topIndex = 0;
    updateTheme('cocktails'); 
    showNextCard();
  });

  chooseShots.addEventListener('click', () => {
    currentCards = shots;
    topIndex = 0;
    updateTheme('shots'); 
    showNextCard();
  });

  // Закрытие модалки
  modalClose.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', e => { if(e.target===modal) modal.classList.remove('show'); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') modal.classList.remove('show'); });
});
