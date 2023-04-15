import React from 'react'
import { useEffect } from 'react'
export default function Orders() {
    useEffect(() => {
        document.title = `Admin | Orders`;
    }, []);
    return (
        <div>Orders</div>
    )
}
