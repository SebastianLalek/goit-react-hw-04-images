import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Notiflix from 'notiflix';

// components
import Searchbar from './searchbar/Seachbar';
import ImageGallery from './imagegallery/ImageGallery';
import ImageGalleryItem from './imagegalerryitem/ImageGalleryItem';
import Loader from './loader/Loader';
import Button from './button/Button';
import Modal from './modal/Modal';

function ImageFinder() {
  // states
  const [pictures, setPictures] = useState([]);
  const [modalOn, setModalOn] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [totalPictures, setTotalPictures] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [modalImage, setModalImage] = useState('');

  // API request
  const getImages = async (query, page) => {
    const URL = 'https://pixabay.com/api/';

    const params = {
      key: '39310150-ae6655c0c5d929a5c6e93be30',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: page,
      per_page: 12,
    };

    setError('');

    if (query === '') {
      return setPictures([]);
    }

    try {
      setisLoading(true);

      const result = await axios
        .get(URL, { params })
        .then(response => response.data);

      const totalHits = result.totalHits;
      setTotalPictures(totalHits);

      const photos = await result.hits;
      setPictures(pictures => [...pictures, ...photos]);
    } catch (err) {
      setError(err.toString());
    } finally {
      setisLoading(false);
    }
  };

  // event handlers

  const handleSubmit = e => {
    e.preventDefault();
    const query = e.target.query.value;

    setSearchQuery(query);
    setPictures([]);
    setCurrentPage(1);
  };

  const imageHandler = e => {
    const largeImage = e.target.dataset.image;
    if (largeImage === undefined) {
      return;
    }

    setModalImage(largeImage);
    setModalOn(true);
  };

  const handleClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const modalHandler = e => {
    if (e.target.className === 'Overlay') {
      setModalOn(false);
    }
  };

  // use effects

  useEffect(() => {
    getImages(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (error !== '') {
      Notiflix.Notify.failure(error);
    }
  }, [error]);

  return (
    <>
      <Searchbar onSubmit={handleSubmit} />
      <ImageGallery onClick={imageHandler}>
        {pictures.map(picture => (
          <ImageGalleryItem key={picture.id} image={picture} />
        ))}
      </ImageGallery>
      {modalOn && <Modal imageSrc={modalImage} onClick={modalHandler} />}
      {isLoading && <Loader />}
      {pictures.length !== totalPictures && pictures.length !== 0 && (
        <Button onClick={handleClick} />
      )}
    </>
  );
}

export const App = () => {
  return (
    <div>
      <ImageFinder />
    </div>
  );
};
