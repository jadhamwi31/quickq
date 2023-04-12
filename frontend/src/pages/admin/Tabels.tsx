import { useEffect } from 'react'
import Tabel from '../../components/Tabel'
import AddTabelForm from '../../components/AddTabelForm';
export default function Tabels() {
    useEffect(() => {
        document.title = `Admin | Tabels`;
    }, []);
    return (

        <div className='tabels'>
            <Tabel />
            <Tabel />
            <Tabel />
            <Tabel />
            <Tabel />
            <Tabel />
            <Tabel />
            <Tabel />
            <AddTabelForm />
        </div>
    )
}
