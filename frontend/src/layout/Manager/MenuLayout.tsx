import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import React from 'react'

export default function MenuLayout() {


    return (
        <div className='MenuLayout'>
            <div className="GeneralContent container-fluid">
                <div className="MenuNav">
                    <NavLink to="Category">Category</NavLink>
                    <NavLink to="Dish">Dish</NavLink>
                    <NavLink to="Ingredients">Ingredients</NavLink>
                    <NavLink to="Customize">Customize</NavLink>
                </div>
                <Outlet />
            </div>
        </div>
    )
}
