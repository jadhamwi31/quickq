import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PackageJson from '../../../package.json'
import { useNavigate, Link } from 'react-router-dom'
import { useActiveMenu } from '../../hooks/useActiveMenu';
import Cookies from 'js-cookie';
import { useAuthContext } from '../../context/AuthContext';


function ClientLogin() {
    const { ActiveMenu } = useActiveMenu();
    let navigate = useNavigate();
    const [brand, setBrand] = useState<any>([]);
    const { loggedIn, authenticated } = useAuthContext();
    const getBrand = async () => {
        const response = await fetch('/brand');

        if (response.ok) {
            const json = await response.json();
            setBrand(json.data.brand)

        }
    };

    const loginTable = async () => {




        await fetch('/auth/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ table_code: params.id })
        })

        loggedIn();


    }
    useEffect(() => {
        if (authenticated) {
            navigate("/client")
        }
    }, [authenticated])

    useEffect(() => {
        getBrand();

    }, []);
    const params = useParams();
    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: ActiveMenu ? ActiveMenu.data.menu.body.BackgroundColor : "#fff"
        }}>

            <div style={{
                width: "200px",
                height: "600px",
                position: "absolute",
                left: "0",
                right: "0",
                top: "0",
                bottom: "0",
                margin: "auto",
                maxWidth: " 100%",
                maxHeight: " 100%",
                overflow: "auto",
                textAlign: "center",
            }}>
                <img src={`${PackageJson.proxy}/images/${brand.logo}`} alt='' style={{ width: "200px", height: "200px" }} />
                <h1>Welcome to {brand.name}</h1>
                <h3><i>{brand.slogan}</i></h3>

                <button onClick={() => { loginTable() }}>Login</button>

            </div>
        </div>
    )
}

export default ClientLogin

