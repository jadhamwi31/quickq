import { useEffect, useState } from 'react'
import Cookies from "js-cookie";


function PaymentHistory() {
    const [data, setData] = useState([])
    const [total, setTotal] = useState('')

    useEffect(() => {
        document.title = `Manager | Home`;
    }, []);

    useEffect(() => {
        const getSales = async () => {
            const response = await fetch("/payments/history", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setData(json.data.payments);
                setTotal(json.data.total);
            }
        };

        getSales();
    }, []);
    const parseTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { day: "2-digit", year: "2-digit", month: "2-digit", hour: "2-digit" });
    };

    return (

        <div className="scroll">
            <h1>Total : {total}</h1>
            <table className="table" style={{ paddingLeft: "20px" }}>
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.map((transaction: any, index) => (
                            <tr key={index}>

                                <td>{parseTime(transaction.date)}</td>
                                <td>{transaction.amount}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>

    );
}
export default PaymentHistory