import { useNavigate } from "react-router-dom"
import React from 'react'

function Backmenu() {
    let navigate = useNavigate();
    return (
        <div className="backmenu">

            <button onClick={() => navigate(-1)} ><i className="bi bi-arrow-left"></i>
            </button>


        </div>
    )
}

export default Backmenu