export default function Tastad(props) {
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Taska / Tadika {props.kp}
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Bil.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Fasiliti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Jenis Fasiliti
                </th>
                {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Klinik Pergigian
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kod Fasiliti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Status
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Alamat Fasiliti
                </th> */}
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Enrolmen
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
                    {f.nama}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.jenisFasiliti}
                  </td>
                  {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
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
                    {f.alamatTastad}
                  </td> */}
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.enrolmenTastad === 0
                      ? 'Belum ditetapkan'
                      : f.enrolmenTastad}
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
