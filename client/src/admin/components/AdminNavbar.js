import { useState } from "react";
import { FaBars } from "react-icons/fa";

function AdminNavbar() {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  return (
    <>
      <nav
        className={`absolute w-60 h-screen bg-admin2 text-adminWhite text-center top-0 left-0 transition-all ${
          showLinks ? "translate-x-0" : "-translate-x-60"
        }`}
      >
        <div className="h-40"></div>
        <div className="grid">
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#dashboard"
          >
            DASHBOARD
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#klinik pergigian"
          >
            KLINIK PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#pegawai pergigian"
          >
            PEGAWAI PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#juruterapi pergigian"
          >
            JURUTERAPI PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#taska"
          >
            TASKA
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#tadika"
          >
            TADIKA
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#sekolah rendah"
          >
            SEKOLAH RENDAH
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#sekolah menengah"
          >
            SEKOLAH MENENGAH
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="#institusi"
          >
            INSTITUSI
          </a>
        </div>
      </nav>
      <div className="absolute w-60 top-0 left-0 flex text-center justify-center h-40">
        <button
          className="text-2xl bg-adminWhite text-adminBlack mt-14 mb-14 px-3 rounded-md shadow-xl hover:rotate-90 transition-all"
          onClick={toggleLinks}
        >
          <FaBars />
        </button>
      </div>
    </>
  );
}

export default AdminNavbar;
