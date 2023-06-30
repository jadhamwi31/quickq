import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Backmenu from '../../../components/Backmenu';
import { useOrder } from '../../../hooks/useOrder';
import { ToastContainer, toast } from 'react-toastify';
import PackageJson from '../../../../package.json'
const placeholder = require('../../../assets/placeholder.webp');

function DishDetails() {
    const { Order, dispatch } = useOrder();
    const [count, setCount] = useState(0);
    const params = useParams();
    const navigate = useNavigate();
    const [dish, setDish] = useState<{
        name: string;
        image: string;
        price: string;
        category: string;
        description: string;
        ingredients: {
            name: string;
            amount: number;
            unit: string;
        }[];
    } | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch('/dishes'); // Replace with the correct API endpoint
                const json = await response.json();
                if (response.ok) {
                    const dish = json.find((item: any) => item.name === params.name);
                    if (dish) {
                        setDish(dish);
                    }
                } else {

                    console.error('Error:', json.error);
                }
            } catch (error) {
                // Handle fetch error here
                console.error('Fetch Error:', error);
            }
        };
        fetchItem();
    }, [params.name]);
    const AddOrder = (name: String, count: Number, Price: String, image: String) => {
        if (count != 0) {
            dispatch({ type: 'ADD', payload: { name: name, quantity: count, Image: image } })
            toast.success(`${name} is added to order list with count of ${count}`, {
                position: "bottom-right",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.error(`please choose count`, {
                position: "bottom-right",
                autoClose: 500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }


    }

    return (
        <>
            <div className="backmenu">
                <button onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            </div>

            <div
                style={{
                    width: '95%',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '20px 20px 20px 20px',
                    margin: '60px auto 30vh auto',
                }}
            >
                <img
                    src={`${PackageJson.proxy}/images/${dish ? dish.image : ""}`}
                    alt=""
                    style={{
                        borderRadius: '20px',
                        width: '100%',
                    }}
                />

                <h2 style={{ marginTop: '30px' }}>{dish ? dish.name : ''}</h2>
                <h6 style={{ marginTop: '30px' }}>{dish ? dish.description : ''}</h6>
                <h5 style={{ marginTop: '30px' }}>{dish ? dish.price : ''}</h5>

                <div style={{ display: 'inline' }}></div>

                <button
                    style={{
                        border: '1px solid #eee',
                        borderRadius: '25px',
                        width: '40px',
                        display: 'inline-block',
                        marginRight: '10px',
                        fontSize: '30px',
                    }}
                    disabled={count === 0}
                    onClick={() => {
                        setCount(count - 1);
                    }}
                >
                    -
                </button>
                <p style={{ display: 'inline-block', fontSize: '30px' }}>{count}</p>
                <button
                    style={{
                        border: '1px solid #eee',
                        borderRadius: '25px',
                        width: '40px',
                        display: 'inline-block',
                        margin: '10px',
                        fontSize: '30px',
                    }}
                    onClick={() => {
                        setCount(count + 1);
                    }}
                >
                    +
                </button>
                <button className='btn' style={{
                    border: '1px solid #eee',
                    borderRadius: '15px',
                    display: 'inline-block',
                    margin: '10px',
                    fontSize: '30px',
                }} onClick={() => {
                    AddOrder(dish ? dish?.name : "ss", count, dish ? dish?.price : "", dish ? dish.image : "")

                }}>Add to Order List</button>
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
            </div >
        </>
    );
}

export default DishDetails;
