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

    const openTable = async () => {
        const response = await fetch(`/tables/${props.id}/session`, {
            method: "POST",
            credentials: "include",
            headers: {
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
                    oldCode: props.id,
                    newStatus: "Busy",
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
    }
    const closeTable = async () => {
        const response = await fetch(`/tables/${props.id}/session`, {
            method: "DELETE",
            credentials: "include",
            headers: {
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
                    oldCode: props.id,
                    newStatus: "Available",
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
    }
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

                <Modal.Body>
                    <label className="form-label" htmlFor="CategoryName">
                        Table Status :
                    </label><br />
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around"
                    }}>



                        <button onClick={() => {
                            openTable()
                        }} className="btn btn-secondary">Open Table</button>
                        <button onClick={() => {
                            closeTable()
                        }} className="btn btn-secondary">Close Table</button>
                    </div>
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>

                </Modal.Footer>

            </Modal>

        </div>
    );
}
