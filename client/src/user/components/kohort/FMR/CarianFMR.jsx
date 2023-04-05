import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function UserCarianPromosi() {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allPersonInKohort, setAllPersonInKohort] = useState('');
  const [allSekolahKohortFMR, setAllSekolahKohortFMR] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanKelas, setPilihanKelas] = useState('');
  const [tahunMulaKumuran, setTahunMulaKumuran] = useState('');
  const [modalHapusPromosi, setModalHapusPromosi] = useState(false);

  const [searchUrl, setSearchUrl] = useState('');
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchAllPersonInKohortFMR = async (e) => {
      try {
        const { data } = await axios.get(`/api/v1/kohort/fmr/telah-daftar`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllPersonInKohort(data.allPersonKohortFMR);
        const nama2Sekolah = _.uniq(
          data.allPersonKohortFMR.map((x) => x.namaSekolah)
        );
        console.log(nama2Sekolah);
        setAllSekolahKohortFMR(nama2Sekolah);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //     'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
        // );
      }
    };
    fetchAllPersonInKohortFMR();
  }, []);

  //   useEffect(() => {
  //     const refetchDataOnDelete = async () => {
  //       try {
  //         const { data } = await axios.get(searchUrl, {
  //           headers: {
  //             Authorization: `Bearer ${
  //               reliefUserToken ? reliefUserToken : userToken
  //             }`,
  //           },
  //         });
  //         const desc = data.aktivitiPromosiResultQuery.sort((a, b) =>
  //           a.tarikhMula > b.tarikhMula ? -1 : 1
  //         );
  //         setQueryResult(desc);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.log(error);
  //         // toast.error(
  //         //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-refetchDataOnDelete'
  //         // );
  //       }
  //     };
  //     refetchDataOnDelete();
  //   }, [refetch]);

  //   useEffect(() => {
  //     const fetchAllProgramPromosi = async () => {
  //       try {
  //         setIsLoading(true);
  //         const { data } = await axios.get('/api/v1/promosi', {
  //           headers: {
  //             Authorization: `Bearer ${
  //               reliefUserToken ? reliefUserToken : userToken
  //             }`,
  //           },
  //         });
  //         const withoutDuplicateJenisProgram = data.allProgramPromosi.map(
  //           (a) => a.jenisProgram
  //         );
  //         const withoutDuplicate = [...new Set(withoutDuplicateJenisProgram)];
  //         setJenisProgram(withoutDuplicate);
  //         setAllProgramPromosi(data.allProgramPromosi);
  //         setIsLoading(false);
  //       } catch (error) {
  //         console.log(error);
  //         // toast.error(
  //         //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-fetchAllProgramPromosi'
  //         // );
  //       }
  //     };
  //     fetchAllProgramPromosi();
  //   }, [reliefUserToken, userToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const params = `/api/v1/kohort/fmr?kodFasiliti=${userinfo.kodFasiliti}`;
      setSearchUrl(params);
      const { data } = await axios.get(params, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      });
      const desc = data.aktivitiPromosiResultQuery.sort((a, b) =>
        a.tarikhMula > b.tarikhMula ? -1 : 1
      );
      setQueryResult(desc);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setQueryResult([]);
      setIsLoading(false);
      toast.error('Tiada data promosi yang dijumpai');
    }
  };

  const handleResetAllFilter = () => {
    setTarikhMulaAcara('');
    setTarikhAkhirAcara('');
    setJenisProgramResult('');
    setKodProgram('');
    setNamaAcara('');
    setIdOperator('');
    setIndividuOrKlinik('');
    setQueryResult([]);
  };

  return (
    <>
      <div className='h-full p-3 lg:p-5 overflow-y-auto'>
        <div className='text-lg font-bold uppercase'>
          CARIAN MURID KOHORT PROGRAM KUMURAN BERFLOURIDA
        </div>
        <div className='grid grid-row-2 lg:grid-cols-2 gap-2'>
          <div className='grid lg:grid-cols-2 gap-2'>
            <div className='m-auto w-full lg:flex lg:flex-row lg:py-2 lg:w-96'>
              <label
                htmlFor='pilihanTarikh'
                className='whitespace-nowrap flex items-center mb-1'
              >
                Sekolah :{' '}
              </label>
              <select
                name='pilihanSekolah'
                className='w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setPilihanSekolah(e.target.value)}
                value={pilihanSekolah}
              >
                <option value=''>Sila Pilih</option>
                {allSekolahKohortFMR.map((sekolah, index) => (
                  <option key={index} value={sekolah}>
                    {sekolah}
                  </option>
                ))}
              </select>
            </div>
            <div className='m-auto w-full lg:flex lg:flex-row lg:py-2 lg:w-96'>
              <label
                htmlFor='pilihanTarikh'
                className='whitespace-nowrap flex items-center mb-1'
              >
                Kelas :{' '}
              </label>
              <select
                name='pilihanKelas'
                className='w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline'
                onChange={(e) => setPilihanKelas(e.target.value)}
                value={pilihanKelas}
              >
                <option value=''>Sila Pilih</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
              </select>
            </div>
          </div>
          <div>
            <div className='m-auto w-96 lg:flex lg:flex-row'>
              <label
                htmlFor='jenis-program'
                className='whitespace-nowrap mr-7 mx-5'
              >
                Kohort (Tahun Mula Kumuran) :{' '}
              </label>
              <select
                value={tahunMulaKumuran}
                onChange={(e) => {
                  setTahunMulaKumuran(e.target.value);
                }}
                className='w-full my-3 mx-4 leading-7 px-3 py-2 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              >
                <option value=''>Sila Pilih</option>
                <option value='2020'>2020</option>
                <option value='2019'>2019</option>
                <option value='2018'>2018</option>
              </select>
            </div>
          </div>
        </div>
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  TARIKH KUMURAN TERAKHIR
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  JUMLAH KUMURAN SEMASA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 '>
                  HAPUS
                </th>
              </tr>
            </thead>
            {!isLoading &&
              allPersonInKohort.length > 0 &&
              allPersonInKohort.map((singlePersonKohort, index) => {
                return (
                  <tbody className='bg-user4'>
                    <tr>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {singlePersonKohort.nama}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {singlePersonKohort.kumuranTerakhir}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                        {singlePersonKohort.jumlahKumuran}
                      </td>
                      {/* <td
                        className={`${
                          pilihanId === singlePersonKohort._id && 'bg-user3'
                        } px-2 py-3 outline outline-1 outline-userWhite outline-offset-1 text-user2`}
                      >
                        {hasilQueryPromosi.statusReten === 'telah diisi' ||
                        hasilQueryPromosi.statusReten === 'reten salah' ? (
                          <Link
                            target='_blank'
                            rel='noreferrer'
                            to={`${
                              singlePersonKohort.promosiIndividu
                                ? `/pengguna/landing/promosi-individu/form-promosi/${singlePersonKohort._id}`
                                : `/pengguna/landing/promosi-klinik/form-promosi/${singlePersonKohort._id}`
                            }`}
                            className='m-2 p-2 uppercase bg-user3 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 transition-all'
                          >
                            lihat reten
                          </Link>
                        ) : null}
                        {(userinfo.role === 'admin' ||
                          userinfo.rolePromosiKlinik) &&
                          (singlePersonKohort.statusReten === 'telah diisi' ||
                          singlePersonKohort.statusReten === 'reten salah' ? (
                            <span
                              onClick={() => {
                                setModalHapusPromosi(true);
                                setPilihanId(singlePersonKohort._id);
                                setPilihanNama(singlePersonKohort.namaAcara);
                                // setPilihanStatusReten(
                                //   hasilQueryPromosi.statusReten
                                // );
                              }}
                              className='m-2 p-2 uppercase bg-user9 text-sm text-userWhite rounded-md shadow-md whitespace-nowrap hover:bg-user1 hover:cursor-pointer transition-all'
                            >
                              HAPUS RETEN
                            </span>
                          ) : null)}
                      </td> */}
                    </tr>
                  </tbody>
                );
              })}
            {isLoading && (
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-5 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-20 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-8 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        {modalHapusPromosi && (
          <UserDeleteModal
            handleDelete={handleDelete}
            setModalHapus={setModalHapusPromosi}
            id={pilihanId}
            nama={pilihanNama}
          />
        )}
      </div>
    </>
  );
}
