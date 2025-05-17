const reel = document.getElementById('reel');
const spinBtn = document.getElementById('spin');
const withdrawBtn = document.getElementById('withdraw');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalWithdraw = document.getElementById('modal-withdraw');
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const modalClose = document.getElementById('modal-close');

const originalImages = Array.from(reel.querySelectorAll('img')); // сохраняем оригинальные изображения

let userImageData = null; // переменная для хранения пользовательского изображения

// Восстанавливаем картинку из localStorage при загрузке страницы
const savedImage = localStorage.getItem('userImageData');
if (savedImage) userImageData = savedImage;

// Список путей к вашим изображениям
const imagePaths = [
  'gift/7.png', 'gift/8.png', 'gift/9.png', 'gift/10.png', 'gift/11.png',
  'gift/12.png', 'gift/13.png', 'gift/14.png', 'gift/15.png', 'gift/16.png',
  'gift/17.png', 'gift/18.png', 'gift/19.png'
];

// Функция для создания массива <img>
function getOriginalImages() {
  return imagePaths.map(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'prize';
    return img;
  });
}

// Функция для расчёта полной ширины одного элемента (включая margin)
function getItemWidth(el) {
  const styles = getComputedStyle(el);
  return el.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
}

chooseFileBtn.onclick = function() {
  fileInput.click();
};

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      userImageData = e.target.result;
      localStorage.setItem('userImageData', userImageData); // сохраняем в localStorage

      // Сразу обновляем картинку в модалке (для наглядности)
      modalImg.src = userImageData;
      modal.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }
});

spinBtn.addEventListener('click', () => {
  reel.style.transition = 'none';
  reel.innerHTML = '';

  const imagesForReel = userImageData
    ? [createUserImage(), ...originalImages]
    : [...originalImages];

  // Увеличьте количество повторов!
  const rounds = 30;
  for (let r = 0; r < rounds; r++) {
    imagesForReel.forEach(img => {
      reel.appendChild(img.cloneNode(true));
    });
  }

  Promise.all(imagesForReel.map(img => loadImage(img.src)))
    .then(() => {
      startSpin(imagesForReel);
    });
});

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

function createUserImage() {
  const userImg = document.createElement('img');
  userImg.src = userImageData;
  userImg.alt = "Ваше изображение";
  userImg.className = "prize";
  return userImg;
}

// Функция запуска вращения (адаптируйте под ваш startSpin)
function startSpin(imagesForReel) {
  const itemWidth = getItemWidth(reel.querySelector('img'));
  const items = imagesForReel.length;

  const indicatorCenter = reel.parentElement.offsetWidth / 2;
  const stopIndex = 0; // или ваш индекс выигрыша
  const prizeOffset = stopIndex * itemWidth + itemWidth / 2;
  const maxShift = items * itemWidth; // Уменьшено для более плавной анимации
  const totalShift = (items - 1) * itemWidth + prizeOffset - indicatorCenter;
  const finalShift = Math.min(totalShift, maxShift);

  reel.style.transform = 'translateX(0)';
  const spinTime = 4; // секунды

  setTimeout(() => {
    reel.style.transition = `transform ${spinTime}s cubic-bezier(.45,1.8,.5,1)`;
    reel.style.transform = `translateX(-${finalShift}px)`;
  }, 20);

  setTimeout(() => {
    reel.style.transition = 'none';

    // Первый фейерверк сразу после остановки
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Через 3 секунды показываем модалку и ещё один фейерверк
    setTimeout(() => {
      if (userImageData) {
        modalImg.src = userImageData;
      } else {
        modalImg.src = imagePaths[3]; // например, 4-я картинка
      }
      modal.style.display = 'flex';

      // Второй фейерверк при показе окна
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 3000);

  }, spinTime * 1000 + 20);
}

// Кнопка "Вывести" в модальном окне
modalWithdraw.addEventListener('click', function() {
  window.location.href = 'https://onesecgo.ru/stream/telegramstar'; // ← замените на нужный адрес
});

modalClose.addEventListener('click', function() {
  modal.style.display = 'none';
});

