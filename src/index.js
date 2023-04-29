import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { getImages } from './getImages';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-form input');
const galleryItemsEl = document.querySelector('.gallery');
let nameImages = '';

export { nameImages };

formEl.addEventListener('submit', onSubmit);

const galleryLightBox = new SimpleLightbox('.gallery a');

/**
 * Рендерить розмітку в залежності від результатів пошуку
 * @param {*} evt
 * @returns
 */
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
    console.log(dataGallery.data.hits.length); //для перевірки
    galleryItemsEl.insertAdjacentHTML(
      'beforeend',
      createMarkup(dataGallery.data.hits)
    );
    galleryLightBox.refresh();

    if (dataGallery.data.hits.length) {
      Notify.success(`Hooray! We found ${dataGallery.data.totalHits} images.`);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryItemsEl.innerHTML = '';
    }
  } catch (error) {
    Notify.failure('Oops');
    galleryItemsEl.innerHTML = '';
  }
}

/** Очищаємо розмітку при очістці інпута */
inputEl.addEventListener('input', event => {
  if (inputEl.value === '') {
    galleryItemsEl.innerHTML = '';
  }
});

/**
 * Створює розмітку галереї за вхідними параметрами
 * @param {*} arr масив об'єктів
 * @returns розмітку для рендеру
 */
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
                <a class="gallery-link" href=${largeImageURL}>
                    <img class="gallery-image" src=${webformatURL} alt="${tags}" loading="lazy"/>
                </a>
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
