import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"
import React from 'react'

import Header from "../../components/Header"

const logo = require('../../assets/logo.png')

export default function ManagerLayout() {
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav" >
                <img className="logo" src={logo} alt="logo" />
                <NavLink end to="/Manager"><span className="lnr lnr-home"></span>Home</NavLink>
                <NavLink to="Tabels"><span className="lnr lnr-inbox"></span>Tabels</NavLink>
                <NavLink to="Menu"><span className="lnr lnr-book"></span>Menu</NavLink>
                <NavLink to="Accounting"><span className="lnr lnr-chart-bars"></span>Accounting</NavLink>
                <NavLink to="Inventory"><span className="lnr lnr-store"></span>Inventory</NavLink>
                <NavLink to="Orders"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>
                <NavLink to="Users"><span className="lnr lnr-users"></span>Users</NavLink>
                <NavLink to="Resturant"><span className="lnr lnr-construction"></span>Resutrant</NavLink>


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
