import { useEffect } from 'react'

export default function Inventory() {
    useEffect(() => {
        document.title = `Admin | Inventory`;
    }, []);

    return (
        <div >Inventory</div>
    )
}
