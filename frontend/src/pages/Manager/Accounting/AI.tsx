import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function AI() {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        document.title = 'Manager | Home';
    }, []);

    useEffect(() => {
        const getPrices = async () => {
            try {
                const response = await fetch('/ai/predictions/prices', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });
                const json = await response.json();
                if (response.ok) {


                    setData(json);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error(error);
                // Handle error state or display an error message
            }
        };

        getPrices();
    }, []);

    return (
        <div className="scroll">
            <table className="table" style={{ paddingLeft: '20px' }}>
                <thead>
                    <tr>
                        <th scope="col">Dish Name</th>
                        <th scope="col">Actual Price</th>
                        <th scope="col">Recommended Price</th>
                    </tr>
                </thead>
                <tbody>
                    {data &&
                        data.map((d: any, index: any) => (
                            <tr key={index}>
                                <td>{d.dish_name}</td>
                                <td>{d.actual_price}</td>
                                <td
                                    style={{
                                        color: d.recommended_price >= d.actual_price ? 'green' : 'red',
                                    }}
                                >
                                    {d.recommended_price}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default AI;
