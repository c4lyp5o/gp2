import moment from 'moment';
import { useEffect } from 'react';
import {
  FaWindowClose,
  FaCheckCircle,
  FaTimesCircle,
  FaUserCheck,
  FaRegPaperPlane,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

export default function ModalMuridKohortBuatKumuranFMR(props) {
  useEffect(() => {
    console.log(props.allMuridKohort);
  }, []);

  return (
    <>
      <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={props.closeModal}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
          <h5 className='bg-user9 text-userWhite font-semibold text-xl h-7'>
            PERHATIAN
          </h5>
          <div className='mt-1 py-1'>
            <span className='relative flex items-center justify-center mt-4'>
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute animate-ping' />
              <FaUserCheck className='text-4xl text-user9 mx-auto absolute' />
            </span>
            <p className='px-1 font-semibold mt-7'>
              Anda YAKIN untuk menghantar maklumat?
            </p>
            <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto mt-5'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-user2'>
                  <tr>
                    <th>
                      <input
                        type='checkbox'
                        checked={props.selectAll}
                        onChange={props.handleSelectAll}
                      />
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                      BIL.
                    </th>
                    <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                      NAMA
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                      STATUS KUMURAN TERAKHIR
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                      HADIR FMR
                    </th>
                  </tr>
                </thead>
                <>
                  <tbody className='text-user1'>
                    {props.allMuridKohort &&
                      props.allMuridKohort
                        // .filter((murid) => {
                        //   if (selectedSekolah === '') {
                        //     return murid;
                        //   } else {
                        //     return murid.namaSekolah === selectedSekolah;
                        //   }
                        // })
                        // .filter((murid) => {
                        //   if (selectedKelasBasedOnSekolah === '') {
                        //     return murid;
                        //   } else {
                        //     return (
                        //       murid.namaKelas === selectedKelasBasedOnSekolah
                        //     );
                        //   }
                        // })
                        .map((singleMurid, index) => {
                          return (
                            <tr key={index}>
                              <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                                {' '}
                              </td>
                              <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                                {index + 1}
                              </td>
                              <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                                {singleMurid.nama}
                              </td>
                              <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                                {singleMurid.tarikhKumuranKohortFMR &&
                                singleMurid.tarikhKumuranKohortFMR.length > 0
                                  ? moment(
                                      singleMurid.tarikhKumuranKohortFMR[
                                        singleMurid.tarikhKumuranKohortFMR
                                          .length - 1
                                      ]
                                    ).format('DD/MM/YYYY')
                                  : 'Belum mula'}
                              </td>
                              <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                                <input
                                  type='checkbox'
                                  className='form-checkbox text-md'
                                  checked={props.users[index].masukKohort}
                                  onChange={(e) =>
                                    props.handleCheckboxChange(e, index)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </>
              </table>
            </div>
          </div>
          <div className='sticky grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10 bg-userWhite px-5 py-2'>
            <button
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
              onClick={props.closeModal}
            >
              KEMBALI
              <FaRegPaperPlane className='inline-flex ml-1' />
            </button>
            <button
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
              onClick={confirm}
            >
              HANTAR
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={props.closeModal}
        className='fixed inset-0 bg-userBlack opacity-50 z-0'
      />
    </>
  );
}
