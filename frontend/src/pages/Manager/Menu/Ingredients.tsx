import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function Ingredients() {
    useEffect(() => {
        document.title = `Menu | Ingredients`;
    }, []);
    const [ingredientsList, setIngredientsList] = useState([] as { name: string; unit: string; }[]);
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        const ingredients = { name, unit };

        const response = await fetch('/ingredients/', {
            method: 'POST',
            body: JSON.stringify(ingredients),
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
            toast.success(`${name} Is Added`, {
                position: 'bottom-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            setIngredientsList((prevList) => [...prevList, ingredients]);
        }
    };

    const handleClick = async (name: string) => {
        const response = await fetch('/ingredients/' + name, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });

        const json = await response.json();

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
            const updatedIngredientsList = ingredientsList.filter((ingredient) => ingredient.name !== name);
            setIngredientsList(updatedIngredientsList);
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
        const fetchIng = async () => {
            try {
                const response = await fetch('/ingredients', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`,
                    },
                });

                if (response.ok) {
                    const json = await response.json();
                    console.log(json);
                    setIngredientsList(json);
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchIng();
    }, []);

    return (
        <div className="row">
            <div className="col-4">
                <div className="GeneralItem">
                    <form onSubmit={handleSubmit}>
                        <label className="form-label" htmlFor="CategoryName">
                            Name
                        </label>
                        <input
                            type="text"
                            id="CategoryName"
                            className="form-control"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        /><br />
                        <select className="form-select" value={unit} onChange={(e) => setUnit(e.target.value)}>
                            <option value="">Please Select</option>
                            <option value="Kilogram">Kilogram</option>
                            <option value="Gram">Gram</option>
                            <option value="Ounce">Ounce</option>
                            <option value="Pound">Pound</option>
                        </select>
                        <br />
                        <button className="btn btn-secondary" type="submit">Add</button>
                    </form>
                </div>
            </div>
            <div className="col-8">
                <div className="GeneralItem">
                    <div className="scroll">
                        <div className="t">
                            <table className="table" style={{ paddingLeft: '20px' }}>
                                <thead
                                    style={{
                                        position: 'sticky',
                                        top: '0',
                                        backgroundColor: '#F8F9FA',
                                    }}
                                >
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Unit</th>
                                        <th scope="col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredientsList && ingredientsList.map((i: any) => (
                                        <tr key={i.name}>
                                            <td >{i.name}</td>
                                            <td >{i.unit}</td>
                                            <td >
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleClick(i.name)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
