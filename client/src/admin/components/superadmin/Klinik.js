import { AiOutlineEye } from 'react-icons/ai';

export default function Klinik(props) {
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-3xl font-bold mt-10 mb-10'>
          Senarai Klinik Pergigian Daerah {props.daerah}
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
                  Nama KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Peranan KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Emel KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Akaun Pengguna KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Akaun Pendaftaran KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Status KP
                </th>
                <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                  Tindakan
                </th>
              </tr>
            </thead>
            <tbody className='bg-admin4'>
              {props.data.map((kp, index) => (
                <tr key={kp._id}>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {index + 1}
                  </td>
                  {/* <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                      {kp.kodFasiliti}
                    </td> */}
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {kp.kp}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {kp.statusRoleKlinik}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                    {props.encryptEmail(kp.email)}
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                    {/* <div>{kp.username}</div> */}
                    <div id={index}>
                      {props.showPassword[kp.username] === true
                        ? kp.password
                        : props.encryptPassword(kp.password)}
                      <button
                        className='ml-1'
                        onClick={() => {
                          props.setShowPassword({
                            ...props.showPassword,
                            [kp.username]: !props.showPassword[kp.username],
                          });
                        }}
                      >
                        <AiOutlineEye />
                      </button>
                    </div>
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 normal-case'>
                    {/* <div>{kp.kaunterUsername}</div> */}
                    <div id={index}>
                      {props.showPassword[kp.kaunterUsername] === true
                        ? kp.kaunterPassword
                        : props.encryptPassword(kp.kaunterPassword)}
                      <button
                        className='ml-1'
                        onClick={() =>
                          props.setShowPassword({
                            ...props.showPassword,
                            [kp.kaunterUsername]:
                              !props.showPassword[kp.kaunterUsername],
                          })
                        }
                      >
                        <AiOutlineEye />
                      </button>
                    </div>
                  </td>
                  <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {kp.statusPerkhidmatan === 'active' ? (
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
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                      onClick={() => {
                        props.setShowEditModal(true);
                        props.setId(kp._id);
                      }}
                    >
                      Kemaskini
                    </button>
                    <button
                      className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-1'
                      id={kp._id}
                      onClick={() => {
                        props.setShowDeleteModal(true);
                        props.setId(kp._id);
                        props.setDeleteCandidate(kp.kp);
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
