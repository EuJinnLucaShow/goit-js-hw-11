import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const searchQuery = searchForm.searchQuery.value.trim();

  if (!searchQuery) {
    Notiflix.Notify.warning('Please enter a search term.');
    return;
  }

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=34187261-edb3bdfe414ee3b7adebeccc5&q=${encodeURIComponent(
        searchQuery,
      )}&image_type=photo&orientation=horizontal&safesearch=true`,
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (data.hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    const galleryHTML = data.hits
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
              <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" data-src="${largeImageURL}" />
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

    gallery.insertAdjacentHTML('beforeend', galleryHTML);

    const lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionDelay: 250,
    });
  } catch (error) {
    console.log(error);
    Notiflix.Notify.failure(
      'Oops! Something went wrong. Please try again later.',
    );
  }
});
