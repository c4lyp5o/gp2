import { FaPlus } from "react-icons/fa";
import { getKP, getTaska } from "../../controllers/helper";
import { useEffect, useState } from "react";

function TaskaTable() {
  const [kp, setKP] = useState([]);
  const [taska, setTaska] = useState([]);
  const [daerah, setDaerah] = useState("");

  useEffect(() => {
    getTaska().then((res) => {
      setTaska(res.data);
      setDaerah(res.data[0].daerah);
    });
    getKP().then((res) => {
      setKP(res.data);
    });
  }, []);
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-3xl font-bold">Senarai Taska Daerah {daerah}</h1>
      <table className="table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600 px-3">Bil.</th>
            <th className="border border-slate-600 px-20">Nama Taska</th>
            <th className="border border-slate-600 px-10">Nama Klinik</th>
            <th className="border border-slate-600 px-3">Manage</th>
          </tr>
        </thead>
        <select className="border-2 absolute top-40 right-5">
          {kp.map((k, index) => (
            <option>{k.nama}</option>
          ))}
        </select>
        <tbody>
          {taska.map((t, index) => (
            <tr>
              <td className="border border-slate-700">{index + 1}</td>
              <td className="border border-slate-700 ...">{t.nama}</td>
              <td className="border border-slate-700 ...">{t.handler}</td>
              <td className="border border-slate-700 ...">
                <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                  Edit
                </button>
                <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                  Delete
                </button>
              </td>
            </tr>
          ))}
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

export default TaskaTable;
