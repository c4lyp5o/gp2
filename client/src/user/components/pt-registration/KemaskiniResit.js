import { useState, useEffect } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';
import {
  FaWindowClose,
  FaMoneyCheckAlt,
  FaPlusCircle,
  FaMinusCircle,
} from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function KemaskiniResit({ setShowKemaskiniResit, editId }) {
  const { kaunterToken, toast } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [jenisFasiliti, setJenisFasiliti] = useState('');
  const [noBayaran, setNoBayaran] = useState('');
  const [noResit, setNoResit] = useState('');
  const [tambahBayaran, setTambahBayaran] = useState(true);
  const [noBayaran2, setNoBayaran2] = useState('');
  const [noResit2, setNoResit2] = useState('');
  const [tambahBayaran2, setTambahBayaran2] = useState(true);
  const [noBayaran3, setNoBayaran3] = useState('');
  const [noResit3, setNoResit3] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await toast
      .promise(
        axios.patch(
          `/api/v1/kaunter/${editId}`,
          {
            noBayaran,
            noResit,
            noBayaran2,
            noResit2,
            noBayaran3,
            noResit3,
            catatan,
          },
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        ),
        {
          pending: 'Mengemaskini...',
          success: 'Berjaya dikemaskini',
          error: 'Gagal dikemaskini',
        },
        { autoClose: 2000 }
      )
      .then(() => {
        setIsSubmitting(false);
        setShowKemaskiniResit(false);
      });
  };

  useEffect(() => {
    const fetchPersonKaunter = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/api/v1/kaunter/${editId}`, {
          headers: { Authorization: `Bearer ${kaunterToken}` },
        });
        setJenisFasiliti(data.singlePersonKaunter.jenisFasiliti);
        setNoBayaran(data.singlePersonKaunter.noBayaran);
        setNoResit(data.singlePersonKaunter.noResit);
        setNoBayaran2(data.singlePersonKaunter.noBayaran2);
        setNoResit2(data.singlePersonKaunter.noResit2);
        setNoBayaran3(data.singlePersonKaunter.noBayaran3);
        setNoResit3(data.singlePersonKaunter.noResit3);
        setCatatan(data.singlePersonKaunter.catatan);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        toast.error(
          'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: kaunter-kemaskiniresit'
        );
      }
    };
    fetchPersonKaunter();
  }, []);

  return (
    <>
      <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-7 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          onClick={() => setShowKemaskiniResit(false)}
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
        />
        <h5 className='bg-kaunter1 text-userWhite font-semibold text-lg'>
          KEMASKINI NO. RESIT & CATATAN
        </h5>
        {!isLoading && (
          <form onSubmit={handleSubmit}>
            <div className='pt-1 px-5'>
              {jenisFasiliti === 'kp' ||
              jenisFasiliti === 'projek-komuniti-lain' ? (
                <div>
                  <>
                    <div className='flex flex-row justify-start mt-3'>
                      Bayaran pendaftaran:
                    </div>
                    <div className='flex flex-row justify-start'>
                      <div
                        className='relative w-20 my-2'
                        title='Bayaran dalam RM'
                      >
                        <CurrencyFormat
                          value={noBayaran}
                          thousandSeparator={true}
                          prefix={'RM '}
                          name='no-bayaran'
                          id='no-bayaran'
                          placeholder=' '
                          decimalScale={0}
                          className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                          onChange={(e) => {
                            setNoBayaran(e.target.value);
                          }}
                        />
                        <label
                          htmlFor='no-bayaran'
                          className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                        >
                          Bayaran
                        </label>
                      </div>
                      <div
                        className='relative w-full md:w-60 my-2'
                        title='No. Resit'
                      >
                        <input
                          type='text'
                          name='no-resit'
                          id='no-resit'
                          placeholder=' '
                          value={noResit}
                          onChange={(e) => {
                            setNoResit(e.target.value);
                          }}
                          className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                        />
                        <label
                          htmlFor='no-resit'
                          className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                        >
                          No. Resit
                        </label>
                        <span>
                          <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                        </span>
                      </div>
                      {tambahBayaran2 === false ? (
                        <span className='text-lg md:text-2xl flex items-center ml-1'>
                          {tambahBayaran ? (
                            <FaMinusCircle
                              className='text-kaunter3 cursor-pointer'
                              onClick={() => {
                                setTambahBayaran(false);
                              }}
                            />
                          ) : (
                            <FaPlusCircle
                              className='text-kaunter3 cursor-pointer'
                              onClick={() => {
                                setTambahBayaran(true);
                              }}
                            />
                          )}
                        </span>
                      ) : (
                        <span className='text-lg md:text-2xl flex items-center ml-1'>
                          <FaMinusCircle className='text-kaunter3' />
                        </span>
                      )}
                    </div>
                  </>
                  {tambahBayaran && (
                    <>
                      <div className='flex flex-row justify-start mt-3'>
                        Bayaran rawatan:
                      </div>
                      <div className='flex flex-row justify-start'>
                        <div
                          className='relative w-20 my-2'
                          title='Bayaran dalam RM'
                        >
                          <CurrencyFormat
                            value={noBayaran2}
                            thousandSeparator={true}
                            prefix={'RM '}
                            name='no-bayaran-2'
                            id='no-bayaran-2'
                            placeholder=' '
                            decimalScale={0}
                            className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                            onChange={(e) => {
                              setNoBayaran2(e.target.value);
                            }}
                          />
                          <label
                            htmlFor='no-bayaran-2'
                            className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                          >
                            Bayaran
                          </label>
                        </div>
                        <div
                          className='relative w-full md:w-60 my-2'
                          title='No. Resit'
                        >
                          <input
                            type='text'
                            name='no-resit-2'
                            id='no-resit-2'
                            placeholder=' '
                            value={noResit2}
                            onChange={(e) => {
                              setNoResit2(e.target.value);
                            }}
                            className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                          />
                          <label
                            htmlFor='no-resit-2'
                            className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                          >
                            No. Resit
                          </label>
                          <span>
                            <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                          </span>
                        </div>
                        <span className='text-lg md:text-2xl flex items-center ml-1'>
                          {tambahBayaran2 ? (
                            <FaMinusCircle
                              className='text-kaunter3 cursor-pointer'
                              onClick={() => {
                                setTambahBayaran2(false);
                              }}
                            />
                          ) : (
                            <FaPlusCircle
                              className='text-kaunter3 cursor-pointer'
                              onClick={() => {
                                setTambahBayaran2(true);
                              }}
                            />
                          )}
                        </span>
                      </div>
                    </>
                  )}
                  {tambahBayaran2 && (
                    <>
                      <div className='flex flex-row justify-start mt-3'>
                        Bayaran tambahan:
                      </div>
                      <div className='flex flex-row justify-start'>
                        <div
                          className='relative w-20 my-2'
                          title='Bayaran dalam RM'
                        >
                          <CurrencyFormat
                            value={noBayaran3}
                            thousandSeparator={true}
                            prefix={'RM '}
                            name='no-bayaran-3'
                            id='no-bayaran-3'
                            placeholder=' '
                            decimalScale={0}
                            className='appearance-none w-20 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-l-md peer'
                            onChange={(e) => {
                              setNoBayaran3(e.target.value);
                            }}
                          />
                          <label
                            htmlFor='no-bayaran-3'
                            className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                          >
                            Bayaran
                          </label>
                        </div>
                        <div
                          className='relative w-full md:w-60 my-2'
                          title='No. Resit'
                        >
                          <input
                            type='text'
                            name='no-resit-3'
                            id='no-resit-3'
                            placeholder=' '
                            value={noResit3}
                            onChange={(e) => {
                              setNoResit3(e.target.value);
                            }}
                            className='appearance-none w-full md:w-60 leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-r-md peer'
                          />
                          <label
                            htmlFor='no-resit-3'
                            className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                          >
                            No. Resit
                          </label>
                          <span>
                            <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
              <div
                className='relative w-full mt-5'
                title='No. Slip Cuti Sakit/Lain-lain Catatan Penting'
              >
                <input
                  type='text'
                  name='catatan'
                  id='catatan'
                  placeholder=' '
                  value={catatan}
                  onChange={(e) => {
                    setCatatan(e.target.value);
                  }}
                  className='appearance-none w-full leading-7 px-3 py-1 ring-2 ring-kaunter3 focus:ring-2 focus:ring-kaunter2 focus:outline-none rounded-md peer'
                />
                <label
                  htmlFor='catatan'
                  className='absolute left-3 bottom-7 text-xs text-kaunter1 bg-userWhite peer-placeholder-shown:text-kaunter3 peer-placeholder-shown:bottom-1.5 peer-placeholder-shown:text-base peer-focus:bottom-7 peer-focus:text-xs transition-all duration-500'
                >
                  Lain-lain
                </label>
                <span>
                  <FaMoneyCheckAlt className='absolute top-3 right-2 text-kaunter3' />
                </span>
              </div>
            </div>
            <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
              {isSubmitting ? (
                <button
                  type='button'
                  className='capitalize bg-kaunter3 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
                  disabled
                >
                  <svg
                    className='animate-spin ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Menyemak...
                </button>
              ) : (
                <button
                  type='submit'
                  className='capitalize bg-kaunter1 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-kaunter2 transition-all'
                >
                  YA
                </button>
              )}
              <span
                onClick={() => setShowKemaskiniResit(false)}
                className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 hover:cursor-pointer transition-all'
              >
                Tidak
              </span>
            </div>
          </form>
        )}
        {isLoading && (
          <div className='mt-10'>
            <Spinner />
          </div>
        )}
      </div>
      <div
        onClick={() => setShowKemaskiniResit(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}
