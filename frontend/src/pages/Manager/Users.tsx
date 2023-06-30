import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from '../../context/AuthContext';

interface User {
    username: string;
    password: string;
    role: string;
}

function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUsername, setNewusername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState('');


    const [updatedUser, setUpdatedUser] = useState('');
    const [updatedPassword, setUpdatedPassword] = useState('');
    const [updatedRole, setUpdatedRole] = useState('');




    const handleCloseModal = () => {
        setShowModal(false);
    };
    const addUser = async () => {
        const response = await fetch('/Users', {
            method: 'POST',
            body: JSON.stringify({ username: newUsername, password: password, role: role }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });

        const json = await response.json();

        if (response.ok) {
            setUsers((prevUsers) => [...prevUsers, {
                username: newUsername,
                password: password,
                role: role
            }]);

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
    const updateUserInfo = async (username: string) => {
        const response = await fetch(`/Users/${username}`, {
            method: 'PUT',
            body: JSON.stringify({ username: updatedUser, password: updatedPassword, role: updatedRole }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });


        const updatedData = {
            username: updatedUser,
            password: updatedPassword,
            role: updatedRole
        };
        const json = await response.json();

        if (response.ok) {
            handleCloseModal();
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.username === username ? { ...user, ...updatedData } : user
                )
            );

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

    const deleteUser = async (username: string) => {
        try {
            const response = await fetch(`/Users`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
                body: JSON.stringify({ username })
            });

            const json = await response.json();

            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.username !== username));
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
        } catch (error) {
            toast.error('An error occurred while deleting the user.', {
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
        const getUsers = async () => {
            const response = await fetch('/Users', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setUsers(json.data);
            }
        };

        getUsers();
    }, []);

    const { username } = useAuthContext();
    return (
        <div className="GeneralContent">
            <div className="row">
                <div className="col-4">
                    <div className="GeneralItem scroll">
                        <label htmlFor="username">username</label>
                        <input type="text" className='form-control' value={newUsername} onChange={(e) => {
                            setNewusername(e.target.value)
                        }} />
                        <label htmlFor="password">password</label>
                        <input type="text" className='form-control' value={password} onChange={(e) => {
                            setPassword(e.target.value)
                        }} />
                        <label htmlFor="role">Role</label>
                        <select className='form-select' value={role} onChange={(e) => {
                            setRole(e.target.value)
                        }}>
                            <option value="">Please Choose</option>

                            <option value="cashier">Cashier</option>
                            <option value="chef">Chef</option>
                            <option value="manager">Manager</option>
                        </select><br />
                        <button className='btn btn-secondary' onClick={() => {
                            addUser()
                        }}>Add User</button>
                    </div>
                </div>
                <div className="col-8">
                    <div className="GeneralItem scroll">
                        <div className="t">
                            <div style={{ marginInline: 'auto', marginBottom: '25px' }}>
                                <table className="table" style={{ paddingLeft: '20px' }}>
                                    <thead>
                                        <tr>
                                            <th scope="col">Username</th>
                                            <th scope="col">Password</th>
                                            <th scope="col">Role</th>
                                            <th scope="col">Update</th>
                                            <th scope="col">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.filter((user) => user.username !== username).map((user) => (
                                            <tr key={user.username}>
                                                <td>{user.username}</td>
                                                <td>{user.password}</td>
                                                <td>{user.role}</td>
                                                <td><button className='btn btn-link btn-sm' onClick={() => {
                                                    setUpdatedRole(user.role);
                                                    setUpdatedPassword(user.password);
                                                    setUpdatedUser(user.username);
                                                    setSelectedUser(user.username)
                                                    setShowModal(true);
                                                }}>Update</button></td>
                                                <td><button className='btn btn-danger btn-sm' onClick={() => deleteUser(user.username)}  >Delete</button></td>



                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Information for {selectedUser} </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div>

                            <label htmlFor="username">username</label>
                            <input type="text" className='form-control' value={updatedUser} onChange={(e) => {
                                setUpdatedUser(e.target.value)
                            }} />
                            <label htmlFor="password">password</label>
                            <input type="text" className='form-control' value={updatedPassword} onChange={(e) => {
                                setUpdatedPassword(e.target.value)
                            }} />
                            <label htmlFor="role">Role</label>
                            <select className='form-select' value={updatedRole} onChange={(e) => {
                                setUpdatedRole(e.target.value)
                            }}>
                                <option value="">Please Choose</option>

                                <option value="cashier">Cashier</option>
                                <option value="chef">Chef</option>
                                <option value="manager">Manager</option>
                            </select><br />

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => {
                            updateUserInfo(selectedUser);
                        }}>
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
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="light"
                />
            </div>
        </div >
    );
}

export default Users;