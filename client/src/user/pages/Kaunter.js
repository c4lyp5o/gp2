import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import axios from 'axios';
import { useState } from 'react';

export default function Kaunter() {
  const [nama, setNama] = useState('');
  const [tarikhKedatangan, setTarikhKedatangan] = useState('');
  const [noPengenalan, setNoPengenalan] = useState('');
  const [tarikhLahir, setTarikhLahir] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
    const formUmum = new FormData();
    formUmum.append('nama', nama);
    formUmum.append('tarikhKedatangan', tarikhKedatangan);
    formUmum.append('noPengenalan', noPengenalan);
    formUmum.append('tarikhLahir', tarikhLahir);
    console.log(formUmum);
  };

  return (
    <>
      <UserHeader />
      <form onSubmit={handleSubmit} method='POST'>
        <div className='absolute inset-0 -z-10 bg-user5'></div>
        <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
          <div className='container px-10 h-full p-3 overflow-y-auto'>
            <strong>pendaftaran</strong>
            <br />
            <div className='text-right'>
              <p>tarikh kedatangan: </p>
              <input
                onChange={(e) => setTarikhKedatangan(e.event.target)}
                type='date'
                name='tarikhKedatangan'
                id='tarikhKedatangan'
              />
            </div>
            <div className='text-left'>
              <strong>nama: </strong>
              <input
                onChange={(e) => setNama(e.event.target)}
                type='text'
                name='namaUmum'
                id='namaUmum'
              />
            </div>
            <br />
            <div className='text-left'>
              <select name='pengenalan' id='pengenalan'>
                <option value=''>MyKad</option>
                <option value=''>Passport</option>
                <option value=''>tentera</option>
                <option value=''>polis</option>
                <option value=''>sijil lahir</option>
              </select>
              <input
                onChange={(e) => setNoPengenalan(e.event.target)}
                type='text'
                name='noPengenalan'
                id='noPengenalan'
              />
            </div>
            <br />
            <div className='text-left'>
              <p>tarikh lahir: </p>
              <input
                onChange={(e) => setTarikhLahir(e.event.target)}
                type='date'
                name='tarikhLahir'
                id='tarikhLahir'
              />
            </div>
            <button type='submit'>Submit</button>
          </div>
        </div>
      </form>
      <UserFooter />
    </>
  );
}
