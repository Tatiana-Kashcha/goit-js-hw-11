import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import axios from 'axios';

const API_KEY = '35802971-9f205e77cee7d2465290329c6';
const BASE_URL = 'https://pixabay.com/api/';
const axios = require('axios').default;
const formEl = document.querySelector('#search-form');
let nameImages = '';

formEl.addEventListener('submit', onSubmit);

async function getImages() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: nameImages,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Рендерить розмітку в залежності від результатів пошуку
 * @param {*} evt
 */
function onSubmit(evt) {
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;
  nameImages = searchQuery.value;
  console.log(nameImages);
  if (nameImages === '') {
    return;
  }

  getImages();

  // .then(data => {
  //   console.log(data); //для перевірки
  // })
  // .catch(error => {
  //   Notify.failure('Oops');
  // });
}
