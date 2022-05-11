import { FaPlus } from "react-icons/fa";
import { tableVar } from "../../../testrun/global.js";

function AdminTable() {
  function KlinikListTable() {
    if (tableVar === "klinik") {
      return (
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-3xl font-bold">
            Senarai Klinik Pergigian Daerah Kota Setar / Pendang
          </h1>
          <table className="table-auto border-collapse border border-slate-500">
            <thead>
              <tr>
                <th className="border border-slate-600 ...">Bil.</th>
                <th className="border border-slate-600 ...">Nama KP</th>
                <th className="border border-slate-600 ...">Username</th>
                <th className="border border-slate-600 ...">Password</th>
                <th className="border border-slate-600 ...">Manage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-700 ...">1</td>
                <td className="border border-slate-700 ...">KP Gulau</td>
                <td className="border border-slate-700 ...">kpgulau</td>
                <td className="border border-slate-700 ...">rahasia</td>
                <td className="border border-slate-700 ...">
                  <div className="admin-table-header-container-text-manage">
                    <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                      Edit
                    </button>
                    <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-700 ...">2</td>
                <td className="border border-slate-700 ...">KP Naka</td>
                <td className="border border-slate-700 ...">kpnaka</td>
                <td className="border border-slate-700 ...">rahasia</td>
                <td className="border border-slate-700 ...">
                  <div className="admin-table-header-container-text-manage">
                    <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                      Edit
                    </button>
                    <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            className="bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl"
            id="addFac"
          >
            <div className="text-adminWhite text-7xl">
              <FaPlus />
            </div>
          </button>
        </div>
      );
    }
  }

  function StaffListTable() {
    function Pegawai() {
      if (tableVar === "pegawai") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Pegawai Pergigian Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    function Juruterapi() {
      if (tableVar === "juruterapi") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Juruterapi Pergigian Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    if (tableVar === "pegawai" || tableVar === "juruterapi") {
      return (
        <div className="flex flex-col items-center gap-5">
          <Pegawai />
          <Juruterapi />
          <div>
            <table className="table-auto border-collapse border border-slate-500">
              <thead>
                <tr>
                  <th className="border border-slate-600 ...">Bil.</th>
                  <th className="border border-slate-600 ...">Nama</th>
                  <th className="border border-slate-600 ...">Gred</th>
                  {/* <th>KP</th> */}
                  <th className="border border-slate-600 ...">
                    Nama Klinik Pergigian
                  </th>
                  <th className="border border-slate-600 ...">Role</th>
                  <th className="border border-slate-600 ...">Manage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-700 ...">1</td>
                  <td className="border border-slate-700 ...">Calypso</td>
                  <td className="border border-slate-700 ...">666</td>
                  <td className="border border-slate-700 ...">
                    Klinik Pergigian Datuk Kumbar
                  </td>
                  {/* <td>KP Datuk Kumbar</td> */}
                  <td className="border border-slate-700 ...">Driller</td>
                  <td className="border border-slate-700 ...">
                    <div className="admin-table-header-container-text-manage">
                      <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                        Edit
                      </button>
                      <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-700 ...">2</td>
                  <td className="border border-slate-700 ...">Mariya</td>
                  <td className="border border-slate-700 ...">999</td>
                  <td className="border border-slate-700 ...">
                    Klinik Pergigian Alor Janggus
                  </td>
                  {/* <td>KP Alor Janggus</td> */}
                  <td className="border border-slate-700 ...">Driller</td>
                  <td className="border border-slate-700 ...">
                    <div className="admin-table-header-container-text-manage">
                      <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                        Edit
                      </button>
                      <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className="bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl"
            id="addFac"
          >
            <div className="text-adminWhite text-7xl">
              <FaPlus />
            </div>
          </button>
        </div>
      );
    }
  }
  function EducationCenterListTable() {
    function Taska() {
      if (tableVar === "taska") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Taska Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    function TadikaPraSekolah() {
      if (tableVar === "tadika") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Tadika Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    function SekolahRendah() {
      if (tableVar === "sr") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Sekolah Rendah Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    function SekolahMenengah() {
      if (tableVar === "sm") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Sekolah Menengah Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    function Institusi() {
      if (tableVar === "inst") {
        return (
          <h1 className="text-3xl font-bold">
            Senarai Institusi Daerah Kota Setar / Pendang
          </h1>
        );
      }
    }
    if (
      tableVar === "taska" ||
      tableVar === "tadika" ||
      tableVar === "sr" ||
      tableVar === "sm" ||
      tableVar === "inst"
    ) {
      return (
        <div className="flex flex-col items-center gap-5">
          <Taska />
          <TadikaPraSekolah />
          <SekolahRendah />
          <SekolahMenengah />
          <Institusi />
          <div className="admin-table-container">
            <div className="admin-table-header-container">
              <select className="border-2 absolute top-15 left-5">
                <option>Klinik Pergigian Alor Janggus</option>
                <option>Klinik Pergigian Datuk Kumbar</option>
              </select>
              <div className="admin-table-header-container-text">
                <table className="table-auto border-collapse border border-slate-500">
                  <thead>
                    <tr>
                      <th className="border border-slate-600 ...">Bil.</th>
                      <th className="border border-slate-600 ...">Nama</th>
                      <th className="border border-slate-600 ...">
                        Nama Klinik Pergigian
                      </th>
                      <th className="border border-slate-600 ...">Manage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-700 ...">1</td>
                      <td className="border border-slate-700 ...">Calypso</td>
                      <td className="border border-slate-700 ...">666</td>
                      <td className="border border-slate-700 ...">
                        <div className="admin-table-header-container-text-manage">
                          <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                            Edit
                          </button>
                          <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-700 ...">1</td>
                      <td className="border border-slate-700 ...">Calypso</td>
                      <td className="border border-slate-700 ...">666</td>
                      <td className="border border-slate-700 ...">
                        <div className="admin-table-header-container-text-manage">
                          <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                            Edit
                          </button>
                          <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button
                className="bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl"
                id="addFac"
              >
                <div className="text-adminWhite text-7xl">
                  <FaPlus />
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <KlinikListTable />
      <StaffListTable />
      <EducationCenterListTable />
    </div>
  );
}

export default AdminTable;
