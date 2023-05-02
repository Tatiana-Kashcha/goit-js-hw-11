import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { getImages } from './getImages';
import { createMarkup } from './createMarkup';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('#search-form input');
const galleryItemsEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let nameImages = '';
let currentPage = 1;
let totalPage = 0;
let perPage = 0;

export { nameImages };
export { currentPage };

formEl.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

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
  currentPage = 1;
  loadMoreBtn.hidden = true;

  if (nameImages === '') {
    evt.currentTarget.reset();
    return;
  }

  try {
    const dataGallery = await getImages();
    // console.log(dataGallery.data.hits); //для перевірки
    galleryItemsEl.innerHTML = createMarkup(dataGallery.data.hits);
    galleryLightBox.refresh();

    if (dataGallery.data.hits.length) {
      Notify.success(`Hooray! We found ${dataGallery.data.totalHits} images.`);
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryItemsEl.innerHTML = '';
      loadMoreBtn.hidden = true;
    }

    totalPage =
      Math.ceil(dataGallery.data.totalHits / dataGallery.data.hits.length) ||
      'Сторінки відсутні';
    perPage = dataGallery.data.hits.length;

    console.log(`Номер сторінки: ${currentPage}`);
    console.log(`Загальна кількість сторінок: ${totalPage}`);
    console.log(`Кількість карток на сторінці: ${perPage}`);
    // console.log(totalPage > currentPage); //для перевірки

    if (totalPage > currentPage) {
      loadMoreBtn.hidden = false;
    }
  } catch (error) {
    console.error(error);
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
}

/** Очищає розмітку при очистці інпута та ховає кнопку пагінації */
inputEl.addEventListener('input', event => {
  if (event.currentTarget.value === '') {
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
});

/**
 * Виконує пагінацію галереї карток
 */
async function onClickLoadMoreBtn() {
  currentPage += 1;
  if (currentPage === totalPage) {
    loadMoreBtn.hidden = true;

    Notify.failure(
      'We/re sorry, but you/ve reached the end of search results.'
    );
  }
  try {
    const dataGalleryPagination = await getImages();
    galleryItemsEl.insertAdjacentHTML(
      'beforeend',
      createMarkup(dataGalleryPagination.data.hits)
    );
    galleryLightBox.refresh();
    perPage = dataGalleryPagination.data.hits.length;

    console.log(`Номер сторінки: ${currentPage}`);
    console.log(`Загальна кількість сторінок: ${totalPage}`);
    console.log(`Кількість карток на сторінці: ${perPage}`);
  } catch (error) {
    console.error(error);
    galleryItemsEl.innerHTML = '';
    loadMoreBtn.hidden = true;
    currentPage = 1;
  }
}
