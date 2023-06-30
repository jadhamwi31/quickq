import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import OrderDishes from '../../components/OrderDishes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSocketIoContext } from '../../context/SocketIoContext';
interface Order {
    id: string;
    tableId: string;
    date: string;
    status: string;
    total: string;
    dishes: any[];
}

export default function ChefOrders() {
    const { socket } = useSocketIoContext();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        document.title = 'Manager | Orders';
    }, []);

    useEffect(() => {
        const getTodayOrders = async () => {
            const response = await fetch('/orders/today', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setOrders(json.data);
            }
        };

        getTodayOrders();
    }, []);

    const UpdateOrderStatus = async (orderId: string, newStatus: string) => {
        const response = await fetch(`/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json);
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
        }

        if (response.ok) {
            console.log(json);
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

            const updatedOrders = orders.map((order) => {
                if (order.id === orderId) {
                    return { ...order, status: newStatus };
                }
                return order;
            });

            setOrders(updatedOrders);
        }
    };

    const renderGroupedOrders = () => {
        const groupedOrders: { [tableId: string]: Order[] } = {};
        orders.forEach((o) => {
            if (groupedOrders[o.tableId]) {
                groupedOrders[o.tableId].push(o);
            } else {
                groupedOrders[o.tableId] = [o];
            }
        });

        return Object.keys(groupedOrders).map((tableId) => {
            const groupHeader = `Table ${tableId}`;
            const groupRows = groupedOrders[tableId];

            return (
                <React.Fragment key={tableId}>
                    <tr className="table-info" style={{ textAlign: 'center' }}>
                        <td colSpan={6}>{groupHeader}</td>
                    </tr>
                    {groupRows.map((o) => (
                        <tr
                            key={o.id}
                            className={
                                o.status === 'Pending'
                                    ? 'table-danger'
                                    : o.status === 'In Cook'
                                        ? 'table-warning'
                                        : o.status === 'Ready'
                                            ? 'table-success'
                                            : ''
                            }
                        >
                            <td>{o.id}</td>
                            <td>{o.tableId}</td>
                            <td>
                                {(() => {
                                    const date = new Date(o.date);
                                    const time = date.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    });
                                    return time;
                                })()}
                            </td>
                            <td>{o.total}</td>
                            <td>
                                <select
                                    value={o.status}
                                    className="form-select"
                                    onChange={(e) => {
                                        const newStatus = e.target.value;
                                        UpdateOrderStatus(o.id, newStatus);
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Cook">In Cook</option>
                                    <option value="Ready">Ready</option>
                                </select>
                            </td>
                            <td>
                                <OrderDishes dishes={o.dishes} id={o.tableId} />
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };
    useEffect(() => {
        const newOrderHandler = (order: Order) => {
            setOrders((prevOrders) => [...prevOrders, order]);
        };

        socket!.on("new_order", newOrderHandler);

        return () => {
            socket!.off("new_order", newOrderHandler);
        };
    }, []);



    return (
        <div className="GeneralContent">
            <div className="scroll">
                <div className="t">
                    <table className="table" style={{ paddingLeft: '20px' }}>
                        <thead>
                            <tr className="table-active">
                                <td>Order ID</td>
                                <td>Table ID</td>
                                <td>Date</td>
                                <td>Total</td>
                                <td>Status</td>
                                <td>Dishes</td>
                            </tr>
                        </thead>
                        <tbody>{renderGroupedOrders()}</tbody>
                    </table>
                </div>
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
        </div>
    );
}
