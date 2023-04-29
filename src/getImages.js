import axios from 'axios';
import { nameImages } from './index';

const API_KEY = '35802971-9f205e77cee7d2465290329c6';
const BASE_URL = 'https://pixabay.com/api/';

/**
 * Виконує запит на бекенд з заданними властивостями - об'єктом "params",
 * де nameImages - назва, яку ввів користувач в пошуку;
 * @returns Promis
 */
async function getImages() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: nameImages,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });
    console.log(response); //для перевірки
    return response;
  } catch (error) {
    console.error(error);
  }
}
export { getImages };
