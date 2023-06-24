import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface Transaction {
    date: string;
    amount: number;
    tableId: string;
}

interface Data {
    transactions: Transaction[];
    payins: number;
}

function PaysIn() {
    const [data, setData] = useState<Data>({
        transactions: [],
        payins: 0,
    });

    useEffect(() => {
        const getInventoryItems = async () => {
            const response = await fetch("/payments/today", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setData(json.data);
            }
        };

        getInventoryItems();
    }, []);

    const parseTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (
        <div className="GeneralContent container-fluid">
            <div className="scroll">
                <h3>Total : {data.payins.toLocaleString()}</h3>
                <table className="table" style={{ paddingLeft: "20px" }}>
                    <thead>
                        <tr>
                            <th scope="col">Tabel</th>
                            <th scope="col">Date</th>
                            <th scope="col">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.transactions &&
                            data.transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.tableId}</td>
                                    <td>{parseTime(transaction.date)}</td>
                                    <td>{transaction.amount}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaysIn;
