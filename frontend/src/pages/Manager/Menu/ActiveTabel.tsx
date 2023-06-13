import { useEffect } from 'react'
import Cookies from 'js-cookie';
import { useActiveMenu } from '../../../hooks/useActiveMenu';
function ActiveTabel() {
    const { ActiveMenu, dispatch } = useActiveMenu();
    useEffect(() => {
        document.title = `Menu | Active Tabel`;
    }, []);
    const loginClient = async () => {
        const response = await fetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ "table_code": "dbd7251e-8627-462c-9ad3-4ec519f3c2b7" }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json)
        }
        if (response.ok) {
            console.log(json)
        }


    }
    const OpeanTabel = async () => {
        const response = await fetch("/tables/session", {
            method: "POST",

            credentials: "include",
            headers: {
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            console.log(json)

        }
        if (response.ok) {
            console.log(json)
        }


    }


    return (
        <div >
            <button style={{
                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.BackgroundColor : "#fff"
            }} onClick={() => {
                loginClient();
            }}>Active</button><br />
            <button style={{
                backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.BackgroundColor : "#fff"
            }} onClick={() => {
                OpeanTabel();
            }}>OpeanTabel</button>

        </div >
    )
}

export default ActiveTabel