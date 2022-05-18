import { FaPlus } from "react-icons/fa";
import { getCurrentUser, getPG } from "../../controllers/helper";
import { useEffect, useState } from "react";
import DeleteModal from "../DeleteModal";
import EditModal from "../EditModal";
import AddModal from "./Modal";

function PegawaiTable() {
  const [pg, setPG] = useState([]);
  const [daerah, setDaerah] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    getPG().then((res) => {
      setPG(res.data);
    });
    getCurrentUser().then((res) => {
      setDaerah(res.data.data.daerah);
    });
  }, []);

  function Pegawai() {
    return (
      <h1 className="text-3xl font-bold">
        Senarai Pegawai Pergigian Daerah {daerah}
      </h1>
    );
  }
  // function Juruterapi() {
  //   return (
  //     <h1 className="text-3xl font-bold">
  //       Senarai Juruterapi Pergigian Daerah Kota Setar / Pendang
  //     </h1>
  //   );
  // }
  return (
    <div className="flex flex-col items-center gap-5">
      <Pegawai />
      {/* <Juruterapi /> */}
      <div>
        <table className="table-auto border-collapse border border-slate-500">
          <thead>
            <tr>
              <th className="border border-slate-600">Bil.</th>
              <th className="border border-slate-600">Nama</th>
              <th className="border border-slate-600">Gred</th>
              <th className="border border-slate-600">Nama Klinik Pergigian</th>
              <th className="border border-slate-600">Role</th>
              <th className="border border-slate-600">Manage</th>
            </tr>
          </thead>
          <tbody>
            {pg.map((p, index) => (
              <tr id={index}>
                <td className="border border-slate-700">{index + 1}</td>
                <td className="border border-slate-700">{p.nama}</td>
                <td className="border border-slate-700">{p.gred}</td>
                <td className="border border-slate-700">{p.kpSkrg}</td>
                <td className="border border-slate-700">{p.role}</td>
                <td className="border border-slate-700">
                  <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                    Edit
                  </button>
                  {editOpen && <EditModal setEditOpen={setEditOpen} />}
                  <button className="bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2">
                    Delete
                  </button>
                  {isOpen && <DeleteModal setIsOpen={setIsOpen} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl"
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

export default PegawaiTable;
