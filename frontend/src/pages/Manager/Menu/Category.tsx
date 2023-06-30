import React from 'react';
import { useEffect } from 'react';
import Categories from '../../../components/Categories';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { useCategoriesContext } from '../../../hooks/useCategory';

export default function Category() {

    useEffect(() => {
        document.title = `Menu | Category`;
    }, []);

    const { dispatch } = useCategoriesContext();
    const [name, setName] = useState('');

    const [picture, setPicture] = useState<any>('');


    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', picture);



        const response = await fetch('/categories/', {
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
            const response = await fetch('/categories/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            }).then((res) => res.json())
            console.log(response)
            dispatch({ type: 'SET', payload: response });
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-4">
                    <div className="GeneralItem">
                        <form onSubmit={handleSubmit}>
                            <label className="form-label" htmlFor="CategoryName" >Category Name</label>
                            <input type="text" id="CategoryName" className="form-control"
                                name="name"
                                onChange={(e) => setName(e.target.value)}
                                value={name} /><br />
                            <label className="form-label" htmlFor="CategoryName" >Category Avatar</label>
                            <input className="form-control" type="file" id="dishAvatar" onChange={(e) => { e.target.files && setPicture(e.target.files[0]) }} /><br />

                            <button className="btn btn-secondary" type='submit'>Add</button>
                        </form>
                    </div>
                </div>

                <div className="col-8 ">
                    <Categories />
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

