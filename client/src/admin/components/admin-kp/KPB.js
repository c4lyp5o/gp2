export default function KlinikPergigianBergerak(props) {
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
          >
            <option value=''>Pilih KPB</option>
            {props.data.map((f) => (
              <option value={f.nama}>{f.nama}</option>
            ))}
          </select>
          <button className='text-sm text-adminWhite bg-admin3 hover:bg-admin4 rounded-r-lg px-2 py-1 '>
            Tambah Hari Beroperasi
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
              {props.data.map((f, index) => (
                <tr key={f._id}>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {index + 1}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.tarikh}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.klinik}
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
