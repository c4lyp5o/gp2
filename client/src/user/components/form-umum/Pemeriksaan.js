import { useEffect, useState } from 'react';
import { FaInfoCircle, FaCaretDown, FaClock } from 'react-icons/fa';
import moment from 'moment';
import Datetime from 'react-datetime';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function Pemeriksaan(props) {
  const { dateToday, formatTime, dictionaryJenisFasiliti } =
    useGlobalUserAppContext();

  const [show, setShow] = useState(false);
  let isDisabled = false;
  if (
    props.statusReten === 'telah diisi' ||
    props.statusReten === 'reten salah' ||
    props.singlePersonUmum.rawatanDibuatOperatorLain === true
  ) {
    isDisabled = true;
  }

  // calculate duration waktu menunggu
  const durationTime = (time1, time2) => {
    const duration = moment(time2, 'HH:mm').diff(
      moment(time1, 'HH:mm'),
      'minutes'
    );
    return duration;
  };

  useEffect(() => {
    if (
      props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
      'tidak-sedia-ada-status-denture-pemeriksaan-umum'
    ) {
      props.setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum('');
      props.setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum('');
    }
    if (
      props.yaTidakPerluStatusDenturePemeriksaanUmum ===
      'tidak-perlu-status-denture-pemeriksaan-umum'
    ) {
      props.setSeparaPenuhAtasPerluDenturePemeriksaanUmum('');
      props.setSeparaPenuhBawahPerluDenturePemeriksaanUmum('');
    }
    if (
      props.disaringProgramKanserMulutPemeriksaanUmum ===
      'tidak-disaring-program-kanser-mulut-pemeriksaan-umum'
    ) {
      props.setLesiMulutPemeriksaanUmum(false);
      props.setTabiatBerisikoTinggiPemeriksaanUmum(false);
    }
  }, [
    props.yaTidakSediaAdaStatusDenturePemeriksaanUmum,
    props.yaTidakPerluStatusDenturePemeriksaanUmum,
    props.disaringProgramKanserMulutPemeriksaanUmum,
  ]);

  //reset status gigi
  useEffect(() => {
    if (props.yaTidakPesakitMempunyaiGigi === 'tidak-pesakit-mempunyai-gigi') {
      props.setAdaDesidusPemeriksaanUmum(false);
      props.setAdaKekalPemeriksaanUmum(false);
    }
    if (props.adaDesidusPemeriksaanUmum === false) {
      props.setDAdaGigiDesidusPemeriksaanUmum(0);
      props.setFAdaGigiDesidusPemeriksaanUmum(0);
      props.setXAdaGigiDesidusPemeriksaanUmum(0);
    }
    if (props.adaKekalPemeriksaanUmum === false) {
      props.setDAdaGigiKekalPemeriksaanUmum(0);
      props.setMAdaGigiKekalPemeriksaanUmum(0);
      props.setFAdaGigiKekalPemeriksaanUmum(0);
      props.setXAdaGigiKekalPemeriksaanUmum(0);
    }
  }, [
    props.yaTidakPesakitMempunyaiGigi,
    props.adaDesidusPemeriksaanUmum,
    props.adaKekalPemeriksaanUmum,
  ]);

  //reset taska tadika
  useEffect(() => {
    if (!props.engganTaskaTadika) {
      props.setPemeriksaanTaskaTadika('');
    }
  }, [props.engganTaskaTadika]);

  useEffect(() => {
    if (!props.tidakHadirTaskaTadika) {
      props.setPemeriksaanTaskaTadika('');
    }
  }, [props.tidakHadirTaskaTadika]);

  return (
    <>
      <div className='pb-1 pr-2 pl-2'>
        {props.pemeriksaanTaskaTadika ===
        'tiada-pemeriksaan-taska-tadika' ? null : (
          <div
            className={`grid gap-2 ${
              props.statusKehadiran === false ? 'lg:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            <article className='grid border border-userBlack mb-2 pl-3 p-2 rounded-md auto-rows-min'>
              <h4
                className='flex flex-row items-center pl-5 font-bold col-span-2  hover:cursor-pointer hover:text-user6'
                onClick={() => setShow(!show)}
              >
                Pemeriksaan atau Rawatan Yang Tidak Diberikan
                <FaInfoCircle
                  className='ml-2 text-xl text-userBlack'
                  title='Tanda jika pesakit sudah didaftar dan tidak diberi pemeriksaan/rawatan'
                />
              </h4>
              <div
                className={`flex items-center flex-row pl-5 transition-all ${
                  show ? 'max-h-min overflow-y-auto' : 'max-h-0 overflow-hidden'
                }`}
              >
                <input
                  disabled={isDisabled}
                  type='checkbox'
                  name='tidak-hadir'
                  id='tidak-hadir'
                  checked={props.statusKehadiran}
                  onChange={() => {
                    props.setStatusKehadiran(!props.statusKehadiran);
                  }}
                  className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                />
                <label htmlFor='tidak-hadir' className='m-2 text-sm font-m'>
                  Pesakit pulang sebelum sebarang pemeriksaan atau rawatan
                </label>
              </div>
            </article>
            {props.statusKehadiran === false ? (
              <article className='flex flex-wrap border border-userBlack mb-2 pl-3 p-2 rounded-md'>
                {props.singlePersonUmum.jenisFasiliti === 'kp' ? (
                  <div className='flex flex-wrap lg:flex-row items-center my-2'>
                    <div className='flex flex-row'>
                      <p className='flex flex-row items-center pl-5 font-bold col-span-2 whitespace-nowrap'>
                        waktu dipanggil :
                      </p>
                      <span className='font-semibold text-user6'>*</span>
                      <div className='relative w-32 mx-3'>
                        {!isDisabled ? (
                          <Datetime
                            initialViewMode='time'
                            dateFormat={false}
                            timeFormat='hh:mm A'
                            input={true}
                            value={props.waktuDipanggilDT}
                            initialValue={
                              props.waktuDipanggil
                                ? props.waktuDipanggil
                                : props.setWaktuDipanggil(
                                    moment(dateToday).format('HH:mm')
                                  )
                            }
                            onChange={(dt) => {
                              const timeString = moment(dt).format('HH:mm');
                              props.setWaktuDipanggil(timeString);
                              props.setWaktuDipanggilDT(dt);
                            }}
                            inputProps={{
                              required: true,
                              readOnly: true,
                              className:
                                'appearance-none w-32 h-min leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md',
                            }}
                          />
                        ) : (
                          <input
                            disabled={isDisabled}
                            type='text'
                            name='waktu-dipanggil'
                            value={formatTime(props.waktuDipanggil)}
                            className='appearance-none w-32 h-min leading-7 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md'
                          />
                        )}
                        <span>
                          <FaClock className='absolute top-2.5 right-2 text-user3' />
                        </span>
                      </div>
                    </div>
                    <div className='text-sm text-left mx-2 ml-auto lg:ml-0'>
                      <p className='font-semibold text-user9 normal-case'>
                        Waktu sampai :{' '}
                        {formatTime(props.singlePersonUmum.waktuSampai)}
                      </p>
                      <p className='font-semibold text-user9 text-xs normal-case'>
                        Durasi waktu menunggu :{' '}
                        {durationTime(
                          props.singlePersonUmum.waktuSampai,
                          props.waktuDipanggil
                        ) > 0 ? (
                          <span className='text-user7'>
                            {durationTime(
                              props.singlePersonUmum.waktuSampai,
                              props.waktuDipanggil
                            ) + ' minit'}
                          </span>
                        ) : (
                          <span className='normal-case'>
                            Pastikan waktu DIPANGGIL MELEBIHI waktu SAMPAI
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
                {props.allUsedKPBMPB.length > 0 && (
                  <div className='flex flex-row items-center'>
                    <p className='flex flex-row items-center pl-5 font-bold col-span-2 whitespace-nowrap'>
                      Penggunaan KPB / MPB :
                    </p>
                    <select
                      disabled={isDisabled}
                      name='penggunaan-kpb-mpb'
                      id='penggunaan-kpb-mpb'
                      value={props.penggunaanKPBMPB}
                      onChange={(e) => {
                        props.setPenggunaanKPBMPB(e.target.value);
                      }}
                      className='appearance-none w-44 h-min leading-7 m-3 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md'
                    >
                      <option value=''>Pilih Jika Berkenaan</option>
                      {props.singlePersonUmum.jenisFasiliti !==
                      'projek-komuniti-lain'
                        ? props.allUsedKPBMPB.map((kpbmpb) => (
                            <option value={kpbmpb.nama}>
                              {dictionaryJenisFasiliti[kpbmpb.jenisFasiliti]} |{' '}
                              {kpbmpb.nama}
                            </option>
                          ))
                        : null}
                      {props.singlePersonUmum.jenisFasiliti ===
                      'projek-komuniti-lain'
                        ? props.allUsedKPBMPB.map((kpbmpb) => {
                            return (
                              <>
                                {kpbmpb.penggunaanKpb !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanKpb}>
                                    KPB | {kpbmpb.penggunaanKpb}
                                  </option>
                                )}
                                {kpbmpb.penggunaanKpb2 !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanKpb2}>
                                    KPB | {kpbmpb.penggunaanKpb2}
                                  </option>
                                )}
                                {kpbmpb.penggunaanKpb3 !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanKpb3}>
                                    KPB | {kpbmpb.penggunaanKpb3}
                                  </option>
                                )}
                                {kpbmpb.penggunaanMpb !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanMpb}>
                                    MPB | {kpbmpb.penggunaanMpb}
                                  </option>
                                )}
                                {kpbmpb.penggunaanMpb2 !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanMpb2}>
                                    MPB | {kpbmpb.penggunaanMpb2}
                                  </option>
                                )}
                                {kpbmpb.penggunaanMpb3 !== 'NOT APPLICABLE' && (
                                  <option value={kpbmpb.penggunaanMpb3}>
                                    MPB | {kpbmpb.penggunaanMpb3}
                                  </option>
                                )}
                              </>
                            );
                          })
                        : null}
                    </select>
                  </div>
                )}
                {props.singlePersonUmum.umur >= 18 &&
                props.singlePersonUmum.jenisFasiliti === 'kp' ? (
                  <div className='flex flex-col l border border-userBlack py-2 text-left'>
                    <div className='flex flex-col lg:flex-row items-center pl-5 '>
                      <p className='items-center font-bold whitespace-nowrap'>
                        Tekanan Darah :{' '}
                        {props.singlePersonUmum.kedatangan ===
                          'baru-kedatangan' && (
                          <span className='font-semibold text-user6'>*</span>
                        )}
                      </p>
                      <div className='flex flex-row whitespace-nowrap'>
                        <input
                          required={
                            props.singlePersonUmum.kedatangan ===
                            'baru-kedatangan'
                              ? true
                              : false
                          }
                          disabled={isDisabled}
                          type='number'
                          name='systolic-tekanan-darah'
                          id='systolic-tekanan-darah'
                          value={props.systolicTekananDarah}
                          onChange={(e) => {
                            props.setSystolicTekananDarah(e.target.value);
                            props.setRujukKeKlinik(false);
                          }}
                          onClick={() => {
                            if (
                              props.systolicTekananDarah === 0 ||
                              props.systolicTekananDarah === '0'
                            ) {
                              props.setSystolicTekananDarah('');
                            }
                          }}
                          min='0'
                          max='300'
                          className='appearance-none font-normal w-20 h-min leading-7 mx-3 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md'
                        />
                        <p className='font-bold text-2xl'> / </p>
                        <input
                          required={
                            props.singlePersonUmum.kedatangan ===
                            'baru-kedatangan'
                              ? true
                              : false
                          }
                          disabled={isDisabled}
                          type='number'
                          name='diastolic-tekanan-darah'
                          id='diastolic-tekanan-darah'
                          value={props.diastolicTekananDarah}
                          onChange={(e) => {
                            props.setDiastolicTekananDarah(e.target.value);
                            props.setRujukKeKlinik(false);
                          }}
                          onClick={() => {
                            if (
                              props.diastolicTekananDarah === 0 ||
                              props.diastolicTekananDarah === '0'
                            ) {
                              props.setDiastolicTekananDarah('');
                            }
                          }}
                          min='0'
                          max='300'
                          className='appearance-none font-normal w-20 h-min leading-7 mx-3 px-3 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user3 focus:outline-none shadow-md'
                        />
                      </div>
                      <div className='flex flex-row whitespace-nowrap'>
                        <p className='font-semibold text-lg mr-2 normal-case'>
                          mmHg
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center text-left pl-5'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='sejarah-darah-tinggi'
                        id='sejarah-darah-tinggi'
                        checked={props.sejarahDarahTinggi}
                        onChange={() => {
                          props.setSejarahDarahTinggi(
                            !props.sejarahDarahTinggi
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='sejarah-darah-tinggi'
                        className='m-2 text-sm font-m text-left'
                      >
                        Ada Sejarah darah tinggi ?
                      </label>
                    </div>
                    {(props.systolicTekananDarah >= 1 &&
                      props.systolicTekananDarah <= 89) ||
                    (props.diastolicTekananDarah >= 1 &&
                      props.diastolicTekananDarah <= 59) ||
                    props.systolicTekananDarah >= 140 ||
                    props.diastolicTekananDarah >= 90 ? (
                      <div className='flex items-center text-left pl-5'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujuk-ke-klinik'
                          id='rujuk-ke-klinik'
                          checked={props.rujukKeKlinik}
                          onChange={() => {
                            props.setRujukKeKlinik(!props.rujukKeKlinik);
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='rujuk-ke-klinik'
                          className='m-2 text-sm font-m text-left'
                        >
                          Dirujuk ke klinik kesihatan kerana masalah tekanan
                          darah
                        </label>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ) : null}
          </div>
        )}
        <div className=' grid grid-cols-2'>
          {props.statusKehadiran === false ? (
            <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
              <p className='ml-3 text-xl font-semibold'>Pemeriksaan</p>
            </span>
          ) : null}
          <section
            className={` grid mt-3 mb-3 w-full ${
              props.singlePersonUmum.kedatangan === 'baru-kedatangan'
                ? 'col-span-2 grid-cols-1 lg:grid-cols-2 gap-2'
                : 'col-span-2 grid-cols-1'
            }`}
          >
            {props.singlePersonUmum.kedatangan === 'baru-kedatangan' &&
            props.statusKehadiran === false ? (
              <div className='grid gap-2 auto-rows-min'>
                {props.jenisFasiliti === 'taska-tadika' && (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='flex flex-row items-center pl-5 font-bold col-span-2'>
                      kedatangan taska / tadika
                    </h4>
                    <div className='grid grid-rows-2'>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='enggan-taska-tadika'
                          id='enggan-taska-tadika'
                          value='enggan-taska-tadika'
                          checked={props.engganTaskaTadika}
                          onChange={() => {
                            props.setEngganTaskaTadika(
                              !props.engganTaskaTadika
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='enggan-taska-tadika'
                          className='m-2 text-sm font-m'
                        >
                          enggan
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='tidak-hadir-taska-tadika'
                          id='tidak-hadir-taska-tadika'
                          value='tidak-hadir-taska-tadika'
                          checked={props.tidakHadirTaskaTadika}
                          onChange={() => {
                            props.setTidakHadirTaskaTadika(
                              !props.tidakHadirTaskaTadika
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='tidak-hadir-taska-tadika'
                          className='m-2 text-sm font-m'
                        >
                          tidak hadir
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${
                        props.engganTaskaTadika ||
                        props.tidakHadirTaskaTadika ||
                        'hidden'
                      } outline outline-1 outline-userBlack grid grid-rows-3 col-start-2`}
                    >
                      <h4 className=' font-bold flex items-center flex-row px-2 text-clip'>
                        pemeriksaan
                      </h4>
                      <div className='flex items-center flex-row px-2'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='pemeriksaan-taska-tadika'
                          id='ada-pemeriksaan-taska-tadika'
                          value='ada-pemeriksaan-taska-tadika'
                          checked={
                            props.pemeriksaanTaskaTadika ===
                            'ada-pemeriksaan-taska-tadika'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setPemeriksaanTaskaTadika(e.target.value);
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ada-pemeriksaan-taska-tadika'
                          className='m-2 text-sm font-m'
                        >
                          ada
                        </label>
                      </div>
                      <div className='flex items-center flex-row px-2'>
                        <input
                          disabled={isDisabled}
                          type='radio'
                          name='pemeriksaan-taska-tadika'
                          id='tiada-pemeriksaan-taska-tadika'
                          value='tiada-pemeriksaan-taska-tadika'
                          checked={
                            props.pemeriksaanTaskaTadika ===
                            'tiada-pemeriksaan-taska-tadika'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setPemeriksaanTaskaTadika(e.target.value);
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tiada-pemeriksaan-taska-tadika'
                          className='m-2 text-sm font-m'
                        >
                          tiada
                        </label>
                      </div>
                    </div>
                  </article>
                )}
                {props.singlePersonUmum.umur >= 60 && (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      warga emas
                    </h4>
                    <div className='flex flex-row pl-5 items-center col-span-2'>
                      <p className='text-sm font-m '>
                        Bilangan Gigi Kekal Yang Ada:{' '}
                        <span className='text-user6'>*</span>
                      </p>
                      <input
                        disabled={isDisabled}
                        required={
                          props.singlePersonUmum.umur >= 60 ? false : true
                        }
                        min='0'
                        max='32'
                        type='number'
                        name='bilangan-gigi-mempunyai-20-gigi-edentulous-warga-emas-pemeriksaan-umum'
                        id='bilangan-gigi-mempunyai-20-gigi-edentulous-warga-emas-pemeriksaan-umum'
                        value={
                          props.bilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum
                        }
                        onChange={(e) => {
                          props.setBilanganGigiMempunyai20GigiEdentulousWargaEmasPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      />
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article className='grid border border-userBlack p-1 rounded-md'>
                    <div className='flex flex-row items-center pl-5'>
                      <h4 className='font-bold'>
                        Pesakit Mempunyai Gigi Desidus/Kekal?
                        <span className='text-user6'>*</span>
                      </h4>
                      <div className='flex items-center justify-center ml-2'>
                        <input
                          disabled={isDisabled}
                          required
                          type='radio'
                          name='pesakit-mempunyai-gigi'
                          id='ya-pesakit-mempunyai-gigi'
                          value='ya-pesakit-mempunyai-gigi'
                          checked={
                            props.yaTidakPesakitMempunyaiGigi ===
                            'ya-pesakit-mempunyai-gigi'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setYaTidakPesakitMempunyaiGigi(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='ya-pesakit-mempunyai-gigi'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>
                        <input
                          disabled={isDisabled}
                          required
                          type='radio'
                          name='pesakit-mempunyai-gigi'
                          id='tidak-pesakit-mempunyai-gigi'
                          value='tidak-pesakit-mempunyai-gigi'
                          checked={
                            props.yaTidakPesakitMempunyaiGigi ===
                            'tidak-pesakit-mempunyai-gigi'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            props.setYaTidakPesakitMempunyaiGigi(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-pesakit-mempunyai-gigi'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                    {props.yaTidakPesakitMempunyaiGigi ===
                      'ya-pesakit-mempunyai-gigi' && (
                      <article className=' border border-userBlack pl-3 p-2 rounded-md'>
                        <div className='shadow-lg  grid lg:grid-cols-[2fr_4fr] items-center justify-start py-2'>
                          <h4 className='font-bold flex flex-row pl-5'>
                            Status Gigi Desidus
                          </h4>
                          <div className='grid gap-1'>
                            <div className='flex items-center pl-5'>
                              <input
                                disabled={isDisabled}
                                type='checkbox'
                                required={
                                  props.adaDesidusPemeriksaanUmum === true ||
                                  props.adaKekalPemeriksaanUmum === true
                                    ? false
                                    : true
                                }
                                name='ada-desidus-pemeriksaan-umum'
                                id='ada-desidus-pemeriksaan-umum'
                                checked={props.adaDesidusPemeriksaanUmum}
                                onChange={() => {
                                  props.setAdaDesidusPemeriksaanUmum(
                                    !props.adaDesidusPemeriksaanUmum
                                  );
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='ada-desidus-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                ada gigi desidus
                              </label>
                            </div>
                            <div
                              className={`${
                                !props.adaDesidusPemeriksaanUmum && 'hidden'
                              } grid grid-cols-1 sm:grid-cols-2`}
                            >
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m lowercase'>d: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='d-ada-status-gigi-desidus-pemeriksaan-umum'
                                  id='d-ada-status-gigi-desidus-pemeriksaan-umum'
                                  value={props.dAdaGigiDesidusPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setDAdaGigiDesidusPemeriksaanUmum(
                                      e.target.value
                                    );
                                    if (e.target.value > 0) {
                                      props.setTidakPerluRawatanPemeriksaanUmum(
                                        false
                                      );
                                    }
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m lowercase'>f: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='f-ada-status-gigi-desidus-pemeriksaan-umum'
                                  id='f-ada-status-gigi-desidus-pemeriksaan-umum'
                                  value={props.fAdaGigiDesidusPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setFAdaGigiDesidusPemeriksaanUmum(
                                      e.target.value
                                    );
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m lowercase'>x: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='20'
                                  type='number'
                                  name='x-ada-status-gigi-desidus-pemeriksaan-umum'
                                  id='x-ada-status-gigi-desidus-pemeriksaan-umum'
                                  value={props.xAdaGigiDesidusPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setXAdaGigiDesidusPemeriksaanUmum(
                                      e.target.value
                                    );
                                    if (e.target.value > 0) {
                                      props.setTidakPerluRawatanPemeriksaanUmum(
                                        false
                                      );
                                    }
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              {props.singlePersonUmum.umur >= 10 &&
                              props.dAdaGigiDesidusPemeriksaanUmum > 0 ? (
                                <div className='flex flex-row items-center pl-5'>
                                  <p className='text-sm font-m'>
                                    tampalan sementara desidus
                                  </p>
                                  <input
                                    disabled={isDisabled}
                                    required
                                    min='0'
                                    max={props.dAdaGigiDesidusPemeriksaanUmum}
                                    type='number'
                                    name='tampalan-sementara-desidus-pemeriksaan-umum'
                                    id='tampalan-sementara-desidus-pemeriksaan-umum'
                                    value={
                                      props.tampalanSementaraDesidusPemeriksaanUmum
                                    }
                                    onChange={(e) => {
                                      props.setTampalanSementaraDesidusPemeriksaanUmum(
                                        e.target.value
                                      );
                                    }}
                                    className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                  />
                                </div>
                              ) : null}
                            </div>
                            {props.sumDMFXDesidusUmum > 20 && (
                              <p className='text-user6 font-semibold'>
                                jumlah <span className='lowercase'>dfx</span>{' '}
                                tidak boleh melebihi 20
                              </p>
                            )}
                          </div>
                        </div>
                        <div className='shadow-lg grid lg:grid-cols-[2fr_4fr] items-center justify-start py-2'>
                          <h4 className='font-bold flex flex-row pl-5'>
                            Status Gigi Kekal
                          </h4>
                          <div className='grid gap-1 '>
                            <div className='flex items-center pl-5'>
                              <input
                                disabled={isDisabled}
                                required={
                                  props.adaKekalPemeriksaanUmum === true ||
                                  props.adaDesidusPemeriksaanUmum === true
                                    ? false
                                    : true
                                }
                                type='checkbox'
                                name='ada-kekal-pemeriksaan-umum'
                                id='ada-kekal-pemeriksaan-umum'
                                checked={props.adaKekalPemeriksaanUmum}
                                onChange={() => {
                                  props.setAdaKekalPemeriksaanUmum(
                                    !props.adaKekalPemeriksaanUmum
                                  );
                                }}
                                className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                              />
                              <label
                                htmlFor='ada-kekal-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                ada gigi kekal
                              </label>
                            </div>
                            <div
                              className={`${
                                !props.adaKekalPemeriksaanUmum && 'hidden'
                              } grid grid-cols-2`}
                            >
                              <div className='flex flex-row items-center  pl-5'>
                                <p className='text-sm font-m '>D: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='d-ada-status-gigi-kekal-pemeriksaan-umum'
                                  id='d-ada-status-gigi-kekal-pemeriksaan-umum'
                                  value={props.dAdaGigiKekalPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setDAdaGigiKekalPemeriksaanUmum(
                                      e.target.value
                                    );
                                    if (e.target.value > 0) {
                                      props.setTidakPerluRawatanPemeriksaanUmum(
                                        false
                                      );
                                    }
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m '>M: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='m-ada-status-gigi-kekal-pemeriksaan-umum'
                                  id='m-ada-status-gigi-kekal-pemeriksaan-umum'
                                  value={props.mAdaGigiKekalPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setMAdaGigiKekalPemeriksaanUmum(
                                      e.target.value
                                    );
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m '>F: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='f-ada-status-gigi-kekal-pemeriksaan-umum'
                                  id='f-ada-status-gigi-kekal-pemeriksaan-umum'
                                  value={props.fAdaGigiKekalPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setFAdaGigiKekalPemeriksaanUmum(
                                      e.target.value
                                    );
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m '>E: </p>
                                <span className='text-user6'>* </span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='e-ada-status-gigi-kekal-pemeriksaan-umum'
                                  id='e-ada-status-gigi-kekal-pemeriksaan-umum'
                                  value={props.eAdaGigiKekalPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setEAdaGigiKekalPemeriksaanUmum(
                                      e.target.value
                                    );
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                                <FaInfoCircle
                                  title='Hanya masukkan E10 , E12 & E13'
                                  className='text-lg m-1'
                                />
                              </div>
                              <div className='flex flex-row items-center pl-5'>
                                <p className='text-sm font-m '>X: </p>
                                <span className='text-user6'>*</span>
                                <input
                                  disabled={isDisabled}
                                  required
                                  min='0'
                                  max='32'
                                  type='number'
                                  name='x-ada-status-gigi-kekal-pemeriksaan-umum'
                                  id='x-ada-status-gigi-kekal-pemeriksaan-umum'
                                  value={props.xAdaGigiKekalPemeriksaanUmum}
                                  onChange={(e) => {
                                    props.setXAdaGigiKekalPemeriksaanUmum(
                                      e.target.value
                                    );
                                    if (e.target.value > 0) {
                                      props.setTidakPerluRawatanPemeriksaanUmum(
                                        false
                                      );
                                    }
                                  }}
                                  className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                                />
                              </div>
                            </div>
                            {props.sumDMFXKekalUmum > 32 && (
                              <p className='text-user6 font-semibold'>
                                jumlah DMFX tidak boleh melebihi 32
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    )}
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md '>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Cleft Lip/Palate
                    </h4>
                    <div className='flex flex-row items-center pl-5 pt-1'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='ada-cleft-lip-pemeriksaan-umum'
                        id='ada-cleft-lip-pemeriksaan-umum'
                        checked={props.adaCleftLipPemeriksaanUmum}
                        onChange={() => {
                          props.setAdaCleftLipPemeriksaanUmum(
                            !props.adaCleftLipPemeriksaanUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                      />
                      <label
                        htmlFor='ada-cleft-lip-pemeriksaan-umum'
                        className='mx-2 text-sm font-m'
                      >
                        Ada
                      </label>
                    </div>
                    <div className='flex flex-row items-center pl-5 pt-1'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='rujuk-cleft-lip-palate-pemeriksaan-umum'
                        id='rujuk-cleft-lip-palate-pemeriksaan-umum'
                        checked={props.rujukCleftLipPemeriksaanUmum}
                        onChange={() => {
                          props.setRujukCleftLipPemeriksaanUmum(
                            !props.rujukCleftLipPemeriksaanUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='rujuk-cleft-lip-palate-pemeriksaan-umum'
                        className='mx-2 text-sm font-m'
                      >
                        Rujuk
                      </label>
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md '>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Tidak Perlu Rawatan
                    </h4>
                    <div className='flex flex-row pl-5 py-2'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='tidak-perlu-rawatan-pemeriksaan-umum'
                        id='tidak-perlu-rawatan-pemeriksaan-umum'
                        checked={props.tidakPerluRawatanPemeriksaanUmum}
                        onChange={() => {
                          // props.setTidakPerluRawatanPemeriksaanUmum(
                          //   !props.tidakPerluRawatanPemeriksaanUmum
                          // );
                          props.theCheckTPRShow();
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='tidak-perlu-rawatan-pemeriksaan-umum'
                        className='mx-2 text-sm font-m'
                      >
                        TPR
                      </label>
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article className='row-span-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      Status dentur
                    </h4>
                    <div className='grid grid-rows-2 gap-2 auto-rows-min'>
                      <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-semibold'>
                          Sedia Ada?
                          {/* <span className='text-user6'>*</span> */}
                        </h4>
                        <div className='flex items-center justify-center'>
                          <input
                            disabled={isDisabled}
                            // required
                            type='radio'
                            name='sedia-ada-status-denture-pemeriksaan-umum'
                            id='ya-sedia-ada-status-denture-pemeriksaan-umum'
                            value='ya-sedia-ada-status-denture-pemeriksaan-umum'
                            checked={
                              props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                              'ya-sedia-ada-status-denture-pemeriksaan-umum'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setYaTidakSediaAdaStatusDenturePemeriksaanUmum(
                                e.target.value
                              );
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-sedia-ada-status-denture-pemeriksaan-umum'
                            className='m-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            // required
                            type='radio'
                            name='sedia-ada-status-denture-pemeriksaan-umum'
                            id='tidak-sedia-ada-status-denture-pemeriksaan-umum'
                            value='tidak-sedia-ada-status-denture-pemeriksaan-umum'
                            checked={
                              props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                              'tidak-sedia-ada-status-denture-pemeriksaan-umum'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setYaTidakSediaAdaStatusDenturePemeriksaanUmum(
                                e.target.value
                              );
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-sedia-ada-status-denture-pemeriksaan-umum'
                            className='m-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                        {props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                          'ya-sedia-ada-status-denture-pemeriksaan-umum' && (
                          <div className='flex items-center flex-row pl-5'>
                            <label className='m-2 text-sm font-m'>Atas</label>
                          </div>
                        )}
                        {props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                          'ya-sedia-ada-status-denture-pemeriksaan-umum' && (
                          <div className='grid grid-cols-2'>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                id='separa-atas-sedia-ada-denture-pemeriksaan-umum'
                                value='separa-atas-sedia-ada-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                                  'separa-atas-sedia-ada-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-atas-sedia-ada-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                id='penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                value='penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhAtasSediaAdaDenturePemeriksaanUmum ===
                                  'penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhAtasSediaAdaDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-atas-sedia-ada-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                          </div>
                        )}
                        {props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                          'ya-sedia-ada-status-denture-pemeriksaan-umum' && (
                          <div className='flex items-center flex-row pl-5'>
                            <label className='m-2 text-sm font-m'>Bawah</label>
                          </div>
                        )}
                        {props.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                          'ya-sedia-ada-status-denture-pemeriksaan-umum' && (
                          <div className='grid grid-cols-2'>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                id='separa-bawah-sedia-ada-denture-pemeriksaan-umum'
                                value='separa-bawah-sedia-ada-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                                  'separa-bawah-sedia-ada-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-bawah-sedia-ada-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                id='penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                value='penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhBawahSediaAdaDenturePemeriksaanUmum ===
                                  'penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhBawahSediaAdaDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-bawah-sedia-ada-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                          </div>
                        )}
                      </article>
                      <article className='grid grid-cols-2 auto-rows-min border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-semibold'>
                          Perlu Dentur ?
                          {/* <span className='text-user6'>*</span> */}
                        </h4>
                        <div className='flex items-center justify-center'>
                          <input
                            disabled={isDisabled}
                            // required
                            type='radio'
                            name='perlu-status-denture-pemeriksaan-umum'
                            id='ya-perlu-status-denture-pemeriksaan-umum'
                            value='ya-perlu-status-denture-pemeriksaan-umum'
                            checked={
                              props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                              'ya-perlu-status-denture-pemeriksaan-umum'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setYaTidakPerluStatusDenturePemeriksaanUmum(
                                e.target.value
                              );
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='ya-perlu-status-denture-pemeriksaan-umum'
                            className='m-2 text-sm font-m'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            // required
                            type='radio'
                            name='perlu-status-denture-pemeriksaan-umum'
                            id='tidak-perlu-status-denture-pemeriksaan-umum'
                            value='tidak-perlu-status-denture-pemeriksaan-umum'
                            checked={
                              props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                              'tidak-perlu-status-denture-pemeriksaan-umum'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setYaTidakPerluStatusDenturePemeriksaanUmum(
                                e.target.value
                              );
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='tidak-perlu-status-denture-pemeriksaan-umum'
                            className='m-2 text-sm font-m'
                          >
                            Tidak
                          </label>
                        </div>
                        {props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                          'ya-perlu-status-denture-pemeriksaan-umum' && (
                          <div className='flex items-center flex-row pl-5'>
                            <label
                              htmlFor='atas-perlu-denture-pemeriksaan-umum'
                              className='m-2 text-sm font-m'
                            >
                              Atas
                            </label>
                          </div>
                        )}
                        {props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                          'ya-perlu-status-denture-pemeriksaan-umum' && (
                          <div className='grid grid-cols-2'>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-perlu-denture-pemeriksaan-umum'
                                id='separa-atas-perlu-denture-pemeriksaan-umum'
                                value='separa-atas-perlu-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                                  'separa-atas-perlu-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhAtasPerluDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-atas-perlu-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-atas-perlu-denture-pemeriksaan-umum'
                                id='penuh-atas-perlu-denture-pemeriksaan-umum'
                                value='penuh-atas-perlu-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhAtasPerluDenturePemeriksaanUmum ===
                                  'penuh-atas-perlu-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhAtasPerluDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-atas-perlu-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                          </div>
                        )}
                        {props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                          'ya-perlu-status-denture-pemeriksaan-umum' && (
                          <div className='flex items-center flex-row pl-5'>
                            <label className='m-2 text-sm font-m'>Bawah</label>
                          </div>
                        )}
                        {props.yaTidakPerluStatusDenturePemeriksaanUmum ===
                          'ya-perlu-status-denture-pemeriksaan-umum' && (
                          <div className='grid grid-cols-2'>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-perlu-denture-pemeriksaan-umum'
                                id='separa-bawah-perlu-denture-pemeriksaan-umum'
                                value='separa-bawah-perlu-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                                  'separa-bawah-perlu-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhBawahPerluDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='separa-bawah-perlu-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Separa
                              </label>
                            </div>
                            <div className='flex items-center justify-center'>
                              <input
                                disabled={isDisabled}
                                type='radio'
                                name='separa-penuh-bawah-perlu-denture-pemeriksaan-umum'
                                id='penuh-bawah-perlu-denture-pemeriksaan-umum'
                                value='penuh-bawah-perlu-denture-pemeriksaan-umum'
                                checked={
                                  props.separaPenuhBawahPerluDenturePemeriksaanUmum ===
                                  'penuh-bawah-perlu-denture-pemeriksaan-umum'
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  props.setSeparaPenuhBawahPerluDenturePemeriksaanUmum(
                                    e.target.value
                                  );
                                }}
                                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                              />
                              <label
                                htmlFor='penuh-bawah-perlu-denture-pemeriksaan-umum'
                                className='m-2 text-sm font-m'
                              >
                                Penuh
                              </label>
                            </div>
                          </div>
                        )}
                      </article>
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article
                    className='grid grid-cols-1 border border-userBlack pl-3 p-2 rounded-md'
                    title='Tooth Surface Loss'
                  >
                    <h4 className='font-bold flex flex-row pl-5'>
                      Kehilangan Permukaan Gigi
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='tooth-surface-loss-pemeriksaan-umum'
                        id='tooth-surface-loss-pemeriksaan-umum'
                        checked={props.toothSurfaceLossTraumaPemeriksaanUmum}
                        onChange={() => {
                          props.setToothSurfaceLossTraumaPemeriksaanUmum(
                            !props.toothSurfaceLossTraumaPemeriksaanUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='tooth-surface-loss-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Kehilangan Permukaan Gigi
                      </label>
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article
                    className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'
                    title='Fissure Sealant'
                  >
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Pengapan Fisur
                    </h4>
                    {/* <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                    <input
                      disabled={isDisabled}
                      type='checkbox'
                      name='fissure-sealant-pemeriksaan-umum'
                      id='fissure-sealant-pemeriksaan-umum'
                      checked={props.fissureSealantPemeriksaanUmum}
                      onChange={() => {
                        props.setFissureSealantPemeriksaanUmum(
                          !props.fissureSealantPemeriksaanUmum
                        );
                      }}
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label className='mx-2 text-sm font-m'>
                      pesakit perlu Pengapan Fisur
                    </label>
                  </div> */}
                    <div className='flex flex-row items-center pl-5 col-span-2'>
                      <p className='flex flex-row text-sm font-m items-center'>
                        Jumlah Gigi Kekal Perlu Pengapan Fisur (E10)
                      </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='baru-jumlah-gigi-kekal-perlu-fs-rawatan-umum'
                        id='baru-jumlah-gigi-kekal-perlu-fs-rawatan-umum'
                        value={props.baruJumlahGigiKekalPerluFSRawatanUmum}
                        onChange={(e) => {
                          props.setBaruJumlahGigiKekalPerluFSRawatanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        min='0'
                        max='32'
                      />
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article
                    className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'
                    title='Fluoride Varnish'
                  >
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Sapuan Fluorida
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='flex  text-sm font-m items-center mr-3'>
                        Perlu Sapuan
                      </p>
                      <input
                        disabled={isDisabled}
                        type='radio'
                        name='fv-perlu-sapuan-pemeriksaan-umum'
                        id='ya-fv-perlu-sapuan-pemeriksaan-umum'
                        value='ya-fv-perlu-sapuan-pemeriksaan-umum'
                        checked={
                          props.fvPerluSapuanPemeriksaanUmum ===
                          'ya-fv-perlu-sapuan-pemeriksaan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setFvPerluSapuanPemeriksaanUmum(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ya-fv-perlu-sapuan-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Ya
                      </label>
                      <input
                        disabled={isDisabled}
                        type='radio'
                        name='fv-perlu-sapuan-pemeriksaan-umum'
                        id='tidak-fv-perlu-sapuan-pemeriksaan-umum'
                        value='tidak-fv-perlu-sapuan-pemeriksaan-umum'
                        checked={
                          props.fvPerluSapuanPemeriksaanUmum ===
                          'tidak-fv-perlu-sapuan-pemeriksaan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setFvPerluSapuanPemeriksaanUmum(e.target.value);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-fv-perlu-sapuan-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Tidak
                      </label>
                    </div>
                  </article>
                )}
                {props.pemeriksaanTaskaTadika ===
                'tiada-pemeriksaan-taska-tadika' ? null : (
                  <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Tampalan Resin Pencegahan Jenis 1 (PRR Type I)
                    </h4>
                    {/* <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                    <input
                      disabled={isDisabled}
                      type='checkbox'
                      name='prr-jenis-1-pemeriksaan-umum'
                      id='prr-jenis-1-pemeriksaan-umum'
                      checked={props.prrJenis1PemeriksaanUmum}
                      onChange={() => {
                        props.setPrrJenis1PemeriksaanUmum(
                          !props.prrJenis1PemeriksaanUmum
                        );
                      }}
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label className='mx-2 text-sm font-m'>
                      murid perlu Tampalan Resin Pencegahan Jenis 1 (PRR Type I)
                    </label>
                  </div> */}
                    <div className='flex flex-row items-center pl-5 col-span-2'>
                      <p className='flex flex-row text-sm font-m '>
                        Jumlah Gigi Kekal Perlu Tampalan Resin Pencegahan Jenis
                        1 (PRR Type I) (E12)
                      </p>
                      <input
                        disabled={isDisabled}
                        type='number'
                        name='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-rawatan-umum'
                        id='baru-jumlah-gigi-kekal-perlu-prr-jenis-1-rawatan-umum'
                        value={
                          props.baruJumlahGigiKekalPerluPRRJenis1RawatanUmum
                        }
                        onChange={(e) => {
                          props.setBaruJumlahGigiKekalPerluPRRJenis1RawatanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        min='0'
                        max='32'
                      />
                    </div>
                  </article>
                )}
                {/* SDF akan digunakan masa hadapan */}
                {/* <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Silver Diamine Fluoride
                  </h4>
                  <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                    Perlu Sapuan
                  </p>
                  <div className='flex items-center justify-center'>
                    <input
                      disabled={isDisabled}
                      type='radio'
                      name='silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      id='ya-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      value='ya-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      checked={
                        props.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum ===
                        'ya-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum(
                          e.target.value
                        );
                      }}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='ya-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Ya
                    </label>
                    <input
                      disabled={isDisabled}
                      type='radio'
                      name='silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      id='tidak-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      value='tidak-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      checked={
                        props.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum ===
                        'tidak-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                          ? true
                          : false
                      }
                      onChange={(e) => {
                        props.setYaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum(
                          e.target.value
                        );
                      }}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='tidak-silver-diamine-fluoride-perlu-sapuan-pemeriksaan-umum'
                      className='m-2 text-sm font-m'
                    >
                      Tidak
                    </label>
                  </div>
                </article> */}
              </div>
            ) : null}
            {props.pemeriksaanTaskaTadika ===
            'tiada-pemeriksaan-taska-tadika' ? null : (
              <div className='grid gap-2 auto-rows-min'>
                {props.singlePersonUmum.kedatangan === 'baru-kedatangan' &&
                props.statusKehadiran === false ? (
                  <article className='grid grid-cols-1 lg:grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 lg:col-span-2'>
                      Kebersihan Mulut
                    </h4>
                    <div className='grid grid-cols-[2fr_1fr] items-center col-start-1'>
                      <p className='flex flex-row pl-5 text-sm font-m '>
                        Gred Skor Plak<span className='text-user6'>*</span>
                      </p>
                      <div className='flex flex-row items-center relative'>
                        <select
                          disabled={isDisabled}
                          required
                          name='kebersihan-mulut-pemeriksaan-umum'
                          id='kebersihan-mulut-pemeriksaan-umum'
                          value={
                            props.kebersihanMulutOralHygienePemeriksaanUmum
                          }
                          onChange={(e) => {
                            props.setKebersihanMulutOralHygienePemeriksaanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        >
                          <option value=''></option>
                          <option value='tiada'>-</option>
                          <option value='A'>A</option>
                          <option value='C'>C</option>
                          <option value='E'>E</option>
                        </select>
                        <FaCaretDown className='absolute top-3 left-12 text-user4' />
                        <FaInfoCircle
                          title='Tanda (-) jika tidak berkenaan'
                          className='text-lg m-1'
                        />
                      </div>
                    </div>
                    {/* {props.singlePersonUmum.umur <= 17 ? ( */}
                    <div className='grid grid-cols-[2fr_1fr] items-center col-start-1'>
                      <p className='flex flex-row pl-5 text-sm font-m'>
                        GIS Skor:
                        {/* <span className='text-user6'>*</span> */}
                      </p>
                      <div className='flex flex-row items-center relative'>
                        <select
                          disabled={isDisabled}
                          // required={
                          //   props.singlePersonUmum.umur <= 17 ? true : false
                          // }
                          name='skor-gis-pemeriksaan-umum'
                          id='skor-gis-pemeriksaan-umum'
                          value={props.skorGisMulutOralHygienePemeriksaanUmum}
                          onChange={(e) => {
                            props.setSkorGisMulutOralHygienePemeriksaanUmum(
                              e.target.value
                            );
                            if (
                              parseInt(e.target.value) === 1 ||
                              parseInt(e.target.value) === 3
                            ) {
                              props.setTidakPerluRawatanPemeriksaanUmum(false);
                            }
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        >
                          <option value=''></option>
                          <option value='tiada'>-</option>
                          <option value='0'>0</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                        </select>
                        <FaCaretDown className='absolute top-3 left-12 text-user4' />
                        <FaInfoCircle
                          title='Tanda (-) jika tidak berkenaan'
                          className='text-lg m-1'
                        />
                      </div>
                    </div>
                    {/* ) : null} */}
                    <div className='flex items-center flex-row pl-5 col-start-1'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='perlu-penskaleran-pemeriksaan-umum'
                        id='perlu-penskaleran-pemeriksaan-umum'
                        checked={props.perluPenskaleranPemeriksaanUmum}
                        onChange={(e) => {
                          props.setPerluPenskaleranPemeriksaanUmum(
                            !props.perluPenskaleranPemeriksaanUmum
                          );
                          console.log(e.target.checked);
                          if (e.target.checked === true) {
                            props.setTidakPerluRawatanPemeriksaanUmum(false);
                          }
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                      />
                      <label
                        htmlFor='perlu-penskaleran-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        Perlu Penskaleran
                      </label>
                    </div>
                  </article>
                ) : null}
                {props.singlePersonUmum.kedatangan === 'baru-kedatangan' &&
                props.statusKehadiran === false ? (
                  <article className='border border-userBlack pl-3 p-2 rounded-md grid grid-cols-1 lg:grid-cols-2'>
                    <h4 className='font-bold flex flex-row pl-5 lg:col-span-2'>
                      Risiko Karies
                    </h4>
                    <div className='grid grid-cols-[2fr_1fr]'>
                      <p className='flex items-center flex-row pl-5'>
                        Jumlah Faktor Risiko:
                      </p>
                      <div className='flex flex-row items-center relative'>
                        <select
                          disabled={isDisabled}
                          name='jumlah-faktor-risiko-pemeriksaan-umum'
                          id='jumlah-faktor-risiko-pemeriksaan-umum'
                          value={props.jumlahFaktorRisikoPemeriksaanUmum}
                          onChange={(e) => {
                            props.setJumlahFaktorRisikoPemeriksaanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        >
                          <option value=''></option>
                          <option value='0'>0</option>
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>
                          <option value='5'>5</option>
                          <option value='6'>6</option>
                          <option value='7'>7</option>
                          <option value='8'>8</option>
                        </select>
                        <FaCaretDown className='absolute top-3 left-12 text-user4' />
                      </div>
                    </div>
                  </article>
                ) : null}
                {props.singlePersonUmum.kedatangan === 'baru-kedatangan' &&
                props.statusKehadiran === false ? (
                  <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Program Kanser Mulut
                    </h4>
                    <p className='flex items-center justify-center text-sm font-m '>
                      disaring: <span className='text-user6'>*</span>
                    </p>
                    <div className='flex items-center justify-center'>
                      <input
                        disabled={isDisabled}
                        required
                        type='radio'
                        name='disaring-program-kanser-mulut-pemeriksaan-umum'
                        id='ya-disaring-program-kanser-mulut-pemeriksaan-umum'
                        value='ya-disaring-program-kanser-mulut-pemeriksaan-umum'
                        checked={
                          props.disaringProgramKanserMulutPemeriksaanUmum ===
                          'ya-disaring-program-kanser-mulut-pemeriksaan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setDisaringProgramKanserMulutPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='ya-disaring-program-kanser-mulut-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        ya
                      </label>
                      <input
                        disabled={isDisabled}
                        required
                        type='radio'
                        name='disaring-program-kanser-mulut-pemeriksaan-umum'
                        id='tidak-disaring-program-kanser-mulut-pemeriksaan-umum'
                        value='tidak-disaring-program-kanser-mulut-pemeriksaan-umum'
                        checked={
                          props.disaringProgramKanserMulutPemeriksaanUmum ===
                          'tidak-disaring-program-kanser-mulut-pemeriksaan-umum'
                            ? true
                            : false
                        }
                        onChange={(e) => {
                          props.setDisaringProgramKanserMulutPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='tidak-disaring-program-kanser-mulut-pemeriksaan-umum'
                        className='m-2 text-sm font-m'
                      >
                        tidak
                      </label>
                    </div>
                    {props.disaringProgramKanserMulutPemeriksaanUmum ===
                      'ya-disaring-program-kanser-mulut-pemeriksaan-umum' && (
                      <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='lesi-mulut-pemeriksaan-umum'
                          id='lesi-mulut-pemeriksaan-umum'
                          checked={props.lesiMulutPemeriksaanUmum}
                          onChange={() => {
                            props.setLesiMulutPemeriksaanUmum(
                              !props.lesiMulutPemeriksaanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='lesi-mulut-pemeriksaan-umum'
                          className='mx-2 text-sm font-m'
                        >
                          Ada lesi mulut
                        </label>
                      </div>
                    )}
                    {props.disaringProgramKanserMulutPemeriksaanUmum ===
                      'ya-disaring-program-kanser-mulut-pemeriksaan-umum' && (
                      <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='tabiat-berisiko-tinggi-pemeriksaan-umum'
                          id='tabiat-berisiko-tinggi-pemeriksaan-umum'
                          checked={props.tabiatBerisikoTinggiPemeriksaanUmum}
                          onChange={() => {
                            props.setTabiatBerisikoTinggiPemeriksaanUmum(
                              !props.tabiatBerisikoTinggiPemeriksaanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='tabiat-berisiko-tinggi-pemeriksaan-umum'
                          className='mx-2 text-sm font-m'
                        >
                          ada tabiat berisiko tinggi
                        </label>
                      </div>
                    )}
                  </article>
                ) : null}{' '}
                {props.statusKehadiran === false &&
                props.singlePersonUmum.umur >= 15 &&
                props.sekolahIdc !== 'umum-sekolah' ? (
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      Pengurusan Penyakit dan kondisi periodontium serta
                      peri-implan pergigian
                    </h4>
                    <article className='grid grid-cols-[2fr_1fr] md:grid-cols-[3fr_2fr] gap-2 items-center border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-span-2 '>
                      <label
                        htmlFor='punca-rujukan'
                        className='text-left justify-start items-center text-sm pl-3'
                      >
                        pesakit mempunyai rujukan T2DM (
                        <i> Type II Diabetes Mellitus</i> ) ?
                        {props.singlePersonUmum.kedatangan ===
                          'baru-kedatangan' && (
                          <span className='text-user6'>*</span>
                        )}
                      </label>
                      <select
                        disabled={isDisabled}
                        required={
                          props.singlePersonUmum.kedatangan ===
                          'baru-kedatangan'
                            ? true
                            : false
                        }
                        name='punca-rujukan'
                        id='punca-rujukan'
                        value={props.puncaRujukan}
                        onChange={(e) => {
                          props.setPuncaRujukan(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-full text-sm font-m'
                      >
                        <option value=''>Pilih</option>
                        <option value='klinik-kesihatan'>
                          Ya Dari Klinik Kesihatan
                        </option>
                        <option value='lain-lain'>
                          Ya Dari Selain Klinik Kesihatan
                        </option>
                        <option value='tiada'>Tiada</option>
                      </select>
                      <label
                        htmlFor='faktor-risiko-bpe'
                        className='text-left flex justify-start items-start text-sm pl-3'
                      >
                        Pesakit Mempunyai Faktor Risiko
                      </label>
                      <div>
                        <div className='flex flex-col'>
                          <div className='flex flex-row items-center'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='diabetes-faktor-risiko-bpe'
                              id='diabetes-faktor-risiko-bpe'
                              value='diabetes-faktor-risiko-bpe'
                              checked={
                                props.diabetesFaktorRisikoBpe ? true : false
                              }
                              onChange={() => {
                                props.setDiabetesFaktorRisikoBpe(
                                  !props.diabetesFaktorRisikoBpe
                                );
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='diabetes-faktor-risiko-bpe'
                              className='m-1 text-sm font-m'
                            >
                              Diabetes
                            </label>
                          </div>
                          <div className='flex flex-row items-center'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='perokok-faktor-risiko-bpe'
                              id='perokok-faktor-risiko-bpe'
                              value='perokok-faktor-risiko-bpe'
                              checked={
                                props.perokokFaktorRisikoBpe ? true : false
                              }
                              onChange={() => {
                                props.setPerokokFaktorRisikoBpe(
                                  !props.perokokFaktorRisikoBpe
                                );
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='perokok-faktor-risiko-bpe'
                              className='m-1 text-sm font-m'
                            >
                              Perokok
                            </label>
                          </div>
                          <div className='flex flex-row items-center'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='lain-lain-faktor-risiko-bpe'
                              id='lain-lain-faktor-risiko-bpe'
                              value='lain-lain-faktor-risiko-bpe'
                              checked={
                                props.lainLainFaktorRisikoBpe ? true : false
                              }
                              onChange={() => {
                                props.setLainLainFaktorRisikoBpe(
                                  !props.lainLainFaktorRisikoBpe
                                );
                              }}
                              className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                            />
                            <label
                              htmlFor='lain-lain-faktor-risiko-bpe'
                              className='m-1 text-sm font-m'
                            >
                              Lain-lain
                              <FaInfoCircle
                                className='ml-2 text-xl text-userBlack inline-flex'
                                title='contohnya seperti hormone-related (Eg: pregnancy), penyakit kardiovaskular, penyakit respiratori seperti pneumonia, stres, osteoporosis, rheumatoid arthritis, obesiti, dementia dan chronic kidney disease.'
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </article>
                    <div className='flex items-center justify-start pl-3'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='enggan-bpe-implan'
                        id='enggan-bpe-implan'
                        value='enggan-bpe-implan'
                        checked={props.engganBpeImplan ? true : false}
                        onChange={() => {
                          props.setEngganBpeImplan(!props.engganBpeImplan);
                        }}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                      />
                      <label
                        htmlFor='enggan-bpe-implan'
                        className='text-left flex justify-start items-center text-sm pl-3'
                      >
                        Enggan Disaring BPE
                      </label>
                    </div>
                    {props.engganBpeImplan === false ? (
                      <article className='grid grid-cols-[2fr_1fr] md:grid-cols-[3fr_2fr] gap-2 items-center border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-span-2 '>
                        <label
                          htmlFor='saringan-penyakit-periodontium-dan-peri-implan'
                          className='text-left flex justify-start items-center text-sm pl-3 col-span-2'
                        >
                          Saringan Penyakit Periodontium Dan Peri Implan
                        </label>
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-m'>
                            Skor BPE:
                            {props.singlePersonUmum.kedatangan ===
                              'baru-kedatangan' && (
                              <span className='text-user6'>*</span>
                            )}
                          </p>
                          <div className='flex flex-row items-center relative'>
                            <select
                              disabled={isDisabled}
                              required={
                                props.singlePersonUmum.kedatangan ===
                                'baru-kedatangan'
                                  ? true
                                  : false
                              }
                              name='skor-bpe-pemeriksaan-umum'
                              id='skor-bpe-pemeriksaan-umum'
                              value={props.skorBpeOralHygienePemeriksaanUmum}
                              onChange={(e) => {
                                props.setSkorBpeOralHygienePemeriksaanUmum(
                                  e.target.value
                                );
                                if (parseInt(e.target.value) > 0) {
                                  props.setTidakPerluRawatanPemeriksaanUmum(
                                    false
                                  );
                                }
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            >
                              <option value=''></option>
                              <option value='tiada'>-</option>
                              <option value='0'>0</option>
                              <option value='1'>1</option>
                              <option value='2'>2</option>
                              <option value='3'>3</option>
                              <option value='4'>4</option>
                            </select>
                            <FaCaretDown className='absolute top-3 left-12 text-user4' />
                            <FaInfoCircle
                              title='Tanda (-) jika tidak berkenaan'
                              className='text-lg m-1'
                            />
                          </div>
                        </div>
                        <div className='flex items-center justify-start pl-3 col-span-2'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='peri-implant-mucositis'
                            id='peri-implant-mucositis'
                            value='peri-implant-mucositis'
                            checked={props.periImplantMucositis ? true : false}
                            onChange={() => {
                              props.setPeriImplantMucositis(
                                !props.periImplantMucositis
                              );
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='peri-implant-mucositis'
                            className='text-left flex justify-start items-center text-sm pl-3'
                          >
                            <i>Peri-Implant Mucositis {` < `} 6mm </i>
                          </label>
                        </div>
                        <div className='flex items-center justify-start pl-3 col-span-2'>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='peri-implantitis'
                            id='peri-implantitis'
                            value='peri-implantitis'
                            checked={props.periImplantitis ? true : false}
                            onChange={() => {
                              props.setPeriImplantitis(!props.periImplantitis);
                            }}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          />
                          <label
                            htmlFor='peri-implantitis'
                            className='text-left flex justify-start items-center text-sm pl-3'
                          >
                            <i>Peri-Implantitis ≥ 6mm</i>
                          </label>
                        </div>
                      </article>
                    ) : null}
                    {/* <div className='flex items-center justify-start pl-3 col-span-2'>
                    <input
                      disabled={isDisabled}
                      type='checkbox'
                      name='pesakit-mempunyai-implan-pergigian'
                      id='pesakit-mempunyai-implan-pergigian'
                      value='pesakit-mempunyai-implan-pergigian'
                      checked={
                        props.pesakitMempunyaiImplanPergigian ? true : false
                      }
                      onChange={() => {
                        props.setPesakitMempunyaiImplanPergigian(
                          !props.pesakitMempunyaiImplanPergigian
                        );
                      }}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                    />
                    <label
                      htmlFor='pesakit-mempunyai-implan-pergigian'
                      className='text-left flex justify-start items-center text-sm pl-3'
                    >
                      Pesakit Mempunyai Implan Pergigian
                    </label>
                  </div> */}
                  </article>
                ) : null}
                {props.singlePersonUmum.kedatangan === 'baru-kedatangan' &&
                props.statusKehadiran === false ? (
                  <article className='grid grid-cols-1 lg:grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-semibold flex flex-row pl-3 lg:col-span-2'>
                      kes endodontik diperlukan
                    </h4>
                    <div className='grid grid-cols-[2fr_1fr] items-center pl-3 col-start-1'>
                      <label
                        htmlFor='jumlah-anterior-kes-endodontik-diperlukan-pemeriksaan-umum'
                        className='text-left flex justify-start items-center text-sm'
                      >
                        anterior :
                      </label>
                      <input
                        disabled={isDisabled}
                        min='0'
                        max='12'
                        type='number'
                        name='jumlah-anterior-kes-endodontik-diperlukan-pemeriksaan-umum'
                        id='jumlah-anterior-kes-endodontik-diperlukan-pemeriksaan-umum'
                        value={
                          props.jumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum
                        }
                        onChange={(e) => {
                          props.setJumlahAnteriorKesEndodontikDiperlukanPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      />
                    </div>
                    <div className='grid grid-cols-[2fr_1fr] items-center pl-3 col-start-1'>
                      <label
                        htmlFor='jumlah-premolar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        className='text-sm font-m m-1 flex justify-start text-left'
                      >
                        premolar :
                      </label>
                      <input
                        disabled={isDisabled}
                        min='0'
                        max='8'
                        type='number'
                        name='jumlah-premolar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        id='jumlah-premolar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        value={
                          props.jumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum
                        }
                        onChange={(e) => {
                          props.setJumlahPremolarKesEndodontikDiperlukanPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      />
                    </div>
                    <div className='grid grid-cols-[2fr_1fr] items-center pl-3 col-start-1'>
                      <label
                        htmlFor='jumlah-molar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        className='text-sm font-m m-1 flex justify-start text-left'
                      >
                        molar :
                      </label>
                      <input
                        disabled={isDisabled}
                        min='0'
                        max='12'
                        type='number'
                        name='jumlah-molar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        id='jumlah-molar-kes-endodontik-diperlukan-pemeriksaan-umum'
                        value={
                          props.jumlahMolarKesEndodontikDiperlukanPemeriksaanUmum
                        }
                        onChange={(e) => {
                          props.setJumlahMolarKesEndodontikDiperlukanPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      />
                    </div>
                    <div className='grid grid-cols-[2fr_1fr] items-center pl-3 col-start-1'>
                      <label
                        htmlFor='rawatan-semula-endodontik-dari-primer-kes-endodontik-diperlukan-pemeriksaan-umum'
                        className='text-sm font-m m-1 flex justify-start text-left'
                      >
                        rawatan semula endodontik :
                      </label>
                      <input
                        disabled={isDisabled}
                        min='0'
                        max='32'
                        type='number'
                        name='rawatan-semula-endodontik-dari-primer-kes-endodontik-diperlukan-pemeriksaan-umum'
                        id='rawatan-semula-endodontik-dari-primer-kes-endodontik-diperlukan-pemeriksaan-umum'
                        value={
                          props.rawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum
                        }
                        onChange={(e) => {
                          props.setRawatanSemulaEndodontikDariPrimerKesEndodontikDiperlukanPemeriksaanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                      />
                    </div>
                  </article>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
