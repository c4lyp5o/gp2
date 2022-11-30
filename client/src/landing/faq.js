import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

function Faq() {
  // Pentadbir
  const [showPentadbir, setShowPentadbir] = useState(false);
  const [showSubPentadbir1, setShowSubPentadbir1] = useState(false);
  const [showSubPentadbir2, setShowSubPentadbir2] = useState(false);
  const [showSubPentadbir3, setShowSubPentadbir3] = useState(false);
  const [showSubPentadbir4, setShowSubPentadbir4] = useState(false);
  const [showSubPentadbir5, setShowSubPentadbir5] = useState(false);
  const [showSubPentadbir6, setShowSubPentadbir6] = useState(false);
  const [showSubPentadbir7, setShowSubPentadbir7] = useState(false);
  const [showSubPentadbir8, setShowSubPentadbir8] = useState(false);
  const [showSubPentadbir9, setShowSubPentadbir9] = useState(false);
  const [showSubPentadbir10, setShowSubPentadbir10] = useState(false);

  // Register
  const [showPendaftaran, setShowPendaftaran] = useState(false);
  const [showSubPendaftaran1, setShowSubPendaftaran1] = useState(false);
  const [showSubPendaftaran2, setShowSubPendaftaran2] = useState(false);
  const [showSubPendaftaran3, setShowSubPendaftaran3] = useState(false);
  const [showSubPendaftaran4, setShowSubPendaftaran4] = useState(false);

  // Pengguna
  const [showPengguna, setShowPengguna] = useState(false);
  const [showSubPengguna1, setShowSubPengguna1] = useState(false);
  const [showSubPengguna2, setShowSubPengguna2] = useState(false);
  const [showSubPengguna3, setShowSubPengguna3] = useState(false);
  const [showSubPengguna4, setShowSubPengguna4] = useState(false);

  // unUsed
  const [showUnused, setShowUnused] = useState(true);

  return (
    <>
      {/*header*/}
      <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-[#2c3e50] text-userWhite font-sans capitalize justify-evenly'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='grid grid-rows-[50px_10px_10px] md:gap-1 text-center col-start-1 md:col-start-2 md:justify-end'>
            <img
              className='w-full h-full'
              src='https://upload.wikimedia.org/wikipedia/commons/9/94/Jata_MalaysiaV2.svg'
              alt='missing jata negara'
            />
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              kementerian kesihatan malaysia
            </p>
            <p className='uppercase text-[0.55rem] lg:text-[0.65rem]'>
              program kesihatan pergigian
            </p>
            <h1 className='md:hidden text-lg font-semibold'>Soalan Lazim</h1>
          </div>
        </div>
        <div className='hidden md:grid grid-rows-2 text-3xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>Soalan Lazim</h1>
        </div>
      </div>
      {/* content */}
      <div className='absolute inset-0 -z-10 flex bg-user5 text-center justify-center items-center capitalize'>
        <div className='w-full h-4/6 md:h-3/4 mx-2 mt-24 bg-userWhite outline outline-1 outline-use rounded-md shadow-xl overflow-auto'>
          <div className='grid'>
            <div className='justify-center items-center text-xl font-bold mt-7'>
              <h1>Soalan Lazim Gi-Ret 2.0</h1>
            </div>
            <p className='lg:hidden text-sm text-user6 mt-3'></p>
          </div>
          <div className='px-2 grid grid-cols-3'>
            {/* tajuk modul */}
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-admin2 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md'
                onClick={() => {
                  setShowPentadbir(!showPentadbir);
                  setShowPendaftaran(false);
                  setShowPengguna(false);
                  setShowUnused(false);
                }}
              >
                PENTADBIR
              </button>
            </div>
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-kaunter1 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md '
                onClick={() => {
                  setShowPendaftaran(!showPendaftaran);
                  setShowPentadbir(false);
                  setShowPengguna(false);
                  setShowUnused(false);
                }}
              >
                PANDAFTARAN
              </button>
            </div>
            <div>
              <button
                className='flex text-kaunterWhite text-sm lg:text-lg font-semibold justify-center bg-user2 bg-opacity-70 active:bg-opacity-100 focus:bg-opacity-100 hover:bg-opacity-100 p-1 w-full capitalize cursor-pointer rounded-t-md '
                onClick={() => {
                  setShowPengguna(!showPengguna);
                  setShowPentadbir(false);
                  setShowPendaftaran(false);
                  setShowUnused(false);
                }}
              >
                PENGGUNA
              </button>
            </div>
            {/* modul pentadbir */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-admin5 bg-opacity-70 rounded-b-md ${
                showPentadbir
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir1(!showSubPentadbir1);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 1
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  jlklllllllllllllllllllllllllllllllllllllllllksdlkjaspdjsapdaslkdjaslkdjpkjdksljd
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir2(!showSubPentadbir2);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 2
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir3(!showSubPentadbir3);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 3
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir4(!showSubPentadbir4);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                  }}
                >
                  {showSubPentadbir4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 4
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              {/* copy starts here */}
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir5(!showSubPentadbir5);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                  }}
                >
                  {showSubPentadbir5 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 5
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir5
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 5......
                </p>
              </article>
              {/* copy ends here*/}
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir6(!showSubPentadbir6);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                  }}
                >
                  {showSubPentadbir6 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 6
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir6
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 6......
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir7(!showSubPentadbir7);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                  }}
                >
                  {showSubPentadbir7 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 7
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir7
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 7......
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir8(!showSubPentadbir8);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                  }}
                >
                  {showSubPentadbir8 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 8
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir8
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 8......
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir9(!showSubPentadbir9);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                    setShowSubPentadbir8(false);
                  }}
                >
                  {showSubPentadbir9 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 9
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir9
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 9......
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-admin1 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPentadbir10(!showSubPentadbir10);
                    setShowSubPentadbir1(false);
                    setShowSubPentadbir2(false);
                    setShowSubPentadbir3(false);
                    setShowSubPentadbir4(false);
                    setShowSubPentadbir5(false);
                    setShowSubPentadbir6(false);
                    setShowSubPentadbir7(false);
                    setShowSubPentadbir8(false);
                    setShowSubPentadbir9(false);
                  }}
                >
                  {showSubPentadbir10 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 10
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPentadbir10
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  }`}
                >
                  Jawapan soalan 10......
                </p>
              </article>
            </article>
            {/* modul pendaftaran */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-kaunter3 bg-opacity-70 rounded-b-md ${
                showPendaftaran
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran1(!showSubPendaftaran1);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 1
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  jlklllllllllllllllllllllllllllllllllllllllllksdlkjaspdjsapdaslkdjaslkdjpkjdksljd
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran2(!showSubPendaftaran2);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran3(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 2
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran3(!showSubPendaftaran3);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran4(false);
                  }}
                >
                  {showSubPendaftaran3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 3
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-kaunter2 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPendaftaran4(!showSubPendaftaran4);
                    setShowSubPendaftaran1(false);
                    setShowSubPendaftaran2(false);
                    setShowSubPendaftaran3(false);
                  }}
                >
                  {showSubPendaftaran4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 4
                </span>
                <p
                  className={`flex flex-row transition-all bg-admin5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPendaftaran4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
            </article>
            {/* modul pengguna */}
            <article
              className={`flex flex-col transition-all col-span-3 bg-user5 bg-opacity-70 rounded-b-md ${
                showPengguna
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna1(!showSubPengguna1);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                  }}
                >
                  {showSubPengguna1 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 1
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna1
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  jlklllllllllllllllllllllllllllllllllllllllllksdlkjaspdjsapdaslkdjaslkdjpkjdksljd
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna2(!showSubPengguna2);
                    setShowSubPengguna1(false);
                    setShowSubPengguna3(false);
                    setShowSubPengguna4(false);
                  }}
                >
                  {showSubPengguna2 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 2
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna2
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna3(!showSubPengguna3);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna4(false);
                  }}
                >
                  {showSubPengguna3 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 3
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna3
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
              <article className='my-1'>
                <span
                  className='flex text-xs lg:text-base items-center text-adminWhite font-bold bg-user3 pl-3 p-1 w-full capitalize cursor-pointer'
                  onClick={() => {
                    setShowSubPengguna4(!showSubPengguna4);
                    setShowSubPengguna1(false);
                    setShowSubPengguna2(false);
                    setShowSubPengguna3(false);
                  }}
                >
                  {showSubPengguna4 ? (
                    <FaMinus className='pt-1' />
                  ) : (
                    <FaPlus className='pt-1' />
                  )}
                  Soalan 4
                </span>
                <p
                  className={`flex flex-row transition-all bg-user5 pl-3 text-xs lg:text-base font-normal ${
                    showSubPengguna4
                      ? 'max-h-full overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  apapapa huhu
                </p>
              </article>
            </article>
            <article
              className={`flex flex-col transition-all col-span-3 bg-user5 bg-opacity-70 rounded-b-md ${
                showUnused ||
                (showPentadbir === false &&
                  showPendaftaran === false &&
                  showPengguna === false)
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-y-hidden'
              } `}
            >
              <p className='text-xl font-thin'>
                sila pilih modul yang dikehendaki
              </p>
            </article>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className='absolute bottom-0 left-0 right-0 grid grid-cols-2 bg-[#95a5a6] uppercase'>
        <p className='text-left ml-1 my-1 text-xs'>hak cipta kkm</p>
        <p className='text-right mr-1 my-1 text-xs whitespace-nowrap overflow-x-auto'>
          <a
            className='text-admin2 underline'
            href='https://forms.gle/v9P7w9qweTX86Nxn8'
          >
            bantuan perkhidmatan: borang maklumbalas
          </a>
        </p>
      </div>
    </>
  );
}
export default Faq;
