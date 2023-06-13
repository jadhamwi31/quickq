import { useState } from "react";


function openNav(): void {

    const t = document.getElementById("myBtn") as HTMLButtonElement;
    if (t.value === "ON") {
        document.getElementById("mySidenav")!.style.width = "0px";
        document.getElementById("main")!.style.marginLeft = "0px";

        t.value = "OFF";

    } else if (t.value === "OFF") {
        document.getElementById("mySidenav")!.style.width = "250px";
        document.getElementById("main")!.style.marginLeft = "250px";

        t.value = "ON";

    }
}



function Header() {
    const [notificationStatus, setNotificationStatus] = useState(false)
    return (
        <>
            <nav className="header" style={{ zIndex: "1000000000" }}>
                <div>
                    <button id="myBtn" onClick={openNav} value="ON">
                        <span
                            id="menuicon"
                            style={{ fontSize: "30px", cursor: "pointer", transition: "0.5s", color: "#7A7A7A" }}
                        >
                            ☰
                        </span>

                    </button>

                </div>
                <input type="checkbox" name="notification" id="notification" style={{
                    display: "none"
                }}
                    checked={notificationStatus}
                    onChange={() => {
                        setNotificationStatus(prevNotificationStatus => !prevNotificationStatus);

                    }}
                />

                <label htmlFor="notification" style={{
                    cursor: "pointer"
                }}>

                    <span style={{ fontSize: "30px", marginRight: "300px", color: "#7A7A7A" }}>

                        {notificationStatus ? <i className="bi bi-bell-fill" style={{ fontSize: "30px" }}></i> : <i className="bi bi-bell" style={{ fontSize: "30px" }}></i>}
                    </span>

                </label>
            </nav>
            {notificationStatus && (
                <div style={{
                    height: "500px",
                    width: "20%",
                    backgroundColor: "rgba(255, 255, 255, 0.814)",
                    position: "absolute",
                    zIndex: "100000",
                    marginTop: "60px",
                    right: 30,
                    marginLeft: "auto",
                    borderRadius: "25px",
                    border: "1px solid #F0F0EF",
                    backdropFilter: "blur(10px)",
                    overflowY: "auto",
                    boxShadow: "10px 26px 72px -43px rgba(0,0,0,0.75)"



                }}>
                    {/* Content to render when notificationStatus is true */}
                </div >
            )
            }
        </>
    );
}

export default Header;