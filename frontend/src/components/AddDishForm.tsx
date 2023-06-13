import React from 'react'


export default function AddDishForm() {
    return (
        <div className="left GeneralItem">
            <form>
                <label className="form-label" htmlFor="CategoryName">Dish Name</label>
                <input type="text" className="form-control" id="CategoryName" />
                <label htmlFor="dishAvatar" className="form-label">Dish Avatar</label>
                <input className="form-control" type="file" id="dishAvatar" />
                <label className="form-label" htmlFor="dishPrice">Price</label>
                <input className="form-control" type="text" id="dishPrice" />
                <label className="form-label" htmlFor="CategoryName">Unit</label>
                <input className="form-control" type="text" id="CategoryName" />
                <label htmlFor="CategoryName">Category</label>
                <select className="form-select">
                    <option>gg</option>
                    <option>gg</option>
                    <option>gg</option>
                    <option>gg</option>
                </select>
            </form>


        </div >
    )

}
