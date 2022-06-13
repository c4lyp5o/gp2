import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserPilihFasiliti() {
  const {
    userToken,
    setFasilitiRelief,
    setDisplayLoginForm,
    setDisplayPilihNama,
    setDisplayPilihFasiliti,
    navigate,
  } = useGlobalUserAppContext();

  const [listPilihFasiliti, setListPilihFasiliti] = useState([]);
  const pilihanFasiliti = useRef(null);

  useEffect(() => {
    const fetchPilihFasiliti = async () => {
      try {
        const { data } = await axios.get('/api/v1/pilih/fasiliti', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setListPilihFasiliti(data.fasilitis);
      } catch (error) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        navigate('/');
      }
    };
    fetchPilihFasiliti();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(pilihanFasiliti.current.value);
  };

  return (
    <>
      <h3 className='text-xl font-semibold mt-10'>
        pilih fasiliti relief anda
      </h3>
      <form onSubmit={handleSubmit}>
        <select
          ref={pilihanFasiliti}
          className='mt-12 leading-7 px-3 py-1 capitalize ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-xl hover:cursor-pointer'
          required
        >
          {listPilihFasiliti.map((singleFasiliti, index) => {
            return (
              <option key={index} value={`${singleFasiliti.nama}`}>
                {singleFasiliti.nama}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <button
          type='submit'
          className='capitalize bg-user3 text-userWhite rounded-md shadow-xl px-5 py-2 hover:bg-user1 transition-all'
        >
          pilih
        </button>
      </form>
    </>
  );
}

export default UserPilihFasiliti;
