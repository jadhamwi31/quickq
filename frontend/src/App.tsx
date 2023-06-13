import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";

import "./App.css";

import ManagerLayout from "./layout/Manager/ManagerLayout";
import MenuLayout from "./layout/Manager/MenuLayout";
import Accounting from "./pages/Manager/Accounting";
import Inventory from "./pages/Manager/Inventory";
import ManagerHome from "./pages/Manager/ManagerHome";
import Orders from "./pages/Manager/Orders";
import Tabels from "./pages/Manager/Tabels";

import Category from "./pages/Manager/Menu/Category";
import Customize from "./pages/Manager/Menu/Customize";
import Dish from "./pages/Manager/Menu/Dish";

import CurrentOrders from "./pages/Cashier/CurrentOrders";

import OrderLayout from "./layout/Home/OrderLayout";
import ErrorPage from "./pages/Home/ErrorPage";
import Index from "./pages/Home/Index";
import Login from "./pages/Home/Login";
import DigitalMenu from "./pages/Home/Order/DigitalMenu";
import DishDetails from "./pages/Home/Order/DishDetails";
import Order from "./pages/Home/Order/Order";
import Unauthorized from "./pages/Home/Unauthorized";

import { useAuthContext } from "./context/AuthContext";
import CashierLayout from "./layout/Cashier/CashierLayout";
import ChefLayout from "./layout/Chef/ChefLayout";
import AddOrder from "./pages/Cashier/AddOrder";
import CashierAccount from "./pages/Cashier/CashierAccount";
import ChefInventory from "./pages/Chef/ChefInventory";
import ChefOrders from "./pages/Chef/ChefOrders";
import Payment from "./pages/Home/Order/Payment";
import ActiveTabel from "./pages/Manager/Menu/ActiveTabel";
import Ingredients from "./pages/Manager/Menu/Ingredients";
import Resturant from "./pages/Manager/Resturant";
import Users from "./pages/Manager/Users";

function App() {
	const { authenticated, role } = useAuthContext();

	return (
		<RouterProvider
			router={createBrowserRouter(
				createRoutesFromElements(
					<>
						<Route
							path="login"
							element={!authenticated ? <Login /> : <Navigate to="/" />}
						/>
						<Route
							element={authenticated ? <Outlet /> : <Navigate to={"/login"} />}
						>
							<Route path="Order" element={<OrderLayout />}>
								<Route index element={<Navigate to="Menu" replace={true} />} />
								<Route path="Menu" element={<DigitalMenu />} />
								<Route path="ActiveTabel" element={<ActiveTabel />} />
								<Route path="promotion" element={<></>} />
								<Route path="MyOrder" element={<Order />} />
								<Route path="Dish/:name" element={<DishDetails />} />
								<Route path="payment" element={<Payment />} />
							</Route>

							<Route
								path="/Manager"
								element={
									role === "manager" ? (
										<ManagerLayout />
									) : (
										<Navigate to="/Unauthorized" replace={true} />
									)
								}
							>
								<Route index element={<ManagerHome />} />
								<Route path="Tabels" element={<Tabels />} />
								<Route path="Menu" element={<MenuLayout />}>
									<Route
										index
										element={<Navigate to="Category" replace={true} />}
									/>
									<Route path="Dish" element={<Dish />} />
									<Route path="Ingredients" element={<Ingredients />} />
									<Route index path="Category" element={<Category />} />
									<Route path="Customize" element={<Customize />} />
								</Route>
								<Route path="Accounting" element={<Accounting />} />
								<Route path="Inventory" element={<Inventory />} />
								<Route path="Orders" element={<Orders />} />
								<Route path="Users" element={<Users />} />
								<Route path="Resturant" element={<Resturant />} />
							</Route>

							<Route
								path="/cashier"
								element={
									role === "cashier" ? (
										<CashierLayout />
									) : (
										<Navigate to="/Unauthorized" replace={true} />
									)
								}
							>
								<Route index element={<CurrentOrders />} />
								<Route path="AddOrder" element={<AddOrder />} />
								<Route path="Account" element={<CashierAccount />} />
							</Route>

							<Route
								path="/chef"
								element={
									role === "chef" || "manager" ? (
										<ChefLayout />
									) : (
										<Navigate to="/Unauthorized" replace={true} />
									)
								}
							>
								<Route index element={<ChefOrders />} />
								<Route path="Inventory" element={<ChefInventory />} />
								<Route path="Tables" element={<ChefInventory />} />
								<Route path="Account" element={<ChefLayout />} />
							</Route>
						</Route>
						<Route path="/" element={<Index />} />
						<Route path="Unauthorized" element={<Unauthorized />} />
						<Route path="*" element={<ErrorPage />} />
					</>
				)
			)}
		/>
	);
}

export default App;
