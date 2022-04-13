import AdminTableHeader from "./AdminTableHeader";
import AdminTableBody from "./AdminTableBody";

function AdminTable() {
    return (
        <div className="admin-table">
            <h1>Senarai Klinik Pergigian Daerah $$$</h1>
            <div className="admin-table-container">
                <AdminTableHeader />
                {/* <AdminTableBody /> */}
            </div>
            <button id='addFac'>Hehe Boi</button>
        </div>
    )
}

export default AdminTable;