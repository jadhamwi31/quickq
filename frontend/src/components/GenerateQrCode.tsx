import { useState, useRef } from "react";
import QRCodeGenerator from './QRCodeGenerator';

import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useTabelsContext } from "../hooks/useTabel";
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import { table } from "console";

interface ChildComponentProps {
    id: String;
    status: String;
    code: String;
}
export default function GenerateQrCode(props: ChildComponentProps) {



    const [status, setStatus] = useState("");


    const { dispatch } = useTabelsContext();
    const [showModal, setShowModal] = useState(false);


    const qrCodeRef = useRef<HTMLDivElement>(null);
    const width = 400
    const handleDownload = async () => {
        if (qrCodeRef.current) {
            const canvas = await html2canvas(qrCodeRef.current);
            const qrCodeDataURL = canvas.toDataURL('image/jpeg');
            const link = document.createElement('a');
            link.href = qrCodeDataURL;
            link.download = `${props.id}-QR.jpg`;
            link.click();
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
                <span className="lnr"> <i className="bi bi-qr-code"></i></span>Generate
            </button>





            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Generate Qr Code For  Table Number : {props.id}</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <div ref={qrCodeRef} style={{
                        padding: "10px",
                        textAlign: "center"
                    }}>

                        <QRCode value={`http://192.168.1.105:3000/loginClient/${props.code}`} size={width} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleDownload}>
                        Save
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
