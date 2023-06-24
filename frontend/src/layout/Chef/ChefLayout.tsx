import { Outlet, NavLink, ScrollRestoration } from "react-router-dom"
import { Button } from "react-bootstrap";
import Header from "../../components/Header"
import { useAuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
const logo = require('../../assets/logo.png')

export default function ChefLayout() {
    const { loggedOut } = useAuthContext();
    return (<>
        <div className="root-layout">
            <ScrollRestoration />
            <div id="mySidenav" className="sidenav" >
                <img className="logo" src={logo} alt="logo" />
                <NavLink end to="/chef"><span className="lnr lnr-text-align-center"></span>Orders</NavLink>
                <NavLink end to="Inventory"><span className="lnr lnr-store"></span>Inventory</NavLink>
                <NavLink end to="Account"><span className="lnr lnr-user"></span>Account Setting</NavLink>
                <Button style={{
                    marginTop: "56vh",
                    marginLeft: "30px"


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
