import { FaPlus } from "react-icons/fa";
import { getKP } from "../../controllers/helper.js";
import { useEffect, useState } from "react";

function KlinikTable() {
  const [KP, setKP] = useState([]);
  const [daerah, setDaerah] = useState("");

  useEffect(() => {
    getKP().then((res) => {
      setKP(res.data);
      setDaerah(res.data[0].daerah);
    });
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">
        Senarai Klinik Pergigian Daerah {daerah}
      </h1>
      <table className="table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th class="border border-slate-600 ...">Bil.</th>
            <th class="border border-slate-600 ...">Nama KP</th>
            <th class="border border-slate-600 ...">Daerah</th>
            <th class="border border-slate-600 ...">
              KP yang bertanggungjawab
            </th>
            <th class="border border-slate-600 ...">Manage</th>
          </tr>
        </thead>
        <tbody>
          {KP.map((kp, index) => (
            <tr>
              <td class="border border-slate-600 ...">{index + 1}</td>
              <td class="border border-slate-600 ...">{kp.nama}</td>
              <td class="border border-slate-600 ...">{kp.daerah}</td>
              <td class="border border-slate-600 ...">{kp.handler}</td>
              <td class="border border-slate-600 ...">
                <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                  Edit
                </button>
                <button class="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {/* <tbody>
          <tr>
            <td class="border border-slate-700 ...">1</td>
            <td class="border border-slate-700 ...">KP Gulau</td>
            <td class="border border-slate-700 ...">kpgulau</td>
            <td class="border border-slate-700 ...">rahasia</td>
            <td class="border border-slate-700 ...">
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
            <td class="border border-slate-700 ...">2</td>
            <td class="border border-slate-700 ...">KP Naka</td>
            <td class="border border-slate-700 ...">kpnaka</td>
            <td class="border border-slate-700 ...">rahasia</td>
            <td class="border border-slate-700 ...">
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
        </tbody> */}
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

export default KlinikTable;
