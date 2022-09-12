import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useState, useEffect } from 'react';
import Add from './Add';
import Edit from './Edit';
import Delete from './Delete';
import { FaPlus } from 'react-icons/fa';
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

  const { Dictionary, getCurrentUser, readData, encryptEmail } =
    useGlobalAdminAppContext();

  useEffect(() => {
    setLoading(true);
    setData([]);
    getCurrentUser().then((res) => {
      setDaerah(res.data.daerah);
      setNegeri(res.data.negeri);
      setUser(res.data.nama);
    });
    readData(FType).then((res) => {
      console.log(res.data);
      setData(res.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });
  }, [FType]);

  function Klinik() {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold'>
          Senarai Klinik Pergigian Daerah {daerah}
        </h1>
        <table className='table-auto border-collapse border border-slate-500'>
          <thead>
            <tr>
              <th className='border border-slate-600'>Bil.</th>
              <th className='border border-slate-600'>Kod Fasiliti</th>
              <th className='border border-slate-600'>Nama KP</th>
              <th className='border border-slate-600'>Role KP</th>
              <th className='border border-slate-600'>Emel KP</th>
              <th className='border border-slate-600'>Username KP</th>
              <th className='border border-slate-600'>Password KP</th>
              <th className='border border-slate-600'>Status KP</th>
              <th className='border border-slate-600'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {data.map((kp, index) => (
              <tr key={kp._id}>
                <td className='border border-slate-700'>{index + 1}</td>
                <td className='border border-slate-700'>{kp.kodFasiliti}</td>
                <td className='border border-slate-700'>{kp.kp}</td>
                <td className='border border-slate-700'>
                  {kp.statusRoleKlinik}
                </td>
                <td className='border border-slate-700'>
                  {encryptEmail(kp.email)}
                </td>
                <td className='border border-slate-700'>{kp.username}</td>
                <td className='border border-slate-700'>{kp.password}</td>
                <td className='border border-slate-700'>
                  {kp.statusPerkhidmatan === 'active' ? (
                    <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                      Aktif
                    </span>
                  ) : (
                    <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                      Tidak Aktif
                    </span>
                  )}
                </td>
                <button
                  className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                  onClick={() => {
                    setShowEditModal(true);
                    setId(kp._id);
                  }}
                >
                  Edit
                </button>
                <button
                  className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 z-0'
                  id={kp._id}
                  onClick={() => {
                    setShowDeleteModal(true);
                    setId(kp._id);
                    setDeleteCandidate(kp.kp);
                  }}
                >
                  Delete
                </button>
              </tr>
            ))}
          </tbody>
        </table>
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
        <h1 className='text-3xl font-bold'>
          Senarai {Dictionary[FType]} {daerah}
        </h1>
        <div>
          <table className='table-auto border-collapse border border-slate-500'>
            <thead>
              <tr>
                <th className='border border-slate-600 px-3'>Bil.</th>
                <th className='border border-slate-600 px-20'>Nama</th>
                {FType === 'pp' && (
                  <th className='border border-slate-600 px-20'>Nombor MDC</th>
                )}
                {FType === 'jp' && (
                  <th className='border border-slate-600 px-20'>Nombor MDTB</th>
                )}
                <th className='border border-slate-600 px-4'>Gred</th>
                <th className='border border-slate-600 px-5'>
                  Nama Klinik Pergigian
                </th>
                <th className='border border-slate-600 px-4'>Role</th>
                <th className='border border-slate-600 px-4'>Manage</th>
              </tr>
            </thead>
            <select
              value={pilihanKlinik}
              onChange={(e) => {
                setPilihanKlinik(e.target.value);
              }}
              className='border-2 absolute top-40 right-5 w-24'
            >
              <option value=''>Filter..</option>
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
              className='border-2 absolute top-32 right-5 w-24'
            >
              <option value=''>Filter..</option>
              {namaRoles.map((k, index) => (
                <option key={index} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              className='border-2 absolute top-48 right-5 w-24'
              onClick={() => {
                setPilihanRole('');
                setPilihanKlinik('');
              }}
            >
              Reset Filter
            </button>
            <tbody>
              {data
                .filter((os) => {
                  const officersChoice = os.kpSkrg.includes(pilihanKlinik);
                  const officersRole = os.role.includes(pilihanRole);
                  return officersChoice && officersRole;
                })
                .map((o, index) => (
                  <tr>
                    <td className='border border-slate-700'>{index + 1}</td>
                    <td className='border border-slate-700 px-3'>{o.nama}</td>
                    <td className='border border-slate-700 px-3'>
                      {o.mdcNumber}
                    </td>
                    <td className='border border-slate-700 uppercase'>
                      {o.gred}
                    </td>
                    <td className='border border-slate-700 px-3'>{o.kpSkrg}</td>
                    <td className='border border-slate-700'>{o.role}</td>
                    <td className='border border-slate-700'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        onClick={() => {
                          setShowEditModal(true);
                          setId(o._id);
                        }}
                      >
                        Edit
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
                        Delete
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
        <h1 className='text-3xl font-bold'>
          Senarai {Dictionary[FType]} Daerah {daerah}
        </h1>
        <table className='table-auto border-collapse border border-slate-500'>
          <thead>
            <tr>
              <th className='border border-slate-600 px-3'>Bil.</th>
              <th className='border border-slate-600 px-20'>
                Nama {Dictionary[FType]}
              </th>
              <th className='border border-slate-600 px-10'>Nama Klinik</th>
              {(FType === 'taska' || FType === 'tadika') && (
                <>
                  <th className='border border-slate-600 px-3'>
                    Kod {Dictionary[FType]}
                  </th>
                  <th className='border border-slate-600 px-3'>
                    Catatan {Dictionary[FType]}
                  </th>
                </>
              )}
              {(FType === 'sr' || FType === 'sm') && (
                <>
                  <th className='border border-slate-600 px-3'>Kod Sekolah</th>
                  <th className='border border-slate-600 px-3'>Status</th>
                  <th className='border border-slate-600 px-3'>PERSiS</th>
                </>
              )}
              <th className='border border-slate-600 px-3'>Manage</th>
            </tr>
          </thead>
          <select
            value={pilihanKlinik}
            onChange={(e) => {
              setPilihanKlinik(e.target.value);
            }}
            className='border-2 absolute top-40 right-5 w-24'
          >
            <option value=''>Filter..</option>
            {namaKliniks.map((k, index) => (
              <option key={index} value={k}>
                {k}
              </option>
            ))}
          </select>
          <tbody>
            {data
              .filter((fs) => {
                return fs.handler.includes(pilihanKlinik);
              })
              .map((f, index) => (
                <tr key={f._id}>
                  <td className='border border-slate-600 px-3'>{index + 1}</td>
                  <td className='border border-slate-600 px-20'>{f.nama}</td>
                  <td className='border border-slate-600 px-10'>{f.handler}</td>
                  {(FType === 'taska' || FType === 'tadika') && (
                    <>
                      <td className='border border-slate-600 px-3'>
                        {f.kodSekolah}
                      </td>
                      <td className='border border-slate-600 px-3'>
                        {f.catatanTastad}
                      </td>
                    </>
                  )}
                  {(FType === 'sr' || FType === 'sm') && (
                    <>
                      <td className='border border-slate-600 px-3'>
                        {f.kodSekolah}
                      </td>
                      <td className='border border-slate-600 px-3'>
                        {f.statusPerkhidmatan}
                      </td>
                      <td className='border border-slate-600 px-3'>
                        {f.risikoSekolahPersis}
                      </td>
                    </>
                  )}
                  <td className='border border-slate-600 px-3'>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      id={f._id}
                      onClick={() => {
                        setShowEditModal(true);
                        setId(f._id);
                      }}
                    >
                      Edit
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
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Ring />
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
        {FType === 'kp' && <Klinik />}
        {(FType === 'pp' || FType === 'jp') && <Pegawai />}
        {FType !== 'kp' && FType !== 'pp' && FType !== 'jp' && <Facility />}
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
