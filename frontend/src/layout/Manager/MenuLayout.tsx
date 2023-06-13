import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useSocketIoContext } from "../../context/SocketIoContext";

export default function MenuLayout() {
	const { socket } = useSocketIoContext();
	useEffect(() => {
		console.log(socket);
	}, [socket]);
	return (
		<div className="MenuLayout">
			<div className="GeneralContent container-fluid">
				<div className="MenuNav">
					<NavLink to="Category">Category</NavLink>
					<NavLink to="Dish">Dish</NavLink>
					<NavLink to="Ingredients">Ingredients</NavLink>
					<NavLink to="Customize">Customize</NavLink>
				</div>
				<Outlet />
			</div>
		</div>
	);
}
