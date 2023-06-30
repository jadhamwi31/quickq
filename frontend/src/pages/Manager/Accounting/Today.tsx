import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { useSocketIoContext } from '../../../context/SocketIoContext';
interface Transaction {
    date: string;
    amount: number;
    tableId: string;
}

interface Data {
    transactions: Transaction[];
    payins: number;
}

function Today() {
    const { socket } = useSocketIoContext();
    const [data, setData] = useState<Data>({
        transactions: [],
        payins: 0,
    });

    const [today, setToday] = useState(0);


    useEffect(() => {
        document.title = `Manager | Home`;
    }, []);

    useEffect(() => {
        const getSales = async () => {
            const response = await fetch("/payments/today", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setData(json.data);
                setToday(json.data.payins);
            }
        };

        getSales();
    }, []);
    useEffect(() => {
        socket!.on("increment_payins", (amount) => {
            setToday((previous) => previous + amount)

            console.log("amount", amount);


        });
        return () => {
            socket!.off("increment_payins")
        }


    }, []);
    useEffect(() => {
        socket!.on("new_payment", (pay) => {


            setData((previousData) => ({
                ...previousData,
                transactions: [...previousData.transactions, pay],
            }));

        });
        return () => {
            socket!.off("new_payment")
        }


    }, []);





    const parseTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (

        <div className="scroll">
            <h3>Total : {today}</h3>
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

    );
}
export default Today