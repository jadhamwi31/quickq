import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"
import React from 'react'

import Header from "../../components/Header"

const logo = require('../../assets/logo.png')

export default function CashierLayout() {
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav" >
                <img className="logo" src={logo} alt="logo" />
                <NavLink end to="/cashier"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>


                <NavLink to="AddOrder"><span className="lnr lnr-file-add"></span>Add Order</NavLink>
                <NavLink end to="Account"><span className="lnr lnr-user"></span>Account Setting</NavLink>

            </div>
        </div>




        <div id="main">

            <Header />
            <div className='content'>
                <Outlet /></div>
        </div>

    </>
    )
}
