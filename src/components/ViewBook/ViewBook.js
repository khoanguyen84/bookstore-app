import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import noBookPhoto from '../../assets/images/noBookPhoto.jpg';
import CategoryService from "../../services/categoryService";
import PublisherService from "../../services/publisherService";
import Spinner from "../Spinner/Spinner";
import BookService from './../../services/bookService';
import Helper from './../../services/helper';

function ViewBook() {
    const { bookId } = useParams();
    const [state, setState] = useState({
        loading: false,
        book: {},
        category: {},
        publisher: {},
        errorMessage: ""
    });

    useEffect(() => {
        try {
            setState({ ...state, loading: true });
            async function getData() {
                let bookRes = await BookService.getBook(bookId);
                let categoryRes = await CategoryService.getCategory(bookRes.data.catId);
                let publisherRes = await PublisherService.getPublisher(bookRes.data.publisherId);
                setState({
                    ...state,
                    book: bookRes.data,
                    category: categoryRes.data,
                    publisher: publisherRes.data,
                    loading: false
                })
            }
            getData();
        } catch (error) {
            setState({ ...state, loading: false, errorMessage: error.message });
        }
    }, [])

    const { book, category, publisher, loading } = state;
    return (
        <>
            <section className="book-info">
                <div className="container my-2">
                    <h3 className="me-2 text-warning">Book Detail</h3>
                    <p className="fst-italic">Et sit dolore velit ea ipsum elit excepteur nulla voluptate. Officia voluptate nisi eu amet culpa deserunt irure sunt laboris magna anim deserunt laboris ex. Ut excepteur nulla reprehenderit ullamco adipisicing adipisicing et aute laborum exercitation culpa incididunt velit esse. Magna exercitation officia ea tempor nisi id aute amet veniam cupidatat ipsum. Qui nisi eiusmod do veniam. Minim laborum sit Lorem pariatur cillum ad ea culpa.</p>
                </div>
            </section>
            <section className="book-detail">
                {loading ? <Spinner /> : (
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <img className="photo-lg" src={book.photo || noBookPhoto} alt="" />
                            </div>
                            <div className="col-md-4 d-flex flex-column">
                                <div className="">
                                    <ul className="list-group">
                                        <li className="list-group-item">
                                            Book name: <span className="fw-bolder">{book.bookName}</span>
                                        </li>
                                        <li className="list-group-item">
                                            Price: <span className="fw-bolder">{Helper.formatCurrency(book.price)}</span>
                                        </li>
                                        <li className="list-group-item">
                                            Author: <span className="fw-bolder">{book.author}</span>
                                        </li>
                                        <li className="list-group-item">
                                            Publish year: <span className="fw-bolder">{book.publishYear}</span>
                                        </li>
                                        <li className="list-group-item">
                                            Publisher: <span className="fw-bolder">{publisher.publisherName}</span>
                                        </li>
                                        <li className="list-group-item">
                                            Category: <span className="fw-bolder">{category.categoryName}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-2">
                                    <Link to={`/bookstore-app/book/update/${book.id}`} className="btn btn-warning btn-sm me-2">
                                        <i className="fa fa-edit me-2"></i>
                                        Update
                                    </Link>
                                    <Link to={"/bookstore-app/"} className="btn btn-dark btn-sm">
                                        <i className="fa-solid fa-angles-left me-2"></i>
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    )
}

export default ViewBook;