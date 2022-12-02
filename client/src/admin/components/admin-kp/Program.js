import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment';

export default function Program(props) {
  const { Dictionary } = useGlobalAdminAppContext();

  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Program Outreach {props.data[0].handler} {props.kp}
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Bil.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Program
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Aktiviti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tarikh Aktiviti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kaedah Penyampaian Perkhidmatan
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Urus
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((f, index) => (
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
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {moment(f.tarikh).format('DD/MM/YYYY')}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <div className='grid gap-1'>
                      {f.modPenyampaianPerkhidmatan.map((f) => (
                        <span className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          {Dictionary[f]}
                        </span>
                      ))}
                    </div>
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
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      id={f._id}
                      onClick={() => {
                        props.setShowDeleteModal(true);
                        props.setId(f._id);
                        props.setDeleteCandidate(f.nama);
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
