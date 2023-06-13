import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom'

import './App.css';
import Cookies from 'js-cookie';


import ManagerLayout from './layout/Manager/ManagerLayout';
import Tabels from './pages/Manager/Tabels';
import Inventory from './pages/Manager/Inventory';
import Orders from './pages/Manager/Orders';
import Accounting from './pages/Manager/Accounting';
import ManagerHome from './pages/Manager/ManagerHome';
import MenuLayout from './layout/Manager/MenuLayout';

import Dish from './pages/Manager/Menu/Dish';
import Customize from './pages/Manager/Menu/Customize';
import Category from './pages/Manager/Menu/Category';


import CurrentOrders from './pages/Cashier/CurrentOrders';



import Index from './pages/Home/Index'
import Login from './pages/Home/Login';
import ErrorPage from './pages/Home/ErrorPage';
import Unauthorized from './pages/Home/Unauthorized';
import OrderLayout from './layout/Home/OrderLayout';
import DigitalMenu from './pages/Home/Order/DigitalMenu';
import Order from './pages/Home/Order/Order';
import DishDetails from './pages/Home/Order/DishDetails';
import { io, Socket } from "socket.io-client";



import useRole from './hooks/useRole';
import CashierLayout from './layout/Cashier/CashierLayout';
import AddOrder from './pages/Cashier/AddOrder';
import Ingredients from './pages/Manager/Menu/Ingredients';
import { useEffect, useState } from 'react';
import ActiveTabel from './pages/Manager/Menu/ActiveTabel';
import Payment from './pages/Home/Order/Payment';
import ChefLayout from './layout/Chef/ChefLayout';
import ChefOrders from './pages/Chef/ChefOrders';
import ChefInventory from './pages/Chef/ChefInventory';
import Users from './pages/Manager/Users';
import CashierAccount from './pages/Cashier/CashierAccount';
import Resturant from './pages/Manager/Resturant';
export type TableStatus = "Busy" | "Available";

export type OrderStatusType = "Pending" | "In Cook" | "Ready";
export interface IServerToClientEvents {
  update_table_status: (tableId: number, tableStatus: TableStatus) => void;
  update_order_status: (orderId: number, orderStatus: OrderStatusType) => void;
}

export interface IClientToServerEvents {
  checkoutFinished: () => void;
}


export const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io({
  query: {
    auth: Cookies.get("jwt")
  }
});
function App() {




  const role = useRole()


  return (
    <RouterProvider router={createBrowserRouter(
      createRoutesFromElements(<>
        <Route path="/" element={<Index />} />
        <Route path='Unauthorized' element={<Unauthorized />} />
        <Route path='*' element={<ErrorPage />} />
        <Route path="login" element={!role ? <Login /> : <Navigate to="/" />} />

        <Route path="Order" element={< OrderLayout />} >


          <Route index element={<Navigate to="Menu" replace={true} />} />
          <Route path="Menu" element={<DigitalMenu />} />
          <Route path="ActiveTabel" element={<ActiveTabel />} />
          <Route path="promotion" element={<></>} />
          <Route path="MyOrder" element={<Order />} />
          <Route path="Dish/:name" element={<DishDetails />} />
          <Route path="payment" element={<Payment />} />
        </Route >



        <Route path="/Manager" element={role && role === "manager" ? <ManagerLayout /> : <Navigate to='/Unauthorized' replace={true} />}>
          <Route index element={<ManagerHome />} />
          <Route path='Tabels' element={<Tabels />} />
          <Route path="Menu" element={<MenuLayout />}>
            <Route index element={<Navigate to="Category" replace={true} />} />
            <Route path="Dish" element={<Dish />} />
            <Route path="Ingredients" element={<Ingredients />} />
            <Route index path='Category' element={<Category />} />
            <Route path="Customize" element={<Customize />} />
          </Route>
          <Route path='Accounting' element={<Accounting />} />
          <Route path='Inventory' element={<Inventory />} />
          <Route path='Orders' element={<Orders />} />
          <Route path='Users' element={<Users />} />
          <Route path='Resturant' element={<Resturant />} />
        </Route >


        <Route path="/cashier" element={(role) && (role === "cashier") ? <CashierLayout /> : <Navigate to='/Unauthorized' replace={true} />}>
          <Route index element={<CurrentOrders />} />
          <Route path="AddOrder" element={<AddOrder />} />
          <Route path="Account" element={<CashierAccount />} />

        </Route >

        <Route path="/chef" element={(role) && (role === "chef" || "manager") ? <ChefLayout /> : <Navigate to='/Unauthorized' replace={true} />}>
          <Route index element={<ChefOrders />} />
          <Route path="Inventory" element={<ChefInventory />} />
          <Route path="Tables" element={<ChefInventory />} />
          <Route path="Account" element={<ChefLayout />} />

        </Route >

      </>
      )
    )} />

  );
}

export default App;
