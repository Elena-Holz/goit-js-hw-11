import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '29134253-bbfb6b627ddeed17a742fb71a';

const formRef = document.querySelector('#search-form');
const galleryMarket = document.querySelector('.gallery');
const inputRef = document.querySelector('input');
const btnMore = document.querySelector('.load-more');

btnMore.classList.add('is-hidden');
 

async function getFetch(q, page) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}&per_page:40`;
   return await axios.get(url).then(response => response.data);
}
  

let photoName = '';
let currentPage = 1;
let currentHits = 0;

const lightbox = new SimpleLightbox(".photo-card  a", {
    captionsData: "alt",
    captionDelay: 250,
  captionPosition: "bottom",
    captions: true,
});

formRef.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
    e.preventDefault();
  photoName = e.target.searchQuery.value;
  currentPage = 1;
  console.log(photoName.length);
  if (photoName.length === 0) {
    // galleryMarket.innerHTML = '';
    return incorrectName();
    }
    
  try {
const response = await getFetch(photoName, currentPage)
  // console.log('hits-length:', response.hits.length)
  // console.log(response);
  // console.log('totalHits:', response.totalHits);
    const fotoAr = response.hits;
  
  if (response.totalHits === 0) {
    galleryMarket.innerHTML = '';
    incorrectName();
  }
  
  if (response.totalHits > 0) {
    galleryMarket.innerHTML = '';
    lightbox.refresh();
     Notiflix.Notify.info(`Hooray! We found ${response.totalHits} images.`)
    galleryMarket.insertAdjacentHTML("beforeend", fotoGenerate(fotoAr));
    btnMore.addEventListener('click', onClickBtnMore);    
  }
    
  if (response.totalHits > 40){
  btnMore.classList.remove('is-hidden');
  } else {
    btnMore.classList.add('is-hidden');
    
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
    }
  } catch (error) {
    console.log(error.message);
  }
  }

function fotoGenerate(fotoAr) {
    //  console.log(fotoAr);
    const fotoCard = fotoAr
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
            <div class="photo-card">
            <a href="${largeImageURL}" class=photo-card>
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
           </a>
          <div class="info">
              <p class="info-item">
                <br>Likes</br>
                ${likes}
              </p>
              <p class="info-item">
                <br>Views</br>
                ${views}
              </p>
              <p class="info-item">
                <br>Comments</br>
                ${comments}
              </p>
              <p class="info-item">
              <br>Downloads</br>
              ${downloads}
              </p>
            </div>
          </div>
         
            `
        }).join('')
    return fotoCard;
    console.log(fotoCard);
}

async function onClickBtnMore() {
  currentPage += 1;
  // console.log('currentPage', currentPage);
  btnMore.classList.remove('is-hidden');

  const response = await getFetch(photoName, currentPage)
  lightbox.refresh();
  currentHits += response.hits.length;
  // console.log('currentHits', currentHits);
  // console.log('totaltHits', response.totalHits)
  // console.log('response.hits.length:', response.hits.length);
  const fotoAr = response.hits;
 
  galleryMarket.insertAdjacentHTML("beforeend", fotoGenerate(fotoAr));
  
  if (response.totalHits % currentHits < response.hits.length) {
    currentHits += response.totalHits % currentHits;
    // console.log('currentHits', currentHits);
  } 

  if (currentHits >= response.totalHits || response.hits.length === 0) {
    isEndColection();
    btnMore.classList.add('is-hidden');
   
  }
}

function incorrectName() {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
};

function isEndColection() {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
};

