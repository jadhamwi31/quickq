import React from 'react'
import { NavLink } from "react-router-dom"
const logo = require('../../assets/warnning.png')


function ErrorPage() {
    return (

        <div style={{ backgroundColor: "#f0f0f0", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div>
                <img src={logo} className="BigLogo bounce2" alt="logo" />
                <h1 >404 - Page not found</h1> <p>The page you are looking for might have been removed or is temporarily
                    unavailable.</p>

                <NavLink end to="/" style={{ color: "black", fontSize: "21px", }}><svg style={{ marginRight: "15px" }} width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" ><path fill="black" fill-rule="evenodd" clip-rule="evenodd" d="M4,12l8,8,1.41-1.41L7.83,13H20V11H7.83l5.59-5.59L12,4Z"></path></svg>Go back to home</NavLink>
            </div>
        </div>
    )
}

export default ErrorPage