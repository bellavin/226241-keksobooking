'use strict';


/**
 * 1) Утилитарные функции
 * 2) Генерация данных
 * 3) Манипуляции с картой (активное и неактивное состояния)
 * 4.1) На основе шаблона генерируем DOM элементы
 * 4.2) Отрисовка DOM элементов
 * 5) Отрисовываем карточку объявления
 */


(function () {
  // УТИЛИТАРНЫЕ ФУНКЦИИ

  /**
   * 1) Генератор случайных чисел
   * 2) Функция перемещивающая массив
   * 3) Функция берущая произвольный элемент массива
   * 4) Функция обрезающая массив до рандомной длинны
   */

  window.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  window.shuffleArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = window.getRandomInt(0, i);
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  window.getRandomArraysItem = function (array) {
    var randomIndex = window.getRandomInt(0, array.length - 1);
    return array[randomIndex];
  };

  window.sliceArray = function (array, firstElement, lastElement) {
    var arrayLength = window.getRandomInt(firstElement, lastElement);
    return array.slice(0, arrayLength);
  };
})();


(function () {
  /**
   * 1) Объявление констант (исходные данные)
   * 2) Генерация массива данных на основе исходных данных
   */


  /** Константы:
    * 1) Описания (TITLES)
    * 2) Цена (MIN_PRICE, MAX_PRICE)
    * 3) Тип жилья (DWELLINGS_TYPES)
    * 4) Количество комнат (MIN_ROOMS, MAX_ROOMS)
    * 5) Количество гостей (MIN_GUESTS, MAX_GUESTS)
    * 6) Время заселения и выселения (TIMES)
    * 7) Дополнительные опции (FEATURES)
    * 8) Исходный массив, который наполняем данными (ADS)
    */


  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];

  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;

  var DWELLINGS_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  var MIN_ROOMS = 1;
  var MAX_ROOMS = 5;

  var MIN_GUESTS = 1;
  var MAX_GUESTS = 5;

  var TIMES = [
    '12:00',
    '13:00',
    '14:00'
  ];

  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ];
  var MIN_FEATURES = 0;
  var MAX_FEATURES = FEATURES.length - 1;


  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var SHUFFLED_PHOTOS = window.shuffleArray(PHOTOS);

  var MIN_X = 300;
  var MAX_X = 900;

  var MIN_Y = 130;
  var MAX_Y = 630;


  var ADS = [];


  /**
   * Функция, генерирующая данные:
   */

  window.generateData = function (numberOfElements) {
    for (var i = 0; i < numberOfElements; i++) {


      var AVATAR_NUMBER = '0' + (i + 1);

      var SHUFFLED_TITLES = window.shuffleArray(TITLES);

      var LOCATION_X = window.getRandomInt(MIN_X, MAX_X);
      var LOCATION_Y = window.getRandomInt(MIN_Y, MAX_Y);

      var RANDOM_PRICE = window.getRandomInt(MIN_PRICE, MAX_PRICE);

      var RANDOM_DWELLINGS_TYPE = window.getRandomArraysItem(DWELLINGS_TYPES);

      var NUMBER_OF_ROOMS = window.getRandomInt(MIN_ROOMS, MAX_ROOMS);
      var NUMBER_OF_GUESTS = window.getRandomInt(MIN_GUESTS, MAX_GUESTS);

      var CHECKIN_TIME = window.getRandomArraysItem(TIMES);
      var CHECKOUT_TIME = window.getRandomArraysItem(TIMES);

      var SHUFFLED_FEATURES = window.shuffleArray(FEATURES);
      var CURRENT_FEATURES = window.sliceArray(SHUFFLED_FEATURES, MIN_FEATURES, MAX_FEATURES);


      ADS[i] = {
        'author': {
          'avatar': 'img/avatars/user' + AVATAR_NUMBER + '.png'
        },
        'location': {
          'x': LOCATION_X,
          'y': LOCATION_Y
        },
        'offer': {
          'title': SHUFFLED_TITLES[i],
          'address': LOCATION_X + ', ' + LOCATION_Y,
          'price': RANDOM_PRICE,
          'type': RANDOM_DWELLINGS_TYPE,
          'rooms': NUMBER_OF_ROOMS,
          'guests': NUMBER_OF_GUESTS,
          'checkin': CHECKIN_TIME,
          'checkout': CHECKOUT_TIME,
          'features': CURRENT_FEATURES,
          'description': '',
          'photos': SHUFFLED_PHOTOS

        }
      };
    }
    return ADS;
  };
})();


(function () {
  var MAP = document.querySelector('.map');
  MAP.classList.remove('map--faded');
})();


(function () {
  var getPinElement = function (data) {
    var TEMPLATE = document.querySelector('template').content;
    var MAP_PIN_TEMPLATE = TEMPLATE.querySelector('.map__pin');
    var MAP_PIN_ELEMENT = MAP_PIN_TEMPLATE.cloneNode(true);
    var MAP_PIN_ELEMENT_IMG = MAP_PIN_ELEMENT.querySelector('img');

    MAP_PIN_ELEMENT.style.left = data.location.x + 'px';
    MAP_PIN_ELEMENT.style.top = data.location.y + 'px';
    MAP_PIN_ELEMENT_IMG.src = data.author.avatar;
    MAP_PIN_ELEMENT_IMG.alt = data.author.description;

    return MAP_PIN_ELEMENT;
  };

  window.renderPinElement = function (dataArray) {
    var MAP_PINS = document.querySelector('.map__pins');
    var FRAGMENT = document.createDocumentFragment();

    for (var i = 0; i < dataArray.length; i++) {
      FRAGMENT.appendChild(getPinElement(dataArray[i]));
    }

    MAP_PINS.appendChild(FRAGMENT);
  };
})();


(function () {
  var OFFER_DWELLINGS_TYPES = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var TEMPLATE = document.querySelector('template').content;
  var MAP_CARD_TEMPLATE = TEMPLATE.querySelector('.map__card');
  var POPUP = MAP_CARD_TEMPLATE.cloneNode(true);


  var createFeatures = function (data) {
    var POPUP_FEATURES = POPUP.querySelector('.popup__features');
    var REMOVED_FEATURES_ELEMENTS = POPUP_FEATURES.querySelectorAll('.popup__feature');
    for (var i = 0; i < REMOVED_FEATURES_ELEMENTS.length; i++) {
      POPUP_FEATURES.removeChild(REMOVED_FEATURES_ELEMENTS[i]);
    }

    for (var j = 0; j < data.offer.features.length; j++) {
      var POPUP_FEATURES_ELEMENT = document.createElement('li');
      POPUP_FEATURES_ELEMENT.className = 'popup__feature popup__feature--' + data.offer.features[j];
      POPUP.querySelector('.popup__features').appendChild(POPUP_FEATURES_ELEMENT);
    }
  };

  var createPhotos = function (data) {
    var PHOTOS = POPUP.querySelector('.popup__photos');
    var PHOTOS_TEMPLATE = PHOTOS.querySelector('img');
    var NUM_OF_PHOTOS = data.offer.photos.length - 1;
    for (var i = 0; i < NUM_OF_PHOTOS; i++) {
      var PHOTO = PHOTOS_TEMPLATE.cloneNode();
      PHOTOS.appendChild(PHOTO);
    }

    var CREATED_PHOTOS = PHOTOS.querySelectorAll('img');
    for (var j = 0; j < CREATED_PHOTOS.length; j++) {
      CREATED_PHOTOS[j].src = data.offer.photos[j];
    }
  };

  window.createMapCard = function (data) {
    POPUP.querySelector('.popup__title').textContent = data.offer.title;
    POPUP.querySelector('.popup__text--address').textContent = data.offer.address;
    POPUP.querySelector('.popup__text--price').textContent = data.offer.price + '₽/ночь';
    POPUP.querySelector('.popup__type').textContent = OFFER_DWELLINGS_TYPES[data.offer.type];
    POPUP.querySelector('.popup__text--capacity').textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    POPUP.querySelector('.popup__text--time').textContent = 'Заезд после' + data.offer.checkin + ' , выезд до ' + data.offer.checkout;
    createFeatures(data);
    POPUP.querySelector('.popup__description').textContent = data.offer.description;
    createPhotos(data);
    POPUP.querySelector('.popup__avatar').src = data.author.avatar;

    var MAP = document.querySelector('.map');
    var MAP_FILTERS_CONTAINER = MAP.querySelector('.map__filters-container');

    MAP.insertBefore(POPUP, MAP_FILTERS_CONTAINER);
  };
})();


var NUM_OF_ELEMENTS = 8;
var DATA_ARRAY = window.generateData(NUM_OF_ELEMENTS);
var DATA_MAP_CARD = DATA_ARRAY[0];

window.renderPinElement(DATA_ARRAY);
window.createMapCard(DATA_MAP_CARD);
