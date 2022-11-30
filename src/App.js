import { Routes, Route } from 'react-router-dom'
import './App.css';
import Navbar from './components/Navbar/Navbar';
import BookList from './components/BookList/BookList';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
          <Route path='/bookstore-app/' element={<BookList/>}/>
      </Routes>
    </>
  );
}

export default App;
