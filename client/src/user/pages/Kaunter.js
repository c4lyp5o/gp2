import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';
import axios from 'axios';
import { useRef } from 'react';

export default function Kaunter() {
  const form = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    axios
      .post('/api/v1/kaunter/postdata', formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <UserHeader />
      <form ref={form} onSubmit={handleSubmit} encType='multipart/form-data'>
        <div className='absolute inset-0 -z-10 bg-user5'></div>
        <div className='absolute inset-10 top-44 -z-10 bg-userWhite text-center justify-center items-center outline outline-1 outline-userBlack rounded-md shadow-xl capitalize'>
          <div className='container px-10 h-full p-3 overflow-y-auto'>
            <strong>pendaftaran</strong>
            <br />
            <div className='text-right'>
              <p>tarikh kedatangan: </p>
              <input
                // onChange={(e) => setTarikhKedatangan(e.target.value)}
                required
                type='date'
                name='tarikhKedatangan'
              />
            </div>
            <div className='text-left'>
              <strong>nama: </strong>
              <input
                // onChange={(e) => setNama(e.target.value)}
                type='text'
                name='namaUmum'
              />
            </div>
            <br />
            <div className='text-left'>
              <select name='pengenalan' id='pengenalan'>
                <option value='mykad'>MyKad</option>
                <option value='passport'>Passport</option>
                <option value='tentera'>tentera</option>
                <option value='polis'>polis</option>
                <option value='sijil'>sijil lahir</option>
              </select>
              <input
                // onChange={(e) => setIc(e.target.value)}
                type='text'
                name='ic'
              />
            </div>
            <br />
            <div className='text-left'>
              <p>tarikh lahir: </p>
              <input
                // onChange={(e) => setTarikhLahir(e.target.value)}
                type='date'
                name='tarikhLahir'
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
