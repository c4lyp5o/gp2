import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useState, useEffect } from 'react';
import Add from '../Add';
import Edit from '../Edit';
import Delete from '../Delete';
import { FaPlus } from 'react-icons/fa';

import Program from './Program';
import Sosmed from './Sosmed';
import Tastad from './Tastad';
import Pegawai from './Pegawai';
import Institusi from './Institusi';

import ModalSosMed from './modal-sosmed/Modal';

import { Loading } from '../Loading';

import nothinghere from '../../assets/nothinghere.png';

export default function DataKp({ FType }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSosMedModal, setShowSosMedModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [id, setId] = useState(null);

  // data
  const [data, setData] = useState(null);
  const [kp, setKp] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [negeri, setNegeri] = useState(null);
  const [user, setUser] = useState(null);

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { Dictionary, getCurrentUser, readDataForKp } =
    useGlobalAdminAppContext();

  useEffect(() => {
    const getData = async () => {
      const { nama, kp, daerah, negeri } = await getCurrentUser();
      setUser(nama);
      setKp(kp);
      setDaerah(daerah);
      setNegeri(negeri);
      const { data } = await readDataForKp(FType);
      setData(data);
    };
    getData().catch((err) => {
      console.log(err);
    });
    return () => {
      setData(null);
    };
  }, [FType, reload]);

  const props = {
    showAddModal,
    setShowAddModal,
    showSosMedModal,
    setShowSosMedModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    deleteCandidate,
    setDeleteCandidate,
    id,
    setId,
    data,
    setData,
    kp,
    setKp,
    daerah,
    setDaerah,
    negeri,
    setNegeri,
    user,
    setUser,
    reload,
    setReload,
  };

  function NothingHereBoi() {
    return (
      <div className='flex justify-center text-center h-full w-full'>
        <div className='m-auto rounded-md grid'>
          <div className='rounded-lg shadow-lg bg-white max-w-sm'>
            <img
              className='rounded-t-lg'
              src={nothinghere}
              alt='There is nothing here'
            />
            <div className='p-6'>
              <h5 className='text-gray-900 text-xl font-medium mb-2'>
                Tiada Data
              </h5>
              <p className='text-gray-700 text-base mb-4'>
                Data{' '}
                {FType === 'kp' ? `Klinik Pergigian` : `${Dictionary[FType]}`}{' '}
                belum di isi...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const RenderSection = () => {
    return (
      <>
        {FType === 'program' ? <Program {...props} /> : null}
        {FType === 'sosmed' ? <Sosmed {...props} /> : null}
        {FType === 'tastad' ? <Tastad {...props} /> : null}
        {FType === 'pp' ? <Pegawai {...props} /> : null}
        {FType === 'jp' ? <Pegawai {...props} /> : null}
        {FType === 'ins' ? <Institusi {...props} /> : null}
      </>
    );
  };

  const RenderModal = () => {
    return (
      <>
        {showAddModal ? <Add {...props} /> : null}
        {showEditModal ? <Edit {...props} /> : null}
        {showDeleteModal ? <Delete {...props} /> : null}
      </>
    );
  };

  if (!data) {
    return <Loading />;
  }

  if (data) {
    return (
      <>
        {data.length === 0 ? <NothingHereBoi /> : <RenderSection />}
        <RenderModal />
        {showSosMedModal ? <ModalSosMed {...props} /> : null}
      </>
    );
  }
}
