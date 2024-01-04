// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

let colors = {
  'фиолетовый': 'violet',
  'зеленый': 'green',
  'розово-красный' : 'carmazin',
  'желтый' : 'yellow',
  'светло-коричневый' : 'lightbrown'
};

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  fruitsList.textContent = '';

  for (let i = 0; i < fruits.length; i++) {
    let liElem = document.createElement('li');
    let fruitInfo = document.createElement('div');

    liElem.classList.add('fruit__item');
    fruitInfo.classList.add('fruit__info');

    for (let attr in fruits[i]) {
      if (attr === 'color') {
        if (colors.hasOwnProperty(fruits[i][attr]))
        {
          liElem.classList.add('fruit_' + colors[fruits[i][attr]]);
        }
      }
      let div = document.createElement('div');
      div.textContent = `${attr}: ${fruits[i][attr]}`;
      fruitInfo.appendChild(div);
    }

    liElem.appendChild(fruitInfo);
    fruitsList.appendChild(liElem);

    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [],
      index = 0,
      arrTempFruits = fruits.slice(),
      bIdentity = true;

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)

    index = getRandomInt(0, fruits.length - 1);
    result.push(fruits[index]);
    fruits.splice(index, 1);
  }

  for (let i = 0; i < arrTempFruits.length; i++) {
    Object.keys(arrTempFruits[i]).forEach((key) => {
      if (arrTempFruits[i][key] !== result[i][key])
        bIdentity = false;
    });
    if (!bIdentity) break;
  }

  if (bIdentity) {
    alert('Предупреждаем! Порядок не изменился!')
  }
  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    const minVal = parseInt(document.getElementsByClassName('minweight__input')[0].value),
        maxVal = parseInt(document.getElementsByClassName('maxweight__input')[0].value);

    if (!isNaN(minVal) && !isNaN(maxVal) && minVal <= maxVal) {
      return item.weight >= minVal && item.weight <= maxVal;
    }
    else if (!isNaN(minVal) && isNaN(maxVal)) {
      return item.weight >= minVal;
    }
    else if (isNaN(minVal) && !isNaN(maxVal)) {
      return item.weight <= maxVal;
    }
    else {
      return true;
    }
  });

};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const priority = ['красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'синий', 'фиолетовый'];
  let priority1, priority2;

  if (priority.indexOf(a.color) === -1 && priority.indexOf(b.color) === -1) {
    priority1 = a.color;
    priority2 = b.color;
  }
  else {
    priority1 = priority.indexOf(a.color) === -1 ? priority.length + 1 : priority.indexOf(a.color);
    priority2 = priority.indexOf(b.color) === -1 ? priority.length + 1 : priority.indexOf(b.color);
  }

  return priority1 > priority2;
};

const sortAPI = {
  bubbleSort(arr, comparation)
  {
    let n = arr.length;
    if (n > 0) {
      // внешняя итерация по элементам
      for (let i = 0; i < n - 1; i++) {
        // внутренняя итерация для перестановки элемента в конец массива
        for (let j = 0; j < n - 1 - i; j++) {
          // сравниваем элементы
          if (comparation(arr[j], arr[j + 1])) {
            // делаем обмен элементов
            let temp = arr[j + 1];
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
    }
  },

  quickSort(arr, comparation)
  {
    function quickSortFun(arr) {
      if (arr.length < 2) return arr;

      let pivot = arr[0];
      const left = [];
      const right = [];

      for (let i = 1; i < arr.length; i++)
      {
        if (comparation(pivot, arr[i])) {
          left.push(arr[i]);
        }
        else {
          right.push(arr[i]);
        }
      }
      return quickSortFun(left).concat(pivot, quickSortFun(right));

    }

    fruits = quickSortFun(arr);
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  if (!kindInput.value.length || !colorInput.value.length || !weightInput.value.length) {
    alert('Не все поля заполнены! Добавить фрукт не получится!');
    return;
  }
  let newElem = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: weightInput.value
  }
  fruits.push(newElem);
  display();
});