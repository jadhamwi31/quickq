
const tabel = require('../assets/tabel.webp')

export default function EditTabelForm() {

    return (
        <>
            <input type="checkbox" id="EditTabelmodal" />
            <label htmlFor="EditTabelmodal" className="EditButton"><span className="lnr lnr-pencil"></span></label>

            <label htmlFor="EditTabelmodal" className="EditTabelmodal-background"></label>
            <div className="EditTabelmodal">
                <div className="EditTabelmodal-header">
                    <h1>  <span className="lnr lnr-pencil"></span>Edit Tabel</h1>
                </div>
                <div className="EditTabelmodal-content">
                    <img src={tabel} alt="" />
                    <form>
                        <label htmlFor="chairNumber">Number of Chairs</label><br />
                        <input type="text" id="chairNumber" />
                        <label htmlFor="chairNumber">Status</label><br />
                        <input type="text" id="chairNumber" />
                    </form>
                </div>
                <div className="EditTabelmodal-footer">
                    <label htmlFor="EditTabelmodal">
                        cancel
                    </label>
                    <button>Add </button>
                </div>

            </div>

        </>
    )
}
