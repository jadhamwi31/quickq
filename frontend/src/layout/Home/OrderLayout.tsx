import Cookies from 'js-cookie';
import { NavLink, Outlet } from "react-router-dom"
import { useEffect } from 'react'
import { useActiveMenu } from "../../hooks/useActiveMenu"

function OrderLayout() {
    const { ActiveMenu, dispatch } = useActiveMenu();
    useEffect(() => {
        const fetchActiveMenu = async () => {
            const response = await fetch('/menu/active', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET', payload: json });
            }
        };

        fetchActiveMenu();
    }, [dispatch]);

    return (
        <div>
            <div className="menuNavbar" style={{ backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#fff" }}>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} end to="menu"><i className="bi bi-book"></i>Menu</NavLink>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="promotion"><i className="bi bi-star"></i>promo</NavLink>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="myOrder"><i className="bi bi-file-earmark-text"></i>Order</NavLink>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="Payment"><i className="bi bi-cash-coin"></i>Payment</NavLink>





            </div>
            <div style={{ height: "100vh", paddingBottom: "40vh", overflowY: "auto", backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.BackgroundColor : "#fff" }}>

                <Outlet />
            </div>
        </div>
    )
}

export default OrderLayout