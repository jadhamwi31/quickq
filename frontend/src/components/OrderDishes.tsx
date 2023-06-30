import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useTabelsContext } from "../hooks/useTabel";

export default function OrderDishes(props: any) {




    const [status, setStatus] = useState("");


    const { dispatch } = useTabelsContext();
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <button type="button" className="btn btn-link btn-sm" onClick={() => setShowModal(true)}>
                Dishes
            </button>





            <Modal show={showModal} onHide={handleCloseModal} centered>

                <Modal.Body>
                    <h2>Dishes for Table: {props.id}</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <td>Name</td>
                                <td>Quantity</td>
                                <td>Price</td>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>

                        {props.dishes.map((o: any) => (
                            <tr key={o.name}>
                                <td>{o.name}</td>
                                <td>{o.quantity}</td>
                                <td>{o.price}</td>
                            </tr>
                        ))}

                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>

                </Modal.Footer>

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
