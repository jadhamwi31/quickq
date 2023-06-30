import { NavLink, Outlet } from "react-router-dom";
import { useSocketIoContext } from "../../context/SocketIoContext";

export default function MenuLayout() {


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
