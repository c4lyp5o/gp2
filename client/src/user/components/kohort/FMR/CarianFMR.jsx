import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function UserCarianPromosi() {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);

  const [allMuridKohort, setAllMuridKohort] = useState('');
  const [allSekolahKohortFMR, setAllSekolahKohortFMR] = useState([]);
  const [allKelasBasedOnSekolah, setAllKelasBasedOnSekolah] = useState([]);
  const [allTahunKohort, setAllTahunKohort] = useState([]);

  // const [pilihanSekolah, setPilihanSekolah] = useState('');
  // const [pilihanKelas, setPilihanKelas] = useState('');
  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedTahunKohort, setSelectedTahunKohort] = useState('');
  const [selectedMurid, setSelectedMurid] = useState([]);

  const [tahunMulaKumuran, setTahunMulaKumuran] = useState('');
  const [modalHapusPromosi, setModalHapusPromosi] = useState(false);

  const [searchUrl, setSearchUrl] = useState('');
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchAllMuridFMR = async (e) => {
      try {
        const { data } = await axios.get(`/api/v1/kohort/fmr/murid-kohort`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        setAllMuridKohort(data.muridDalamKohortFMR);
        const nama2Sekolah = _.uniq(
          data.muridDalamKohortFMR.map((x) => x.namaSekolah)
        );
        const nama2TahunKohort = _.uniq(
          data.muridDalamKohortFMR.map((x) => x.tahunKohortFMR)
        );
        console.log(nama2Sekolah);
        setAllSekolahKohortFMR(nama2Sekolah);
        setAllTahunKohort(nama2TahunKohort);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //     'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
        // );
      }
    };
    fetchAllMuridFMR();
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

  useEffect(() => {
    if (selectedSekolah === '') {
      console.log('resetting');
      setSelectedKelas('');
    } else {
      const allKelasBasedOnSekolah = _.uniq(
        allMuridKohort
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((murid) => murid.namaKelas)
      );
      setAllKelasBasedOnSekolah(allKelasBasedOnSekolah);
      setSelectedMurid(
        allMuridKohort.filter((murid) => murid.namaSekolah === selectedSekolah)
      );
    }
  }, [selectedSekolah]);

  // useEffect(() => {
  //   if (selectedKelas === '') {
  //     console.log('resetting');
  //     setSelectedMurid(
  //       allMuridKohort.filter((murid) => murid.namaSekolah === selectedSekolah)
  //     );
  //   } else {
  //     setSelectedMurid(
  //       allMuridKohort.filter(
  //         (murid) =>
  //           murid.namaSekolah === selectedSekolah &&
  //           murid.namaKelas === selectedKelas
  //       )
  //     );
  //   }
  // }, [selectedKelas]);

  useEffect(() => {
    setSelectedMurid([]);
    setSelectedSekolah('');
    setSelectedKelas('');
  }, [selectedTahunKohort]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-2 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            CARIAN MURID KOHORT TAHUN 1 PROGRAM KUMURAN BERFLOURIDA
          </h5>
        </div>
        <div className='grid grid-row-2 shadow-md shadow-user3'>
          <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
            <div className='m-5'>
              <label className='flex justify-center items-center'>
                <span className='font-semibold'>SEKOLAH:</span>
                <select
                  className='ml-2'
                  onChange={(event) => setSelectedSekolah(event.target.value)}
                >
                  <option value=''>Sila pilih sekolah</option>
                  {allSekolahKohortFMR.map((sekolah, index) => {
                    return (
                      <option value={sekolah} key={index}>
                        {sekolah}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
            <div className='m-5'>
              <label className='flex justify-center items-center'>
                <span className='font-semibold'>KELAS:</span>
                <select
                  className='ml-2'
                  onChange={(event) => setSelectedKelas(event.target.value)}
                >
                  <option value=''>Sila pilih kelas</option>
                  {allSekolahKohortFMR !== '' &&
                    allKelasBasedOnSekolah.map((kelas, index) => {
                      return (
                        <option value={kelas} key={index}>
                          {kelas}
                        </option>
                      );
                    })}
                </select>
              </label>
            </div>
          </div>
          <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
            <div>
              <label className='flex m-5'>
                <span className='font-semibold'>
                  Kohort (Tahun Mula Kumuran):
                </span>
                <select
                  className='ml-2'
                  onChange={(event) => {
                    setSelectedTahunKohort(event.target.value);
                  }}
                >
                  <option value=''>Sila pilih kohort</option>
                  {allTahunKohort.map((kohort, index) => {
                    return (
                      <option value={kohort} key={index}>
                        {kohort}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
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
                {userinfo.role === 'admin' ? (
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 '>
                    HAPUS
                  </th>
                ) : null}
              </tr>
            </thead>
            {!isLoading &&
              allMuridKohort.length > 0 &&
              allMuridKohort
                .filter((muridKohort) => {
                  return muridKohort.tahunKohortFMR === selectedTahunKohort;
                })
                .filter((murid) => {
                  if (selectedSekolah === '') {
                    return murid;
                  } else {
                    if (selectedKelas === '') {
                      return murid.namaSekolah === selectedSekolah;
                    } else {
                      return (
                        murid.namaSekolah === selectedSekolah &&
                        murid.namaKelas === selectedKelas
                      );
                    }
                  }
                })
                .map((singlePersonKohort, index) => {
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
                          {singlePersonKohort.tarikhKumuranKohortFMR &&
                          singlePersonKohort.tarikhKumuranKohortFMR.length > 0
                            ? moment(
                                singlePersonKohort.tarikhKumuranKohortFMR[
                                  singlePersonKohort.tarikhKumuranKohortFMR
                                    .length - 1
                                ]
                              ).format('DD/MM/YYYY')
                            : 'Belum mula'}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                          {singlePersonKohort.jumlahKumuran}
                        </td>
                        {userinfo.role === 'admin' ? (
                          <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1 text-center'>
                            <BsTrash className='text-xl' />
                          </td>
                        ) : null}
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
