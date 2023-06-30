import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tabels from '../Manager/Tabels';
import packageJson from '../../../package.json'


interface Table {
    id: string;
    status: string;
}
interface OrderItem {
    name: string;
    quantity: number;
}

function AddOrder(): JSX.Element {
    const [tables, setTables] = useState<Table[]>([]);
    const [dishes, setDishes] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [id, setID] = useState<string>('');
    const [tabelActive, setTabelActive] = useState('');
    const [statusHolder, setStatusHolder] = useState('');

    const handleCategoryChange = (category: string): void => {
        setSelectedCategory(category);
    };

    const handleAddToOrder = (name: string): void => {
        const existingItem = orderItems.find((item) => item.name === name);
        if (existingItem) {
            setOrderItems(
                orderItems.map((item) =>
                    item.name === name ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setOrderItems([...orderItems, { name, quantity: 1 }]);
        }
    };
    const handleDeleteFromOrder = (name: string): void => {
        setOrderItems(prevItems =>
            prevItems.map(item =>
                item.name === name
                    ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    useEffect(() => {
        document.title = 'Cashier | Add Order';

    }, []);


    const OpenTable = async () => {
        const response1 = await fetch(`/tables/${id}/session`, {
            method: 'POST',
            body: JSON.stringify({ tableId: id, dishes: orderItems }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });

        if (response1.ok) {
            toast.success(`Table Is Opend`, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });

        }
        if (!response1.ok) {
            toast.success(`Table Can't Be Opend`, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });

        }
    }

    useEffect(() => {
        const getTables = async (): Promise<void> => {
            const response = await fetch('/tables/', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                setTables(json);
            }
        };

        const getDishes = async (): Promise<void> => {
            const response = await fetch('/dishes/', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                setDishes(json);
            }
        };

        getDishes();
        getTables();
    }, []);

    useEffect(() => {
        const uniqueCategories = Array.from(new Set(dishes.map((dish) => dish.category)));
        setCategories(uniqueCategories);

    }, [dishes]);

    const insertOrder = async () => {




        const response = await fetch('/orders/', {
            method: 'POST',
            body: JSON.stringify({ tableId: id, dishes: orderItems }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });

        const json = await response.json();

        if (!response.ok) {

            toast.error(json.message, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        } else {

            toast.success(`Order Is Added`, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });

        }


    }

    return (
        <div className="GeneralContent container-fluid ">
            <div className="row">
                <div className="col-4">
                    <div className="GeneralItem scroll" >

                        <label htmlFor="tabelsId">Table Number</label>
                        <select
                            id="tabelsId"
                            name="tabelsId"
                            className="form-select"
                            style={{
                                marginBottom: "20px"
                            }}
                            value={id}
                            onChange={(e) => {
                                const selectedTable = tables.find((table) => table.id.toString() === (e.target.value).toString());

                                setTabelActive(selectedTable?.status || '');
                                setID(e.target.value);



                            }}
                        >
                            <option value="" >
                                Please Choose
                            </option>

                            {tables.map((t) =>

                                <option value={t.id} key={t.id}>
                                    {t.id}
                                </option>

                            )}

                        </select>
                        <button className='btn btn-secondary btn-sm' disabled={tabelActive == 'Busy' || tabelActive == ''} onClick={() => { OpenTable() }}>Open Tabel</button><br /><br />


                        <table className='table table-sm'>
                            <thead>
                                <tr>
                                    <td style={{ width: "300px" }}>Dish Name</td>
                                    <td>Quantity</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>




                                {orderItems.length === 0 ? (
                                    <></>
                                ) : (
                                    <>
                                        {orderItems.map((item) => (
                                            <tr key={item.name}>
                                                <td>{item.name} </td >
                                                <td>{item.quantity} </td >
                                                <td> <button className='btn btn-danger btn-sm' onClick={() => handleDeleteFromOrder(item.name)}>Delete</button> </td >


                                            </tr>

                                        ))}
                                    </>
                                )}
                            </tbody>

                        </table>
                        <button className='btn btn-secondary' onClick={() => {
                            insertOrder()
                        }}> Add Order</button>
                    </div>
                </div>
                <div className="col-8">
                    <div className="GeneralItem scroll" style={{ padding: "0px" }}>
                        <div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-around",
                                backgroundColor: "#F0F0EF",
                                padding: "10px"
                            }}>
                                {categories.map((category) => (
                                    <label key={category} style={{

                                        cursor: "pointer"
                                    }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category}
                                            checked={selectedCategory === category}
                                            onChange={() => handleCategoryChange(category)}
                                            style={{ display: "none" }}
                                        />
                                        {category}
                                    </label>
                                ))}</div>
                        </div>
                        <div style={{
                            display: "grid",
                            padding: "10px",
                            gridTemplateColumns: "auto auto auto auto ",
                            rowGap: "15px",
                            columnGap: "15px"
                        }}>
                            {dishes
                                .filter((dish) => selectedCategory === '' || dish.category === selectedCategory)
                                .map((d) => (
                                    <div key={d.name} onClick={() => handleAddToOrder(d.name)} style={{
                                        cursor: "pointer",
                                        width: "200px",
                                        height: "100px",
                                        backgroundImage: `url(${packageJson.proxy}/images/${d.image})`,
                                        backgroundSize: "cover",
                                        borderRadius: "20px",
                                        textAlign: "center",
                                        paddingTop: "35px"
                                    }}>
                                        <h4 style={{

                                            color: "white",


                                        }}>{d.name}</h4>

                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </div>
    );
}

export default AddOrder;
