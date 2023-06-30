import { useState } from 'react';
import { useOrder } from "../../../hooks/useOrder";
import { Console, assert } from 'console';
import Cookies from "js-cookie";
function Order() {
    const { Order, dispatch } = useOrder();

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

    const handleDecrement = (name: String) => {
        const updatedOrder = Order.map((o: any) => {
            if (o.name === name) {
                return {
                    ...o,
                    quantity: o.quantity > 0 ? o.quantity - 1 : 0,
                };
            }
            return o;
        });
        dispatch({ type: 'SET', payload: updatedOrder });
        localStorage.setItem('order', JSON.stringify(updatedOrder));
    };
    const order = async () => {
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

        }
        if (response.ok) {
            console.log(json)
        }
    }

    return (
        <div>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>Dish Name</th>
                        <th>Count</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {Order ? (
                        Order.map((o: any) => (
                            <tr key={o.name}>
                                <td>{o.name}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-secondary mr-2"
                                        onClick={() => handleDecrement(o.name)}
                                    >
                                        -
                                    </button>
                                    {o.quantity}
                                    <button
                                        className="btn btn-sm btn-secondary ml-2"
                                        onClick={() => handleIncrement(o.name)}
                                    >
                                        +
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
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
            </table>
            <button onClick={() => {
                order();
            }}>Order</button>
        </div>
    );
}

export default Order;
