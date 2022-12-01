import { Routes, Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import BookList from './components/BookList/BookList';
import CreateBook from './components/CreateBook/CreateBook';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/bookstore-app/' element={<BookList />} />
        <Route path='/bookstore-app/book/create' element={<CreateBook />} />
      </Routes>
    </>
  );
}

export default App;
