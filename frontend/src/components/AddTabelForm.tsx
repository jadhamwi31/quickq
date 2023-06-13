import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useTabelsContext } from "../hooks/useTabel";

export default function AddTabelForm() {

    const [id, setId] = useState("");

    const { dispatch } = useTabelsContext();
    const [showModal, setShowModal] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();

        const response = await fetch("/tables", {
            method: "POST",
            body: JSON.stringify({ id }),
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
            const newTabel = { code: json.data.code, id: id, status: "Available" }
            dispatch({ type: 'CREATE', payload: newTabel });
            setId('')
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



            <button type="button" className="btn btn-light" onClick={() => setShowModal(true)} style={{
                height: "300px",
                width: "100%",
                borderRadius: "25px",
                fontSize: "90px",
                color: "#DEE2E6",
                lineHeight: "15px"
            }}>
                <i className="bi bi-plus-lg"></i><br />
                <span style={{
                    fontSize: "40px"
                }}>Add Tabel</span>
            </button>


            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Table</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <label className="form-label" htmlFor="CategoryName">
                            Table Number :
                        </label>
                        <input
                            type="text"
                            id="CategoryName"
                            className="form-control"
                            name="name"
                            onChange={(e) => setId(e.target.value)}
                            value={id}
                        />
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Add
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
