import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { getImages } from './getImages';
import { createMarkup } from './createMarkup';

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

  nameImages = searchQuery.value.trim();

  if (nameImages === '') {
    evt.currentTarget.reset();
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

/** Очищаємо розмітку при очистці інпута */
inputEl.addEventListener('input', event => {
  if (event.currentTarget.value === '') {
    galleryItemsEl.innerHTML = '';
  }
});
