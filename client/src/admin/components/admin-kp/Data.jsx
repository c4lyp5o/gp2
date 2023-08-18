import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useKpData } from '../../context/kp-hooks/useKpData';
import { useLogininfo } from '../../context/useLogininfo';

import Tastad from './Tastad';
import Pegawai from './Pegawai';
import Program from './Program';
import KlinikPergigianBergerak from './KPB';
import MakmalPergigianBergerak from './MPB';

import { AddModalForKp, EditModalForKp, DeleteModal } from '../Modal';
import { Loading, NothingHereBoi } from '../Screens';

export default function DataKp({ FType }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [id, setId] = useState(null);

  // data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kp, setKp] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [negeri, setNegeri] = useState(null);
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);

  // pp jp last place
  const [showInfo, setShowInfo] = useState(false);
  const [dataIndex, setDataIndex] = useState(null);

  // shower
  const [show, setShow] = useState({});
  const [showModal, setShowModal] = useState({});

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { readDataForKp } = useKpData();
  const { loginInfo } = useLogininfo();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        setAccountType(loginInfo.accountType);
        setUser(loginInfo.nama);
        setNegeri(loginInfo.negeri);
        setDaerah(loginInfo.daerah !== '-' ? loginInfo.daerah : undefined);
        setKp(loginInfo.kp);

        const res = await readDataForKp(FType, kp);
        setData(res.data);

        switch (FType) {
          case 'program':
            setShow({ program: true });
            break;
          case 'tastad':
            setShow({ tastad: true });
            break;
          case 'pp':
          case 'jp':
            setShow({ operators: true });
            break;
          case 'kpb':
            setShow({ kpb: true });
            break;
          case 'mpb':
            setShow({ mpb: true });
            break;
          default:
            break;
        }
      } catch (error) {
        setData(null);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setData(null);
      setShow({});
      setLoading(true);
    };
  }, [FType, reload]);

  const props = {
    showInfo,
    setShowInfo,
    dataIndex,
    setDataIndex,
    showModal,
    setShowModal,
    showAddModal,
    setShowAddModal,
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
    accountType,
    setAccountType,
    reload,
    setReload,
    FType,
  };

  const RenderModal = () => {
    return (
      <>
        {showAddModal && <AddModalForKp {...props} />}
        {showEditModal && <EditModalForKp {...props} />}
        {showDeleteModal && <DeleteModal {...props} />}
      </>
    );
  };

  const RenderSection = () => {
    return (
      <>
        {show.program && <Program {...props} />}
        {show.tastad && <Tastad {...props} />}
        {show.operators && <Pegawai {...props} />}
        {show.kpb && <KlinikPergigianBergerak {...props} />}
        {show.mpb && <MakmalPergigianBergerak {...props} />}
      </>
    );
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className='h-full overflow-y-auto'>
        {FType === 'program' && (
          <button
            className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-md z-10'
            onClick={() => {
              setShowAddModal(true);
            }}
          >
            <div className='text-adminWhite text-5xl'>
              <FaPlus />
            </div>
          </button>
        )}
        {!data ? <NothingHereBoi FType={FType} /> : <RenderSection />}
      </div>
      <RenderModal />
    </>
  );
}
