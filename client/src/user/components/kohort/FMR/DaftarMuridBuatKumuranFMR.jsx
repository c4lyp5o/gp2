import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

import ModalDaftarMuridBuatKumuranFMR from './ModalDaftarMuridBuatKumuranFMR';

export default function DaftarMuridBuatKumuranFMR() {
  const { userToken, reliefUserToken, masterDatePicker, navigate, toast } =
    useGlobalUserAppContext();

  const [allMuridD1, setAllMuridD1] = useState([]);

  const [allSekolah, setAllSekolah] = useState([]);
  const [allKelasBasedOnSekolah, setAllKelasBasedOnSekolah] = useState([]);

  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKelasBasedOnSekolah, setSelectedKelasBasedOnSekolah] =
    useState('');

  const [selectAll, setSelectAll] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(null);

  const [users, setUsers] = useState([{ nomborId: '', masukKohort: false }]);
  const [startKumuran, setStartKumuran] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [searchUrl, setSearchUrl] = useState('/api/v1/kohort/fmr/semua-murid');
  const [refetch, setRefetch] = useState(false);

  //datepicker range
  const [startKumuranDatePicker, setStartKumuranDatePicker] = useState(null);

  const init = useRef(false);

  const TarikhKumuran = () => {
    return masterDatePicker({
      selected: startKumuranDatePicker,
      selectsStart: true,
      startDate: startKumuranDatePicker,
      onChange: (startDate) => {
        setStartKumuran(moment(startDate).format('YYYY-MM-DD'));
        setStartKumuranDatePicker(startDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      required: true,
      className:
        'text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setCheckboxStates((prevStates) => {
      const updatedStates = { ...prevStates };
      allMuridD1.forEach((singleMurid) => {
        updatedStates[singleMurid.nomborId] = isChecked;
      });
      return updatedStates;
    });
    setUsers((prevUsers) =>
      prevUsers.map((singleMurid) => ({
        ...singleMurid,
        masukKohort: isChecked,
      }))
    );
  };

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setCheckboxStates((prevStates) => ({ ...prevStates, [id]: isChecked }));
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((singleMurid) =>
        singleMurid.nomborId === id
          ? { ...singleMurid, masukKohort: isChecked }
          : singleMurid
      );
      // console.log(updatedUsers);
      return updatedUsers;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // jgn send kalau xde tarikh kumuran
    if (startKumuran === '') {
      toast.error('Sila pilih tarikh kumuran');
      return;
    }
    // jgn send kalau xde murid yg dipilih
    const filteredMurid = users.filter((user) => user.masukKohort === true);
    if (filteredMurid.length === 0) {
      toast.error('Sila pilih sekurang-kurangnya satu murid');
      return;
    }
    // send
    const data = {
      muridKumuran: filteredMurid,
      startKumuran,
    };
    // console.log(data);
    try {
      const res = await axios.patch('/api/v1/kohort/fmr/daftar-kumuran', data, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      });
      // console.log(res);
      toast.success('Berjaya');
      closeModalAndGoAway();
    } catch (err) {
      console.log(err);
      toast.error('yada yada');
      closeModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setRefetch(!true);
  };

  const closeModalAndGoAway = () => {
    setShowModal(false);
    navigate('/pengguna/landing/kohort/fmr');
  };

  const props = {
    selectedSekolah,
    selectedKelasBasedOnSekolah,
    users,
    closeModal,
    closeModalAndGoAway,
    handleSubmit,
  };

  useEffect(() => {
    const fetchAllMuridD1 = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        // console.log(data);
        setAllMuridD1(data.allD1PelajarSekolah);
        const allSekolah = _.uniq(
          data.allD1PelajarSekolah.map((murid) => murid.namaSekolah)
        );
        // const allSekolah = [
        //   ...new Set(
        //     data.allD1PelajarSekolah.map(({ namaSekolah }) => namaSekolah)
        //   ),
        // ];
        setAllSekolah(allSekolah);
        setUsers(
          data.allD1PelajarSekolah.map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
        );
        setCheckboxStates(
          Object.fromEntries(
            data.allD1PelajarSekolah.map((singleMurid) => [
              singleMurid.id,
              singleMurid.masukKohort,
            ])
          )
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        toast.error('yada yada');
      }
    };
    if (init.current === false) {
      fetchAllMuridD1();
      init.current = true;
    }
    fetchAllMuridD1();
  }, []);

  useEffect(() => {
    const refetchDataOnDelete = async () => {
      console.log('refetch running');
      try {
        const { data } = await axios.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        const desc = data.allD1PelajarSekolah.sort((a, b) =>
          a.nama > b.nama ? 1 : -1
        );
        setAllMuridD1(desc);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-refetchDataOnDelete'
        // );
      }
    };
    refetchDataOnDelete();
  }, [refetch]);

  useEffect(() => {
    if (selectedSekolah === '') {
      // console.log('resetting');
      setSelectedKelasBasedOnSekolah('');
    } else {
      const allKelasBasedOnSekolah = _.uniq(
        allMuridD1
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((murid) => murid.kelasPelajar)
      );
      setAllKelasBasedOnSekolah(allKelasBasedOnSekolah);
      // setUsers(
      //   allMuridD1
      //     .filter((murid) => murid.namaSekolah === selectedSekolah)
      //     .map((singleMurid) => ({
      //       ...singleMurid,
      //       masukKohort: false,
      //     }))
      // );
    }
  }, [selectedSekolah]);

  useEffect(() => {
    if (selectedKelasBasedOnSekolah === '') {
      setUsers(
        allMuridD1
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
      );
    } else {
      // setUsers(
      //   allMuridD1
      //     .filter(
      //       (murid) =>
      //         murid.namaSekolah === selectedSekolah &&
      //         murid.kelasPelajar === selectedKelasBasedOnSekolah
      //     )
      //     .map((singleMurid) => ({
      //       ...singleMurid,
      //       masukKohort: false,
      //     }))
      // );
      console.log('kelas');
    }
  }, [selectedKelasBasedOnSekolah]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            CARIAN MURID TAHUN 1 PROGRAM KUMURAN BERFLOURIDA
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
                  {allSekolah.map((sekolah, index) => {
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
                  onChange={(event) =>
                    setSelectedKelasBasedOnSekolah(event.target.value)
                  }
                >
                  <option value=''>Sila pilih kelas</option>
                  {allSekolah !== '' &&
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
        </div>
        <div className='grid grid-cols-2 shadow-md shadow-user3 m-5'>
          <div className='m-5'>
            <label>
              <span className='font-semibold'>Tarikh Kumuran:</span>
            </label>
          </div>
          <div className='m-5'>
            <TarikhKumuran />
          </div>
        </div>
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-2'>
                  <input
                    type='checkbox'
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  STATUS KUMURAN TERAKHIR
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  HADIR FMR
                </th>
              </tr>
            </thead>
            {!isLoading ? (
              <>
                <tbody className='bg-user4'>
                  {allMuridD1
                    .filter((murid) => {
                      if (selectedSekolah === '') {
                        return murid;
                      } else {
                        if (selectedKelasBasedOnSekolah === '') {
                          return murid.namaSekolah === selectedSekolah;
                        } else {
                          return (
                            murid.namaSekolah === selectedSekolah &&
                            murid.kelasPelajar === selectedKelasBasedOnSekolah
                          );
                        }
                      }
                    })
                    .map((singleMurid, index) => {
                      return (
                        <tr key={index}>
                          <td className='px-2 py-1 outline outline-1 outline-offset-1'>
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
                                    singleMurid.tarikhKumuranKohortFMR.length -
                                      1
                                  ]
                                ).format('DD/MM/YYYY')
                              : 'Belum mula'}
                          </td>
                          <td className='px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'>
                            <input
                              type='checkbox'
                              className='form-checkbox text-md'
                              checked={checkboxStates[singleMurid.nomborId]}
                              onChange={(e) =>
                                handleCheckboxChange(e, singleMurid.nomborId)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </>
            ) : (
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
                </tr>
              </tbody>
            )}
          </table>
          {!isLoading && (
            <div className='grid grid-cols-2 gap-4 mt-5'>
              <button
                type='button'
                className='bg-user2 text-userWhite rounded-md px-3 py-2'
                onClick={() => navigate('/pengguna/landing/kohort/fmr')}
              >
                KEMBALI
              </button>
              <button
                type='button'
                onClick={() => setShowModal(true)}
                className='bg-user2 text-userWhite rounded-md px-3 py-2'
              >
                DAFTAR KUMURAN
              </button>
            </div>
          )}
        </div>
        {showModal ? <ModalDaftarMuridBuatKumuranFMR {...props} /> : null}
      </div>
    </>
  );
}
