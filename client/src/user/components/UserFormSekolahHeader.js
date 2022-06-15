import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Pendaftaran from './form-sekolah/Pendaftaran';
import PemeriksaanAwal from './form-sekolah/PemeriksaanAwal';

function UserFormSekolah() {

  return (
    <>
      <div className="container px-10 h-full p-3 overflow-y-auto">
        <div className="p-2">
          <article className="outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2">
            <div className="">
              <div>
                <h1 className="text-l font-bold flex flex-row pl-5 pt-5">
                  BASIC DEMOGRAFIK
                </h1>
                <div className="text-s flex flex-row pl-5">
                  <h2 className="font-semibold">NAMA:</h2>
                  <p className="">izzuddin</p>
                </div>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">JANTINA:</h2>
                  <p>Lelaki</p>
                </div>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">UMUR:</h2>
                  <p>28</p>
                </div>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">NO IC:</h2>
                  <p>123456-10-7891</p>
                </div>
              </div>
            </div>
            <div className='md:pt-10'>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">NAMA SEKOLAH:</h2>
                  <p className='flex flex-row'>SEKOLAH SERI HOGWART</p>
                </div>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">DARJAH/TINGKATAN:</h2>
                  <p>1</p>
                </div>
                <div className=" text-s flex flex-row pl-5">
                  <h2 className="font-semibold">KELAS:</h2>
                  <p>1 ARIF</p>
                </div>
            </div>
          </article>
        </div>
        <Pendaftaran />
        {/* <PemeriksaanAwal /> */}
      </div>
    </>
  );
}

export default UserFormSekolah;
