import { useState } from 'react';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

export default function Tastad(props) {
  const { Dictionary } = useGlobalAdminAppContext();
  const [pilihanKlinik, setPilihanKlinik] = useState('');

  const namaKliniks = props.data.reduce(
    (arrNamaKliniks, singleFasilitis) => {
      if (!arrNamaKliniks.includes(singleFasilitis.handler)) {
        arrNamaKliniks.push(singleFasilitis.handler);
      }
      return arrNamaKliniks.filter((valid) => valid);
    },
    ['']
  );

  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai {Dictionary[props.FType]} Daerah {props.daerah}
        </h1>
        <div className='grid gap-1 absolute top-4 left-5 p-1.5 bg-adminWhite rounded-md'>
          <p>carian</p>
          <select
            value={pilihanKlinik}
            onChange={(e) => {
              setPilihanKlinik(e.target.value);
            }}
            className='w-40 leading-7 px-3 py-1 ring-2 ring-admin4 focus:ring-2 focus:ring-admin1 focus:outline-none rounded-md peer shadow-md capitalize text-xs'
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
                  Nama {Dictionary[props.FType]}
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Klinik Bertugas
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kod {Dictionary[props.FType]}
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Status
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kategori
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Alamat {Dictionary[props.FType]}
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data
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
                      {f.govKe === 'Kerajaan' ? (
                        <span className='bg-user7 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded'>
                          Kerajaan
                        </span>
                      ) : f.govKe === 'Swasta' ? (
                        <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Swasta
                        </span>
                      ) : (
                        <span className='bg-admin2 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          {' '}
                          -{' '}
                        </span>
                      )}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {f.alamatTastad}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={f._id}
                        onClick={() => {
                          props.setShowEditModal(true);
                          props.setId(f._id);
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
