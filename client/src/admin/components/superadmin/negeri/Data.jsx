import { useAdminData } from '../../../context/admin-hooks/useAdminData';
import { useLogininfo } from '../../context/useLogininfo';
import { useDictionary } from '../../../context/useDictionary';
import { useState, useEffect } from 'react';

import { Loading, NothingHereBoi } from '../../Screens';

import Pegawai from './Pegawai';
import Juruterapi from './Juruterapi';

export default function DataNegeri({ DType }) {
  // data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [negeri, setNegeri] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [user, setUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dataIndex, setDataIndex] = useState(null);

  // short circuit
  const [show, setShow] = useState({});

  const { readData } = useAdminData();
  const { loginInfo } = useLogininfo();
  const { Dictionary } = useDictionary();

  useEffect(() => {
    setDaerah(loginInfo.daerah);
    setNegeri(loginInfo.negeri);
    setUser(loginInfo.nama);
    readData(DType).then((res) => {
      setData(res.data);
      switch (DType) {
        case 'ppspn':
          setShow({ pp: true });
          break;
        case 'jpspn':
          setShow({ jp: true });
          break;
        default:
          console.log('nope');
          break;
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    return () => {
      setLoading(true);
      setShow({});
    };
  }, [DType]);

  const props = {
    //data
    data,
    DType,
    negeri,
    daerah,
    user,
    // funcs and misc
    showInfo,
    setShowInfo,
    dataIndex,
    setDataIndex,
    Dictionary,
  };

  const RenderSection = () => {
    return (
      <>
        {show.pp ? <Pegawai {...props} /> : null}
        {show.jp ? <Juruterapi {...props} /> : null}
      </>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (!loading) {
    return (
      <>
        {data && data.length === 0 ? (
          <NothingHereBoi FType={DType} />
        ) : (
          <RenderSection />
        )}
      </>
    );
  }
}
