import React, { useState, useEffect } from "react";
import { useCategoriesContext } from "../hooks/useCategory";
import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
interface CategoriesProps {
    categoryName: string;
}

export default function UpdateCategory(props: CategoriesProps) {
    const { categoryName } = props;
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    useEffect(() => {
        setName(categoryName);
    }, [categoryName]);
    const { dispatch } = useCategoriesContext();
    const [showModal, setShowModal] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();

        const response = await fetch("/categories/" + categoryName, {
            method: "PUT",
            body: JSON.stringify({ name }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            toast.error(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (response.ok) {
            dispatch({
                type: 'UPDATE',
                payload: {
                    oldName: categoryName,
                    newName: name,
                    newImage: image,
                },
            });
            setShowModal(false);
            toast.success(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-link"
                onClick={() => setShowModal(true)}

            >
                Update
            </button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category Name</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <label className="form-label" htmlFor="CategoryName">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="CategoryName"
                            className="form-control"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />    <br />
                        <input className="form-control" type="file" id="dishAvatar" onChange={(e) => { e.target.files && setImage(URL.createObjectURL(e.target.files[0])) }} /><br />
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

        </div>
    );
}
