import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import noBookPhoto from '../../assets/images/noBookPhoto.jpg';
import CategoryService from "../../services/categoryService";
import PublisherService from "../../services/publisherService";
import BookService from './../../services/bookService';
import Spinner from './../Spinner/Spinner';
import FileHelper from './../../services/fileHelper';
import { toast } from 'react-toastify';
import Helper from './../../services/helper';

var imageUrl = "";
var oldPhotoUrl = "";
function UpdateBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        loading: false,
        categories: [],
        publishers: [],
        book: {},
        errorMessage: ""
    })

    const [fileImg, setFileImg] = useState({
        uploading: false,
        file: {}
    });

    useEffect(() => {
        try {
            setState({ ...state, loading: true });
            async function getData() {
                let bookRes = await BookService.getBook(bookId);
                let categoryRes = await CategoryService.getCategories();
                let publisherRes = await PublisherService.getPublishers();
                oldPhotoUrl = bookRes.data.photo;
                setState({
                    ...state,
                    loading: false,
                    book: bookRes.data,
                    categories: categoryRes.data,
                    publishers: publisherRes.data
                })
            }
            getData();
        } catch (error) {
            setState({ ...state, loading: false, errorMessage: error.message })
        }
        return async () => {
            if (imageUrl) {
                let filename = Helper.getFilename(imageUrl);
                let destroyRes = await FileHelper.destroyImage(filename);
            }
        }
    }, [])

    const handleInputValue = (e) => {
        setState({
            ...state,
            book: {
                ...book,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleUpdateBook = async (e) => {
        e.preventDefault();
        try {
            setState({ ...setState, loading: true });
            // remove old Photo
            if (oldPhotoUrl !== book.photo) {
                let filename = Helper.getFilename(oldPhotoUrl);
                let destroyRes = await FileHelper.destroyImage(filename);
            }

            // update book detail
            let updateRes = await BookService.updateBook(book, bookId);
            if (updateRes.data) {
                setState({ ...setState, loading: false });
                navigate("/bookstore-app", { replace: true });
                toast.success(`Book ${book.bookName} has been updated success`);
            }

        } catch (error) {
            setState({ ...setState, loading: false, errorMessage: error.message });
        }
    }

    const changePhoto = (e) => {
        let photo_url = URL.createObjectURL(e.target.files[0]);
        setFileImg({ ...fileImg, file: e.target.files[0] })
        setState({
            ...state,
            book: {
                ...book,
                photo: photo_url
            }
        })
    }

    const handleUploadImage = async () => {
        setFileImg({ ...fileImg, uploading: true });
        let uploadRes = await FileHelper.uploadImage(fileImg.file);
        if (uploadRes.data) {
            toast.success('Photo uploaded success!');
            imageUrl = uploadRes.data.url;
            setState({
                ...state,
                book: {
                    ...book,
                    photo: uploadRes.data.url
                }
            })
            setFileImg({ ...fileImg, uploading: false });
        }
    }
    const { loading, book, categories, publishers } = state;

    return (
        <>
            <section className="update-info my-2">
                <div className="container">
                    <h3 className="me-2 text-primary">Update Book</h3>
                    <p className="fst-italic">Ad dolore eu amet non mollit non non deserunt. Labore cupidatat Lorem consequat et in laborum reprehenderit. Eu voluptate fugiat fugiat quis consectetur nulla elit. Consectetur ut do ipsum amet nisi consequat mollit culpa consequat excepteur et. Ullamco ipsum duis aliquip eu et nostrud sint. Pariatur fugiat dolor duis in nostrud amet eiusmod ex magna labore.</p>
                </div>
            </section>
            <section className="update-detail">
                {
                    loading ? <Spinner /> : (
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4">
                                    <form className="w-100" onSubmit={handleUpdateBook}>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Book name</label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" name="bookName" className="form-control" required placeholder="Book name"
                                                    onInput={handleInputValue}
                                                    value={book.bookName}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Price</label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="number" name="price" min="1000" max={Number.MAX_SAFE_INTEGER} className="form-control"
                                                    required placeholder="Price" onInput={handleInputValue}
                                                    value={book.price}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Author</label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="text" name="author" className="form-control" required
                                                    placeholder="Author" onInput={handleInputValue}
                                                    value={book.author}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Publish Year</label>
                                            </div>
                                            <div className="col-md-9">
                                                <input type="number" name="publishYear" className="form-control" required
                                                    placeholder="Publish Year" min="1900" max={new Date().getFullYear()}
                                                    onInput={handleInputValue}
                                                    value={book.publishYear}
                                                />
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Publisher</label>
                                            </div>
                                            <div className="col-md-9">
                                                <select name="publisherId" className="form-control" value={book.publisherId} onChange={handleInputValue}>
                                                    {
                                                        publishers && publishers.map((pub) => (
                                                            <option value={pub.id} key={pub.id}>{pub.publisherName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                                <label className="col-form-label">Category</label>
                                            </div>
                                            <div className="col-md-9">
                                                <select name="catId" className="form-control" value={book.catId} onChange={handleInputValue}>
                                                    {
                                                        categories && categories.map((cat) => (
                                                            <option value={cat.id} key={cat.id}>{cat.categoryName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row align-items-center mb-2">
                                            <div className="col-md-3">
                                            </div>
                                            <div className="col-md-9">
                                                <button type="submit" className="btn btn-primary btn-sm me-2">Update</button>
                                                <Link to={"/bookstore-app/"} className="btn btn-dark btn-sm">Close</Link>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-3">
                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <input type="file" accept="image/*" className="d-none"
                                            onChange={changePhoto}
                                        />
                                        <img className="photo-lg" src={book && book.photo || noBookPhoto} alt="" role="button"
                                            onClick={() => document.querySelector('input[type="file"]').click()}
                                        />
                                        {
                                            fileImg.uploading ? (
                                                <button className="btn btn-secondary btn-sm mt-1" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    Uploading ...
                                                </button>
                                            ) : (
                                                <button className="btn btn-secondary btn-sm mt-1" onClick={handleUploadImage}>Upload</button>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </section>
        </>
    )
}

export default UpdateBook;