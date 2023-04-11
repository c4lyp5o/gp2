import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function ListMuridFMR() {
  const { userToken, userinfo, reliefUserToken, masterDatePicker, toast } =
    useGlobalUserAppContext();

  const [allMuridD1, setAllMuridD1] = useState([]);
  const [allSekolah, setAllSekolah] = useState([]);
  const [allKelasBasedOnSekolah, setAllKelasBasedOnSekolah] = useState([]);

  const [selectedSekolah, setSelectedSekolah] = useState([]);
  const [selectedKelasBasedOnSekolah, setSelectedKelasBasedOnSekolah] =
    useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([{ noKp: '', masukKohort: true }]);
  const [startKumuran, setStartKumuran] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  //datepicker range
  const [startKumuranDatePicker, setStartKumuranDatePicker] = useState(null);

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
        'text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent mt-5',
    });
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    setUsers(
      allMuridD1.map((singleMurid) => ({
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

  const handleSubmit = (event) => {
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
    console.log(data);
    axios
      .post('/api/v1/kohort/fmr/daftar-kumuran', data, {
        headers: {
          Authorization: `Bearer ${
            reliefUserToken ? reliefUserToken : userToken
          }`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success('Berjaya');
      })
      .catch((err) => {
        console.log(err);
        toast.error('yada yada');
      });
  };

  useEffect(() => {
    const fetchAllMuridD1 = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/v1/kohort/fmr/query`, {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        });
        console.log(data);
        setAllMuridD1(data.allD1PelajarSekolah);
        const allSekolah = _.uniq(
          data.allD1PelajarSekolah.map((murid) => murid.namaSekolah)
        );
        setAllSekolah(allSekolah);
        setUsers(
          data.allD1PelajarSekolah.map((singleMurid) => ({
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
    fetchAllMuridD1();
  }, []);

  useEffect(() => {
    if (selectedSekolah === '') {
      console.log('resetting');
      setSelectedKelasBasedOnSekolah('');
    } else {
      const allKelasBasedOnSekolah = _.uniq(
        allMuridD1
          .filter((murid) => murid.namaSekolah === selectedSekolah)
          .map((murid) => murid.namaKelas)
      );
      setAllKelasBasedOnSekolah(allKelasBasedOnSekolah);
    }
  }, [selectedSekolah]);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            CARIAN MURID KOHORT PROGRAM KUMURAN BERFLOURIDA
          </h5>
        </div>
        <div className='grid grid-row-2 shadow-md shadow-user3 mt-5'>
          <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
            <div>
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
            <div>
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
          <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
            <div>
              <label className='flex mt-5'>
                <span className='font-semibold'>
                  Kohort (Tahun Mula Kumuran):
                </span>
                <select className='ml-2'>
                  <option value=''>Sila pilih kohort</option>
                  <option value=''>2021</option>
                  <option value=''>2020</option>
                  <option value=''>2019</option>
                  <option value=''>2018</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-2'>
            <div>
              <label className='flex mt-5'>
                <span className='font-semibold'>Tarikh Kumuran:</span>
              </label>
            </div>
            <div>
              <TarikhKumuran />
            </div>
          </div>
          <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto mt-3'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th>
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
                    {allMuridD1
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
                type='submit'
                className='bg-user2 text-userWhite rounded-md px-3 py-1'
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
