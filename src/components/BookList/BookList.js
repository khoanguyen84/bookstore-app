import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import BookService from './../../services/bookService';
import Helper from './../../services/helper';
import Spinner from './../Spinner/Spinner';

function BookList() {
    const [state, setState] = useState({
        loading: false,
        books: [],
        errorMessage: ""
    })

    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        try {
            setState({ ...state, loading: true });
            async function getData() {
                let resBook = await BookService.getBooks();
                resBook.data.sort((book1, book2) => book2.id - book1.id);
                setState({
                    ...state,
                    loading: false,
                    books: resBook.data
                })
            }
            getData();
        } catch (error) {
            setState({
                ...state,
                errorMessage: error.message
            })
        }
    }, [])

    const handleSearch = async (e) => {
        let keyword = e.target.value;
        setState({ ...state, loading: true });
        let bookRes = await BookService.getBooks();
        setState({
            ...state,
            books: keyword ? bookRes.data.filter((book) => book.bookName.toLowerCase().includes(keyword.toLowerCase())) : bookRes.data,
            loading: false
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({ ...state, loading: true });
        let bookRes = await BookService.getBooks();
        setState({
            ...state,
            books: keyword ? bookRes.data.filter((book) => book.bookName.toLowerCase().includes(keyword.toLowerCase()) ||
                book.author.toLowerCase().includes(keyword.toLowerCase()))
                : bookRes.data,
            loading: false
        })
    }

    const removeBook = async (book) => {
        try {
            let confirm = window.confirm(`Are sure to remove book ${book.bookName}?`);
            if (confirm) {
                setState({ ...state, loading: true });
                let delelteRes = await BookService.deleteBook(book.id);
                if (delelteRes.data) {
                    let bookRes = await BookService.getBooks();
                    toast.success(`Book ${delelteRes.data.bookName} has been removed success!`, 
                                    { position: "bottom-right", autoClose: 2 * 1000 });
                    setState({
                        ...state,
                        books: bookRes.data,
                        loading: false
                    })
                }
                else {
                    toast.error('Something went wrong, please try again later!');
                }
            }
        } catch (error) {
            toast.error(error.message);
            setState({
                ...state,
                loading: false,
                errorMessage: error.message
            })
        }
    }
    const { loading, books } = state;
    return (
        <>
            <section className="create-book my-2">
                <div className="container">
                    <div className="d-flex align-items-center">
                        <h3 className="me-2">Book Manager</h3>
                        <Link to={"/bookstore-app/book/create"} className="btn btn-primary btn-sm">
                            <i className="fa fa-circle-plus me-2"></i>
                            New
                        </Link>
                    </div>
                    <p className="fst-italic">Reprehenderit excepteur quis exercitation deserunt laboris enim. Excepteur tempor proident incididunt officia excepteur occaecat ea cupidatat. Ea officia eu quis aliquip veniam eiusmod aliqua.</p>
                    <div>
                        <form onSubmit={handleSubmit} className="d-flex w-25">
                            {/* <input type="text" className="form-control" onInput={handleSearch} /> */}
                            <input type="text" className="form-control" value={keyword} onInput={(e) => setKeyword(e.target.value)} />
                            <button type="submit" className="btn btn-outline-secondary btn-sm ms-2">Search</button>
                        </form>
                    </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className="row">
                        {
                            loading ? <Spinner /> : (
                                books && books.map(book => (
                                    <div className="col-md-4 mb-4" key={book.id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="row d-flex align-items-center">
                                                    <div className="col-md-3">
                                                        <img className="rounded photo-md" src={book.photo} alt="" />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <ul className="list-group">
                                                            <li className="list-group-item">
                                                                Book Name: <span className="fw-bolder">{book.bookName}</span>
                                                            </li>
                                                            <li className="list-group-item">
                                                                Price: <span className="fw-bolder">{Helper.formatCurrency(book.price)}</span>
                                                            </li>
                                                            <li className="list-group-item">
                                                                Author: <span className="fw-bolder">{book.author}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-1">
                                                        <div className="d-flex flex-column align-items-center">
                                                            <button className="btn btn-warning btn-sm">
                                                                <i className="fa fa-eye"></i>
                                                            </button>
                                                            <button className="btn btn-primary btn-sm my-2">
                                                                <i className="fa fa-edit"></i>
                                                            </button>
                                                            <button className="btn btn-danger btn-sm" onClick={() => removeBook(book)}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>
            </section>
        </>

    )
}

export default BookList;