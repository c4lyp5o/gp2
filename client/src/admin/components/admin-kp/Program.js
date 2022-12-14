import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment';

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
                  Nama Aktiviti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tarikh Aktiviti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Tempat Aktiviti
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Enrolmen
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  Kaedah Penyampaian Perkhidmatan
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  POA Daerah / Negeri
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
                    {Dictionary[f.jenisEvent]}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {f.nama}
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    {!f.tarikhStart && !f.tarikhEnd && 'Belum ditetapkan'}
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
                              {i.includes('kpb') ? (
                                <p>{f.penggunaanKpb}</p>
                              ) : (
                                <p>{f.penggunaanMpb}</p>
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
                  <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                    <div>
                      {f.assignedByDaerah ? (
                        <div>
                          <span className='bg-admin2 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                            YA
                          </span>
                        </div>
                      ) : (
                        <span className='bg-user7 text-adminWhite text-xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                          Tidak
                        </span>
                      )}
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
                    {!f.assignedByDaerah ? (
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
