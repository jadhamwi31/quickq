import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"
import React from 'react'

import Header from "../../components/Header"

const logo = require('../../assets/logo.png')

export default function ChefLayout() {
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav" >
                <img className="logo" src={logo} alt="logo" />
                <NavLink end to="/chef"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>
                <NavLink end to="Inventory"><span className="lnr lnr-store"></span>Inventory</NavLink>
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
