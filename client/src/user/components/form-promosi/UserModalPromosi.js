import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserModalPromosiConfirmation from '../UserModalPromosiConfirmation';

function UserModalPromosi({
  individuOrKlinik,
  setShowTambahAcara,
  kodProgram,
  toast,
}) {
  const { userToken, reliefUserToken, username, userinfo, masterDatePicker } =
    useGlobalUserAppContext();

  const [namaAcara, setNamaAcara] = useState('');
  const [tarikhMula, setTarikhMula] = useState('');
  const [tarikhAkhir, setTarikhAkhir] = useState('');
  const [lokasi, setLokasi] = useState('');

  // datepicker issues
  const [tarikhMulaDP, setTarikhMulaDP] = useState(null);
  const [tarikhAkhirDP, setTarikhAkhirDP] = useState(null);

  const confirmProps = {
    kodProgram,
    namaAcara,
    tarikhMula,
    tarikhAkhir,
    lokasi,
  };

  const TarikhMula = () => {
    return masterDatePicker({
      selected: tarikhMulaDP,
      selectsStart: true,
      startDate: tarikhMulaDP,
      endDate: tarikhAkhirDP,
      required: true,
      onChange: (tarikhMula) => {
        const tempDate = moment(tarikhMula).format('YYYY-MM-DD');
        setTarikhMula(tempDate);
        setTarikhMulaDP(tarikhMula);
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selected: tarikhAkhirDP,
      selectsEnd: true,
      startDate: tarikhMulaDP,
      endDate: tarikhAkhirDP,
      minDate: tarikhMulaDP,
      required: true,
      onChange: (tarikhAkhir) => {
        const tempDate = moment(tarikhAkhir).format('YYYY-MM-DD');
        setTarikhAkhir(tempDate);
        setTarikhAkhirDP(tarikhAkhir);
      },
      className:
        'appearance-none w-36 text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row',
    });
  };

  // reset tarikhAkhir if change tarikhMula
  useEffect(() => {
    setTarikhAkhir('');
    setTarikhAkhirDP(null);
  }, [tarikhMula]);

  const closeModal = () => {
    setShowTambahAcara(false);
  };

  const handleSubmit = async (e) => {
    let mdcMdtbNum;
    if (!userinfo.mdcNumber) {
      mdcMdtbNum = userinfo.mdtbNumber;
    }
    if (!userinfo.mdtbNumber) {
      mdcMdtbNum = userinfo.mdcNumber;
    }

    let promosiIndividu = false;
    let promosiKlinik = false;
    if (individuOrKlinik === 'promosi-individu') {
      promosiIndividu = true;
      promosiKlinik = false;
    }
    if (individuOrKlinik === 'promosi-klinik') {
      promosiIndividu = false;
      promosiKlinik = true;
    }

    await toast
      .promise(
        axios.post(
          '/api/v1/promosi/aktiviti',
          {
            createdByUsername: username,
            createdByMdcMdtb: mdcMdtbNum,
            promosiIndividu,
            promosiKlinik,
            //modal promosi
            kodProgram,
            namaAcara,
            tarikhMula,
            tarikhAkhir,
            lokasi,
          },
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        ),
        {
          pending: 'Menambah acara...',
          success: 'Acara berjaya ditambah',
          error: 'Acara gagal ditambah',
        },
        {
          autoClose: 2000,
        }
      )
      .then(() => {
        closeModal();
      });
  };

  return (
    <>
      <div className='absolute inset-10 lg:inset-x-80 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <div className='sticky top-0 z-50'>
          <FaWindowClose
            onClick={closeModal}
            className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user6 transition-all'
          />
          <h1 className='bg-user3 text-userWhite font-semibold text-xl'>
            tambah acara
          </h1>
        </div>
        <UserModalPromosiConfirmation
          data={confirmProps}
          callbackFunction={handleSubmit}
        >
          {(confirm) => (
            <form onSubmit={confirm(handleSubmit)}>
              <div className='grid gap-3 mt-7'>
                <div className='flex m-auto'>
                  <p className='mr-1'>acara bagi kod program :</p>
                  <p>{kodProgram}</p>
                </div>
                <div className='flex m-auto'>
                  <label htmlFor='nama-acara' className='mt-4'>
                    nama acara :{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <input
                    required
                    type='text'
                    id='nama-acara'
                    name='nama-acara'
                    value={namaAcara}
                    onChange={(e) => {
                      setNamaAcara(e.target.value);
                    }}
                    className='my-3 ml-4 appearance-none leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none rounded-md peer'
                  />
                </div>
                <div className='flex m-auto'>
                  <label
                    htmlFor='tarikh-mula'
                    className='whitespace-nowrap mr-3'
                  >
                    tarikh mula :{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <TarikhMula />
                </div>
                <div className='flex m-auto'>
                  <label
                    htmlFor='tarikh-akhir'
                    className='whitespace-nowrap mr-3'
                  >
                    tarikh akhir :{' '}
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <TarikhAkhir />
                </div>
                <div>
                  <label htmlFor='lokasi'>
                    lokasi : <span className='font-semibold text-user6'>*</span>
                  </label>
                  <select
                    required
                    name='lokasi'
                    id='lokasi'
                    value={lokasi}
                    onChange={(e) => {
                      setLokasi(e.target.value);
                    }}
                    className='w-1/2 my-3 ml-2 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
                  >
                    <option value=''>Sila pilih lokasi..</option>
                    <option value='hospital'>Hospital</option>
                    <option value='klinik'>Klinik</option>
                    <option value='kawasan-awam'>Kawasan awam</option>
                  </select>
                </div>
                <div className='absolute bottom-0 right-0 left-0 m-2 mx-10'>
                  <button
                    type='submit'
                    className='uppercase w-1/3 m-auto bg-user3 text-base text-userWhite rounded-md shadow-md p-2 hover:bg-user1 transition-all'
                  >
                    tambah
                  </button>
                </div>
              </div>
            </form>
          )}
        </UserModalPromosiConfirmation>
      </div>
      <div
        onClick={closeModal}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}

export default UserModalPromosi;
