import { Component, useEffect, useState } from "react";
import { MainContainer } from "./App.styled";
import { Searchbar } from "components/Searchbar/";
import { ImageGallery } from "components/ImageGallery";
import { getPics } from "services/getPics";
import { Button } from "components/Button";
import { Loader } from "components/Loader";
import Modal from "components/Modal/Modal";
import { ErrorView } from "components/ErrorView/ErrorView";

export function App() {
  
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('idle');
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const prevImages = searchQuery;
    const prevPage = page;
    const nextImages = searchQuery;
    const nextPage = page;

    if ((prevImages !== nextImages || prevPage !== nextPage) && status !== 'pending') {
      setStatus('pending');
      if (nextPage === 1) {
        setImages([]);
      }
      fetchPics();
    }
  }, [searchQuery, page]);
  
    const onSearchSubmit = (imageName) => {
    if (imageName !== searchQuery && status !== 'pending') {
      setSearchQuery(imageName);
      setPage(1);
      setImages([]);
      setStatus('pending');
  }
};

  const fetchPics = () => {
      getPics(searchQuery, page)
        .then(response => {
          console.log('Response from getPics:', response);
          const hits = response.hits;
          
          if (!hits || hits.length === 0) {
            setStatus('rejected');
          } else {
            setImages(prevImages => page === 1 ? hits : [...prevImages, ...hits]);
            setStatus('resolved');
            setTotalHits(response.totalHits);
          }
      })
        .catch(error => {
          console.log(error);
          setError(error.message);
          setStatus('rejected');
        });
  }

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  }

  const toggleModal = largeImageURL => {
      setShowModal(prevShowModal => !prevShowModal);
      setModalImage(largeImageURL);
    };


  return (
      <MainContainer>
        <Searchbar onSubmit={onSearchSubmit} />
        {status !== 'idle' && images.length > 0 && (
          <ImageGallery images={images} toggleModal={toggleModal}/>
        )} 
        {status === 'resolved' && images.length !== 0 && (
          <Button onClick={loadMore} />
        )}
        {status === "rejected" && <ErrorView/>}
        {status === "pending" && <Loader/>}
        {showModal && (<Modal modalImage={modalImage} closeModal={toggleModal} />)}
      </MainContainer>
    );

}


// export class App extends Component {

//     state = {
//       images: [],
//       showModal: false,
//       page: 1,
//       searchQuery: '',
//       status: 'idle',
//       totalHits: 0,
//       error: null,
//       modalImage: null,
//     }

//   componentDidUpdate(_, prevState) {     
//     const prevImages = prevState.searchQuery;
//     const prevPage = prevState.page;
//     const nextImages = this.state.searchQuery;
//     const nextPage = this.state.page;

//     if ((prevImages !== nextImages || prevPage !== nextPage) && this.state.status !== 'pending') {
//       this.setState({
//         status: 'pending',
//       });
//       if (nextPage === 1) {
//         this.setState({ images: [] });
//       }
//       this.fetchPics();
//     }
//   }

//   onSearchSubmit = (imageName) => {
//   if (imageName !== this.state.searchQuery && this.state.status !== 'pending') {
//     this.setState({
//       searchQuery: imageName,
//       page: 1,
//       images: [], 
//       status: 'pending',
//     }, () => {
//       this.fetchPics(); 
//     });
//   }
// }
  
//     fetchPics = () => {
//     const { searchQuery, page } = this.state;

//       getPics(searchQuery, page)
//         .then(response => {
//           console.log('Response from getPics:', response);
//           const hits = response.hits;
          
//           if (!hits || hits.length === 0) {
//             this.setState ({
//               status: 'rejected',
//             })
//           } else {
//             this.setState((prevState) => ({
//               images: page === 1 ? hits : [...prevState.images, ...hits],
//               status: 'resolved',
//               totalHits: response.totalHits,
//             }))
//           }
//       })
//         .catch(error => {
//           console.log(error);
//           this.setState({ error: error.message, status: 'rejected' });
//         })
//   }
  
//   loadMore = () => {
//       this.setState((prevState) => ({
//         page: prevState.page + 1,
//       }), () => {
//         this.fetchPics();
//       });
//   }

//   toggleModal = largeImageURL => {
//     this.setState(({ showModal }) => ({
//       showModal: !showModal,
//       modalImage: largeImageURL,
//     }));
//   };

//   render() {

//     const { images, status, modalImage, showModal } = this.state;

//     return (
//       <MainContainer>
//         <Searchbar onSubmit={this.onSearchSubmit} />
//         {status !== 'idle' && images.length > 0 && (
//           <ImageGallery images={images} toggleModal={this.toggleModal}/>
//         )} 
//         {status === 'resolved' && images.length !== 0 && (
//           <Button onClick={this.loadMore} />
//         )}
//         {status === "rejected" && <ErrorView/>}
//         {status === "pending" && <Loader/>}
//         {showModal && (<Modal modalImage={modalImage} closeModal={this.toggleModal} />)}
//       </MainContainer>
//     );
//   }
  
// };
