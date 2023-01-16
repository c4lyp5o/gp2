import { useState } from 'react';
import moment from 'moment';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

export default function MakmalPergigianBergerak(props) {
  const { readOneDataForKp } = useGlobalAdminAppContext();
  const [show, setShow] = useState(false);
  const [singleMpbData, setSingleMpbData] = useState(null);

  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Makmal Pergigian Bergerak {props.kp}
        </h1>
        <div>
          <select
            name='pilih-mpb'
            id='pilih-mpb'
            className='text-sm rounded-l-lg px-2 py-1 w-60'
            onChange={(e) => {
              if (e.target.value === '') {
                setSingleMpbData(null);
                setShow(false);
                return;
              }
              readOneDataForKp('mpb', e.target.value).then((res) => {
                setSingleMpbData(res.data);
                setShow(true);
              });
            }}
          >
            <option value=''>Pilih MPB</option>
            {props.data.map((mpb) => (
              <option value={mpb._id}>{mpb.nama}</option>
            ))}
          </select>
          {singleMpbData && (
            <button
              className='text-sm text-adminWhite bg-admin3 hover:bg-admin4 rounded-r-lg px-2 py-1'
              onClick={() => {
                props.setShowEditModal(true);
                props.setId(singleMpbData._id);
              }}
            >
              Tambah Hari Beroperasi
            </button>
          )}
        </div>
        {show && singleMpbData.penggunaanKPBMPB.length > 0 ? (
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tarikh
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Klinik Bertanggungjawab
                  </th>
                  {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th> */}
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {singleMpbData.penggunaanKPBMPB.map((kpb, index) => (
                  <tr key={kpb._id}>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {index + 1}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {moment(kpb.tarikhStart).format('DD/MM/YYYY')} -{' '}
                      {moment(kpb.tarikhEnd).format('DD/MM/YYYY')}
                    </td>
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {kpb.klinikBertanggungjawab}
                    </td>
                    {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={kpb._id}
                        onClick={() => {
                          // props.setShowEditModal(true);
                          // props.setId(singleMpbData._id);
                          toast.info('Fungsi masih belum di implementasi');
                        }}
                      >
                        Kemaskini
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className='font-mono'>
            Tiada Maklumat Penggunaan{' '}
            {singleMpbData ? <span>bagi {singleMpbData.nama}</span> : null}
          </span>
        )}
      </div>
    );
  }
}
