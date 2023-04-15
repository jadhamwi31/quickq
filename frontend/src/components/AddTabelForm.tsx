
const tabel = require('../assets/tabel.webp')

export default function AddTabelForm() {
    return (
        <div className="AddTabel" >
            <input type="checkbox" id="modal" />
            <label htmlFor="modal" className="addTabel-label">
                <span className="lnr lnr-plus-circle "></span><br />
            </label>
            <span className="addTabel-label" >Add </span>
            <label htmlFor="modal" className="modal-background"></label>
            <div className="modal">
                <div className="modal-header">
                    <h1>  <span className="lnr lnr-plus-circle "></span>Add Tabel</h1>
                </div>
                <div className="modal-content">
                    <img src={tabel} alt="" />
                    <form>
                        <label htmlFor="chairNumber">Number of Chairs</label><br />
                        <input type="text" id="chairNumber" />
                    </form>
                </div>
                <div className="modal-footer">
                    <label htmlFor="modal">
                        cancel
                    </label>
                    <button>Add </button>
                </div>
            </div>
        </div>
    )
}
