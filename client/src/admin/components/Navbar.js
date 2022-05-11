import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { changeValueTableKlinik } from "../../testrun/global.js";

function AdminNavbar() {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const handleClick = () => {
    changeValueTableKlinik();
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
            // onClick={handleClick()}
            href="kp"
          >
            KLINIK PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="pp"
          >
            PEGAWAI PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="jp"
          >
            JURUTERAPI PERGIGIAN
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="taska"
          >
            TASKA
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="tadika"
          >
            TADIKA
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="sr"
          >
            SEKOLAH RENDAH
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="sm"
          >
            SEKOLAH MENENGAH
          </a>
          <a
            className="bg-admin3 rounded-md shadow-xl p-3 m-1 hover:bg-admin1 transition-all"
            href="ins"
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
