export default function Kkiakd(props) {
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai KKIA / KD Daerah {props.daerah}
        </h1>
        <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-adminWhite bg-admin3'>
              <tr>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Bil.
                </th>
                {/* <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Kod Fasiliti Gi-Ret 2.0
                  </th> */}
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Nama KKIA / KD
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Status KKIA / KD
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  KP Bertanggungjawab
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((kkia, index) => (
                <tr key={kkia._id}>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {index + 1}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {kkia.nama}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {kkia.statusPerkhidmatan === 'active' ? (
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
                    {kkia.handler}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                      onClick={() => {
                        props.setShowEditModal(true);
                        props.setId(kkia._id);
                      }}
                    >
                      Kemaskini
                    </button>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                      id={kkia._id}
                      onClick={() => {
                        props.setShowDeleteModal(true);
                        props.setId(kkia._id);
                        props.setDeleteCandidate(kkia.nama);
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
