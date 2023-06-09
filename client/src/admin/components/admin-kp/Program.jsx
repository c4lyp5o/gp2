import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment';
import { BsArrowLeftSquare } from 'react-icons/bs';

export default function Program(props) {
  const { Dictionary } = useGlobalAdminAppContext();
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
                    {!f.tarikhStart && !f.tarikhEnd && (
                      <>
                        <div className='flex justify-center items-center'>
                          <p className='text-xl font-semibold mr-3'>
                            Sila tetapkan tarikh program
                          </p>
                          <div class='animate-bounce shadow-lg rounded-full flex items-center justify-center'>
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
                    {f.jenisEvent !== 'programDewasaMuda' &&
                      f.jenisEvent !== 'we' &&
                      f.jenisEvent !== 'oku' && (
                        <p className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Tidak Berkenaan
                        </p>
                      )}
                    {(f.jenisEvent === 'programDewasaMuda' ||
                      f.jenisEvent === 'we' ||
                      f.jenisEvent === 'oku') &&
                      f.enrolmenInstitusi === 'NOT APPLICABLE' && (
                        <p className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Belum Ditetapkan
                        </p>
                      )}
                    {(f.jenisEvent === 'programDewasaMuda' ||
                      f.jenisEvent === 'we' ||
                      f.jenisEvent === 'oku') &&
                      f.enrolmenInstitusi !== 'NOT APPLICABLE' && (
                        <p className='bg-user3 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          {f.enrolmenInstitusi}
                        </p>
                      )}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <div>
                      {f.modPenyampaianPerkhidmatan.length > 0 ? (
                        <div>
                          {f.modPenyampaianPerkhidmatan.map((i) => (
                            <p className='bg-admin3 text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap mt-1 mb-1'>
                              {Dictionary[i]}
                              {i.includes('ppb') && <div className='hidden' />}
                              {i.includes('kpb') && (
                                <div className='grid grid-rows'>
                                  <p>{f.penggunaanKpb}</p>
                                  {f.penggunaanKpb2 !== 'NOT APPLICABLE' ? (
                                    <p>{f.penggunaanKpb2}</p>
                                  ) : null}
                                  {f.penggunaanKpb3 !== 'NOT APPLICABLE' ? (
                                    <p>{f.penggunaanKpb3}</p>
                                  ) : null}
                                </div>
                              )}
                              {i.includes('mpb') && (
                                <div className='grid grid-rows'>
                                  <p>{f.penggunaanMpb}</p>
                                  {f.penggunaanMpb2 !== 'NOT APPLICABLE' ? (
                                    <p>{f.penggunaanMpb2}</p>
                                  ) : null}
                                  {f.penggunaanMpb3 !== 'NOT APPLICABLE' ? (
                                    <p>{f.penggunaanMpb3}</p>
                                  ) : null}
                                </div>
                              )}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <span className='bg-adminBlack text-adminWhite text-xs font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Belum Ditetapkan
                        </span>
                      )}
                    </div>
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
                      <span class='relative inline-flex'>
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
                        <span class='flex absolute h-3 w-3 top-0 right-1'>
                          <span class='animate-ping absolute inline-flex h-full w-full rounded-full bg-admin3 opacity-75'></span>
                          <span class='relative inline-flex rounded-full h-3 w-3 bg-user8'></span>
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
