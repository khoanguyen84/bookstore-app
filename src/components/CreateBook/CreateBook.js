import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CategoryService from './../../services/categoryService';
import PublisherService from './../../services/publisherService';
import noBookPhoto from '../../assets/images/noBookPhoto.jpg';
import BookService from './../../services/bookService';
import FileHelper from './../../services/fileHelper';

function CreateBook() {
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


    const navigate = useNavigate();

    useEffect(() => {
        try {
            setState({ ...state, loading: true })
            async function getData() {
                let catRes = await CategoryService.getCategories();
                let pubRes = await PublisherService.getPublishers();
                setState({
                    ...state,
                    categories: catRes.data,
                    publishers: pubRes.data,
                    loading: false
                })
            }

            getData();
        } catch (error) {
            toast.error(error.message)
            setState({ ...state, loading: false, errorMessage: error.message });
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

    const handleCreateBook = async (e) => {
        e.preventDefault();
        try {
            setState({ ...setState, loading: true });
            let createRes = await BookService.createBook(book);
            if (createRes.data) {
                setState({ ...setState, loading: false });
                navigate("/bookstore-app", { replace: true });
                toast.success(`Book ${book.bookName} has been created success`);
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
            setFileImg({ ...fileImg, uploading: false });
            setState({
                ...state,
                book: {
                    ...book,
                    photo: uploadRes.data.url
                }
            })
        }

    }
    const { loading, book, categories, publishers } = state;
    return (
        <>
            <section className="create-book my-2">
                <div className="container">
                    <h3 className="me-2 text-success">Create Book</h3>
                    <p className="fst-italic">Est enim esse sint excepteur dolor officia Lorem adipisicing ipsum dolore exercitation exercitation aute. Aliqua et in dolor laborum ut sit pariatur esse laborum qui id nostrud ad. Voluptate est ea proident aliquip irure pariatur ea eu qui. Pariatur laborum esse consequat tempor magna duis Lorem qui duis nulla. Reprehenderit labore aliqua culpa irure esse velit incididunt nostrud aliqua aliqua amet laboris do aliqua.</p>
                </div>
            </section>
            <section className="create-detail">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <form className="w-100" onSubmit={handleCreateBook}>
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Book name</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="bookName" className="form-control" required placeholder="Book name"
                                            onInput={handleInputValue}
                                        />
                                    </div>
                                </div>
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Price</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="number" name="price" min={1000} max={Number.MAX_SAFE_INTEGER} className="form-control"
                                            required placeholder="Price" onInput={handleInputValue} />
                                    </div>
                                </div>
                                {/* <div className="row align-items-center mb-1">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Photo</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="url" name="photo" className="form-control" required placeholder="Photo URL"
                                            onInput={handleInputValue}
                                        />
                                    </div>
                                </div> */}
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Author</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="text" name="author" className="form-control" required placeholder="Author" onInput={handleInputValue} />
                                    </div>
                                </div>
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Publish Year</label>
                                    </div>
                                    <div className="col-md-9">
                                        <input type="number" name="publishYear" className="form-control" required
                                            placeholder="Publish Year" min="1900" max={new Date().getFullYear()} onInput={handleInputValue} />
                                    </div>
                                </div>
                                <div className="row align-items-center mb-2">
                                    <div className="col-md-3">
                                        <label className="col-form-label">Category</label>
                                    </div>
                                    <div className="col-md-9">
                                        <select name="catId" className="form-control" onChange={handleInputValue}>
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
                                        <label className="col-form-label">Publisher</label>
                                    </div>
                                    <div className="col-md-9">
                                        <select name="publisherId" className="form-control" onChange={handleInputValue}>
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
                                    </div>
                                    <div className="col-md-9">
                                        <button type="submit" className="btn btn-success btn-sm me-2">Create</button>
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
            </section>
        </>
    )
}

export default CreateBook;