import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

import ModalMuridKohortBuatKumuranFMR from './ModalDaftarMuridKohortBuatKumuranFMR';
import ModalConfirmMuridKohortBuatKumuranFMR from './ModalConfirmMuridKohortBuatKumuranFMR';

export default function DaftarMuridKohortBuatKumuranFMR() {
  const { userToken, reliefUserToken, masterDatePicker, navigate, toast } =
    useGlobalUserAppContext();

  const [allMuridKohort, setAllMuridKohort] = useState([]);

  const [allSekolah, setAllSekolah] = useState([]);
  const [allKelasBasedOnSekolah, setAllKelasBasedOnSekolah] = useState([]);
  const [allTahunKohort, setAllTahunKohort] = useState([]);

  const [selectedSekolah, setSelectedSekolah] = useState('');
  const [selectedKelasBasedOnSekolah, setSelectedKelasBasedOnSekolah] =
    useState('');
  const [selectedTahunKohort, setSelectedTahunKohort] = useState('');

  const [selectedMurid, setSelectedMurid] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState(null);

  const [users, setUsers] = useState([{ nomborId: '', masukKohort: false }]);
  const [startKumuran, setStartKumuran] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [searchUrl, setSearchUrl] = useState('/api/v1/kohort/fmr/murid-kohort');
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
      allMuridKohort.forEach((singleMurid) => {
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
    if (startKumuran === '') {
      toast.error('Sila pilih tarikh kumuran');
      return;
    }
    const filteredMurid = users.filter((user) => user?.masukKohort === true);
    if (filteredMurid.length === 0) {
      toast.error('Sila pilih sekurang-kurangnya satu murid');
      return;
    }
    const data = {
      muridKumuran: filteredMurid,
      startKumuran,
    };
    // import.meta.process.env.VITE_ENV === 'DEV' && console.log(data);
    try {
      const res = await axios.patch(
        '/api/v1/kohort/fmr/daftar-kumuran-kohort',
        data,
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      );
      // console.log(res);
      toast.success('Berjaya');
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error('yada yada');
      closeModal();
    }
  };

  const closeModal = () => {
    console.log('closing modal');
    setRefetch(!refetch);
    setShowModal(false);
    setShowConfirmModal(false);
  };

  const openConfirmModal = () => {
    console.log('open confirm modal');
    setShowConfirmModal(true);
  };

  const closeConfirmModalAndGoAway = () => {
    setShowModal(false);
    setShowConfirmModal(false);
    navigate('/user/kohort/fmr');
  };

  const props = {
    openConfirmModal,
    closeModal,
    closeConfirmModalAndGoAway,
    TarikhKumuran,
    handleSelectAll,
    handleCheckboxChange,
    handleSubmit,
    selectAll,
    checkboxStates,
    selectedSekolah,
    selectedKelasBasedOnSekolah,
    selectedMurid,
    startKumuran,
    users,
    allMuridKohort,
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
        setAllMuridKohort(data.muridDalamKohortFMR);
        const allSekolah = _.uniq(
          data.muridDalamKohortFMR.map((murid) => murid.namaSekolah)
        );
        setAllSekolah(allSekolah);
        const allKohort = _.uniq(
          data.muridDalamKohortFMR.map((murid) => murid.tahunKohortFMR)
        );
        setAllTahunKohort(allKohort);
        setUsers(
          data.muridDalamKohortFMR.map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
        );
        setCheckboxStates(
          Object.fromEntries(
            data.muridDalamKohortFMR.map((singleMurid) => [
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
    if (!init.current) {
      fetchAllMuridD1();
      init.current = true;
    }
    fetchAllMuridD1();
  }, []);

  useEffect(() => {
    const refetchDataOnDelete = async () => {
      try {
        const { data } = await axios.get(searchUrl, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        // const desc = data.muridDalamKohortFMR.sort((a, b) =>
        //   a.nama > b.nama ? -1 : 1
        // );
        setAllMuridKohort(data.muridDalamKohortFMR);
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
      console.log('resetting');
      setSelectedKelasBasedOnSekolah('');
    } else {
      const allKelasBasedOnSekolah = _.uniq(
        allMuridKohort
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((murid) => murid.kelasPelajar)
      );
      setAllKelasBasedOnSekolah(allKelasBasedOnSekolah);
      setSelectedMurid(
        allMuridKohort.filter((murid) => murid.namaSekolah === selectedSekolah)
      );
      setUsers(
        allMuridKohort
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
      );
    }
  }, [selectedSekolah]);

  useEffect(() => {
    if (selectedKelasBasedOnSekolah === '') {
      console.log('resetting');
      setSelectedMurid(
        allMuridKohort.filter((murid) => murid.namaSekolah === selectedSekolah)
      );
      setUsers(
        allMuridKohort
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
      );
    } else {
      setSelectedMurid(
        allMuridKohort.filter(
          (murid) =>
            murid.namaSekolah === selectedSekolah &&
            murid.kelasPelajar === selectedKelasBasedOnSekolah
        )
      );
      setUsers(
        allMuridKohort
          .filter(
            (murid) =>
              murid.namaSekolah === selectedSekolah &&
              murid.kelasPelajar === selectedKelasBasedOnSekolah
          )
          .map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
      );
      console.log('selected kelas');
    }
  }, [selectedKelasBasedOnSekolah]);

  useEffect(() => {
    if (selectedTahunKohort === '') {
      setSelectedMurid([]);
      setSelectedSekolah('');
      setSelectedKelasBasedOnSekolah('');
    } else {
      setSelectedMurid(
        allMuridKohort.filter(
          (murid) => murid.tahunKohortFMR === selectedTahunKohort
        )
      );
      setUsers(
        allMuridKohort
          .filter((murid) => murid.tahunKohortFMR === selectedTahunKohort)
          .map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
      );
    }
  }, [selectedTahunKohort]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-2 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            CARIAN MURID KOHORT TAHUN 1 PROGRAM KUMURAN BERFLOURIDA
          </h5>
        </div>
        <div className='grid shadow-md shadow-user3 mt-5 items-center'>
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
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  STATUS KUMURAN TERAKHIR
                </th>
                {/* <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                    HADIR FMR
                  </th> */}
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  JUMLAH KUMURAN SEMASA
                </th>
              </tr>
            </thead>
            {!isLoading ? (
              <>
                <tbody className='bg-user4'>
                  {allMuridKohort
                    .filter((muridKohort) => {
                      return muridKohort.tahunKohortFMR === selectedTahunKohort;
                    })
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
                            {singleMurid.jumlahKumuran}
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
        </div>
        {showModal && <ModalMuridKohortBuatKumuranFMR {...props} />}
      </div>
      {showConfirmModal && <ModalConfirmMuridKohortBuatKumuranFMR {...props} />}
    </>
  );
}
