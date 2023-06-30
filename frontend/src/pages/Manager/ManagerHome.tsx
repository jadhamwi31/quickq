import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import ChartComponent from '../../components/ChartComponent';
import Categories from '../../components/Categories';
const tabel = require('../../assets/menu.png')

interface tablesType {
    code: string,
    id: number,
    status: string
}
export default function ManagerHome() {
    const [data, setData] = useState([])
    const [tables, setTables] = useState<tablesType[]>([])
    const [dishes, setDishes] = useState([])
    const [categories, setCategories] = useState([])
    const [users, setUsers] = useState([])
    const [todat, setToday] = useState("")
    const [totalHistory, setTotalHistory] = useState("")

    useEffect(() => {
        document.title = `Manager | Home`;
    }, []);
    useEffect(() => {
        const getSales = async () => {
            const response = await fetch("payments/history", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setData(json.data.payments);
                setTotalHistory(json.data.total);


            }
        };

        const getTodaySales = async () => {
            const response = await fetch("payments/today", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setToday(json.data.payins);


            }
        };

        const getCategories = async () => {
            const response = await fetch("/categories", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setCategories(json);


            }
        };
        const getDishes = async () => {
            const response = await fetch("/dishes", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setDishes(json);


            }
        };
        const getUsers = async () => {
            const response = await fetch("/users", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setUsers(json.data);


            }
        };


        const getTables = async () => {
            const response = await fetch("tables/", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setTables(json);


            }
        };
        getTodaySales();
        getUsers();
        getDishes();
        getCategories();
        getTables();
        getSales();
    }, []);

    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-blue order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Categories</h6>
                                <h2 className="text-right"><i><span className="lnr lnr-text-align-center f-left"></span></i><span>{categories.length}</span></h2>

                                <h3 className="text-right"><i style={{ fontSize: "24px" }}><span className="lnr lnr-dinner f-left"></span></i><span>{dishes.length}</span></h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-yellow order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Busy Tabels</h6>
                                <h2 className="text-right"><i><span className="lnr lnr-inbox f-left"></span></i><span>{tables.filter((t) => t.status === "Busy").length}</span></h2>
                                <p className="m-b-0">All Tabels<span className="f-right">{tables.length}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-green order-card">
                            <div className="card-block">
                                <h6 className="m-b-21">Users</h6>
                                <h2 className="text-right"><i ><span className="lnr lnr-user f-left"></span></i><span>{users.length}</span></h2>
                                <p className="m-b-0">Managers:<span className="f-right">{users.filter((t: any) => t.role === "manager").length}</span></p>
                            </div>
                        </div>
                    </div>



                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-pink order-card">
                            <div className="card-block">
                                <h6 className="m-b-21">Payments</h6>
                                <h2 className="text-right"><i ><span className="lnr lnr-chart-bars f-left"></span></i><span>{todat}</span></h2>
                                <p className="m-b-0">Today:<span className="f-right">{totalHistory}</span></p>
                            </div>
                        </div>
                    </div>


                </div>
            </div >







            <div className="charts">
                <ChartComponent data={data} />

            </div>
        </>
    )
}
