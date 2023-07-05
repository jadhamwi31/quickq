import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSocketIoContext } from "../../context/SocketIoContext";
import { Modal, Button } from "react-bootstrap";

export default function ChefInventory() {
    const { socket } = useSocketIoContext();
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [available, setAvailable] = useState("");
    const [needed, setNeeded] = useState("");
    const [thold, setThold] = useState("");

    useEffect(() => {
        document.title = "Manager | Inventory";

        return () => {
            // Clean up the socket connection when the component is unmounted
            socket!.off("update_inventory_item");
        };
    }, [socket]);

    const [showModal, setShowModal] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState("");

    useEffect(() => {
        const getInventoryItems = async () => {
            const response = await fetch("/inventory/items", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("jwt")}`,
                },
            });
            if (response.ok) {
                const json = await response.json();

                setInventoryItems(json);
                setFilteredItems(json);
            }
        };

        getInventoryItems();
    }, []);

    const handleSearch = (query: string) => {
        const filtered = inventoryItems.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredItems(filtered);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const updateInventoryItems = async (itemName: string) => {
        const response = await fetch("/inventory/items/" + itemName, {
            method: "PUT",
            body: JSON.stringify({
                available: available,
                needed: needed,
                thresh_hold: thold,
            }),
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

        const updatedData = {
            available: parseFloat(available),
            needed: parseFloat(needed),
            thresh_hold: parseFloat(thold),
        };

        if (response.ok) {
            setFilteredItems((prevItems) =>
                prevItems.map((item) =>
                    item.name === itemName ? { ...item, ...updatedData } : item
                )
            );

            handleCloseModal();

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

    useEffect(() => {
        socket!.on("update_inventory_item", (ingredientName, { available, needed, thresh_hold }) => {
            const updatedData = {
                available: available,
                needed: needed,
                thresh_hold
            };

            setFilteredItems((prevItems) =>
                prevItems.map((item) =>
                    item.name === ingredientName ? { ...item, ...updatedData } : item
                )
            );
        });

        return () => {
            socket!.off("update_inventory_item");
        };
    }, []);


    return (
        <div className="GeneralContent">
            <div className="scroll">
                <div className="t">
                    <div style={{ width: "50%", marginInline: "auto", marginBottom: "25px" }}>
                        <div className="form-group">

                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Search"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table" style={{ paddingLeft: "20px" }}>
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Unit</th>

                                <th scope="col">Available</th>
                                <th scope="col">Needed</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems && filteredItems.map((item, index) => (
                                <tr key={item.name}>
                                    <td style={{ paddingTop: "15px" }}>{item.name}</td>
                                    <td style={{ paddingTop: "15px" }}>{item.unit}</td>
                                    <td style={{ paddingTop: "15px" }}>{item.thresh_hold}</td>
                                    <td style={{ paddingTop: "15px" }}>{item.available}</td>
                                    <td style={{ paddingTop: "15px" }}>{item.needed}</td>
                                    <td>
                                        <button
                                            className="btn btn-link btn-sm"
                                            onClick={() => {
                                                setSelectedInventory(item.name);
                                                setNeeded(item.needed);
                                                setAvailable(item.available);
                                                setThold(item.thresh_hold);
                                                setShowModal(true);
                                            }}
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

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Information for {selectedInventory}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>

                        <label htmlFor="username">Available</label>
                        <input
                            type="text"
                            className="form-control"
                            value={available}
                            onChange={(e) => {
                                setAvailable(e.target.value);
                            }}
                        />
                        <label htmlFor="password">Needed</label>
                        <input
                            type="text"
                            className="form-control"
                            value={needed}
                            onChange={(e) => {
                                setNeeded(e.target.value);
                            }}
                        />
                        <br />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => updateInventoryItems(selectedInventory)}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                position="bottom-right"
                autoClose={1000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </div>
    );
}
