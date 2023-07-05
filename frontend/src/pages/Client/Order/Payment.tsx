import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { useActiveMenu } from '../../../hooks/useActiveMenu';
import { useSocketIoContext } from '../../../context/SocketIoContext'
interface Receipt {
    id: number;
    tableId: number;
    total: number;
    date: string;
    dishes: Dish[];
    status: string;
}

interface Dish {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

function Payment() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [total, setTotal] = useState("")
    const { ActiveMenu } = useActiveMenu();
    const { socket } = useSocketIoContext();

    useEffect(() => {
        const getReceipt = async () => {
            try {
                const response = await fetch('/tables/receipt', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });
                const json = await response.json();
                if (response.ok) {
                    console.log(json);
                    setReceipts(json.data.receipt);
                    setTotal(json.data.total);
                } else {
                    console.log(json);
                }
            } catch (error) {
                console.error('Error fetching receipt:', error);
            }
        };

        getReceipt();
    }, []);
    const RequestReceipt = () => {

        socket?.emit("request_checkout")
        toast.success("Recipt Requested ,Thanks For Waiting", {
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

    return (
        <>
            <div style={{

                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                borderRadius: "15px",
                margin: "30px",
                padding: "30px",
                boxShadow: "-1px -1px 100px -20px rgba(0,0,0,0.75)",
                backdropFilter: "opacity(0.2)"

            }}>
                <h1>Total :{total}</h1>
                <hr style={{
                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#FF0000",
                    border: "none",
                    height: "2px"
                }} />

                <table width="100%">
                    <thead>
                        <tr style={{
                            fontSize: "18px"
                        }}>
                            <th>Dish</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.map((receipt) =>
                            receipt.dishes.map((dish) => (
                                <tr key={dish.name}>
                                    <td>{dish.name}</td>
                                    <td>{dish.quantity}</td>
                                    <td>{dish.price}</td>
                                    <td>{dish.quantity * dish.price}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-around"
            }}>


                <button style={{

                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                    color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                    borderRadius: "15px",
                    margin: "10px",
                    padding: "15px",

                    backdropFilter: "opacity(0.2)"

                }} onClick={() => {
                    RequestReceipt()
                }}>Request CheckOut </button>

                <button style={{

                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                    color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                    borderRadius: "15px",
                    margin: "10px",
                    padding: "15px",

                    backdropFilter: "opacity(0.2)"
                }}
                    disabled={true}>Online Payment </button>

            </div>
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

        </>
    );
}

export default Payment;
