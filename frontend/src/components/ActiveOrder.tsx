import { useActiveMenu } from '../hooks/useActiveMenu';
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from "react";
import PackageJson from '../../package.json'
import { useSocketIoContext } from '../context/SocketIoContext';
import { useAuthContext } from '../context/AuthContext';
interface deleteDish {
    name: String
}
export default function ActiveOrder() {
    const [activeOrder, setActiveOrder] = useState<any>([]);
    const [deleted, setDeleted] = useState<deleteDish[]>([]);
    const [showDishes, setShowDishes] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null); // State to store the selected order ID
    const { ActiveMenu } = useActiveMenu();
    const { tableId } = useAuthContext();
    const { socket } = useSocketIoContext();

    useEffect(() => {
        const getActiveOrders = async () => {
            try {
                const response = await fetch(`/orders/today/${tableId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });
                const json = await response.json();
                if (response.ok) {
                    setActiveOrder(json.data);
                } else {
                    console.log(json);
                }
            } catch (error) {
                console.error('Error fetching ActiveOrders:', error);
            }
        };
        console.log()
        getActiveOrders();
    }, []);

    useEffect(() => {
        const handler = (orderId: any, status: any) => {
            setActiveOrder((prevActiveOrder: any) => {
                const updatedOrders = prevActiveOrder.map((order: any) => {
                    if (order.id === orderId) {
                        return { ...order, status };
                    }
                    return order;
                });

                return updatedOrders;
            });
        }
        socket!.on("update_order_status", handler);
        return () => {
            socket!.off("update_order_status", handler)
        }
    }, []);


    const handleShowCheckbox = (orderId: string) => {
        if (selectedOrderId === orderId) {
            setShowDishes((prevState) => !prevState); // Toggle showDishes
        } else {
            setShowDishes(true);
        }
        setSelectedOrderId(orderId);
    };

    const getShowHideLabel = (orderId: string) => {
        if (selectedOrderId === orderId) {
            return showDishes ? "Hide Dishes" : "Show Dishes";
        }
        return "Show";
    };

    return (
        <>
            {activeOrder.length > 0 ? (
                <div
                    style={{
                        backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                        color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                        borderRadius: "15px",
                        margin: "30px",
                        padding: "30px",
                        boxShadow: "-1px -1px 100px -20px rgba(0,0,0,0.75)",
                        backdropFilter: "opacity(0.2)"
                    }}
                >
                    {activeOrder.map((order: any, index: any) => (
                        <>
                            <div className="row" key={order.id}>
                                <div className="col-md-4"><h4>Order ID: {index + 1}</h4></div>
                                <div className="col-md-4">
                                    <p>Status: {order.status}</p>
                                    <label style={{ cursor: "pointer" }} htmlFor={`show-${order.id}`}>{getShowHideLabel(order.id)}</label><br />
                                    <input
                                        type='checkbox'
                                        onChange={() => handleShowCheckbox(order.id)}
                                        style={{ display: "none" }}
                                        id={`show-${order.id}`}
                                    />

                                    {showDishes && selectedOrderId === order.id && (
                                        order.dishes.map((dish: any) => (<div className="row">
                                            <div className="col">{dish.name}</div>
                                            <div className="col">{dish.quantity}</div>
                                        </div>

                                        ))
                                    )}
                                </div>
                            </div>
                            <hr /></>
                    ))}
                </div>
            ) : (
                "No active orders"
            )}
        </>
    );
}
