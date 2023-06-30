import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import OrderDishes from "../../components/OrderDishes";

interface Order {
	id: string;
	tableId: string;
	date: string;
	status: string;
	total: string;
	dishes: any[];
}

export default function CurrentOrders() {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		document.title = "Cashier | Orders";
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
							<h5>{groupHeader}</h5>
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
							<td>{o.id}</td>
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
