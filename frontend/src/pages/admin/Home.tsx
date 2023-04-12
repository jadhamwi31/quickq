import { useEffect } from 'react'

export default function Home() {
    useEffect(() => {
        document.title = `Admin | Home`;
    }, []);

    return (
        <>
            <div className="cards">

                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
            </div>
            <div className="charts">
                <div className="bigChart">fsd</div>
                <div className="smallChart">s </div>
            </div>
        </>
    )
}
