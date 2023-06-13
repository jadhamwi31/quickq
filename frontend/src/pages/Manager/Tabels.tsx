import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Tabel from '../../components/Tabel';
import AddTabelForm from '../../components/AddTabelForm';
import { useTabelsContext } from '../../hooks/useTabel';
import { socket } from '../../App';
import { table } from 'console';

export default function Tabels() {

    useEffect(() => {
        document.title = `Manager | Tabels`;
    }, []);

    const { Tabels, dispatch } = useTabelsContext();


    useEffect(() => {
        if (Tabels.length > 0) {
            socket.on('update_table_status', (id, status) => {
                const newTables = [...Tabels];
                const index = Tabels.findIndex((table: any) => table.id == id)
                newTables[index].status = status
                dispatch({ type: "SET", payload: newTables })
            })
            return () => {


                socket.off("update_table_status")
            }
        }
    }, [Tabels, dispatch]);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await fetch('/tables', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    dispatch({ type: 'SET', payload: json });
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchTables();
    }, []);


    return (
        <div className='tabels'>
            {Tabels && Tabels.map((table: any) => (
                <Tabel key={table.id} id={table.id} status={table.status} code={table.code} />
            ))}
            <AddTabelForm />
        </div>
    );
}
