import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

interface Dish {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Receipt {
    id: number;
    tableId: number;
    total: number;
    date: string;
    dishes: Dish[];
    status: string;
}

interface Data {
    receipt: Receipt[];
    total: number;
}

function Receipt(props: any) {
    const [showModal1, setShowModal1] = useState(false);
    const [data, setData] = useState<Data>({
        receipt: [],
        total: 0,
    });

    const handleCloseModal1 = () => {
        setShowModal1(false);
    };

    const printDiv = (divId: string) => {
        const printContents = document.getElementById(divId);
        if (printContents) {
            const printWindow = window.open("", "_blank");
            if (printWindow) {
                const style = `
              <style>
              
            
            body {
                font-family: "Times new roman", sans-serif;
                background-color: #f0f0f0;
                margin: 0px;
                color: black;
            }
      
                h2 {
                  font-size: 18px;
                  margin-bottom: 10px;
                }
      
                .table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                }
      
                .table th,
                .table td {
                  border: 1px solid #ccc;
                  padding: 8px;
                }
      
                .total {
                  font-weight: bold;
                  margin-top: 20px;
                }
              </style>
            `;
                const html = `${style}${printContents.innerHTML}`;

                printWindow.document.open();
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }
    };
    const checkOut = async (id: any, total: any) => {
        console.log(id)
        const response = await fetch('/payments', {
            method: 'POST',
            body: JSON.stringify({
                tableId: id,
                amountPaid: total,
            }),
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            toast.error(json.message, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        } else {
            handleCloseModal1()
            toast.success(json.message, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });


        }

    }
    useEffect(() => {
        const getTodayOrders = async () => {
            const response = await fetch(`tables/${props.tableID}/receipt`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setData(json.data);
            }
        };

        getTodayOrders();
    });

    useEffect(() => {
        const handleAfterPrint = () => {
            document.body.innerHTML = originalContentsRef.current;
        };

        window.addEventListener("afterprint", handleAfterPrint);

        return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    const originalContentsRef = React.useRef("");
    useEffect(() => {
        originalContentsRef.current = document.body.innerHTML;
    }, []);

    return (
        <div>
            <button type="button" className="btn btn-link btn-sm" onClick={() => setShowModal1(true)}>
                Receipt
            </button>

            <Modal show={showModal1} onHide={handleCloseModal1} centered>
                <Modal.Body>
                    <div className="scroll" id="printable">
                        <h2>Receipt for Table: {props.tableID}</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Price Per One</th>
                                    <th>Price Per All</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.receipt.map((receipt) =>
                                    receipt.dishes.map((dish) => (
                                        <tr key={dish.id}>
                                            <td>{dish.name}</td>
                                            <td>{dish.quantity}</td>
                                            <td>{dish.price}</td>
                                            <td>{dish.price * dish.quantity}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <h2>Total: {data.total}</h2>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal1}>
                        Close
                    </Button>
                    <Button variant="link" onClick={() => printDiv('printable')}>
                        Print
                    </Button>
                    <Button variant="link" onClick={() => checkOut(props.tableID, data.total)}>
                        Check out
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default Receipt;