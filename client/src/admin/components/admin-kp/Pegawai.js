import { FaInfoCircle } from 'react-icons/fa';

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
                    {/* <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2'
                      id={o._id}
                      onClick={(e) => {
                        props.setShowDeleteModal(true);
                        props.setId(o._id);
                        props.setDeleteCandidate(o.nama);
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
