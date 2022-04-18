import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHeader from "./admin/components/AdminHeader";
import AdminNavbar from "./admin/components/AdminNavbar";
import AdminCenterStage from "./admin/components/AdminCenterStage";
import AdminFooter from "./admin/components/AdminFooter";
import Layout from "./testrun/Layout";
import Fourohfour from "./testrun/Fourohfour";

// import './user/user.css';
// import UserHeader from './user/components/UserHeader';
// import UserNavbar from './user/components/UserNavbar';
// import UserLoginForm from './user/components/UserLoginForm';
// import UserSelamatDatang from './user/components/UserSelamatDatang';
// import UserFooter from './user/components/UserFooter';

const App = () => {
  function AdminPage() {
    return (
      <>
        <AdminHeader />
        <AdminNavbar />
        <AdminCenterStage />
        <AdminFooter />
      </>
    );
  }

  // <div className='user-canvas'>
  //   <UserHeader />
  //   <UserNavbar />
  //   <UserLoginForm />
  //   {/* <UserSelamatDatang /> */}
  //   <UserFooter />
  // </div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminPage />} />
          <Route path="*" element={<Fourohfour />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
