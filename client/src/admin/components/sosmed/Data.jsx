import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useAdminData } from '../../context/admin-hooks/useAdminData';
import { useKpData } from '../../context/kp-hooks/useKpData';
import { useLogininfo } from '../../context/useLogininfo';

import Sosmed from './Sosmed';
import Followers from './Followers';

import { ModalSosMed, ModalAddFollowers } from './Modal';
import { DeleteModal } from '../../components/Modal';

import { Loading, NothingHereBoi } from '../Screens';

export default function DataSosmed({ FType }) {
  // modal
  const [showSosMedModal, setShowSosMedModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
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

  // follower
  const [namaPlatform, setNamaPlatform] = useState(null);
  const [jumlahBulanTerdahulu, setJumlahBulanTerdahulu] = useState(null);
  const [jumlahBulanIni, setJumlahBulanIni] = useState(null);

  // shower
  const [show, setShow] = useState({});
  const [showModal, setShowModal] = useState({});

  // reloader workaround
  const [reload, setReload] = useState(false);

  const { readData } = useAdminData();
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

        const res = await (loginInfo.accountType === 'kpUserAdmin'
          ? readDataForKp(FType, kp)
          : readData(FType));
        setData(res.data);

        switch (FType) {
          case 'sosmed':
            setShow({ sosmed: true });
            break;
          case 'followers':
            setShow({ followers: true });
            break;
          default:
            break;
        }
        setShowFollowersModal(false);
        setShowSosMedModal(false);
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
    showSosMedModal,
    setShowSosMedModal,
    showFollowersModal,
    setShowFollowersModal,
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
    showModal,
    setShowModal,
    reload,
    setReload,
    FType,
  };

  const RenderModal = () => {
    return (
      <>
        {showSosMedModal && <ModalSosMed {...props} />}
        {showFollowersModal && <ModalAddFollowers {...props} />}
        {showDeleteModal && <DeleteModal {...props} />}
      </>
    );
  };

  const RenderSection = () => {
    return (
      <>
        {show.sosmed && <Sosmed {...props} />}
        {show.followers && <Followers {...props} />}
      </>
    );
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className='h-full overflow-y-auto'>
        <button
          className='bg-admin3 absolute top-5 right-5 p-2 rounded-md text-white shadow-md z-10'
          onClick={() => {
            switch (FType) {
              case 'sosmed':
                setShowSosMedModal(true);
                break;
              case 'followers':
                setShowFollowersModal(true);
                break;
              default:
                break;
            }
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
