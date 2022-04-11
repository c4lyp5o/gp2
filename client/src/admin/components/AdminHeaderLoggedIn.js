function AdminHeaderLoggedIn() {
    return (
        <div className="admin-header-logged-in-container">
            <div className="admin-header-gambar">
                <img
                width={100}
                height={100} 
                src="https://www.rubiks.com/media/catalog/product/cache/9c57e2fe71f8a58f6afba681a0a15dd4/r/u/rubik-4x4-solved_4.jpg" alt="logo" />
            </div>
            <div className="admin-header-info">
                <p>hehe boi</p>
                <p>hehe boi</p>
            </div>
            <div className="admin-header-logout">
                <button className="admin-header-logout-button">LOGOUT</button>
            </div>
        </div>
    );
}

export default AdminHeaderLoggedIn;