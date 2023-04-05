import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../../context/userAppContext';

export default function ListMuridFMR() {
  const { userToken, userinfo, reliefUserToken, toast } =
    useGlobalUserAppContext();

  const { singleSekolahId } = useParams();

  const [allMuridD1, setAllMuridD1] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [users, setUsers] = useState([{ noKp: '', masukKohort: true }]);

  const [isLoading, setIsLoading] = useState(true);

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
  };

  useEffect(() => {
    const fetchAllMuridD1 = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/kohort/fmr/query/${singleSekolahId}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        // console.log(data);
        setAllMuridD1(data.allD1Students);
        setUsers(
          data.allD1Students.map((singleMurid) => ({
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

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <h5 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
            DAFTAR MURID KOHORT TAHUN 1 PROGRAM KUMURAN FLORIDA (PENTADBIR KP)
          </h5>
        </div>
        <div className='grid grid-cols-2 shadow-md shadow-user3 mt-5'>
          <div>
            <label className='flex justify-center items-center'>
              <span className='font-semibold'>CARI MURID:</span>
              <select className='ml-2'>
                <option value='nama'>NAMA</option>
                <option value='nokp'>NO KP</option>
              </select>
            </label>
          </div>
          <div>
            <label className='flex justify-center items-center'>
              <span className='font-semibold'>KELAS:</span>
              <select className='ml-2'>
                <option value='nama'>NAMA</option>
                <option value='nokp'>NO KP</option>
              </select>
            </label>
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
                  {allMuridD1.map((singleMurid, index) => {
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
        </div>
      </div>
    </>
  );
}
