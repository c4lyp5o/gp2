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
  const [loading, setLoading] = useState(true);
  const [kp, setKp] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [negeri, setNegeri] = useState(null);
  const [user, setUser] = useState(null);

  // shower
  const [show, setShow] = useState({});
  const [showModal, setShowModal] = useState({});

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { Dictionary, getCurrentUser, readDataForKp } =
    useGlobalAdminAppContext();

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const { data: userData } = await getCurrentUser();
      setUser(userData.nama);
      setKp(userData.kp);
      setDaerah(userData.daerah);
      setNegeri(userData.negeri);
      const { data } = await readDataForKp(FType);
      setData(data);
    };
    getData()
      .then(() => {
        switch (FType) {
          case 'program':
            setShow({ program: true });
            break;
          case 'sosmed':
            setShow({ sosmed: true });
            break;
          case 'tastad':
            setShow({ tastad: true });
            break;
          case 'pp':
            setShow({ pp: true });
            break;
          case 'jp':
            setShow({ jp: true });
            break;
          case 'ins':
            setShow({ ins: true });
            break;
          default:
            setShow({ program: true });
            break;
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      setData(null);
    };
  }, [FType, reload]);

  const props = {
    showModal,
    setShowModal,
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
        {show.program ? <Program {...props} /> : null}
        {show.sosmed ? <Sosmed {...props} /> : null}
        {show.tastad ? <Tastad {...props} /> : null}
        {show.pp ? <Pegawai {...props} /> : null}
        {show.jp ? <Pegawai {...props} /> : null}
        {show.ins ? <Institusi {...props} /> : null}
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {data.length === 0 ? <NothingHereBoi /> : <RenderSection />}
      <RenderModal />
      {FType === 'program' ? (
        <button
          className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl'
          onClick={() => {
            setShowAddModal(true);
            setShowEditModal(false);
            setShowDeleteModal(false);
          }}
        >
          <div className='text-adminWhite text-7xl'>
            <FaPlus />
          </div>
        </button>
      ) : null}
      {showSosMedModal ? <ModalSosMed {...props} /> : null}
    </>
  );
}
