import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import Program from './Program';
import Sosmed from './Sosmed';
import Tastad from './Tastad';
import Pegawai from './Pegawai';
import Institusi from './Institusi';

import ModalSosMed from './modal-sosmed/Modal';

import { AddModal, EditModal, DeleteModal } from '../superadmin/Modal';
import { Loading, NothingHereBoi } from '../Screens';

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

  const { getCurrentUser, readDataForKp } = useGlobalAdminAppContext();

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
        {showAddModal ? <AddModal {...props} /> : null}
        {showEditModal ? <EditModal {...props} /> : null}
        {showDeleteModal ? <DeleteModal {...props} /> : null}
      </>
    );
  };

  const handleAdd = () => {
    if (FType === 'sosmed') {
      setShowSosMedModal(true);
    }
    if (FType === 'program') {
      setShowAddModal(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {data.length === 0 ? <NothingHereBoi FType={FType} /> : <RenderSection />}
      <RenderModal />
      {FType === 'program' || FType === 'sosmed' ? (
        <button
          className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-xl'
          onClick={handleAdd}
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
