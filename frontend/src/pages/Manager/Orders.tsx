import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import OrderDishes from "../../components/OrderDishes";
import { useSocketIoContext } from "../../context/SocketIoContext";
interface Order {
	id: number;
	tableId: string;
	date: string;
	status: string;
	total: string;
	dishes: any[];
}

export default function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);
	const { socket } = useSocketIoContext();


	useEffect(() => {
		document.title = "Manager | Orders";
	}, []);


	useEffect(() => {
		const getTodayOrders = async () => {
			const response = await fetch("/orders/today", {
				headers: {
					Authorization: `Bearer ${Cookies.get("jwt")}`,
				},
			});

			if (response.ok) {
				const json = await response.json();
				setOrders(json.data);
			}
		};

		getTodayOrders();
	}, []);


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
					<tr className="table-info" style={{ textAlign: "center" }}>
						<td colSpan={6}>
							<h5 key={groupHeader}>{groupHeader}</h5>
						</td>
					</tr>
					{groupRows.map((o) => (
						<tr
							key={o.id}
							className={
								o.status === "Pending"
									? "table-danger"
									: o.status === "In Cook"
										? "table-warning"
										: o.status === "Ready"
											? "table-success"
											: ""
							}
						>
							<td key={o.id}>{o.id}</td>
							<td>{o.tableId}</td>
							<td>
								{(() => {
									const date = new Date(o.date);
									const time = date.toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
										second: "2-digit",
									});
									return time;
								})()}
							</td>
							<td>{o.total}</td>
							<td>{o.status}</td>

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
		const handler = (orderId: any, status: any) => {
			setOrders((prevOrders) => {
				const updatedOrders = prevOrders.map((order) => {
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
					<table className="table" style={{ paddingLeft: "20px" }}>
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
		</div>
	);
}
