import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"

import Header from "../components/Header"
const logo = require('../assets/logo.png')

export default function RootLayout() {
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav">
                <img className="logo" src={logo} width="200px" alt="logo" />
                <NavLink end to="/admin"><span className="lnr lnr-home"></span>Home</NavLink>
                <NavLink to="/admin/Tabels"><span className="lnr lnr-inbox"></span>Tabels</NavLink>
                <NavLink to="/admin/Menu"><span className="lnr lnr-book"></span>Menu</NavLink>
                <NavLink to="/admin/Accounting"><span className="lnr lnr-chart-bars"></span>Accounting</NavLink>
                <NavLink to="/admin/Inventory"><span className="lnr lnr-store"></span>Inventory</NavLink>
                <NavLink to="/admin/Orders"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>


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
