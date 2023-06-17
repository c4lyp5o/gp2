import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment';
import { BsArrowLeftSquare } from 'react-icons/bs';

const subProgramColors = {
  kampungAngkatPergigian: 'bg-user7',
  oap: 'bg-user8',
  hrc: 'bg-user9',
  ppr: 'bg-user12',
};

export default function Program(props) {
  const { Dictionary, DictionarySubProgram } = useGlobalAdminAppContext();
  if (props.data.length > 0) {
    return (
      <div className='flex flex-col items-center gap-5'>
        <h1 className='text-2xl font-bold mt-10 mb-10'>
          Senarai Program Komuniti {props.data[0].handler} {props.kp}
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
                  Jenis Program
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Sub Program
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tarikh Program
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tempat Program
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Enrolmen
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kaedah Penyampaian Perkhidmatan
                </th>
                {/* <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  POA Daerah / Negeri
                </th> */}
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
                    {Dictionary[f.jenisEvent]}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.subProgram && f.subProgram.length > 0 ? (
                      <div>
                        {f.subProgram.map((i) => (
                          <p
                            className={`text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap mt-1 mb-1 ${subProgramColors[i]}`}
                          >
                            {DictionarySubProgram[i]}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                        Tidak Berkenaan
                      </p>
                    )}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {!f.tarikhStart && !f.tarikhEnd && (
                      <>
                        <div className='flex justify-center items-center'>
                          <p className='text-xl font-semibold mr-3'>
                            Sila tetapkan tarikh program
                          </p>
                          <div className='animate-bounce shadow-lg rounded-full flex items-center justify-center'>
                            <BsArrowLeftSquare className='text-user8 text-4xl font-bold' />
                          </div>
                        </div>
                      </>
                    )}
                    {f.tarikhStart && f.tarikhEnd && (
                      <p>
                        {moment(f.tarikhStart).format('DD/MM/YYYY')} -{' '}
                        {moment(f.tarikhEnd).format('DD/MM/YYYY')}
                      </p>
                    )}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.tempat}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.jenisEvent === 'programDewasaMuda' ||
                    f.jenisEvent === 'we' ||
                    f.jenisEvent === 'oku' ? (
                      f.enrolmenInstitusi === 'NOT APPLICABLE' ? (
                        <p className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Belum Ditetapkan
                        </p>
                      ) : (
                        <p className='bg-user3 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          {f.enrolmenInstitusi}
                        </p>
                      )
                    ) : (
                      <p className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                        Tidak Berkenaan
                      </p>
                    )}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.modPenyampaianPerkhidmatan.length > 0 ? (
                      f.modPenyampaianPerkhidmatan.map((i) => (
                        <div className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap mt-1 mb-1'>
                          {Dictionary[i]}
                          {i.includes('ppb') && <div className='hidden' />}
                          {(i.includes('kpb') || i.includes('mpb')) && (
                            <div className='grid grid-rows'>
                              <p>
                                {i.includes('kpb')
                                  ? f.penggunaanKpb
                                  : f.penggunaanMpb}
                              </p>
                              {[2, 3].map((j) =>
                                f[`penggunaan${i.toUpperCase()}${j}`] !==
                                'NOT APPLICABLE' ? (
                                  <p>{f[`penggunaan${i.toUpperCase()}${j}`]}</p>
                                ) : null
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                        Belum Ditetapkan
                      </span>
                    )}
                  </td>
                  {/* <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <div>
                      {f.assignedByDaerah ? (
                        <div>
                          <span className='bg-user7 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                            YA
                          </span>
                        </div>
                      ) : (
                        <span className='bg-admin3 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Tidak
                        </span>
                      )}
                    </div>
                  </td> */}
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {!f.tarikhStart && !f.tarikhEnd ? (
                      <span className='relative inline-flex'>
                        <button
                          className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 hover:bg-admin1'
                          id={f._id}
                          onClick={() => {
                            props.setShowEditModal(true);
                            props.setId(f._id);
                          }}
                        >
                          Kemaskini
                        </button>
                        <span className='flex absolute h-3 w-3 top-0 right-1'>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-admin3 opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-3 w-3 bg-user8'></span>
                        </span>
                      </span>
                    ) : (
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 hover:bg-admin1'
                        id={f._id}
                        onClick={() => {
                          props.setShowEditModal(true);
                          props.setId(f._id);
                        }}
                      >
                        Kemaskini
                      </button>
                    )}
                    {!f.assignedByDaerah ? (
                      <button
                        className='bg-admin3 relative top-0 right-0 p-1 w-20 rounded-md text-white shadow-xl m-2 hover:bg-admin1'
                        id={f._id}
                        onClick={() => {
                          props.setShowDeleteModal(true);
                          props.setId(f._id);
                          props.setDeleteCandidate(f.nama);
                        }}
                      >
                        Hapus
                      </button>
                    ) : null}
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
