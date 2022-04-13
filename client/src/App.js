// import './App.css';
import "./admin/admin.css";
import AdminHeader from "./admin/components/AdminHeader";
// import AdminHeaderLoggedIn from './admin/components/AdminHeaderLoggedIn';
import AdminNavbar from "./admin/components/AdminNavbar";
import AdminLoginForm from "./admin/components/AdminLoginForm";
import AdminSelamatDatang from "./admin/components/AdminSelamatDatang";
import AdminFooter from "./admin/components/AdminFooter";

function App() {
  return (
    <div className="canvas">
      <AdminHeader />
      {/* <AdminHeaderLoggedIn /> */}
      <AdminNavbar />
      {/* <AdminLoginForm /> */}
      <AdminSelamatDatang />
      <AdminFooter />
    </div>
  );
}

export default App;
