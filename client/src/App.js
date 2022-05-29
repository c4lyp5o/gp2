import { BrowserRouter, Routes, Route } from "react-router-dom";

// defaults
import AdminNavbar from "./admin/components/Navbar";
import AdminFooter from "./admin/components/Footer";

// logged in
import AdminCenterStageLoggedIn from "./admin/components/logged/AdminCenterStageLoggedIn";
import AdminHeaderLoggedIn from "./admin/components/HeaderLoggedIn";

// klinik
import KlinikCenter from "./admin/components/klinik/Center";

// pegawai
import PegawaiCenter from "./admin/components/pegawai/Center";

// jp
import JPCenter from "./admin/components/jp/Center";

// taska
import TaskaCenter from "./admin/components/taska/Center";

// tadika
import TadikaCenter from "./admin/components/tadika/Center";

// sr
import SRCenter from "./admin/components/sr/Center";

// sm
import SMCenter from "./admin/components/sm/Center";

// institusi
import InstitusiCenter from "./admin/components/inst/Center";

// misc
import Layout from "./testrun/Layout";
import Fourohfour from "./testrun/Fourohfour";

// tests
import FacilityCenter from "./admin/components/Data";

// import './user/user.css';
// import UserHeader from './user/components/UserHeader';
// import UserNavbar from './user/components/UserNavbar';
// import UserLoginForm from './user/components/UserLoginForm';
// import UserSelamatDatang from './user/components/UserSelamatDatang';
// import UserFooter from './user/components/UserFooter';

import AdminLoginForm from "./admin/components/public/LoginForm";
import { useToken } from "./useToken";

const App = () => {
  const { token, setToken } = useToken();

  function LoggedIn() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <AdminCenterStageLoggedIn />
        <AdminFooter />
      </>
    );
  }

  function Klinik() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <KlinikCenter />
        <AdminFooter />
      </>
    );
  }

  function PP() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <PegawaiCenter />
        <AdminFooter />
      </>
    );
  }

  function JP() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <JPCenter />
        <AdminFooter />
      </>
    );
  }

  function Taska() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        {/* <TaskaCenter /> */}
        <FacilityCenter FType="taska" />
        <AdminFooter />
      </>
    );
  }

  function Tadika() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <TadikaCenter />
        <AdminFooter />
      </>
    );
  }

  function SR() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <SRCenter />
        <AdminFooter />
      </>
    );
  }

  function SM() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <SMCenter />
        <AdminFooter />
      </>
    );
  }

  function Institusi() {
    return (
      <>
        <AdminHeaderLoggedIn />
        <AdminNavbar />
        <InstitusiCenter />
        <AdminFooter />
      </>
    );
  }

  if (!token) {
    return <AdminLoginForm setToken={setToken} />;
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
          {/* <Route index element={<AdminPage />} /> */}
          {/* <Route path="loggedin" element={<LoggedIn />} /> */}
          <Route index element={<LoggedIn />} />
          <Route path="kp" element={<Klinik />} />
          <Route path="pp" element={<PP />} />
          <Route path="jp" element={<JP />} />
          <Route path="taska" element={<Taska />} />
          <Route path="tadika" element={<Tadika />} />
          <Route path="sr" element={<SR />} />
          <Route path="sm" element={<SM />} />
          <Route path="ins" element={<Institusi />} />
          <Route path="*" element={<Fourohfour />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
