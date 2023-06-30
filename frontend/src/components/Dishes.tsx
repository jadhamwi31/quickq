import { useState } from 'react'
import React from 'react'

export default function Asd() {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return (

        <div >
            <label style={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#F8F9FA",
                padding: "10px",
                borderBottom: "1px solid #DEE2E6",
                fontSize: "18px",
            }} >
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                    style={{ display: "none" }}

                />
                <span style={{
                    marginLeft: "10px"
                }}>category name</span>  <span> {isChecked ? <i className="lnr lnr-chevron-up"></i>
                    : <i className="lnr lnr-chevron-down"></i>
                }</span>
            </label>
            {isChecked && (
                <div className="t">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    )
}
