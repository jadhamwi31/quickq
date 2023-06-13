import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { log } from 'console';
interface Brand {
    name: string,
    logo: string,
    slogan: string
}


function Resturant() {

    const [brand, setBrand] = useState<any>([]);
    const [name, setName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [logo, setLogo] = useState<any>();




    const add = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('slogan', slogan);
        formData.append('logo', logo);
        const response = await fetch('/brand', {
            method: 'PUT',
            body: formData,
            credentials: 'include',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`,
            },
        });

        const json = await response.json();
        if (response.ok) {
            console.log(logo)

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

    useEffect(() => {
        const getBrand = async () => {
            const response = await fetch('/brand', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setBrand(json.data)
                console.log(json.data)
            }
        };

        getBrand();
    }, []);
    return (
        <div className="GeneralContent">
            <div className="row">
                <div className="col-4">
                    <div className="GeneralItem scroll">
                        <label htmlFor="">Resturant Name:</label>
                        <input type="text" className='form-control' value={name} onChange={(e) => { setName(e.target.value) }} /><br />
                        <label htmlFor="">Resturant Solgan:</label>
                        <input type="text" className='form-control' value={slogan} onChange={(e) => { setSlogan(e.target.value) }} /><br />
                        <label htmlFor="">Resturant Logo:</label>
                        <input className="form-control" type="file" id="dishAvatar" onChange={(e) => { e.target.files && setLogo(e.target.files[0]) }} /><br />
                        <button className='btn btn-secondary ' onClick={() => {
                            add()
                        }}>Add</button>
                    </div>
                </div>
                <div className="col-8">
                    <div className="GeneralItem scroll" style={{ textAlign: "center" }}>
                        <img src={`http://localhost:80/images/${brand.logo}`} alt='' width="400px"></img>
                        <h3>Name</h3>
                        <h5><i>Lorem ipsum dolor consectetur voluptates, beatae optio dicta dolorem maxime quo officia consequatur at, consequuntur repellat.</i></h5>
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
        </div >
    );
}

export default Resturant;