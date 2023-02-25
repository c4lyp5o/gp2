import { useState } from 'react';

import { FaInfoCircle } from 'react-icons/fa';

export default function Juruterapi(props) {
  const [pilihanKlinik, setPilihanKlinik] = useState('');
  const [pilihanRole, setPilihanRole] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });

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
          Senarai Juruterapi Negeri {props.negeri}
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
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nombor MDTB
                </th>
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
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data
                .filter(
                  (os) =>
                    os.kpSkrg.includes(pilihanKlinik) &&
                    os.role.includes(pilihanRole)
                )
                .map((o, index) => (
                  <tr key={index + 1}>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <div className='flex'>
                        {o.nama}
                        {o.tempatBertugasSebelumIni.length > 0 && (
                          <FaInfoCircle
                            className='ml-2 text-md text-userBlack'
                            onMouseEnter={() => {
                              props.setShowInfo(true);
                              props.setDataIndex(index);
                            }}
                            onMouseLeave={() => {
                              props.setShowInfo(false);
                              props.setDataIndex(null);
                            }}
                            onMouseMove={(e) => {
                              setPos({ x: e.clientX, y: e.clientY });
                            }}
                          />
                        )}
                        {props.showInfo && props.dataIndex === index && (
                          <div
                            className={`absolute shadow-md rounded-md p-2 ${
                              props.showInfo ? 'block' : 'hidden'
                            }`}
                            style={{
                              left: pos.x,
                              bottom: pos.y,
                            }}
                          >
                            <div className='bg-adminWhite rounded-md shadow-md'>
                              <div className='flex justify-center'>
                                <h2 className='font-mono'>
                                  Tempat Bertugas Sebelum Ini:{' '}
                                  {o.tempatBertugasSebelumIni.map(
                                    (o, indexPegawai) => (
                                      <div key={indexPegawai}>
                                        {indexPegawai + 1}. {o}{' '}
                                      </div>
                                    )
                                  )}
                                </h2>
                                <p className='whitespace-nowrap'></p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.mdtbNumber}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 uppercase'>
                      {o.gred}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.kpSkrg}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.role === 'admin' ? (
                        <span>Pentadbir Klinik</span>
                      ) : (
                        <span>Pengguna</span>
                      )}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.rolePromosiKlinik ? 'Ya' : 'Tidak'}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.roleMediaSosialKlinik ? 'Ya' : 'Tidak'}
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
