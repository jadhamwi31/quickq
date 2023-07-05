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
import DigitalMenu from "./pages/Client/Order/DigitalMenu";
import DishDetails from "./pages/Client/Order/DishDetails";
import Order from "./pages/Client/Order/Order";
import Unauthorized from "./pages/Home/Unauthorized";

import SocketConnect from "./components/SocketConnect";
import { useAuthContext } from "./context/AuthContext";
import CashierLayout from "./layout/Cashier/CashierLayout";
import ChefLayout from "./layout/Chef/ChefLayout";
import AddOrder from "./pages/Cashier/AddOrder";
import CashierAccount from "./pages/Cashier/CashierAccount";
import ChefInventory from "./pages/Chef/ChefInventory";
import ChefOrders from "./pages/Chef/ChefOrders";
import Payment from "./pages/Client/Order/Payment";
import ActiveTabel from "./pages/Manager/Menu/ActiveTabel";
import Ingredients from "./pages/Manager/Menu/Ingredients";
import Resturant from "./pages/Manager/Resturant";
import Users from "./pages/Manager/Users";
import ChefAccount from "./pages/Chef/ChefAccount";
import CashierOrders from "./pages/Cashier/CashierOrders";
import PaysIn from "./pages/Cashier/PaysIn";
import AccountingLayout from "./layout/Manager/AccountingLayout";
import Today from "./pages/Manager/Accounting/Today";
import PaymentHistory from "./pages/Manager/Accounting/PaymentHistory";
import AI from "./pages/Manager/Accounting/AI";
import ClientLogin from "./pages/Client/ClientLogin";
import CashierTabels from "./pages/Cashier/CashierTabels";
import ChefTables from "./pages/Chef/ChefTables";
import About from "./pages/Client/Order/About";

function App() {
	const { authenticated, role } = useAuthContext();

	return (
		<RouterProvider
			router={createBrowserRouter(
				createRoutesFromElements(
					<>
						<Route
							path="login"
							element={
								!authenticated ? <Login /> : <Navigate to={`/${role}`} />
							}
						/>
						<Route
							path="loginClient/:id"
							element={
								<ClientLogin />
							}
						/>
						<Route
							element={authenticated ? <Outlet /> : <Navigate to={"/login"} />}
						>
							<Route element={<SocketConnect />}>

								<Route path="client" element={
									role === "client" ? (
										<OrderLayout />
									) : (
										<Navigate to="/Unauthorized" replace={true} />
									)
								} >
									<Route
										index
										element={<Navigate to="Menu" replace={true} />}
									/>
									<Route path="Menu" element={<DigitalMenu />} />
									<Route path="ActiveTabel" element={<ActiveTabel />} />
									<Route path="promotion" element={<></>} />
									<Route path="MyOrder" element={<Order />} />
									<Route path="Dish/:name" element={<DishDetails />} />
									<Route path="payment" element={<Payment />} />
									<Route path="About" element={<About />} />
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


									<Route path="Accounting" element={<AccountingLayout />}>
										<Route
											index
											element={<Navigate to="Today" replace={true} />}
										/>
										<Route path="Today" element={<Today />} />
										<Route path="History" element={<PaymentHistory />} />
										<Route path="Ai" element={<AI />} />



									</Route>
									<Route path="Inventory" element={<Inventory />} />
									<Route path="Orders" element={<Orders />} />
									<Route path="Users" element={<Users />} />
									<Route path="Resturant" element={<Resturant />} />
									<Route path="Account" element={<CashierAccount />} />
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
									<Route index element={<CashierOrders />} />
									<Route path="AddOrder" element={<AddOrder />} />
									<Route path="Tables" element={<CashierTabels />} />
									<Route path="Payin" element={<PaysIn />} />
									<Route path="Account" element={<CashierAccount />} />
								</Route>

								<Route
									path="/chef"
									element={
										role === "chef" ? (
											<ChefLayout />
										) : (
											<Navigate to="/Unauthorized" replace={true} />
										)
									}
								>
									<Route index element={<ChefOrders />} />
									<Route path="Inventory" element={<ChefInventory />} />
									<Route path="Tables" element={<ChefTables />} />
									<Route path="Account" element={<ChefAccount />} />

								</Route>
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
