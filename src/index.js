import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchQuery = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchQuery.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearMarkup(countryList);
    clearMarkup(countryInfo);
    return;
  }

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

function renderCountryList(countries) {
  const markup = countries
    .map(
      country =>
        `<li><img src="${country.flags.svg}" alt="A flag" width="40px"><span>${country.name.common}</span></li>`
    )
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(
      country =>
        `<img src="${
          country.flags.svg
        }" alt="A flag" width="40px"></img><span>${country.name.common}</span>
      <p><b>Capital:</b> ${country.capital}</p>
      <p><b>Popuation:</b> ${country.population}</p>
      <p><b>Languages:</b> ${Object.values(country.languages)}</p>`
    )
    .join('');

  countryInfo.innerHTML = markup;
}

function clearMarkup(domObject) {
  domObject.innerHTML = '';
}