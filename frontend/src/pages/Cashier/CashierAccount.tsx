import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function CashierAccount() {
    const [userName, setUsername] = useState('');
    const [oldPassword, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    useEffect(() => {
        const jwt = Cookies.get('jwt');
        if (!jwt) {
            throw new Error('JWT token is missing');
        }
        const decode = jwt_decode(jwt) as any;
        setUsername(decode.username)
    },)

    const updatePassword = async () => {
        if (newPassword === confirmPassword) {
            const response = await fetch(`/Users`, {
                method: "PUT",
                body: JSON.stringify({ oldPassword: oldPassword, password: newPassword }),
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

                setPassword('')
                setNewPassword('')
                setConfirmPassword('')

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
        }
        else {

            toast.error('Passwords don\'t match', {
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
        <div className='GeneralContent'>
            <div className="row">
                <div className="col-6" style={{
                    marginInline: "auto"
                }}> <div className="GeneralItem scroll">



                        <div className='' style={{ width: "100%" }}>
                            <h4>Change Password</h4>
                            <hr />

                            Old Password:
                            <input type="text" className='form-control' value={oldPassword} onChange={(e) => {
                                setPassword(e.target.value)
                            }} /><br />
                            New Password:
                            <input type="text" className='form-control' value={newPassword} onChange={(e) => {
                                setNewPassword(e.target.value)
                            }} /><br />
                            Retype Password
                            <input type="text" className='form-control' value={confirmPassword} onChange={(e) => {
                                setConfirmPassword(e.target.value)
                            }} />
                            <br />

                            <button className='btn btn-secondary' onClick={() => {
                                updatePassword()
                            }}>Change</button>
                        </div>

                    </div></div>



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

        </div >
    )
}

export default CashierAccount