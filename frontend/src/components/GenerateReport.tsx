import React from 'react'

export default function GenerateReport() {
    return (

        <div className="GeneralItem">
            <label className="htmlForm-check-label m-2" >From </label>
            <input type="date" className="form-control" />

            <label className="htmlForm-check-label m-2" >To</label>
            <input type="date" className="form-control" />

            <div className="htmlForm-check">
                <input className="htmlForm-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                <label className="htmlForm-check-label m-2" htmlFor="flexRadioDefault1">
                    Default radio
                </label>
            </div>
            <div className="htmlForm-check">
                <input className="htmlForm-check-input " type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                <label className="htmlForm-check-label m-2" htmlFor="flexRadioDefault2">
                    Default checked radio
                </label>
            </div>
        </div>
    )
}
