import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dish() {
    const [ingredientsList, setIngredientsList] = useState([] as { name: string }[]);
    const [selectedIngredientsList, setSelectedIngredientsList] = useState([] as { name: string, amount: number }[]);
    const [amountInputs, setAmountInputs] = useState([] as string[]);
    const [categories, setCategories] = useState<string[]>([]);
    const [dishName, setDishName] = useState('')
    const [dishPicture, setDishPicture] = useState<any>()
    const [dishPrice, setDishPrice] = useState('')
    const [dishDesc, setDishDesc] = useState('')
    const [dishCategory, setDdishCategory] = useState('')
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', dishName);
        formData.append('price', dishPrice);
        formData.append('description', dishDesc);
        formData.append('ingredients', JSON.stringify(selectedIngredientsList));
        formData.append('category', dishCategory);
        formData.append('image', dishPicture);

        const response = await fetch('/dishes/', {
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
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

            toast.success(`New Dish Is Added`, {
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
        document.title = `Menu | Dish`;
    }, []);
    useEffect(() => {
        const Categories = async () => {
            const response = await fetch('/categories', {
                headers: {

                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            })
            const json = await response.json()
            if (response.ok) {
                setCategories(json);
            }
        }
        Categories()
    }, [])

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

                    setIngredientsList(json);
                }
            } catch (error) {
                console.error('Error fetching tables:', error);
            }
        };

        fetchIng();
    }, []);

    useEffect(() => {
        setAmountInputs(new Array(ingredientsList.length).fill(''));
    }, [ingredientsList]);

    const handleRemoveIngredient = (ingredient: { name: string, amount: number }) => {
        setSelectedIngredientsList(prevList => prevList.filter(item => item.name !== ingredient.name));
    };



    return (
        <>
            <div className="row">
                <div className="col-4">
                    <div className="left GeneralItem scroll">
                        <form onSubmit={handleSubmit}>
                            <label className="form-label" htmlFor="DishName">Dish Name</label>
                            <input type="text" className="form-control" id="DishName" onChange={(e) => setDishName(e.target.value)} value={dishName} /><br />
                            <label htmlFor="dishAvatar" className="form-label">Dish Avatar</label>
                            <input className="form-control" type="file" id="dishAvatar" onChange={(e) => { e.target.files && setDishPicture(e.target.files[0]) }} /><br />
                            <label className="form-label" htmlFor="dishPrice">Price</label>
                            <input
                                className="form-control"
                                type="text"
                                id="dishPrice"
                                onChange={(e) => {
                                    const regex = /^\d+(\.\d{0,2})?$/;

                                    if (regex.test(e.target.value) || e.target.value === '') {
                                        setDishPrice(e.target.value);
                                    }
                                }}
                                value={dishPrice}
                            /><br />
                            <label className="form-label" htmlFor="Description">Description</label>
                            <textarea className="form-control" id="Description" rows={3} onChange={(e) => setDishDesc(e.target.value)} value={dishDesc} ></textarea><br />
                            <label htmlFor="CategoryName">Category</label>
                            <select className="form-select" value={dishCategory} onChange={(e) => setDdishCategory(e.target.value)}>
                                <option value="">Please Select</option>

                                {categories.map((category: any, index) => (
                                    <option key={index} value={category.name}>{category.name}</option>
                                ))}
                            </select>
                            <br />
                            <table className="table" style={{ paddingLeft: "20px" }}>
                                <thead style={{
                                    position: "sticky", top: "0",
                                    backgroundColor: "#F8F9FA",
                                }}>
                                    <tr style={{ textAlign: "center" }}>
                                        <th scope="col">Name</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedIngredientsList && selectedIngredientsList.map((ingredient) => (
                                        <tr key={ingredient.name} className="">
                                            <td> {ingredient.name}</td>
                                            <td> {ingredient.amount}</td>
                                            <td>  <button className="btn btn-link" onClick={() => handleRemoveIngredient(ingredient)}>
                                                Remove
                                            </button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn btn-secondary" type="submit">
                                Add Dish
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-8 ">
                    <div className="left GeneralItem">
                        <div className="scroll">
                            <table className="table" style={{ paddingLeft: "20px" }}>
                                <thead style={{
                                    position: "sticky", top: "0",
                                    backgroundColor: "#F8F9FA",
                                }}>
                                    <tr style={{ textAlign: "center" }}>
                                        <th scope="col">Name</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Add</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredientsList && ingredientsList.map((ingredient, index) => (
                                        <tr key={ingredient.name} style={{ textAlign: "center" }}>
                                            <td>{ingredient.name}</td>
                                            <td style={{
                                                width: "100px"
                                            }}><input
                                                    className="form-control"
                                                    type="text"
                                                    value={amountInputs[index] || ''} // Provide a default value of an empty string if it's undefined
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const regex = /^\d+(\.\d{0,2})?$/;
                                                        if (regex.test(value) || value === '') {
                                                            const updatedInputs = [...amountInputs];
                                                            updatedInputs[index] = value;
                                                            setAmountInputs(updatedInputs);
                                                        }
                                                    }}
                                                    id={`ingredientAmount_${index}`}
                                                /></td>
                                            <td>  <button className="btn btn-link"
                                                onClick={() => {
                                                    if (amountInputs[index]) {
                                                        setSelectedIngredientsList(prevList => [...prevList, { name: ingredient.name, amount: parseInt(amountInputs[index]) }]);
                                                        const updatedInputs = [...amountInputs];
                                                        updatedInputs[index] = '';
                                                        setAmountInputs(updatedInputs);
                                                    }
                                                }}
                                            >
                                                Add
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
        </>
    )
}
