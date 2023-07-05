import Cookies from "js-cookie";
import { useEffect } from "react";
import AddTabelForm from "../../components/AddTabelForm";
import Tabel from "../../components/Tabel";
import { useTabelsContext } from "../../hooks/useTabel";
import { useSocketIoContext } from "../../context/SocketIoContext";
import React from "react";
import CashierTabel from "../../components/CashierTabel";

export default function CashierTabels() {
    const { socket } = useSocketIoContext();
    const { Tabels, dispatch } = useTabelsContext();

    useEffect(() => {
        document.title = `Manager | Tabels`;


    }, []);


    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch("/tables", {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("jwt")}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    dispatch({ type: "SET", payload: json });
                }
            } catch (error) {
                console.error("Error fetching tables:", error);
            }
        };

        fetchTables();
    }, [])

    useEffect(() => {


        socket!.on("update_table_status", (id, status) => {
            const updatedTables = Tabels.map((table: any) => {
                if (table.id === id) {
                    return { ...table, status };
                }
                return table;
            });

            const foundTable = updatedTables.find((table: any) => table.id === id);
            if (foundTable) {
                dispatch({ type: "SET", payload: updatedTables });
            } else {
                console.error("Table not found:", id);
            }
        });
        return () => {
            socket!.off("update_table_status")
        }

    }, [Tabels, dispatch]);

    return (
        <div className="tabels">
            {Tabels &&
                Tabels.map((table: any) => (
                    <CashierTabel
                        key={table.id}
                        id={table.id}
                        status={table.status}
                        code={table.code}
                    />
                ))}

        </div>
    );
}
