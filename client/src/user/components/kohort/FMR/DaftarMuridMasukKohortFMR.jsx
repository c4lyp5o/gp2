import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

import ModalDaftarMuridMasukKohortFMR from './ModalDaftarMuridMasukKohortFMR';

export default function DaftarMuridMasukKohortFMR() {
  const { userToken, reliefUserToken, navigate, toast } =
    useGlobalUserAppContext();

  const { singleSekolahFMRId } = useParams();

  const [allMuridD1SingleSekolah, setAllMuridD1SingleSekolah] = useState([]);
  const [allSekolah, setAllSekolah] = useState([]);
  const [allKelasBasedOnSekolah, setAllKelasBasedOnSekolah] = useState([]);

  const [selectedSekolah, setSelectedSekolah] = useState([]);
  const [selectedKelasBasedOnSekolah, setSelectedKelasBasedOnSekolah] =
    useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([{ noKp: '', masukKohort: true }]);
  const [filteredMuridD1, setFilteredMuridD1] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const init = useRef(false);

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setUsers(
      allMuridD1SingleSekolah.map((singleMurid) => ({
        ...singleMurid,
        masukKohort: event.target.checked,
      }))
    );
  };

  const handleCheckboxChange = (event, index) => {
    const updatedUsers = [...users];
    updatedUsers[index].masukKohort = event.target.checked;
    setUsers(updatedUsers);
    console.log(updatedUsers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // jgn send kalau xde murid yg dipilih
    const filteredMurid = users.filter((user) => user.masukKohort === true);
    if (filteredMurid.length === 0) {
      toast.error('Sila pilih sekurang-kurangnya satu murid');
      return;
    }
    // send
    const data = {
      semuaMuridKumuran: filteredMurid,
    };
    console.log(data);
    try {
      await axios.post('/api/v1/kohort/fmr/daftar-murid', data, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      });
      toast.success('Berjaya');
      closeModalAndGoAway();
    } catch (error) {
      console.log(error);
      toast.error('yada yada');
      closeModalAndGoAway();
    }
  };

  const closeModalAndGoAway = () => {
    setShowModal(false);
    navigate('/kohort/fmr');
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchAllMuridD1 = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/kohort/fmr/pilih-murid/${singleSekolahFMRId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        console.log(data);
        setAllMuridD1SingleSekolah(data.dataSemuaPelajarD1SingleSekolah);
        const allSekolah = _.uniq(
          data.dataSemuaPelajarD1SingleSekolah.map((murid) => murid.namaSekolah)
        );
        setAllSekolah(allSekolah);
        setUsers(
          data.dataSemuaPelajarD1SingleSekolah.map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        // toast.error('yada yada');
      }
    };
    if (init.current === false) {
      fetchAllMuridD1();
      init.current = true;
    }
  }, []);

  useEffect(() => {
    // Reset the selected class and filtered list of students when the selected school changes
    setSelectedKelasBasedOnSekolah('');
    setFilteredMuridD1(allMuridD1SingleSekolah);

    if (selectedSekolah !== '') {
      // Get all classes based on the selected school
      const allKelas = allMuridD1SingleSekolah
        .filter((murid) => murid.namaSekolah === selectedSekolah)
        .map((murid) => murid.namaKelas);

      // Set the state variable for all classes based on the selected school
      setAllKelasBasedOnSekolah(Array.from(new Set(allKelas)));

      // Filter the list of students based on the selected school
      const filteredMurid = allMuridD1SingleSekolah.filter(
        (murid) => murid.namaSekolah === selectedSekolah
      );

      // Set the state variable for the filtered list of students
      setFilteredMuridD1(filteredMurid);
    }
  }, [selectedSekolah]);

  useEffect(() => {
    if (selectedKelasBasedOnSekolah !== '') {
      // Filter the list of students based on the selected school and class
      const filteredMurid = allMuridD1SingleSekolah.filter(
        (murid) =>
          murid.namaSekolah === selectedSekolah &&
          murid.namaKelas === selectedKelasBasedOnSekolah
      );

      // Set the state variable for the filtered list of students
      setFilteredMuridD1(filteredMurid);
    }
  }, [selectedKelasBasedOnSekolah]);

  const props = {
    closeModalAndGoAway,
    closeModal,
    setShowModal,
    handleSubmit,
    users,
    selectedSekolah,
    selectedKelasBasedOnSekolah,
  };

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            DAFTAR MURID KOHORT TAHUN 1 PROGRAM KUMURAN BERFLOURIDA (PENTADBIR{' '}
            KP)
          </h5>
        </div>
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
        <form onSubmit={handleSubmit}>
          <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto mt-3'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='p-2'>
                    <input
                      type='checkbox'
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                    BIL.
                  </th>
                  <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                    NAMA
                  </th>
                  <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                    KOHORT FMR
                  </th>
                </tr>
              </thead>
              {!isLoading ? (
                <>
                  <tbody className='text-user1'>
                    {allMuridD1SingleSekolah
                      .filter((murid) => {
                        if (selectedSekolah === '') {
                          return murid;
                        } else {
                          if (selectedKelasBasedOnSekolah === '') {
                            return murid.namaSekolah === selectedSekolah;
                          } else {
                            return (
                              murid.namaSekolah === selectedSekolah &&
                              murid.namaKelas === selectedKelasBasedOnSekolah
                            );
                          }
                        }
                      })
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
                              <input
                                type='checkbox'
                                className='form-checkbox text-md'
                                checked={users[index].masukKohort}
                                onChange={(e) => handleCheckboxChange(e, index)}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </>
              ) : (
                <tbody className='text-user1'>
                  <tr>
                    <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                      Loading...
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
            <div className='flex justify-center items-center mt-3'>
              <button
                type='button'
                className='bg-user2 text-userWhite rounded-md px-3 py-1'
              >
                KEMBALI
              </button>
              <button
                type='button'
                onClick={() => setShowModal(true)}
                className='bg-user2 text-userWhite rounded-md px-3 py-1'
              >
                DAFTAR
              </button>
            </div>
          </div>
        </form>
        {showModal && <ModalDaftarMuridMasukKohortFMR {...props} />}
      </div>
    </>
  );
}
