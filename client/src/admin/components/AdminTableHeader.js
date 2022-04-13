import AdminTableBody from "./AdminTableBody";

function AdminTableHeader() {
    return (
        <div className="admin-table-header-container">
            <div className="admin-table-header-container-text">
                <table>
                    <thead>
                        <tr>
                            <th>Bil.</th>
                            <th>Nama KP</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Manage</th>
                        </tr>
                    </thead>
                    <AdminTableBody />
                </table>
            </div>
        </div>
    )
}

export default AdminTableHeader;