import axios from 'axios';
// Збереження ключа API в окремому файлі змінних
import { KEY } from './api-key.js';

// Перевірка помилок під час виконання запиту до серверу
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
    return Promise.reject(error);
  },
);

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response.data;
}

export { fetchImages };
