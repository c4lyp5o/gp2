import { useState } from 'react';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { FaInfoCircle } from 'react-icons/fa';

export default function Operators(props) {
  const { Dictionary } = useGlobalAdminAppContext();
  const [pilihanKlinik, setPilihanKlinik] = useState('');
  const [pilihanRole, setPilihanRole] = useState('');

  const namaKliniks = props.data.reduce(
    (arrNamaKliniks, pegawai) => {
      if (!arrNamaKliniks.includes(pegawai.kpSkrg)) {
        arrNamaKliniks.push(pegawai.kpSkrg);
      }
      return arrNamaKliniks.filter((valid) => valid);
    },
    ['']
  );
  const namaRoles = props.data.reduce(
    (arrNamaRoles, pegawai) => {
      if (!arrNamaRoles.includes(pegawai.role)) {
        arrNamaRoles.push(pegawai.role);
      }
      return arrNamaRoles.filter((valid) => valid);
    },
    ['']
  );

  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai {Dictionary[props.FType]} Daerah {props.daerah}
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
                {props.FType === 'pp' && (
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nombor MDC
                  </th>
                )}
                {props.FType === 'jp' && (
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
              {props.data
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
                              props.setShowInfo(true);
                              props.setDataIndex(index);
                            }}
                            onMouseLeave={(e) => {
                              props.setShowInfo(false);
                            }}
                          />
                        ) : null}
                        {props.showInfo && (
                          <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack m-5 p-5 bg-userWhite top-10 left-1'>
                            <div className='text-xs'>
                              <h2 className='font-mono'>
                                Tempat Bertugas Sebelum Ini:{' '}
                                {props.data[
                                  props.dataIndex
                                ].tempatBertugasSebelumIni.map(
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
                    {props.FType === 'pp' && (
                      <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {o.mdcNumber}
                      </td>
                    )}
                    {props.FType === 'jp' && (
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
                      {props.FType === 'pp' && (
                        <>
                          <button
                            className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                            onClick={() => {
                              props.setShowEditModal(true);
                              props.setId(o._id);
                            }}
                          >
                            Kemaskini
                          </button>
                          <button
                            className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                            id={o._id}
                            onClick={(e) => {
                              props.setShowDeleteModal(true);
                              props.setId(o._id);
                              props.setDeleteCandidate(o.nama);
                            }}
                          >
                            Hapus
                          </button>
                        </>
                      )}
                      {props.FType === 'jp' &&
                        o.mdtbNumber &&
                        !o.mdtbNumber.includes('MDTBAUTO') && (
                          <>
                            <button
                              className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                              onClick={() => {
                                props.setShowEditModal(true);
                                props.setId(o._id);
                              }}
                            >
                              Kemaskini
                            </button>
                            <button
                              className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                              id={o._id}
                              onClick={(e) => {
                                props.setShowDeleteModal(true);
                                props.setId(o._id);
                                props.setDeleteCandidate(o.nama);
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
