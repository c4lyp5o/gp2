import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import Program from './Program';
import Sosmed from './Sosmed';
import Followers from './Followers';
import Tastad from './Tastad';
import Pegawai from './Pegawai';
import Institusi from './Institusi';
import KlinikPergigianBergerak from './KPB';
import MakmalPergigianBergerak from './MPB';

import {
  ModalSosMed,
  ModalDataIkutProgram,
  ModalAddFollowers,
} from '../modal-sosmed/Modal';
import { AddModalForKp, EditModalForKp, DeleteModal } from '../Modal';
import { Loading, NothingHereBoi } from '../Screens';

export default function DataKp({ FType }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSosMedModal, setShowSosMedModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showSosMedDataModal, setShowSosMedDataModal] = useState(false);
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

  // follower
  const [namaPlatform, setNamaPlatform] = useState(null);
  const [jumlahBulanTerdahulu, setJumlahBulanTerdahulu] = useState(null);
  const [jumlahBulanIni, setJumlahBulanIni] = useState(null);

  // pp jp last place
  const [showInfo, setShowInfo] = useState(false);
  const [dataIndex, setDataIndex] = useState(null);

  // shower
  const [show, setShow] = useState({});
  const [showModal, setShowModal] = useState({});

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { getCurrentUser, readDataForKp, readData } =
    useGlobalAdminAppContext();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const { data: userData } = await getCurrentUser();

        setAccountType(userData.accountType);
        setUser(userData.nama);
        setKp(userData.kp);
        setDaerah(userData.daerah !== '-' ? userData.daerah : undefined);
        setNegeri(userData.negeri);

        const { data } = await (userData.accountType === 'kpUserAdmin'
          ? readDataForKp(FType, kp)
          : readData(FType));

        setData(data);

        setShow({
          program: FType === 'program',
          sosmed: FType === 'sosmed',
          followers: FType === 'followers',
          tastad: FType === 'tastad',
          pp: FType === 'pp',
          jp: FType === 'jp',
          ins: FType === 'ins',
          kpb: FType === 'kpb',
          mpb: FType === 'mpb',
        });

        setShowFollowersModal(false);
        setShowSosMedModal(false);
      } catch (error) {
        setData(null);
        console.error(error);
        // toast.error(
        //   'Uh oh, server kita mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: kp-get-data'
        // );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setData(null);
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
    showSosMedModal,
    setShowSosMedModal,
    showSosMedDataModal,
    setShowSosMedDataModal,
    showFollowersModal,
    setShowFollowersModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    deleteCandidate,
    setDeleteCandidate,
    namaPlatform,
    setNamaPlatform,
    jumlahBulanTerdahulu,
    setJumlahBulanTerdahulu,
    jumlahBulanIni,
    setJumlahBulanIni,
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

  const RenderSection = () => {
    return (
      <>
        {show.program ? <Program {...props} /> : null}
        {show.sosmed ? <Sosmed {...props} /> : null}
        {show.followers ? <Followers {...props} /> : null}
        {show.tastad ? <Tastad {...props} /> : null}
        {show.pp ? <Pegawai {...props} /> : null}
        {show.jp ? <Pegawai {...props} /> : null}
        {show.ins ? <Institusi {...props} /> : null}
        {show.kpb ? <KlinikPergigianBergerak {...props} /> : null}
        {show.mpb ? <MakmalPergigianBergerak {...props} /> : null}
      </>
    );
  };

  const RenderModal = () => {
    return (
      <>
        {showAddModal ? <AddModalForKp {...props} /> : null}
        {showEditModal ? <EditModalForKp {...props} /> : null}
        {showDeleteModal ? <DeleteModal {...props} /> : null}
      </>
    );
  };

  const handleAdd = () => {
    if (FType === 'sosmed') {
      setShowSosMedModal(true);
    }
    if (FType === 'followers') {
      setShowFollowersModal(true);
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
      <div className='h-full overflow-y-auto'>
        {FType === 'program' || FType === 'sosmed' || FType === 'followers' ? (
          <button
            className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-md z-10'
            onClick={handleAdd}
          >
            <div className='text-adminWhite text-5xl'>
              <FaPlus />
            </div>
          </button>
        ) : null}
        {showSosMedModal ? <ModalSosMed {...props} /> : null}
        {showFollowersModal ? <ModalAddFollowers {...props} /> : null}
        {showSosMedDataModal ? <ModalDataIkutProgram {...props} /> : null}
        {!data ? <NothingHereBoi FType={FType} /> : <RenderSection />}
      </div>
      <RenderModal />
    </>
  );
}
