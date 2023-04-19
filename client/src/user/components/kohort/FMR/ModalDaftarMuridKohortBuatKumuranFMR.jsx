import moment from 'moment';
import { FaWindowClose, FaRegPaperPlane } from 'react-icons/fa';

export default function ModalMuridKohortBuatKumuranFMR(props) {
  const DateKumuranItem = props.TarikhKumuran;

  return (
    <>
      <div className='absolute inset-x-0 inset-y-0 lg:inset-x-1/5 lg:inset-y-20 text-sm bg-userWhite z-10 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={props.closeModal}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <div className='grid grid-rows-[1fr_8fr_1fr] h-full'>
          <div className='grid grid-cols-2 m-10'>
            <div>
              <label>
                <span className='font-semibold'>Tarikh Kumuran:</span>
              </label>
            </div>
            <div>
              <DateKumuranItem />
            </div>
          </div>
          <div className='mt-1 py-1'>
            <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-user2'>
                  <tr>
                    <th className='p-2'>
                      <input
                        type='checkbox'
                        checked={props.selectAll}
                        onChange={props.handleSelectAll}
                      />
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      BIL.
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                      NAMA
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      TARIKH KUMURAN TERAKHIR
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      HADIR FMR
                    </th>
                  </tr>
                </thead>
                <>
                  <tbody className='bg-user4'>
                    {props.selectedMurid &&
                      props.selectedMurid.map((singleMurid, index) => {
                        return (
                          <tr key={index}>
                            <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                              {' '}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                              {index + 1}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                              {singleMurid.nama}
                            </td>
                            <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
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
                            <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 text-center'>
                              <input
                                type='checkbox'
                                className='form-checkbox text-md'
                                checked={
                                  props.checkboxStates[singleMurid.nomborId]
                                }
                                onChange={(e) =>
                                  props.handleCheckboxChange(
                                    e,
                                    singleMurid.nomborId
                                  )
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
              className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
              onClick={props.closeModal}
            >
              KEMBALI
            </button>
            <button
              className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all flex justify-center items-center'
              onClick={props.openConfirmModal}
            >
              <FaRegPaperPlane className='inline-flex ml-1' />
              HANTAR
            </button>
          </div>
        </div>
      </div>
      <div
        onClick={props.closeModal}
        className='absolute inset-0 bg-user1 opacity-75 z-0'
      />
    </>
  );
}
