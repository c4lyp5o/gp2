import { FaPlus } from "react-icons/fa";
import { getCurrentUser, getKP } from "../../controllers/helper.js";
import { useEffect, useState } from "react";
import DeleteModal from "../DeleteModal";
import EditModal from "../EditModal";
import AddModal from "../AddModal";

function KlinikTable() {
  const [KP, setKP] = useState([]);
  const [daerah, setDaerah] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    getKP().then((res) => {
      setKP(res.data);
    });
    getCurrentUser().then((res) => {
      setDaerah(res.data.data.daerah);
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
            <th className="border border-slate-600">Bil.</th>
            <th className="border border-slate-600">Nama KP</th>
            <th className="border border-slate-600">Daerah</th>
            <th className="border border-slate-600">Manage</th>
          </tr>
        </thead>
        <tbody>
          {KP.map((kp, index) => (
            <tr>
              <td className="border border-slate-700">{index + 1}</td>
              <td className="border border-slate-700">{kp.nama}</td>
              <td className="border border-slate-700">{kp.daerah}</td>
              <td className="border border-slate-700">
                <div>
                  <button
                    className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 z-0"
                    onClick={() => {
                      setEditOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Edit
                  </button>
                  {editOpen && <EditModal setEditOpen={setEditOpen} />}
                  <button
                    className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 z-0"
                    onClick={() => {
                      setIsOpen(true);
                      setEditOpen(false);
                    }}
                  >
                    Delete
                  </button>
                  {isOpen && <DeleteModal setIsOpen={setIsOpen} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl z-0"
        id="addFac"
        onClick={() => {
          setAddOpen(true);
          setEditOpen(false);
          setIsOpen(false);
        }}
      >
        <div className="text-adminWhite text-7xl">
          <FaPlus />
        </div>
      </button>
      {addOpen && <AddModal setAddOpen={setAddOpen} />}
    </div>
  );
}

export default KlinikTable;
