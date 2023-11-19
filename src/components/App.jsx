import axios from 'axios';

import React, { useEffect, useState } from 'react';
import Searchbar from './searchbar/Seachbar';
import ImageGallery from './imagegallery/ImageGallery';
import ImageGalleryItem from './imagegalerryitem/ImageGalleryItem';
import Loader from './loader/Loader';
import Button from './button/Button';
import Modal from './modal/Modal';

function ImageFinder() {
  const [pictures, setPictures] = useState([]);
  const [modalOn, setModalOn] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [totalPictures, setTotalPictures] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [modalImage, setModalImage] = useState('');

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
    } catch (error) {
      setError(error.toString());
    } finally {
      setisLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const query = e.target.query.value;

    setSearchQuery(query);

    setPictures([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    getImages(searchQuery, currentPage);
  }, [searchQuery, currentPage]);

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

// class ImageFinder extends Component {
//   state = {
//     isLoading: false,
//     modalOn: false,
//     modalImage: '',
//     query: '',
//     pictures: [],
//     totalPictures: 0,
//     currentPage: 1,
//     error: '',
//   };

//   getImages = async () => {
//     const URL = 'https://pixabay.com/api/';

//     const params = {
//       key: '39310150-ae6655c0c5d929a5c6e93be30',
//       q: this.state.query,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       page: this.state.currentPage,
//       per_page: 12,
//     };

//     try {
//       this.setState({ isLoading: true });

//       const result = await axios
//         .get(URL, { params })
//         .then(response => response.data);

//       this.setState({ totalPictures: result.totalHits });

//       const photos = await result.hits;

//       this.setState(state => ({
//         pictures: [...state.pictures, ...photos],
//       }));
//     } catch (error) {
//       this.setState({ error: error.toString() });
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const newState = this.state;

//     if (
//       prevState.currentPage !== newState.currentPage ||
//       prevState.query !== newState.query
//     ) {
//       this.getImages();
//     }
//   }

//   handleSubmit = async e => {
//     e.preventDefault();
//     const form = e.currentTarget;
//     const query = form.elements.query.value;

//     this.setState({
//       query: query,
//       pictures: [],
//       currentPage: 1,
//     });
//   };

//   handleClick = () => {
//     this.setState(state => ({ currentPage: state.currentPage + 1 }));
//   };

//   imageHandler = e => {
//     const largeImage = e.target.dataset.image;

//     if (largeImage === undefined) {
//       return;
//     }

//     this.setState({ modalImage: largeImage, modalOn: true });
//   };

//   modalHandler = e => {
//     if (e.target.className === 'Overlay') {
//       this.setState({ modalOn: false });
//     }
//   };

//   render() {
//     const { pictures, totalPictures, isLoading, modalOn, modalImage } =
//       this.state;
//     return (
//       <>
//         <Searchbar onSubmit={this.handleSubmit} />
//         <ImageGallery onClick={this.imageHandler}>
//           {pictures.map(picture => (
//             <ImageGalleryItem key={picture.id} image={picture} />
//           ))}
//         </ImageGallery>
//         {modalOn && <Modal imageSrc={modalImage} onClick={this.modalHandler} />}
//         {isLoading && <Loader />}
//         {pictures.length !== 0 && pictures.length !== totalPictures && (
//           <Button onClick={this.handleClick} />
//         )}
//       </>
//     );
//   }
// }

export const App = () => {
  return (
    <div>
      <ImageFinder />
    </div>
  );
};
