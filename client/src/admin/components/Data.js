import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useState, useEffect } from 'react';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { Ring } from 'react-awesome-spinners';

export default function Data({ FType }) {
  // modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [id, setId] = useState('');

  // data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daerah, setDaerah] = useState(null);
  const [negeri, setNegeri] = useState(null);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // short circuit
  const [showKlinik, setShowKlinik] = useState(false);
  const [showOperators, setShowOperators] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);

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
      console.log(res.data);
      setData(res.data);
      if (FType === 'jp' || FType === 'pp') {
        setShowOperators(true);
      }
      if (FType === 'kp') {
        setShowKlinik(true);
      }
      if (FType !== 'kp' && FType !== 'jp' && FType !== 'pp') {
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
    };
  }, [FType]);

  function Klinik() {
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
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Kod Fasiliti
                </th>
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
                  Nama Pengguna KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Kata Laluan KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Status KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Urus
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {data.map((kp, index) => (
                <tr key={kp._id}>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {index + 1}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                    {kp.kodFasiliti}
                  </td>
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
                    {kp.username}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                    <div id={index}>
                      {showPassword === true
                        ? kp.password
                        : encryptPassword(kp.password)}
                      <button
                        className='ml-1'
                        onClick={() => setShowPassword(!showPassword)}
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
                      Ubah
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
                {k}
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
                  Urus
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
                  <tr>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.nama}
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
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.gred}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.kpSkrg}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.role}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        onClick={() => {
                          setShowEditModal(true);
                          setId(o._id);
                        }}
                      >
                        Ubah
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
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
                  Nama {Dictionary[FType]}
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Klinik
                </th>
                {(FType === 'taska' || FType === 'tadika') && (
                  <>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Kod {Dictionary[FType]}
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Catatan {Dictionary[FType]}
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
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Urus
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
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {f.kodSekolah}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {f.catatanTastad}
                        </td>
                      </>
                    )}
                    {(FType === 'sr' || FType === 'sm') && (
                      <>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {f.kodSekolah}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {f.statusPerkhidmatan}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {f.risikoSekolahPersis}
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
                        Ubah
                      </button>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={f._id}
                        onClick={(e) => {
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

  if (loading) {
    return (
      <div className='flex justify-center text-center h-full w-full'>
        <div className='m-auto p-4 bg-admin4 rounded-md grid'>
          <div className='flex justify-center mb-2'>
            <Ring color='#c44058' />
          </div>
          <span className='bg-admin3 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
            Memuat..
          </span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1>There is no data</h1>
      </div>
    );
  }

  if (error) {
    return <div>Error! Refer react dev tools under Query</div>;
  }

  if (!loading) {
    return (
      <>
        {showKlinik && <Klinik />}
        {showOperators && <Pegawai />}
        {showFacilities && <Facility />}
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
          <Add
            setShowAddModal={setShowAddModal}
            FType={FType}
            daerah={daerah}
          />
        )}
        {showEditModal && (
          <Edit setShowEditModal={setShowEditModal} FType={FType} id={id} />
        )}
        {showDeleteModal && (
          <Delete
            setShowDeleteModal={setShowDeleteModal}
            FType={FType}
            deleteCandidate={deleteCandidate}
            id={id}
          />
        )}
      </>
    );
  }
}
