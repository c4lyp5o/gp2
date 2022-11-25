export default function Pegawai(props) {
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Pegawai {props.kp}
        </h1>
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
                {props.data[0].mdcNumber ? (
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nombor MDC
                  </th>
                ) : (
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    Nombor MDTB
                  </th>
                )}
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Gred
                </th>
                {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Nama Klinik Pergigian
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Peranan
                </th> */}
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Sijil CSCSP
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Urus
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((o, index) => (
                <tr key={index + 1}>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {index + 1}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {o.nama}
                  </td>
                  {props.data[0].mdcNumber ? (
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.mdcNumber}
                    </td>
                  ) : (
                    <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                      {o.mdtbNumber}
                    </td>
                  )}
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 uppercase'>
                    {o.gred}
                  </td>
                  {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {o.kpSkrg}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {o.role}
                  </td> */}
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 uppercase'>
                    {o.cscspVerified ? (
                      <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                        Ada
                      </span>
                    ) : (
                      <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                        Tiada
                      </span>
                    )}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      onClick={() => {
                        props.setShowEditModal(true);
                        props.setId(o._id);
                      }}
                    >
                      Ubah
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
