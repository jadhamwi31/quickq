import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useTabelsContext } from "../hooks/useTabel";
interface ChildComponentProps {
    id: String;
    status: String;
    code: String;
}
export default function EditTabelForm(props: ChildComponentProps) {




    const [status, setStatus] = useState("");


    const { dispatch } = useTabelsContext();
    const [showModal, setShowModal] = useState(false);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event
    ) => {
        event.preventDefault();

        const response = await fetch("/tables/" + props.id, {
            method: "PUT",
            body: JSON.stringify({ status: status }),
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
                    oldCode: props.code,
                    newStatus: status,
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
            <button type="button" className="btn btn-light" onClick={() => setShowModal(true)} style={{
                borderRadius: "0px",
                backgroundColor: "white",
                width: "115px",
                color: "#7A7A7A",
                textAlign: "left"

            }}>
                <span className="lnr"><i className="bi bi-pencil"></i></span>Update
            </button>





            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Table Number : {props.id}</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <label className="form-label" htmlFor="CategoryName">
                            Table Status :
                        </label>
                        <select
                            style={{ marginInline: 'auto' }}
                            className="form-select shadow-none"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >   <option value="">Please Choose</option>
                            <option value="Available">Available</option>
                            <option value="Busy">Busy</option>

                        </select>

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

        </div>
    );
}
