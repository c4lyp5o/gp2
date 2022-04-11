import '../admin.css';

function AdminLoginForm() {
    return (
        <>
        <div className="admin-form-container">
            <div className="admin-form-box">
                <div className="admin-form-box-header">
                    <span className="admin-form-box-header-text">SILA MASUKKAN KATA LALUAN</span>
                </div>
                <div className="admin-form-box-body">
                    <div className="admin-form-box-body-input-container">
                        <input className="admin-form-box-body-input" type="text" placeholder="ID Pengguna" /><br />
                        <input className="admin-form-box-body-input" type="text" placeholder="Kata Laluan" />
                        <a className="linkLupa" href="/">Lupa kata laluan</a>
                    </div>
                    <br />
                    <div className="admin-form-box-body-button-container">
                        <button className="admin-form-box-body-button">MASUK</button>
                    </div>
                </div>
            </div>
        </div>
        </>        
    );
}

export default AdminLoginForm;