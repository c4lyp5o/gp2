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
  const [checkboxStates, setCheckboxStates] = useState(null);

  const [users, setUsers] = useState([{ nomborId: '', masukKohort: true }]);

  const [filteredMuridD1, setFilteredMuridD1] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const init = useRef(false);

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    setCheckboxStates((prevStates) => {
      const updatedStates = { ...prevStates };
      allMuridD1SingleSekolah.forEach((singleMurid) => {
        updatedStates[singleMurid.nomborId] = isChecked;
      });
      return updatedStates;
    });
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
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
      return updatedUsers;
    });
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
      closeModal();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeModalAndGoAway = () => {
    setShowModal(false);
    navigate('/pengguna/landing/kohort/fmr');
  };

  const props = {
    closeModalAndGoAway,
    closeModal,
    setShowModal,
    handleSubmit,
    users,
    selectedSekolah,
    selectedKelasBasedOnSekolah,
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
        const namaSekolah = data.dataSemuaPelajarD1SingleSekolah[0].namaSekolah;
        const namaKelas = _.uniq(
          data.dataSemuaPelajarD1SingleSekolah.map(
            (murid) => murid.kelasPelajar
          )
        );
        setSelectedSekolah(namaSekolah);
        setAllKelasBasedOnSekolah(namaKelas);
        setUsers(
          data.dataSemuaPelajarD1SingleSekolah.map((singleMurid) => ({
            ...singleMurid,
            masukKohort: false,
          }))
        );
        setCheckboxStates(
          Object.fromEntries(
            data.dataSemuaPelajarD1SingleSekolah.map((singleMurid) => [
              singleMurid.id,
              singleMurid.masukKohort,
            ])
          )
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
    if (selectedKelasBasedOnSekolah !== '') {
      console.log(selectedKelasBasedOnSekolah);
      const filteredMurid = allMuridD1SingleSekolah.filter(
        (murid) =>
          // murid.namaSekolah === selectedSekolah &&
          murid.kelasPelajar === selectedKelasBasedOnSekolah
      );
      setFilteredMuridD1(filteredMurid);
    }
  }, [selectedKelasBasedOnSekolah]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            DAFTAR MURID KOHORT TAHUN 1 PROGRAM KUMURAN BERFLOURIDA (PENTADBIR{' '}
            KP)
          </h5>
        </div>
        <div className='flex flex-auto shadow-md shadow-user3 mt-5'>
          {/* <div className='m-5'>
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
          </div> */}
          <div className='m-5'>
            <label className='flex justify-center items-center'>
              <span className='font-semibold'>KELAS:</span>
              <select
                className='ml-2'
                onChange={(event) =>
                  setSelectedKelasBasedOnSekolah(event.target.value)
                }
              >
                <option value=''>Semua Kelas</option>
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
        <div className='m-auto overflow-x-auto overflow-y-hidden text-xs lg:text-sm rounded-md h-min max-w-max mt-5'>
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
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  BIL.
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-96 max-w-md'>
                  NAMA
                </th>
                <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                  KOHORT FMR
                </th>
              </tr>
            </thead>
            {!isLoading ? (
              <>
                <tbody className='bg-user4'>
                  {allMuridD1SingleSekolah
                    .filter((murid) => {
                      // if (selectedSekolah === '') {
                      //   return murid;
                      // } else {
                      if (selectedKelasBasedOnSekolah === '') {
                        return murid;
                      } else {
                        return (
                          // murid.namaSekolah === selectedSekolah &&
                          murid.kelasPelajar === selectedKelasBasedOnSekolah
                        );
                      }
                      // }
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
              <tbody className='text-user1'>
                <tr>
                  <td className='outline outline-1 outline-offset-1 px-2 py-1'>
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
          </table>
          <div className='grid grid-cols-2 gap-2 justify-center items-center mt-3'>
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
              DAFTAR
            </button>
          </div>
        </div>
        {showModal && <ModalDaftarMuridMasukKohortFMR {...props} />}
      </div>
    </>
  );
}
