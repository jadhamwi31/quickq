import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useMenuContext } from '../hooks/useMenu';

export default function MenuStyles() {
    const [selectedStyle, setSelectedStyle] = useState('')
    const { Styles, dispatch } = useMenuContext();

    const selectStyle = async () => {
        console.log(selectedStyle)

    }


    return (
        <div className="input-group mb-3 mt-3  ml-3 p-3">

            <h6 className=' m-2'>Set Style </h6>
            <select style={{
                borderRadius: "5px 0px 0px 5px",
                width: "60%"
            }} className='form-control shadow-non' value={selectedStyle} onChange={(e) => {
                setSelectedStyle(e.target.value)
            }} required >
                {Styles && Styles.map((s: any) => (
                    <option value={s.name}>{s.name}</option>
                ))}
            </select>
            <button className='btn btn-primary' onClick={() => { selectStyle() }}> Add</button>



        </div>
    );
}


