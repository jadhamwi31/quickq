import Cookies from 'js-cookie';
import { NavLink, Outlet } from "react-router-dom"
import { useEffect } from 'react'
import { useActiveMenu } from "../../hooks/useActiveMenu"
import { useSocketIoContext } from '../../context/SocketIoContext';

function OrderLayout() {

    const { socket } = useSocketIoContext();
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
    const requestHelp = () => {
        socket?.emit("request_help")

    }
    return (
        <div>
            <div className="menuNavbar" style={{
                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#fff",
                borderColor: `${ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#00"}`,
                borderStyle: "solid",
                borderWidth: "3px 1px 0px 1px",


            }}
            >
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} end to="menu"><i className="bi bi-book"></i>Menu</NavLink>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="myOrder"><i className="bi bi-file-earmark-text"></i>Order</NavLink>
                <button style={{
                    color: ActiveMenu ? ActiveMenu.data.menu.body.PrimaryColor : "#000",
                    backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000",
                    position: "absolute",
                    top: "-35px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: "50%",
                    width: "70px",
                    height: "70px",
                    lineHeight: "16px"
                }}
                    onClick={() => {
                        requestHelp()
                    }}
                ><i className="bi bi-info" style={{ fontSize: "30px" }}></i><br />Help</button>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="Payment"><i className="bi bi-cash-coin"></i>Payment</NavLink>
                <NavLink style={{ color: ActiveMenu ? ActiveMenu.data.menu.body.SecondaryColor : "#000" }} to="About"><i className="bi bi-cup-hot"></i>About</NavLink>






            </div>

            <div style={{
                height: "100vh",
                paddingBottom: "40vh",
                overflowY: "auto",
                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.BackgroundColor : "#fff",

            }}>


                <Outlet />
            </div>
        </div >
    )
}

export default OrderLayout