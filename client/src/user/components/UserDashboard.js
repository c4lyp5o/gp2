import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function UserDashboard() {
  const [showAccordian1, setShowAccordian1] = useState(true);
  const [showAccordian2, setShowAccordian2] = useState(true);
  const [showAccordian3, setShowAccordian3] = useState(true);

  const [rankingSekolahRendah, setRankingSekolahRendah] = useState(true);
  const [rankingSekolahMenengah, setRankingSekolahMenengah] = useState(false);

  return (
    <>
      <div className='h-full p-3 overflow-y-auto'>
        <div className='grid grid-cols-2 mb-1'>
          <h3 className='text-xs lg:text-lg font-semibold text-left px-2'>
            INFOGRAFIK STATUS KESIHATAN PERGIGIAN PELAJAR
          </h3>
          <select
            name='tahun-dashboard'
            id='tahun-dashboard'
            className='text-xs lg:text-base mr-0 ml-auto lg:w-60 px-2 py-1'
          >
            <option disabled>TAHUN</option>
            <option value='2022'>2022</option>
            <option value='2021'>2021</option>
            <option value='2020'>2020</option>
          </select>
        </div>
        <button
          className='flex bg-user3 p-1 w-full capitalize'
          onClick={() => setShowAccordian1(!showAccordian1)}
        >
          {showAccordian1 ? (
            <FaMinus className='pt-1' />
          ) : (
            <FaPlus className='pt-1' />
          )}
          <p className='ml-3'>jumlah data entri</p>
        </button>
        <section
          className={`grid grid-cols-1 lg:grid-cols-4 gap-1 mt-3 mb-3 transition-all ${
            showAccordian1
              ? 'max-h-[100rem] overflow-y-auto'
              : 'max-h-0 overflow-hidden'
          }`}
        >
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='font-bold pt-2'>jumlah kedatangan</h4>
            <div className='text-4xl'>6734</div>
            <div className=''>baru</div>
            <div className='text-2xl'>5389</div>
            <div className=''>ulangan</div>
            <div className='text-2xl'>1345</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>taska</h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>8/11</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>234</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>pra sekolah</h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>8/12</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>150</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>
              sekolah menengah
            </h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>8/9</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>4234</div>
          </article>
          <article className='grid grid-rows-2 h-full border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='font-bold pt-2'>klinik pergigian</h4>
            <div className='text-4xl'>1/1</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>tadika</h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>14/20</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>876</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>sekolah rendah</h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>13/16</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>877</div>
          </article>
          <article className='grid grid-cols-2 border border-userBlack pl-3 px-1 rounded-md'>
            <h4 className='col-start-1 col-end-3 font-bold'>institusi</h4>
            <div className=''>bilangan dilawati</div>
            <div className='text-2xl'>1/2</div>
            <div className=''>bilangan diperiksa</div>
            <div className='text-2xl'>363</div>
          </article>
        </section>
        <button
          className='flex bg-user3 p-1 w-full capitalize'
          onClick={() => setShowAccordian2(!showAccordian2)}
        >
          {showAccordian2 ? (
            <FaMinus className='pt-1' />
          ) : (
            <FaPlus className='pt-1' />
          )}
          <p className='ml-3'>status kesihatan pergigian pelajar</p>
        </button>
        <section
          className={`grid grid-cols-2 lg:grid-cols-5 gap-1 mt-3 mb-3 transition-all ${
            showAccordian2
              ? 'max-h-[100rem] overflow-y-auto'
              : 'max-h-0 overflow-hidden'
          }`}
        >
          <select
            name='jenis-institusi'
            id='jenis-institusi'
            className='col-start-1 col-end-3 lg:col-start-1 lg:col-end-6 text-xs lg:text-base w-60 px-2 py-1'
          >
            <option disabled>INSTITUSI</option>
            <option value='taska'>TASKA</option>
            <option value='tadika'>TADIKA</option>
            <option value='pra sekolah'>PRA SEKOLAH</option>
            <option value='sekolah rendah'>SEKOLAH RENDAH</option>
            <option value='sekolah menengah'>SEKOLAH MENENGAH</option>
          </select>
          <article className='grid grid-rows-2 border border-userBlack pl-3 px-1 rounded-md h-36'>
            <h4 className='text-2xl pt-3'>MBK</h4>
            <div className='text-4xl'>78%</div>
          </article>
          <article className='grid grid-rows-2 border border-userBlack pl-3 px-1 rounded-md h-36'>
            <h4 className='text-2xl pt-3'>BK</h4>
            <div className='text-4xl'>---</div>
          </article>
          <article className='grid grid-rows-2 border border-userBlack pl-3 px-1 rounded-md h-36'>
            <h4 className='text-2xl pt-3'>MBG</h4>
            <div className='text-4xl'>---</div>
          </article>
          <article className='grid grid-rows-2 border border-userBlack pl-3 px-1 rounded-md h-36'>
            <h4 className='text-2xl pt-3'>TPR</h4>
            <div className='text-4xl'>76%</div>
          </article>
          <article className='grid col-span-2 lg:col-span-1 grid-rows-2 border border-userBlack pl-3 px-1 rounded-md h-36'>
            <h4 className='text-2xl pt-3 lowercase'>dfx=0</h4>
            <div className='text-4xl'>76%</div>
          </article>
        </section>
        <button
          className='flex bg-user3 p-1 w-full text-left capitalize'
          onClick={() => setShowAccordian3(!showAccordian3)}
        >
          {showAccordian3 ? (
            <FaMinus className='pt-1' />
          ) : (
            <FaPlus className='pt-1' />
          )}
          <p className='ml-3'>ranking pencapaian kesihatan pergigian sekolah</p>
        </button>
        <section
          className={`mt-3 mb-3 transition-all ${
            showAccordian3
              ? 'max-h-[100rem] overflow-y-auto'
              : 'max-h-0 overflow-hidden'
          }`}
        >
          <div className='flex text-left text-xs lg:text-base'>
            <div>
              <input
                type='checkbox'
                checked={rankingSekolahRendah}
                onChange={() => {
                  setRankingSekolahRendah(!rankingSekolahRendah);
                }}
                id='sekolah-rendah'
                className='checked:ring-2 checked:ring-user1 checked:outline-none hover:cursor-pointer m-3'
              />
              <label
                htmlFor='sekolah-rendah'
                className='hover:cursor-pointer mr-3'
              >
                sekolah rendah
              </label>
            </div>
            <div>
              <input
                type='checkbox'
                checked={rankingSekolahMenengah}
                onChange={() => {
                  setRankingSekolahMenengah(!rankingSekolahMenengah);
                }}
                id='sekolah-menengah'
                className='checked:ring-2 checked:ring-user1 checked:outline-none hover:cursor-pointer m-3'
              />
              <label
                htmlFor='sekolah-menengah'
                className='hover:cursor-pointer'
              >
                sekolah menengah
              </label>
            </div>
          </div>
          <div className='lg:m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL.
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    NEGERI
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    DAERAH
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    SEKOLAH
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    PERATUS MURID DILIPUTI (%)
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    PERATUS MULUT BEBAS KARIES (%)
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    PERATUS BEBAS KARIES (%)
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    PERATUS MULUT BEBAS GINGIVITIS (%)
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    PERATUS TIDAK PERLU RAWATAN (%)
                  </th>
                </tr>
              </thead>
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    1
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    kedah
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    kota setar
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    sekolah kebangsaan alor janggus
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    98.0
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    70
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    75
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    75
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    75
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    2
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    kedah
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    kota setar
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    sekolah menengah alor janggus
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    90.2
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    69
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    71
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    71
                  </td>
                  <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                    71
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <p className='text-user6 text-xs text-left'>
          <span className='uppercase'>* NOTA PENTING</span>: maklumat{' '}
          <span className='lowercase'>
            ini hanya untuk analisa pencapaian semasa sahaja
          </span>
        </p>
      </div>
    </>
  );
}

export default UserDashboard;
