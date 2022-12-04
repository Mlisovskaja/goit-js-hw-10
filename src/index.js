import './css/styles.css';
import countries from './fetchCountries';
import Notiflix from 'notiflix';

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    const name = event.target.value.trim();
    
    countries.fetchCountries(name)
        .then(renderCountry) 
 .catch(onCatch)
}

function renderCountry(country) {
    clearInput();
    console.log(country);
    if (country.length === 1) {
        clearInput();
        const countryDescription = country.map(({ name, capital, population, flags, languages }) => {
            let lang = '';
            for (let key in languages) {
                lang = languages[key];
            }
    return `
    <ul>
    <h2 class='country'><img class='big-flag-img' src="${flags.svg}" alt="flag">${name.official}</h2>
    <li>Сapital: ${capital}</li>
    <li>Population: ${population}</li>
    <li>Languages: ${lang}</li>
    </ul>`
        }).join("");
        countryInfo.insertAdjacentHTML('beforeend', countryDescription);
    }
    else if (country.length >= 11) {
        clearInput();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name');
    }

    else if (country.length <= 10 || country.length >= 2) {
        clearInput();
        const listName = country.map(({name, flags}) => {
    return `
    <li><img class='flag-img' src="${flags.svg}" alt="flag">${name.official}</li>
    `;
  }).join("");

        countryList.insertAdjacentHTML('beforeend', listName);
    }
    
}

function onCatch(error) {
    if (error) {
        clearInput();
        Notiflix.Notify.failure('Oops, there is no country with that name');
    }
 };

function clearInput() {
    countryInfo.textContent = '';
    countryList.textContent = '';
 }

