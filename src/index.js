import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import axios from 'axios';

const API_KEY = '35802971-9f205e77cee7d2465290329c6';
const BASE_URL = 'https://pixabay.com/api/';
const axios = require('axios').default;
const formEl = document.querySelector('#search-form');
const galleryItemsEl = document.querySelector('.gallery');
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
    return response;
  } catch (error) {
    console.error(error);
  }
}

async function onSubmit(evt) {
  evt.preventDefault();
  const {
    elements: { searchQuery },
  } = evt.currentTarget;

  nameImages = searchQuery.value;

  if (nameImages === '') {
    return;
  }

  try {
    const dataGallery = await getImages();
    console.log(dataGallery.data.hits); //для перевірки
    galleryItemsEl.insertAdjacentHTML(
      'beforeend',
      createMarkup(dataGallery.data.hits)
    );
  } catch (error) {
    Notify.failure('Oops');
  }
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
            <div class="thumb-img">
                <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
            </div>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>${likes}
                </p>
                <p class="info-item">
                <b>Views</b>${views}
                </p>
                <p class="info-item">
                <b>Comments</b>${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>${downloads}
                </p>
            </div>
        </div>`
    )
    .join('');
}
