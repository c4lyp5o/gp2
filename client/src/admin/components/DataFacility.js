import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { getKP, getFacility, getCurrentUser } from '../context/Helper';
import AddModalFacility from './AddModalFacility';
import EditModalFacility from './EditModalFacility';
import DeleteModal from './DeleteModal';

function FacilityCenter({ FType }) {
  const [kp, setKP] = useState([]);
  const [facility, setFacility] = useState([]);
  const [jenisFacility, setJenisFacility] = useState('');
  const [negeri, setNegeri] = useState('');
  const [daerah, setDaerah] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [Id, setId] = useState('');

  useEffect(() => {
    getFacility(FType).then((res) => {
      setFacility(res.data);
      setJenisFacility(res.jenisFasiliti);
    });
    getKP().then((res) => {
      setKP(res.data);
    });
    getCurrentUser().then((res) => {
      setDaerah(res.data.data.daerah);
      setNegeri(res.data.data.negeri);
    });
  }, [FType]);

  function handleClick(e) {
    setId(e.target.id);
  }

  return (
    <>
      <div className='h-full p-5 overflow-y-auto'>
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold'>
            Senarai {jenisFacility} Daerah {daerah}
          </h1>
          <table className='table-auto border-collapse border border-slate-500'>
            <thead>
              <tr>
                <th className='border border-slate-600 px-3'>Bil.</th>
                <th className='border border-slate-600 px-20'>
                  Nama {jenisFacility}
                </th>
                <th className='border border-slate-600 px-10'>Nama Klinik</th>
                <th className='border border-slate-600 px-3'>Manage</th>
              </tr>
            </thead>
            <select className='border-2 absolute top-40 right-5 w-24'>
              {kp.map((k, index) => (
                <option>{k.nama}</option>
              ))}
            </select>
            <tbody>
              {facility.map((t, index) => (
                <tr>
                  <td className='border border-slate-700'>{index + 1}</td>
                  <td className='border border-slate-700'>{t.nama}</td>
                  <td className='border border-slate-700'>{t.handler}</td>
                  <td className='border border-slate-700'>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      id={t._id}
                      onClick={() => {
                        setEditOpen(true);
                        setId(t._id);
                      }}
                    >
                      Edit
                    </button>
                    {editOpen && (
                      <EditModalFacility setEditOpen={setEditOpen} Id={Id} />
                    )}
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      id={t._id}
                      onClick={(e) => {
                        setIsOpen(true);
                        // setEditOpen(false);
                        handleClick(e);
                      }}
                    >
                      Delete
                    </button>
                    {isOpen && <DeleteModal setIsOpen={setIsOpen} Id={Id} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl'
            id='addFac'
            onClick={() => {
              setAddOpen(true);
              setEditOpen(false);
              setIsOpen(false);
            }}
          >
            <div className='text-adminWhite text-7xl'>
              <FaPlus />
            </div>
          </button>
          {addOpen && (
            <AddModalFacility
              setAddOpen={setAddOpen}
              daerah={daerah}
              negeri={negeri}
              jenisFacility={jenisFacility}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default FacilityCenter;
