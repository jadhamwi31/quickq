import { useEffect } from 'react'

export default function Menu() {
    useEffect(() => {
        document.title = `Admin | Menu`;
    }, []);
    return (
        <div>Menu</div>
    )
}
