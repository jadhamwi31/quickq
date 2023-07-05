import React, { useState, useEffect, useRef, Fragment } from "react";
import { useSocketIoContext } from "../context/SocketIoContext";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
const sound = require('../assets/sound.mp3')


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
    const [notList, setNotList] = useState<any[]>([])
    const [NotificationAlarm, setNotificationAlarm] = useState(0)
    const notificationSoundRef = useRef<any>(new Audio(sound));

    const { socket } = useSocketIoContext();
    useEffect(() => {
        notificationSoundRef.current.load()
        const handleNotification = (title: any, content: any) => {
            toast(`${title}\n${content}`);
            setNotList(prevNotList => {
                const newId = uuidv4();
                const idExists = prevNotList.some(item => item.id === newId);
                if (!idExists) {
                    return [{ id: newId, title: title, content: content }, ...prevNotList];
                }
                return prevNotList;
            });

            const replayAudio = () => {
                notificationSoundRef.current.currentTime = 0;
                notificationSoundRef.current.play();
            };
            replayAudio();
            setNotificationAlarm(prevNotificationAlarm => prevNotificationAlarm + 1);
        };

        socket!.on("notification", handleNotification);
        return () => {
            socket?.off("notification", handleNotification)
        }

    }, []);
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
                        setNotificationAlarm(0)
                    }}
                />

                <label htmlFor="notification" style={{
                    cursor: "pointer"
                }}>
                    <span style={{ fontSize: "30px", marginRight: "300px", color: "#7A7A7A" }}>

                        {NotificationAlarm != 0 ? <div style={{
                            backgroundColor: "red",
                            fontSize: "10px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            paddingTop: "3px",
                            textAlign: "center",
                            color: "white",
                            position: "absolute"
                        }}>{NotificationAlarm}</div> : null}
                        {notificationStatus ? <i className="bi bi-bell-fill" style={{ fontSize: "30px" }}></i> :
                            <i className="bi bi-bell" style={{ fontSize: "30px" }}></i>}
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
                    boxShadow: "10px 26px 72px -43px rgba(0,0,0,0.75)",
                    padding: "15px"
                }}>
                    {notList.map((n: any, index) =>
                    (<Fragment key={n.id}>
                        <p>{n.title}</p>
                        <p>{n.content}</p>
                        <hr />
                    </Fragment>
                    ))}
                    <ToastContainer
                        position="top-left"
                        autoClose={2}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable={false}
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            )
            }
        </>
    );
}

export default Header;