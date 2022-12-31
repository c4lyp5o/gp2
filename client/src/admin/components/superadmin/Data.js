import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useState, useEffect } from 'react';
import { FaPlus, FaInfoCircle } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';

import { AddModal, EditModal, DeleteModal } from '../Modal';
import { Loading, NothingHereBoi } from '../Screens';

export default function Data({ FType, kp }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [id, setId] = useState('');

  // data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daerah, setDaerah] = useState(null);
  const [negeri, setNegeri] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [dataIndex, setDataIndex] = useState(null);

  // short circuit
  const [showKlinik, setShowKlinik] = useState(false);
  const [showKkia, setShowKkia] = useState(false);
  const [showOperators, setShowOperators] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showEvent, setShowEvent] = useState(false);

  // reloader workaround
  const [reload, setReload] = useState(false);

  const {
    Dictionary,
    getCurrentUser,
    readData,
    encryptEmail,
    encryptPassword,
  } = useGlobalAdminAppContext();

  useEffect(() => {
    getCurrentUser().then((res) => {
      setDaerah(res.data.daerah);
      setNegeri(res.data.negeri);
      setUser(res.data.nama);
    });
    readData(FType).then((res) => {
      setData(res.data);
      if (FType === 'kp') {
        setShowKlinik(true);
        setShowPassword({
          ...showPassword,
          [res.data.username]: false,
          [res.data.kaunterUsername]: false,
        });
      }
      if (FType === 'jp' || FType === 'pp') {
        setShowOperators(true);
      }
      if (FType === 'kkiakd') {
        setShowKkia(true);
      }
      if (FType === 'program') {
        setShowEvent(true);
      }
      if (
        FType !== 'kp' &&
        FType !== 'kkiakd' &&
        FType !== 'jp' &&
        FType !== 'pp' &&
        FType !== 'program'
      ) {
        setShowFacilities(true);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
    return () => {
      setLoading(true);
      setShowFacilities(false);
      setShowOperators(false);
      setShowKlinik(false);
      setShowKkia(false);
      setShowEvent(false);
    };
  }, [FType, reload]);

  function Klinik() {
    if (data.length > 0) {
      return (
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Senarai Klinik Pergigian Daerah {daerah}
          </h1>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  {/* <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Kod Fasiliti Gi-Ret 2.0
                  </th> */}
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Nama KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Peranan KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Emel KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Akaun Pengguna KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Akaun Pendaftaran KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Status KP
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {data.map((kp, index) => (
                  <tr key={kp._id}>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    {/* <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                      {kp.kodFasiliti}
                    </td> */}
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kp.kp}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kp.statusRoleKlinik}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                      {encryptEmail(kp.email)}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                      {/* <div>{kp.username}</div> */}
                      <div id={index}>
                        {showPassword[kp.username] === true
                          ? kp.password
                          : encryptPassword(kp.password)}
                        <button
                          className='ml-1'
                          onClick={() => {
                            setShowPassword({
                              ...showPassword,
                              [kp.username]: !showPassword[kp.username],
                            });
                          }}
                        >
                          <AiOutlineEye />
                        </button>
                      </div>
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                      {/* <div>{kp.kaunterUsername}</div> */}
                      <div id={index}>
                        {showPassword[kp.kaunterUsername] === true
                          ? kp.kaunterPassword
                          : encryptPassword(kp.kaunterPassword)}
                        <button
                          className='ml-1'
                          onClick={() =>
                            setShowPassword({
                              ...showPassword,
                              [kp.kaunterUsername]:
                                !showPassword[kp.kaunterUsername],
                            })
                          }
                        >
                          <AiOutlineEye />
                        </button>
                      </div>
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kp.statusPerkhidmatan === 'active' ? (
                        <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                          Aktif
                        </span>
                      ) : (
                        <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                        onClick={() => {
                          setShowEditModal(true);
                          setId(kp._id);
                        }}
                      >
                        Kemaskini
                      </button>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                        id={kp._id}
                        onClick={() => {
                          setShowDeleteModal(true);
                          setId(kp._id);
                          setDeleteCandidate(kp.kp);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  function Kkiakd() {
    if (data.length > 0) {
      return (
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Senarai KKIA / KD Daerah {daerah}
          </h1>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  {/* <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Kod Fasiliti Gi-Ret 2.0
                  </th> */}
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Nama KKIA / KD
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Status KKIA / KD
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    KP Bertanggungjawab
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {data.map((kkia, index) => (
                  <tr key={kkia._id}>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kkia.nama}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kkia.statusPerkhidmatan === 'active' ? (
                        <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                          Aktif
                        </span>
                      ) : (
                        <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Tidak Aktif
                        </span>
                      )}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kkia.handler}
                    </td>
                    <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                        onClick={() => {
                          setShowEditModal(true);
                          setId(kkia._id);
                        }}
                      >
                        Kemaskini
                      </button>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                        id={kkia._id}
                        onClick={() => {
                          setShowDeleteModal(true);
                          setId(kkia._id);
                          setDeleteCandidate(kkia.kp);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  function Pegawai() {
    const [pilihanKlinik, setPilihanKlinik] = useState('');
    const [pilihanRole, setPilihanRole] = useState('');

    const namaKliniks = data.reduce(
      (arrNamaKliniks, pegawai) => {
        if (!arrNamaKliniks.includes(pegawai.kpSkrg)) {
          arrNamaKliniks.push(pegawai.kpSkrg);
        }
        return arrNamaKliniks.filter((valid) => valid);
      },
      ['']
    );
    const namaRoles = data.reduce(
      (arrNamaRoles, pegawai) => {
        if (!arrNamaRoles.includes(pegawai.role)) {
          arrNamaRoles.push(pegawai.role);
        }
        return arrNamaRoles.filter((valid) => valid);
      },
      ['']
    );

    if (data.length > 0) {
      return (
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Senarai {Dictionary[FType]} {daerah}
          </h1>
          <div className='grid gap-1 absolute top-2 left-5'>
            <p>carian</p>
            <select
              value={pilihanKlinik}
              onChange={(e) => {
                setPilihanKlinik(e.target.value);
              }}
              className='outline outline-adminBlack outline-1 capitalize w-40'
            >
              <option value=''>Klinik..</option>
              {namaKliniks.map((k, index) => (
                <option key={index} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <select
              value={pilihanRole}
              onChange={(e) => {
                setPilihanRole(e.target.value);
              }}
              className='outline outline-adminBlack outline-1 capitalize w-40'
            >
              <option value=''>Peranan..</option>
              {namaRoles.map((k, index) => (
                <option key={index} value={k}>
                  {k === 'admin' && 'Pentadbir Klinik'}
                  {k === 'umum' && 'Pengguna'}
                </option>
              ))}
            </select>
            <button
              className='rounded-md bg-admin3 hover:bg-admin1 border-admin3 text-sm shadow-md p-2 w-40'
              onClick={() => {
                setPilihanRole('');
                setPilihanKlinik('');
              }}
            >
              Tetap Semula
            </button>
          </div>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nama
                  </th>
                  {FType === 'pp' && (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Nombor MDC
                    </th>
                  )}
                  {FType === 'jp' && (
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Nombor MDTB
                    </th>
                  )}
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Gred
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nama Klinik Pergigian
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Peranan
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Pemegang Promosi Klink
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Pemegang Media Sosial Klink
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {data
                  .filter((os) => {
                    const officersChoice = os.kpSkrg.includes(pilihanKlinik);
                    const officersRole = os.role.includes(pilihanRole);
                    return officersChoice && officersRole;
                  })
                  .map((o, index) => (
                    <tr key={index + 1}>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        <div className='flex'>
                          {o.nama}
                          {o.tempatBertugasSebelumIni.length > 0 ? (
                            <FaInfoCircle
                              className='ml-2 text-md text-userBlack'
                              onMouseEnter={(e) => {
                                setShowInfo(true);
                                setDataIndex(index);
                              }}
                              onMouseLeave={(e) => {
                                setShowInfo(false);
                              }}
                            />
                          ) : null}
                          {showInfo && (
                            <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack m-5 p-5 bg-userWhite top-10 left-1'>
                              <div className='text-xs'>
                                <h2 className='font-mono'>
                                  Tempat Bertugas Sebelum Ini:{' '}
                                  {data[dataIndex].tempatBertugasSebelumIni.map(
                                    (o, indexPegawai) => {
                                      return (
                                        <div key={indexPegawai}>
                                          {indexPegawai + 1}. {o}{' '}
                                        </div>
                                      );
                                    }
                                  )}
                                </h2>
                                <p className='whitespace-nowrap'></p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      {FType === 'pp' && (
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {o.mdcNumber}
                        </td>
                      )}
                      {FType === 'jp' && (
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {o.mdtbNumber}
                        </td>
                      )}
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 uppercase'>
                        {o.gred}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {o.kpSkrg}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {o.role === 'admin' && <span>Pentadbir Klinik</span>}
                        {o.role === 'umum' && <span>Pengguna</span>}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {o.rolePromosiKlinik ? 'Ya' : 'Tidak'}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {o.roleMediaSosialKlinik ? 'Ya' : 'Tidak'}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {FType === 'pp' && (
                          <>
                            <button
                              className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                              onClick={() => {
                                setShowEditModal(true);
                                setId(o._id);
                              }}
                            >
                              Kemaskini
                            </button>
                            <button
                              className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                              id={o._id}
                              onClick={(e) => {
                                setShowDeleteModal(true);
                                setId(o._id);
                                setDeleteCandidate(o.nama);
                              }}
                            >
                              Hapus
                            </button>
                          </>
                        )}
                        {FType === 'jp' &&
                          o.mdtbNumber &&
                          !o.mdtbNumber.includes('MDTBAUTO') && (
                            <>
                              <button
                                className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                                onClick={() => {
                                  setShowEditModal(true);
                                  setId(o._id);
                                }}
                              >
                                Kemaskini
                              </button>
                              <button
                                className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                                id={o._id}
                                onClick={(e) => {
                                  setShowDeleteModal(true);
                                  setId(o._id);
                                  setDeleteCandidate(o.nama);
                                }}
                              >
                                Hapus
                              </button>
                            </>
                          )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  function Facility() {
    const [pilihanKlinik, setPilihanKlinik] = useState('');

    const namaKliniks = data.reduce(
      (arrNamaKliniks, singleFasilitis) => {
        if (!arrNamaKliniks.includes(singleFasilitis.handler)) {
          arrNamaKliniks.push(singleFasilitis.handler);
        }
        return arrNamaKliniks.filter((valid) => valid);
      },
      ['']
    );

    if (data.length > 0) {
      return (
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Senarai {Dictionary[FType]} Daerah {daerah}
          </h1>
          <div className='grid gap-1 absolute top-5 left-5'>
            <p>carian</p>
            <select
              value={pilihanKlinik}
              onChange={(e) => {
                setPilihanKlinik(e.target.value);
              }}
              className='outline outline-adminBlack outline-1 capitalize w-40'
            >
              <option value=''>Klinik..</option>
              {namaKliniks.map((k, index) => (
                <option key={index} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    {FType === 'kpb' || FType === 'mpb' ? 'No. Plat ' : 'Nama '}
                    {Dictionary[FType]}
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nama Klinik Bertugas
                  </th>
                  {(FType === 'taska' || FType === 'tadika') && (
                    <>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Kod {Dictionary[FType]}
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Status
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Alamat {Dictionary[FType]}
                      </th>
                    </>
                  )}
                  {(FType === 'sr' || FType === 'sm') && (
                    <>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Kod Sekolah
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Status
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        PERSiS
                      </th>
                    </>
                  )}
                  {FType === 'ins' && (
                    <>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Kategori
                      </th>
                      <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                        Status
                      </th>
                    </>
                  )}
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {data
                  .filter((fs) => {
                    return fs.handler.includes(pilihanKlinik);
                  })
                  .map((f, index) => (
                    <tr key={f._id}>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {f.nama}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {f.handler}
                      </td>
                      {(FType === 'taska' || FType === 'tadika') && (
                        <>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 uppercase'>
                            {f.kodTastad}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.statusPerkhidmatan === 'active' ? (
                              <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                                Aktif
                              </span>
                            ) : (
                              <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                                Tidak Aktif
                              </span>
                            )}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.alamatTastad}
                          </td>
                        </>
                      )}
                      {(FType === 'sr' || FType === 'sm') && (
                        <>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.kodSekolah}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.statusPerkhidmatan === 'active' ? (
                              <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                                Aktif
                              </span>
                            ) : (
                              <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                                Tidak Aktif
                              </span>
                            )}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.risikoSekolahPersis}
                          </td>
                        </>
                      )}
                      {FType === 'ins' && (
                        <>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.kategoriInstitusi}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                            {f.statusPerkhidmatan === 'active' ? (
                              <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                                Aktif
                              </span>
                            ) : (
                              <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                                Tidak Aktif
                              </span>
                            )}
                          </td>
                        </>
                      )}
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        <button
                          className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                          id={f._id}
                          onClick={() => {
                            setShowEditModal(true);
                            setId(f._id);
                          }}
                        >
                          Kemaskini
                        </button>
                        {/* <button
                          className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                          id={f._id}
                          onClick={(e) => {
                            setShowDeleteModal(true);
                            setId(f._id);
                            setDeleteCandidate(f.nama);
                          }}
                        >
                          Hapus
                        </button> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  function Event() {
    if (data.length > 0) {
      return (
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10 mb-10'>
            Senarai Program Komuniti {daerah}
          </h1>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    Nama Program
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    Jenis Aktiviti
                  </th>
                  {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tarikh Aktiviti
                  </th> */}
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    Institusi
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    Klinik Bertugas
                  </th>
                  {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Kaedah Penyampaian Perkhidmatan
                  </th> */}
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {data.map((f, index) => (
                  <tr key={f._id}>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {Dictionary[f.jenisEvent]}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {f.nama}
                    </td>
                    {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {moment(f.tarikh).format('DD/MM/YYYY')}
                    </td> */}
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {f.kategoriInstitusi ? (
                        <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          {Dictionary[f.kategoriInstitusi]}
                        </span>
                      ) : (
                        'Tidak Berkaitan'
                      )}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {f.createdByKp}
                    </td>
                    {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <div className='grid gap-1'>
                        {f.modPenyampaianPerkhidmatan.map((f) => (
                          <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                            {Dictionary[f]}
                          </span>
                        ))}
                      </div>
                    </td> */}
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={f._id}
                        onClick={() => {
                          setShowEditModal(true);
                          setId(f._id);
                        }}
                      >
                        Kemaskini
                      </button>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={f._id}
                        onClick={() => {
                          setShowDeleteModal(true);
                          setId(f._id);
                          setDeleteCandidate(f.nama);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }

  const props = {
    FType,
    negeri,
    daerah,
    kp,
    id,
    setReload,
    reload,
    setShowAddModal,
    setShowEditModal,
    setShowDeleteModal,
  };

  if (loading) {
    return <Loading />;
  }

  if (!loading) {
    return (
      <>
        {data.length === 0 && <NothingHereBoi FType={FType} />}
        {showKlinik && <Klinik />}
        {showKkia && <Kkiakd />}
        {showOperators && <Pegawai />}
        {showFacilities && <Facility />}
        {showEvent && <Event />}
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
        {showAddModal && (
          <AddModal
            setShowAddModal={setShowAddModal}
            FType={FType}
            negeri={negeri}
            daerah={daerah}
            kp={kp}
            setReload={setReload}
            reload={reload}
          />
        )}
        {showEditModal && (
          <EditModal
            setShowEditModal={setShowEditModal}
            FType={FType}
            kp={kp}
            id={id}
            setReload={setReload}
            reload={reload}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            setShowDeleteModal={setShowDeleteModal}
            FType={FType}
            deleteCandidate={deleteCandidate}
            id={id}
            setReload={setReload}
            reload={reload}
          />
        )}
      </>
    );
  }
}
