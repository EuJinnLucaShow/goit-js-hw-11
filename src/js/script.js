import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);

function renderGallery(images) {
  // Перевірка чи існує галерея перед вставкою даних
  if (!gallery) {
    return;
  }

  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  // Цей код дозволяє автоматично прокручувати сторінку на висоту 2 карток галереї, коли вона завантажується
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.',
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onloadMore() {
  page += 1;
  simpleLightBox.destroy();
  // simpleLightBox.refresh();

  fetchImages(query, page, perPage)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
        );
      }
    })
    .catch(error => console.log(error));
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  );
}

// Функція, яка виконуеться, якщо користувач дійшов до кінця сторінки
function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onloadMore();
  }
}

// Додати подію на прокручування сторінки, яка викликає функцію showLoadMorePage
window.addEventListener('scroll', showLoadMorePage);

// кнопка “вгору”->
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});
