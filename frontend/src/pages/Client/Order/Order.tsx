import { useOrder } from "../../../hooks/useOrder";
import PackageJson from '../../../../package.json'
import { useActiveMenu } from '../../../hooks/useActiveMenu';
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useRef, useState, createRef } from "react";
import ActiveOrder from "../../../components/ActiveOrder";
interface Order {
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

let sessionOpened = false;

function Order() {
    const { Order, dispatch } = useOrder();
    const { ActiveMenu } = useActiveMenu();
    const [activeOrder, setActiveOrder] = useState<any>([]);


    const handleIncrement = (name: String) => {
        const updatedOrder = Order.map((o: any) => {
            if (o.name === name) {
                return {
                    ...o,
                    quantity: o.quantity + 1,
                };
            }
            return o;
        });
        dispatch({ type: 'SET', payload: updatedOrder });
        localStorage.setItem('order', JSON.stringify(updatedOrder));
    };
    useEffect(() => {
        const getActiveOrders = async () => {
            try {
                const response = await fetch(`/orders/today/2`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });
                const json = await response.json();
                if (response.ok) {

                    setActiveOrder(json.data)


                } else {
                    console.log(json);
                }
            } catch (error) {
                console.error('Error fetching ActiveOrders:', error);
            }
        };

        getActiveOrders();
        console.log(activeOrder)
    }, []);


    const handleDecrement = (name: String) => {
        const updatedOrder = Order.map((o: any) => {
            if (o.name === name) {
                return {
                    ...o,
                    quantity: o.quantity > 1 ? o.quantity - 1 : 1, // Check if quantity is greater than 1 before decrementing
                };
            }
            return o;
        });
        dispatch({ type: 'SET', payload: updatedOrder });
        localStorage.setItem('order', JSON.stringify(updatedOrder));
    };

    const order = async () => {

        console.log(sessionOpened);

        if (!sessionOpened) {
            await fetch(`/tables/session`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            sessionOpened = true
        }

        const response = await fetch("/orders/", {
            method: "POST",
            body: JSON.stringify({ "dishes": Order }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json)
            toast.error(`${json.message}`, {
                position: "bottom-right",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (response.ok) {
            toast.success(`${json.message}`, {
                position: "bottom-right",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            dispatch({ type: 'SET', payload: [] });
            localStorage.removeItem('order');
        }







    }


    return (
        <>
            {Order.length > 0 ? <div style={{

                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                borderRadius: "15px",
                margin: "30px",
                padding: "30px",
                boxShadow: "-1px -1px 100px -20px rgba(0,0,0,0.75)",
                backdropFilter: "opacity(0.2)"

            }}> <>
                    <div style={{ textAlign: "center", width: "100%", color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000", }}>
                        <thead>
                            <tr style={{
                                fontFamily: ActiveMenu ? ActiveMenu.data.menu.item.FontFamily : "Arial",
                                fontSize: "30px"
                            }}>
                                <th >Dish Name</th>
                                <th>Count</th>

                            </tr>
                        </thead>
                        <tbody>
                            {Order ? (
                                Order.map((o: any) => (
                                    <tr key={o.name}>
                                        <td width="200px"><div className='slideitem' style={{
                                            backgroundImage: `url(${PackageJson.proxy}/images/${o.Image})`,
                                            backgroundSize: "cover",
                                            padding: "0px",
                                            position: "relative",
                                            height: "100px"
                                        }} >
                                            <p style={{
                                                position: "absolute",
                                                bottom: 10,
                                                fontSize: "25px",
                                                textAlign: "center",
                                                fontFamily: ActiveMenu ? ActiveMenu.data.menu.item.FontFamily : "Arial",
                                                width: "100%",
                                                background: "rgba(0, 0, 0, 0.5)",
                                                color: "white"
                                            }}>{o.name}</p>
                                        </div></td>
                                        <td >
                                            <button
                                                disabled={o.quantity === 1} // Disable the button if quantity is 1

                                                onClick={() => handleDecrement(o.name)}
                                                style={{
                                                    color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                                                    border: "solid 1px",
                                                    borderRadius: "50%",
                                                    width: "30px",
                                                    height: "30px",
                                                    textAlign: "center",
                                                    paddingBottom: "10px",
                                                    margin: "10px"
                                                }}
                                            >
                                                -
                                            </button><br />
                                            {o.quantity}<br />
                                            <button
                                                style={{
                                                    color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                                                    border: "solid 1px",
                                                    borderRadius: "50%",
                                                    width: "30px",
                                                    height: "30px",
                                                    textAlign: "center",
                                                    paddingBottom: "10px",
                                                    margin: "10px"
                                                }}
                                                onClick={() => handleIncrement(o.name)}
                                            >
                                                +
                                            </button><br />
                                            <button
                                                style={{
                                                    color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                                                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",

                                                    borderRadius: "10px",
                                                    padding: "5px",
                                                    textAlign: "center",
                                                    margin: "10px"
                                                }}
                                                onClick={() => {
                                                    dispatch({ type: 'DELETE_ITEM', payload: { name: o.name } });
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>Order List is Empty</td>
                                </tr>
                            )}
                        </tbody>
                    </div>
                    <button style={{
                        color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                        backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                        width: "100%",
                        marginInline: "auto",
                        borderRadius: "10px",
                        padding: "5px",
                        textAlign: "center",
                        margin: "10px"
                    }} onClick={() => {
                        order();
                    }}>Make Order</button></>
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
            </div> : <ActiveOrder />}


        </>
    );
}

export default Order;
