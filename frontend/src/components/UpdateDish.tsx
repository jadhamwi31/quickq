import React, { useState, useEffect } from "react";
import { useCategoriesContext } from "../hooks/useCategory";
import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

interface DishProps {
    dishName: string;
    dishPrice: string;
    dishDesc: string;
    dishIng: {
        name: string,
        amount: number,
        unit: string
    }[];
}

export default function UpdateDish(props: DishProps) {
    const { dishName, dishPrice, dishDesc, dishIng } = props;
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");
    const [ingredients, setIngredients] = useState([] as {
        name: string,
        amount: number,
        unit: string
    }[]);

    useEffect(() => {
        setName(dishName);
        setPrice(dishPrice);
        setDesc(dishDesc);
        setIngredients(dishIng);
    }, [dishName, dishPrice, dishDesc, dishIng]);

    const [showModal, setShowModal] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();

        const response = await fetch("/dishes/" + dishName, {
            method: "PUT",
            body: JSON.stringify({
                name: name,
                price: price,
                description: desc,
                ingredients: ingredients
            }),
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
                className="btn btn-link btn-sm"
                onClick={() => setShowModal(true)}
            >
                Update
            </button>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Dish</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <label className="form-label" htmlFor="dishName">
                            Dish Name
                        </label>
                        <input
                            type="text"
                            id="dishName"
                            className="form-control"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />

                        <label className="form-label" htmlFor="dishPrice">
                            Dish Price
                        </label>
                        <input
                            type="text"
                            id="dishPrice"
                            className="form-control"
                            name="price"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
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
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </div>
    );
}
