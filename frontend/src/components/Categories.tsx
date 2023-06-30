import React, { useEffect, useState } from 'react';
import { useCategoriesContext } from '../hooks/useCategory';
import Cookies from 'js-cookie';
import UpdateCategory from './UpdateCategory';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import PackageJson from '../../package.json'
function Categories() {
    const [dishes, setDishes] = useState([] as {
        name: string;
        price: string;
        category: string;
        description: string;
        ingredients: {
            name: string;
            amount: number;
            unit: string;
        }[];
    }[]);
    const [dishName, setDishName] = useState('');
    const [dishName1, setDishName1] = useState('');
    const [dishPrice, setDishPrice] = useState('');
    const [dishPrice1, setDishPrice1] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { Categories, dispatch } = useCategoriesContext();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const response = await fetch('/dishes/' + dishName1, {
            method: 'PUT',
            body: JSON.stringify({
                name: dishName,
                price: dishPrice,
            }),
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
        }

        if (response.ok) {
            setShowModal(false);
            setDishes((prevDishes) => {
                const updatedDishes = prevDishes.map((dish) => {
                    if (dish.name === dishName1) {
                        return {
                            ...dish,
                            name: dishName,
                            price: dishPrice,
                        };
                    }
                    return dish;
                });

                return updatedDishes;
            });
            toast.success(json.message, {
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
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleClick = async (name: string) => {
        const response = await fetch('/categories/' + name, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({ type: 'DELETE', payload: name });

            toast.success(`${name} Is Deleted`, {
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
        }
    };

    const handleDishDelete = async (name: string) => {
        const response = await fetch('/dishes/' + name, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });
        const json = await response.json();
        setDishes((prevDishes) => prevDishes.filter((dish) => dish.name !== name));
        if (response.ok) {
            toast.success(`${name} Is Deleted`, {
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
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await fetch('/categories', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET', payload: json });
            }
        };

        fetchCategories();
    }, [dispatch]);

    useEffect(() => {
        const fetchDishes = async () => {
            const response = await fetch('/dishes', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            const json = await response.json();

            if (response.ok) {
                setDishes(json);

            }
        };

        fetchDishes();
    }, []);

    return (
        <div className="GeneralItem">
            <div className="scroll">
                <div className="t">
                    {Categories &&
                        Categories.map((c: any) => {
                            const categoryDishes = dishes.filter((dish) => dish.category === c.name);
                            return (
                                <div key={c.name}>
                                    <label
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            backgroundColor: '#F8F9FA',
                                            padding: '10px',
                                            fontSize: '18px',
                                        }}
                                    >
                                        <div style={{ width: '800px' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div style={{ paddingTop: '7px' }}><img src={c.image ? `${PackageJson.proxy}/images/${c.image}` : ''} style={{
                                                    borderRadius: "15px",
                                                    width: "50px",
                                                    height: "50px",
                                                    marginRight: "50px"

                                                }} alt='' />{c.name}</div>


                                                <div style={{ display: 'flex' }}>
                                                    <UpdateCategory categoryName={c.name} />
                                                    <button className="btn btn-link" onClick={() => handleClick(c.name)}>
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </label>

                                    <div className="t">
                                        <table className="table">
                                            <tbody>
                                                {categoryDishes.map((d, index) => (
                                                    <tr key={index}>
                                                        <td>{d.name}</td>
                                                        <td>{d.price}</td>
                                                        <td>
                                                            <>
                                                                <button
                                                                    onClick={() => {
                                                                        setShowModal(true);
                                                                        setDishName1(d.name);

                                                                    }}
                                                                    className="btn btn-link btn-sm"
                                                                >
                                                                    Update
                                                                </button>
                                                                <Modal show={showModal} onHide={handleCloseModal} centered>
                                                                    <Modal.Header closeButton>
                                                                        <Modal.Title>Edit Dish {dishName1}</Modal.Title>
                                                                    </Modal.Header>
                                                                    <form onSubmit={handleSubmit}>
                                                                        <Modal.Body>
                                                                            <label className="form-label" htmlFor="dishName">
                                                                                Dish Name
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id="dishName"
                                                                                className="form-control"
                                                                                name="name"
                                                                                onChange={(e) => setDishName(e.target.value)}
                                                                                value={dishName}
                                                                            />

                                                                            <label className="form-label" htmlFor="dishPrice">
                                                                                Dish Price
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                id="dishPrice"
                                                                                className="form-control"
                                                                                name="price"
                                                                                onChange={(e) => setDishPrice(e.target.value)}
                                                                                value={dishPrice}
                                                                            />
                                                                            <br />
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" onClick={handleCloseModal}>
                                                                                Close
                                                                            </Button>
                                                                            <Button variant="primary" type="submit">
                                                                                Save changes
                                                                            </Button>
                                                                        </Modal.Footer>
                                                                    </form>
                                                                </Modal>
                                                            </>
                                                        </td>
                                                        <td>
                                                            <button onClick={() => handleDishDelete(d.name)} className="btn btn-danger btn-sm">
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <br />
                                    <br />
                                </div>
                            );
                        })}
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

export default Categories;
