import React, { useState } from 'react';

function Faq() {
  {
    /*Pendtabir*/
  }
  const [showSubPentadbir1, setShowSubPentadbir1] = useState(false);
  const [showSubJpentadbir1, setShowSubJpentadbir1] = useState(false);
  const [showAccordian1, setShowAccordian1] = useState(true);
  {
    /*Register*/
  }
  const [showSubRegister, setShowSubRegister] = useState(false);
  const [showSubRegister1, setShowSubRegister1] = useState(false);
  const [showSubAdmin2, setShowSubAdmin2] = useState(true);

  const [showSubAdmin3, setShowSubAdmin3] = useState(false);

  {
    /*Pengguna*/
  }

  return (
    <>
      {/*header*/}
      <div className='absolute top-0 left-0 right-0 grid grid-cols-1 md:grid-cols-2 grid-rows-1 items-center h-28 bg-user2 text-userWhite font-sans capitalize justify-evenly'>
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
        <div className='hidden md:grid grid-rows-2 text-2xl font-bold text-start'>
          <h1 className='row-span-2 mb-3'>Soalan Lazim</h1>
        </div>
      </div>
      {/* content */}
      <div className='absolute inset-0 -z-10 flex bg-[] text-center justify-center items-center capitalize'>
        <div className='w-5/6 lg:w-3/4 h-[25rem] mt-20 mb-5 bg-userWhite outline outline-1 outline-use rounded-md shadow-xl'>
          <div className='grid ml-auto mr-auto p-5'>
            <div className='justify-center items-center text-3 xl font-bold mt-7'>
              <h1>Soalan Lazim Gi-Ret 2.0</h1>
            </div>
            <p className='lg:hidden text-sm text-user6 mt-3'></p>
          </div>
          <div className='px-2'>
            <span
              className='flex text-sm text-kaunterWhite font-bold bg-user3 p-1 w-full capitalize cursor-pointer rounded-md '
              onClick={() => {
                setShowSubPentadbir1(!showSubPentadbir1);
              }}
            >
              MODUL PENTADBIR{' '}
            </span>
            <div
              className={`flex flex-col transition-all ${
                showSubPentadbir1
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-hidden'
              } `}
            >
              <span
                className='flex text-sm text-userBlackk font-bold mt-2 bg-user7 p-1 w-full capitalize cursor-pointer rounded-md '
                onClick={() => setShowSubPentadbir1(!setShowSubJpentadbir1)}
              >
                Soalan Pertama, apakah...{' '}
              </span>
              <article
                className={`flex mt-1 flex-row bg-user8 transition-all rounded-md ${
                  setShowSubJpentadbir1
                    ? 'max-h-20 overflow-y-auto'
                    : 'max-h-0 overflow-hidden'
                } `}
              >
                Jawapan Soalan Pertama
              </article>
            </div>

            <div
              className={`flex flex-col transition-all ${
                showAccordian1
                  ? 'max-h-full overflow-y-auto'
                  : 'max-h-0 overflow-hidden'
              } `}
            >
              <span
                className='flex text-sm text-kaunterWhite font-bold mt-2 bg-user3 p-1 w-full capitalize cursor-pointer rounded-md '
                onClick={() => setShowSubRegister(!showSubRegister)}
              >
                MODUL PENDAFTAR{' '}
              </span>
              <div
                className={`flex flex-col transition-all ${
                  showSubRegister
                    ? 'max-h-full overflow-y-auto'
                    : 'max-h-0 overflow-hidden'
                } `}
              >
                <span
                  className='flex text-sm text-userBlackk font-bold mt-2 bg-user7 p-1 w-full capitalize cursor-pointer rounded-md '
                  onClick={() => setShowSubRegister(!setShowSubRegister1)}
                >
                  Soalan Pertama, apakah...{' '}
                </span>
                <article
                  className={`flex mt-1 flex-row bg-user8 transition-all rounded-md ${
                    setShowSubRegister1
                      ? 'max-h-20 overflow-y-auto'
                      : 'max-h-0 overflow-hidden'
                  } `}
                >
                  Jawapan Soalan Pertama
                </article>
              </div>
            </div>
            <span
              className='flex text-sm text-kaunterWhite font-bold mt-2 bg-user3 p-1 w-full capitalize cursor-pointer rounded-md '
              onClick={() => {
                setShowSubAdmin2(!showSubAdmin2);
              }}
            >
              MODUL PENGGUNA{' '}
            </span>
            <article
              className='flex text-sm text-userBlackk font-bold mt-2 bg-user7 p-1 w-full capitalize cursor-pointer rounded-md '
              onClick={() => setShowSubAdmin3(!setShowSubAdmin3)}
            >
              Soalannya..
            </article>
            <div>
              <article
                className={`flex mt-1 flex-row bg-user4 transition-all rounded-md ${
                  setShowSubAdmin3
                    ? 'max-h-20 overflow-y-auto'
                    : 'max-h-0 overflow-hidden'
                } `}
              >
                Jawapannya
              </article>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Faq;
