// Завдання - пошук країн
// 1.Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою.
// 2.Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн,
//  що задовольнили критерій пошуку. Додай мінімальне оформлення елементів інтерфейсу.
// 3. Назву країни для пошуку користувач вводить у текстове поле input#search-box. HTTP-запити 
// виконуються при введенні назви країни, тобто на події input. Але робити запит з кожним натисканням 
// клавіші не можна, оскільки одночасно буде багато запитів і вони будуть виконуватися в непередбачуваному порядку.
// Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того,
//  як користувач перестав вводити текст. Використовуй пакет lodash.debounce.
// Якщо користувач повністю очищає поле пошуку, то HTTP-запит не виконується, а розмітка списку країн або 
// інформації про країну зникає.
// Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки
// пробіли, або вони є на початку і в кінці рядка.
// 4.Якщо у відповіді бекенд повернув більше ніж 10 країн, в інтерфейсі з'являється повідомлення про те,
//  що назва повинна бути специфічнішою. Для повідомлень використовуй бібліотеку notiflix і виводь такий
//  рядок "Too many matches found. Please enter a more specific name.". Якщо бекенд повернув від 2-х до 
// 10-и країн, під тестовим полем відображається список знайдених країн. Кожен елемент списку складається
//  з прапора та назви країни. Якщо результат запиту - це масив з однією країною, в інтерфейсі відображається 
// розмітка картки з даними про країну: прапор, назва, столиця, населення і мови. Якщо користувач ввів 
// назву країни, якої не існує, бекенд поверне не порожній масив, а помилку зі статус кодом 404 - не 
// знайдено. Якщо це не обробити, то користувач ніколи не дізнається про те, що пошук не дав результатів.
//  Додай повідомлення "Oops, there is no country with that name" у разі помилки, використовуючи бібліотеку notiflix.


import debounce from 'lodash.debounce'; // підключення біблиотеки для імпорту пакетів lodash.debounce.
import Notiflix from 'notiflix';         // підключення біблиотеки notiflix для повідомлення і у разі помилки
import { fetchCountries } from './fetchCountries'; // підключеня функцію fetchCountries(), для HTTP-запитів
import './css/styles.css';   // підключеня стилів css

const DEBOUNCE_DELAY = 300;  // прийом Debounce на обробнику події і робити HTTP-запит через 300мс 

const searchQuery = document.querySelector('#search-box');     //посилання на інпут
const countryList = document.querySelector('.country-list');   //посилання на список країн
const countryInfo = document.querySelector('.country-info');   //посилання на список інформації про країну

searchQuery.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY)); //слухач інпута

//фунція  для обробки даних в інпуті
function onInputChange(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearMarkup(countryList);
    clearMarkup(countryInfo);
    return;
  }

  // проміс
  fetchCountries(countryName)
    .then(json => {
      console.log(json);
      if (json.length > 10) {
        clearMarkup(countryList);
        clearMarkup(countryInfo);
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (json.length >= 2 && json.length <= 10) {
        fetchCountries(countryName).then(countries => {
          clearMarkup(countryInfo);
          renderCountryList(countries);
        });
      } else if (json.length === 1) {
        fetchCountries(countryName).then(countries => {
          clearMarkup(countryList);
          renderCountryInfo(countries);
        });
      }
    })
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

// фунція для відображення списку країн
function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li class="list"><img src="${country.flags.svg}" alt="A flag" width="40px"> <span>   ${country.name.common}</span></li>`
    )
    .join('');
  countryList.innerHTML = markup;
}

// фунція для відображення інформації про країн
function renderCountryInfo(countries) {
  const markup = countries
    .map(
      country =>
        `<img src="${
          country.flags.svg
        }" alt="A flag" width="40px"></img><span>  ${country.name.common}</span>
      <p><b>Capital:</b> ${country.capital}</p>
      <p><b>Popuation:</b> ${country.population}</p>
      <p><b>Languages:</b> ${Object.values(country.languages)}</p>`
    )
    .join('');

  countryInfo.innerHTML = markup;
}

// фунція для очищення 
function clearMarkup(domObject) {
  domObject.innerHTML = '';
}