
import Cookies from 'js-cookie';
import { useState } from 'react'
import { useTabelsContext } from '../hooks/useTabel';
import { ToastContainer, toast } from 'react-toastify';
const tabel = require('../assets/tabel.webp')
interface Item {
    id: number;
    name: string;
}
interface ChildComponentProps {
    id: String;
    status: String;
    code: String
}

export default function ChefTable(props: ChildComponentProps) {
    const { Tabels, dispatch } = useTabelsContext();
    const [isChecked, setIsChecked] = useState(false);




    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const handleClick = async (id: any) => {

        const response = await fetch('/tables/' + id, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });
        const json = await response.json();

        if (response.ok) {

            dispatch({ type: 'DELETE', payload: id });
            toast.success(`Table with Number ${id} Is Deleted`, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };




    return (


        < div className="tabel" >



            <img className="tabelLogo" src={tabel} alt="" />

            <p>Tabele Number: {props.id}</p>
            <p >Status: <span style={{
                color: props.status === "Available" ? "#23BF50" : "#F04D2F"
            }}>{props.status}</span></p>

        </div >
    )
}
