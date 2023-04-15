import { useEffect } from 'react'
export default function Accounting() {
    useEffect(() => {
        document.title = `Admin | Accounting`;
    }, []);
    return (
        <div>Accounting</div>
    )
}
