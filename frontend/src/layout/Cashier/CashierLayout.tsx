import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"

import { Button } from "react-bootstrap";
import Header from "../../components/Header"
import { useAuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
const logo = require('../../assets/logo.png')

export default function CashierLayout() {
    const { loggedOut } = useAuthContext();
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav" >
                <img className="logo" src={logo} alt="logo" />
                <NavLink end to="/cashier"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>
                <NavLink to="AddOrder"><span className="lnr lnr-file-add"></span>Add Order</NavLink>
                <NavLink to="Tables"><span className="lnr lnr-inbox"></span>Tables</NavLink>
                <NavLink to="Payin"><span className="lnr lnr-chart-bars"></span>Pays in</NavLink>
                <NavLink end to="Account"><span className="lnr lnr-user"></span>Account Setting</NavLink>
                <Button style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px"


                }}
                    variant="secondary"
                    onClick={async () => {
                        await fetch("/auth/logout", {
                            headers: {
                                Authorization: `Bearer ${Cookies.get("jwt")}`,
                            },
                            method: "POST",
                        });
                        loggedOut();
                    }}
                >
                    <span className="lnr lnr-exit"></span>Logout
                </Button>
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
