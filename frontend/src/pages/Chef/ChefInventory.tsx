import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChefInventory() {
    interface InventoryItem {
        name: string;
        available: number;
        needed: number;
        unit: string;
    }
    const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [activeItems, setActiveItems] = useState<boolean[]>([]);
    const [availableItems, setAvailableItems] = useState<string[]>([]);
    const [neededItems, setNeededItems] = useState<string[]>([]);

    useEffect(() => {
        document.title = 'Manager | Inventory';
    }, []);

    useEffect(() => {
        const getInventoryItems = async () => {
            const response = await fetch('/inventory/items', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });
            if (response.ok) {
                const json = await response.json();
                const items: InventoryItem[] = json.data.items;
                setInventoryItems(items);
                setActiveItems(new Array(items.length).fill(false));
                setAvailableItems(items.map(item => item.available.toString()));
                setNeededItems(items.map(item => item.needed.toString()));
                setFilteredItems(items);
            }
        };

        getInventoryItems();
    }, []);
    const handleSearch = (query: string) => {
        const filtered = inventoryItems.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredItems(filtered);
    };
    const handleCheckboxChange = (index: number) => {
        setActiveItems(prevActiveItems => {
            const updatedActiveItems = [...prevActiveItems];
            updatedActiveItems[index] = !updatedActiveItems[index];
            return updatedActiveItems;
        });
    };

    const handleAvailableChange = (index: number, value: string) => {
        setAvailableItems(prevAvailableItems => {
            const updatedAvailableItems = [...prevAvailableItems];
            updatedAvailableItems[index] = value;
            return updatedAvailableItems;
        });
    };

    const handleNeededChange = (index: number, value: string) => {
        setNeededItems(prevNeededItems => {
            const updatedNeededItems = [...prevNeededItems];
            updatedNeededItems[index] = value;
            return updatedNeededItems;
        });
    };

    const updateInventoryItems = async (index: number, itemName: string) => {


        const response = await fetch("/inventory/items/" + itemName, {
            method: "PUT",
            body: JSON.stringify({ available: availableItems[index], needed: neededItems[index] }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("jwt")}`,
            },
        });
        const json = await response.json();

        if (!response.ok) {
            toast.error(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        if (response.ok) {
            setActiveItems(prevActiveItems => {
                const updatedActiveItems = [...prevActiveItems];
                updatedActiveItems[index] = false;
                return updatedActiveItems;
            });
            toast.success(json.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }



    };

    return (

        <div className="GeneralContent" >
            <div className="scroll">
                <div className="t">
                    <div style={{ width: "50%", marginInline: "auto", marginBottom: "25px" }}>


                        <div className="form-group has-search">
                            <span className="fa fa-search form-control-feedback"> <i className="bi bi-search"></i></span>
                            <input type="text" className="form-control shadow-none" placeholder="Search" onChange={e => handleSearch(e.target.value)} />
                        </div>
                    </div>

                    <table className="table" style={{ paddingLeft: '20px' }}>
                        <thead

                        >
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Active</th>
                                <th scope="col">Available</th>
                                <th scope="col">Needed</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, index) => (
                                <tr key={item.name}>
                                    <td style={{ paddingTop: "15px" }}>{item.name}</td>
                                    <td style={{ paddingTop: "15px" }}>{item.unit}</td>
                                    <td style={{ paddingTop: "15px" }}>
                                        <input
                                            style={{ cursor: "pointer" }}
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={activeItems[index]}
                                            onChange={() => handleCheckboxChange(index)}
                                            name={item.name}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            disabled={!activeItems[index]}
                                            value={availableItems[index]}
                                            onChange={e => handleAvailableChange(index, e.target.value)}
                                            onKeyPress={e => {
                                                // Allow only decimal numbers and backspace
                                                const charCode = e.which ? e.which : e.keyCode;
                                                if (
                                                    (charCode > 31 && (charCode < 48 || charCode > 57)) // Check for digits
                                                    && charCode !== 46 // Check for decimal point (.)
                                                    && charCode !== 8 // Check for backspace
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            disabled={!activeItems[index]}
                                            value={neededItems[index]}
                                            onChange={e => handleNeededChange(index, e.target.value)}
                                            onKeyPress={e => {
                                                // Allow only decimal numbers and backspace
                                                const charCode = e.which ? e.which : e.keyCode;
                                                if (
                                                    (charCode > 31 && (charCode < 48 || charCode > 57)) // Check for digits
                                                    && charCode !== 46 // Check for decimal point (.)
                                                    && charCode !== 8 // Check for backspace
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            disabled={!activeItems[index]}
                                            className="btn btn-link btn-sm"
                                            onClick={() => updateInventoryItems(index, item.name)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

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
