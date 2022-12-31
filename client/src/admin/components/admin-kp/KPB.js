import { useState } from 'react';
import moment from 'moment';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';

export default function KlinikPergigianBergerak(props) {
  const { toast, readOneDataForKp } = useGlobalAdminAppContext();
  const [show, setShow] = useState(false);
  const [singleKpbData, setSingleKpbData] = useState(null);

  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Klinik Pergigian Bergerak {props.kp}
        </h1>
        <div>
          <select
            name='pilih-kpb'
            id='pilih-kpb'
            className='text-sm rounded-l-lg px-2 py-1 w-60'
            onChange={(e) => {
              if (e.target.value === '') {
                setSingleKpbData(null);
                setShow(false);
                return;
              }
              readOneDataForKp('kpb', e.target.value).then((res) => {
                setSingleKpbData(res.data);
                setShow(true);
              });
            }}
          >
            <option value=''>Pilih KPB</option>
            {props.data.map((kpb) => (
              <option value={kpb._id}>{kpb.nama}</option>
            ))}
          </select>
          {singleKpbData && (
            <button
              className='text-sm text-adminWhite bg-admin3 hover:bg-admin4 rounded-r-lg px-2 py-1'
              onClick={() => {
                props.setShowEditModal(true);
                props.setId(singleKpbData._id);
              }}
            >
              Tambah Hari Beroperasi
            </button>
          )}
        </div>
        {show && singleKpbData.penggunaanKPBMPB.length > 0 ? (
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
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {singleKpbData.penggunaanKPBMPB.map((kpb, index) => (
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
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                        id={kpb._id}
                        onClick={() => {
                          // props.setShowEditModal(true);
                          // props.setId(singleKpbData._id);
                          toast.info('Fungsi masih belum di implementasi');
                        }}
                      >
                        Kemaskini
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className='font-mono'>
            Tiada Maklumat Penggunaan{' '}
            {singleKpbData ? <span>bagi {singleKpbData.nama}</span> : null}
          </span>
        )}
      </div>
    );
  }
}
