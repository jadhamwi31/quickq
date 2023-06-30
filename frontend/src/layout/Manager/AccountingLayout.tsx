import { NavLink, Outlet } from "react-router-dom";
import { useSocketIoContext } from "../../context/SocketIoContext";

export default function AccountingLayout() {


	return (
		<div className="MenuLayout">
			<div className="GeneralContent container-fluid">
				<div className="MenuNav">
					<NavLink to="today">Today</NavLink>
					<NavLink to="History">History</NavLink>
					<NavLink to="AI">Prediction</NavLink>

				</div>
				<Outlet />
			</div>
		</div>
	);
}
