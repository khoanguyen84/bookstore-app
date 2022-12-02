import { Routes, Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import BookList from './components/BookList/BookList';
import CreateBook from './components/CreateBook/CreateBook';
import ViewBook from './components/ViewBook/ViewBook';
import UpdateBook from './components/UpdateBook/UpdateBook';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/bookstore-app/' element={<BookList />} />
        <Route path='/bookstore-app/book/create' element={<CreateBook />} />
        <Route path='/bookstore-app/book/view/:bookId' element={<ViewBook />} />
        <Route path='/bookstore-app/book/update/:bookId' element={<UpdateBook />} />
      </Routes>
    </>
  );
}

export default App;
