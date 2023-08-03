import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useAdminData } from '../../context/admin-hooks/useAdminData';
import { useUtils } from '../../context/useUtils';
import { useDictionary } from '../../context/useDictionary';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import Klinik from './Klinik';
import Kkiakd from './Kkiakd';
import Operators from './Operators';
import Tastad from './Tastad';
import Sekolah from './Sekolah';
import KPBMPB from './KPBMPB';
import Program from './Program';

import { AddModal, EditModal, DeleteModal } from '../Modal';
import { Loading, NothingHereBoi } from '../Screens';

export default function Data({ FType }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [id, setId] = useState('');

  // data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [negeri, setNegeri] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dataIndex, setDataIndex] = useState(null);

  // short circuit
  const [show, setShow] = useState({});

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { getCurrentUser } = useGlobalAdminAppContext();
  const { encryptEmail, encryptPassword } = useUtils();
  const { readData } = useAdminData();
  const { Dictionary } = useDictionary();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: userData } = await getCurrentUser();
        setDaerah(userData.daerah);
        setNegeri(userData.negeri);
        setUser(userData.nama);

        const data = await readData(FType);
        setData(data);

        switch (FType) {
          case 'kp':
            setShowPassword({
              [data.username]: false,
              [data.kaunterUsername]: false,
            });
            setShow({ klinik: true });
            break;
          case 'kkiakd':
            setShow({ kkiakd: true });
            break;
          case 'jp':
          case 'pp':
            setShow({ operators: true });
            break;
          case 'taska':
          case 'tadika':
            setShow({ tastad: true });
            break;
          case 'sr':
          case 'sm':
            setShow({ sekolah: true });
            break;
          case 'program':
            setShow({ program: true });
            break;
          case 'kpb':
          case 'mpb':
            setShow({ kpbmpb: true });
            break;
          default:
            break;
        }
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setLoading(true);
      setShow({});
    };
  }, [FType, reload]);

  const props = {
    //data
    data,
    FType,
    negeri,
    daerah,
    user,
    id,
    setId,
    // reloader
    setReload,
    reload,
    // funcs and misc
    showInfo,
    setShowInfo,
    dataIndex,
    setDataIndex,
    showPassword,
    setShowPassword,
    deleteCandidate,
    setDeleteCandidate,
    Dictionary,
    encryptEmail,
    encryptPassword,
    // modals
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
  };

  const RenderSection = () => {
    return (
      <>
        {show.klinik ? <Klinik {...props} /> : null}
        {show.kkiakd ? <Kkiakd {...props} /> : null}
        {show.operators ? <Operators {...props} /> : null}
        {show.tastad ? <Tastad {...props} /> : null}
        {show.sekolah ? <Sekolah {...props} /> : null}
        {show.kpbmpb ? <KPBMPB {...props} /> : null}
        {show.program ? <Program {...props} /> : null}
      </>
    );
  };

  const RenderModal = () => {
    return (
      <>
        {showAddModal && <AddModal {...props} />}
        {showEditModal && <EditModal {...props} />}
        {showDeleteModal && <DeleteModal {...props} />}
      </>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!loading) {
    return (
      <>
        <div className='h-full overflow-y-auto'>
          <button
            className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-md z-10'
            onClick={() => {
              setShowAddModal(true);
              setShowEditModal(false);
              setShowDeleteModal(false);
            }}
          >
            <div className='text-adminWhite text-5xl'>
              <FaPlus />
            </div>
          </button>
          {!data ? <NothingHereBoi FType={FType} /> : <RenderSection />}
        </div>
        <RenderModal />
      </>
    );
  }
}
