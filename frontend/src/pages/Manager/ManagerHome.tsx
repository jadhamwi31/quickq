import { useEffect } from 'react'
import React from 'react'

export default function ManagerHome() {
    useEffect(() => {
        document.title = `Manager | Home`;
    }, []);

    return (
        <>
            <div className="cards">

                <div className="card1 "></div>
                <div className="card1"></div>
                <div className="card1"></div>
                <div className="card1"></div>
            </div>
            <div className="charts">
                <div className="bigChart">fsd</div>
                <div className="smallChart">s </div>
            </div>
        </>
    )
}
