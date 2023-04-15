import EditTabelForm from "./EditTabelForm"

const tabel = require('../assets/tabel.webp')

export default function Tabel() {

    return (
        <div className="tabel">
            <img className="tabelLogo" src={tabel} alt="" />

            <p>Tabele Number: 3</p>
            <p>Status: Reserved</p>
            <div className="multi-button">
                <button className="ControlButton"><span className="lnr lnr-trash" ></span></button>
                <EditTabelForm />
                <button className="ControlButton"><span className="lnr lnr-eye"></span></button>
            </div>
        </div>
    )
}
