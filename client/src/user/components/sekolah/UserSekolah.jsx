import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaCheckCircle,
  FaTimes,
  FaTimesCircle,
  FaCircle,
  FaAdjust,
  FaRegCircle,
  FaTooth,
  FaMinus,
  FaPlus,
  FaInfoCircle,
} from 'react-icons/fa';

import UserTambahKemaskiniPelajarSekolah from './UserTambahKemaskiniPelajarSekolah';

import UserTambahT1Sekolah from './UserTambahT1Sekolah';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import UserDeleteModal from '../UserDeleteModal';

function UserSekolah() {
  const {
    userToken,
    userinfo,
    reliefUserToken,
    navigate,
    refreshTimer,
    setRefreshTimer,
    masterDatePicker,
    toast,
  } = useGlobalUserAppContext();

  const { kodSekolah } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]); // ganti dah dengan pilihanSekolah terus
  const [tahunTingkatan, setTahunTingkatan] = useState([]);
  // const [kelasPelajar, setKelasPelajar] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanTahunTingkatan, setPilihanTahunTingkatan] = useState('');
  // const [pilihanKelasPelajar, setPilihanKelasPelajar] = useState('');
  const [filterNama, setFilterNama] = useState('');

  const [modalBegin, setModalBegin] = useState(false);
  const [muridBeginCurrentId, setMuridBeginCurrentId] = useState('');
  const [tarikhMelaksanakanBegin, setTarikhMelaksanakanBegin] = useState('');
  const [tarikhMelaksanakanBeginDP, setTarikhMelaksanakanBeginDP] =
    useState(null);
  const [submittingBegin, setSubmittingBegin] = useState(false);

  const [modalTambahKemaskiniPelajar, setModalTambahKemaskiniPelajar] =
    useState(false);
  const [modalTambahT1Sekolah, setModalTambahT1Sekolah] = useState(false);
  const [kemaskiniPelajarId, setKemaskiniPelajarId] = useState('');
  const [submittingTambahPelajar, setSubmittingTambahPelajar] = useState(false);
  const [dataFromPilihanTahunTingkatan, setDataFromPilihanTahunTingkatan] =
    useState({});

  const [pilihanHapusId, setPilihanHapusId] = useState('');
  const [pilihanHapusNama, setPilihanHapusNama] = useState('');
  const [modalHapus, setModalHapus] = useState(false);

  const [fasilitiSekolah, setFasilitiSekolah] = useState({});

  // accordian rawatan
  const [accordian, setAccordian] = useState([]);

  //multiple select
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [showOptions, setShowOptions] = useState(false);
  // let statusRawatanRef = useRef();

  const [reloadState, setReloadState] = useState(false);

  const TarikhBegin = () => {
    return masterDatePicker({
      selected: tarikhMelaksanakanBeginDP,
      required: true,
      onChange: (tarikhMelaksanakanBegin) => {
        const tempDate = moment(tarikhMelaksanakanBegin).format('YYYY-MM-DD');
        setTarikhMelaksanakanBeginDP(tarikhMelaksanakanBegin);
        setTarikhMelaksanakanBegin(tempDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

  // useEffect(() => {
  //   let tutupStatusRawatan = (e) => {
  //     if (!statusRawatanRef.current.contains(e.target)) {
  //       setShowOptions(false);
  //     }
  //   };
  //   document.addEventListener('mousedown', tutupStatusRawatan);
  //   return () => {
  //     document.removeEventListener('mousedown', tutupStatusRawatan);
  //   };
  // });

  // Options Multi Select
  const optionsFiltered = [
    { value: 'belum mula', label: 'Belum mula' },
    { value: 'enggan', label: 'Enggan' },
    { value: 'tidak hadir', label: 'Tidak hadir' },
    { value: 'belum selesai', label: 'Belum selesai' },
    { value: 'enggan rawatan', label: 'Enggan rawatan' },
    { value: 'tidak hadir rawatan', label: 'Tidak hadir rawatan' },
    { value: 'selesai', label: 'Selesai' },
  ];

  // init fetch allPersonSekolahs
  useEffect(() => {
    const fetchAllPersonSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/sekolah/populate-satu-sekolah/${kodSekolah}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );

        // reduce
        const tahunTingkatan = data.allPersonSekolahs.reduce(
          (arrTahunTingkatan, singlePersonSekolah) => {
            if (
              !arrTahunTingkatan.includes(singlePersonSekolah.tahunTingkatan)
            ) {
              arrTahunTingkatan.push(singlePersonSekolah.tahunTingkatan);
            }
            return arrTahunTingkatan.filter((valid) => valid);
          },
          ['']
        );
        setTahunTingkatan(tahunTingkatan);

        setAllPersonSekolahs(data.allPersonSekolahs);
        setPilihanSekolah(data.fasilitiSekolah.nama);
        setFasilitiSekolah(data.fasilitiSekolah);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPersonSekolahs();
  }, [reloadState]);

  const handleSubmitBegin = async (e) => {
    e.preventDefault();
    setSubmittingBegin(true);
    await toast
      .promise(
        axios.patch(
          `/api/v1/sekolah/ubah/${muridBeginCurrentId}`,
          {
            tarikhMelaksanakanBegin,
            namaPelaksanaBegin: userinfo.nama,
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
          pending: 'Sedang mengemaskini maklumat BEGIN pelajar',
          success: 'Berjaya mengemaskini maklumat BEGIN pelajar',
          error: 'Gagal mengemaskini maklumat BEGIN pelajar',
        },
        { autoClose: 5000 }
      )
      .then(() => {
        setReloadState(!reloadState);
        setSubmittingBegin(false);
        setModalBegin(false);
      })
      .catch((err) => {
        console.log(err);
        // setReloadState(!reloadState);
        setSubmittingBegin(false);
        // setModalBegin(false);
      });
  };

  const handleDelete = async (singlePelajar, reason) => {
    if (!modalHapus) {
      setModalHapus(true);
      return;
    }
    if (modalHapus) {
      let mdcMdtbNum = '';
      if (!userinfo.mdtbNumber) {
        mdcMdtbNum = userinfo.mdcNumber;
      }
      if (!userinfo.mdcNumber) {
        mdcMdtbNum = userinfo.mdtbNumber;
      }
      await toast.promise(
        axios.patch(
          `/api/v1/sekolah/delete/${singlePelajar}`,
          {
            deleteReason: reason,
            createdByMdcMdtb: mdcMdtbNum,
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
          pending: 'Menghapus pesakit...',
          success: 'Pesakit berjaya dihapus',
          error: 'Pesakit gagal dihapus',
        },
        { autoClose: 5000 }
      );
      setModalHapus(false);
      setReloadState(!reloadState);
    }
  };

  // reset value tarikhMelaksanakanBegin & tarikhMelaksanakanBeginDP when modalBegin false
  useEffect(() => {
    if (!modalBegin) {
      setTarikhMelaksanakanBegin('');
      setTarikhMelaksanakanBeginDP(null);
    }
  }, [modalBegin]);

  // find first person of pilihanTahunTingkatan and setDataFromPilihanTahunTingkatan
  useEffect(() => {
    if (pilihanTahunTingkatan) {
      const firstPerson = allPersonSekolahs.find(
        (person) => person.tahunTingkatan === pilihanTahunTingkatan
      );
      setDataFromPilihanTahunTingkatan(firstPerson);
    }
  }, [pilihanTahunTingkatan]);

  // reduce
  // useEffect(() => {
  //   const tahunTingkatan = allPersonSekolahs.reduce(
  //     (arrTahunTingkatan, singlePersonSekolah) => {
  //       if (!arrTahunTingkatan.includes(singlePersonSekolah.tahunTingkatan)) {
  //         arrTahunTingkatan.push(singlePersonSekolah.tahunTingkatan);
  //       }
  //       return arrTahunTingkatan.filter((valid) => valid);
  //     },
  //     ['']
  //   );

  //   const order = [
  //     'PRASEKOLAH',
  //     'DAFTAR KE TAHUN SATU',
  //     'PRA UNIVERSITI SEM 2',
  //     'PRA UNIVERSITI SEM 3',
  //     'PRA UNIVERSITI SEM 4',
  //     'INTERNATIONAL BACCALAUREATE SEM 1',
  //     'INTERNATIONAL BACCALAUREATE SEM 2',
  //     'INTERNATIONAL BACCALAUREATE SEM 3',
  //     'INTERNATIONAL BACCALAUREATE SEM 4',
  //     'RENDAH ASAS',
  //     'RENDAH PERDANA',
  //     'MENENGAH ASAS',
  //     'MENENGAH PERDANA',
  //     'TAHUN SATU',
  //     'TAHUN DUA',
  //     'TAHUN TIGA',
  //     'TAHUN EMPAT',
  //     'TAHUN LIMA',
  //     'TAHUN ENAM',
  //     'KELAS KHAS RENDAH',
  //     'PERALIHAN',
  //     'TINGKATAN SATU',
  //     'TINGKATAN DUA',
  //     'TINGKATAN TIGA',
  //     'TINGKATAN EMPAT',
  //     'TINGKATAN LIMA',
  //     // 'TINGKATAN ENAM SEM 1',
  //     // 'TINGKATAN ENAM SEM 2',
  //     'BELUM / TIDAK BERSEKOLAH',
  //     'KOLEJ / UNIVERSITI',
  //     'TAMAT PERSEKOLAHAN / PENGAJIAN',
  //     'TIADA MAKLUMAT',
  //     'KELAS KHAS MENENGAH',
  //     'SEM 1 SIJIL VOKASIONAL MALAYSIA',
  //     'SEM 2 SIJIL VOKASIONAL MALAYSIA',
  //     'SEM 3 SIJIL VOKASIONAL MALAYSIA',
  //     'SEM 4  SIJIL VOKASIONAL MALAYSIA',
  //     // 'STAM',
  //     'PRA UNIVERSITI SEM 1',
  //     'PPPC ASAS 1',
  //     'PPPC ASAS 2',
  //     'PPPC ASAS 3',
  //     'PPPC TAHAP 1',
  //     'PPPC TAHAP 2',
  //     'TINGKATAN LIMA RENDAH',
  //     'TINGKATAN LIMA ATAS',
  //     // 'TINGKATAN ENAM SEM 3',
  //     'SEM 1 DIPLOMA VOKASIONAL MALAYSIA',
  //     'SEM 2 DIPLOMA VOKASIONAL MALAYSIA',
  //     'SEM 3 DIPLOMA VOKASIONAL MALAYSIA',
  //     'SEM 4 DIPLOMA VOKASIONAL MALAYSIA',
  //     'SEM 5 DIPLOMA VOKASIONAL MALAYSIA',
  //   ];

  //   let tahunTingkatanInOrder = [];

  //   for (var i = 0; i < order.length; i++) {
  //     if (tahunTingkatan.indexOf(order[i]) > -1) {
  //       tahunTingkatanInOrder.push(order[i]);
  //     }
  //   }

  //   setTahunTingkatan(tahunTingkatan);
  // }, []);

  // useEffect(() => {
  //   const filteredTahun = allPersonSekolahs.filter((person) =>
  //     person.tahunTingkatan.includes(pilihanTahunTingkatan)
  //   );
  //   const kelasPelajar = filteredTahun.reduce(
  //     (arrKelasPelajar, singlePersonSekolah) => {
  //       if (!arrKelasPelajar.includes(singlePersonSekolah.kelasPelajar)) {
  //         arrKelasPelajar.push(singlePersonSekolah.kelasPelajar);
  //       }
  //       return arrKelasPelajar.filter((valid) => valid);
  //     },
  //     ['']
  //   );
  //   setKelasPelajar(kelasPelajar);
  //   setDahFilterTahun(filteredTahun);
  // }, [pilihanTahunTingkatan]);

  // reset value
  useEffect(() => {
    // setPilihanKelasPelajar('');
    setFilterNama('');
  }, [pilihanTahunTingkatan]);

  // useEffect(() => {
  //   setFilterNama('');
  // }, [pilihanKelasPelajar]);

  // on tab focus reload data
  useEffect(() => {
    window.addEventListener('focus', setReloadState);
    setReloadState(!reloadState);
    return () => {
      window.removeEventListener('focus', setReloadState);
    };
  }, []);

  // specific refreshTimer for this UserSekolah special case
  useEffect(() => {
    setRefreshTimer(!refreshTimer);
  }, [pilihanTahunTingkatan, /*pilihanKelasPelajar,*/ filterNama]);

  const handleAccordian = (e) => {
    if (accordian.includes(e)) {
      setAccordian(accordian.filter((a) => a !== e));
    } else {
      setAccordian([...accordian, e]);
    }
  };

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative mb-2'>
          <div className=''>
            <div className='flex justify-between'>
              <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
                CARIAN MURID
              </h2>
              <div className='flex justify-end items-center text-right mt-2'>
                {fasilitiSekolah.sekolahSelesaiReten == true ? null : (
                  <div>
                    {pilihanTahunTingkatan && (
                      <span className=' uppercase text-xs lg:text-sm w-full'>
                        <button
                          onClick={() => {
                            setModalTambahKemaskiniPelajar(true);
                          }}
                          className='capitalize bg-user10 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user11 transition-all'
                        >
                          Tambah pelajar
                        </button>
                      </span>
                    )}
                  </div>
                )}
                <div>
                  {pilihanTahunTingkatan === '' &&
                    pilihanTahunTingkatan !== 'T1' &&
                    !tahunTingkatan.includes('T1') &&
                    pilihanSekolah.includes('MAKTAB RENDAH SAINS MARA') && (
                      <button
                        onClick={() => {
                          setModalTambahT1Sekolah(true);
                        }}
                        className='flex bg-user14 text-xs text-userWhite rounded-md shadow-xl p-1 my-3 mb-3 mr-2 hover:bg-user1 transition-all'
                      >
                        Tambah Pelajar Tingkatan 1
                        <FaInfoCircle
                          title='Penambahan ini adalah buat murid pertama Tingkatan 1 sahaja. Penambahan seterusnya boleh dibuat selepas memilih Tahun/Tingkatan >> T1'
                          className='m-1 mx-2 text-md'
                        />
                      </button>
                    )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      navigate(-1);
                    }}
                    className='capitalize whitespace-nowrap bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                  >
                    kembali ke senarai sekolah
                  </button>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
              <div className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Sekolah:
                </span>
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <input
                    disabled
                    type='text'
                    name='pilihan-sekolah'
                    id='pilihan-sekolah'
                    value={pilihanSekolah ? pilihanSekolah : 'SEDANG MEMUAT...'}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  />
                </span>
              </div>
              <div className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tahun / Tingkatan:
                </span>
                <span className='uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanTahunTingkatan}
                    onChange={(e) => {
                      setPilihanTahunTingkatan(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanSekolah
                      ? tahunTingkatan.map((singleTahun, index) => {
                          return (
                            <option
                              value={singleTahun}
                              key={index}
                              className='capitalize'
                            >
                              {singleTahun}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </span>
              </div>
              {/* <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Kelas:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanKelasPelajar}
                    onChange={(e) => {
                      setPilihanKelasPelajar(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanTahunTingkatan
                      ? kelasPelajar.map((singleNamaKelas, index) => {
                          return (
                            <option
                              value={singleNamaKelas}
                              key={index}
                              className='capitalize'
                            >
                              {singleNamaKelas}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </span>
              </p> */}
              <div className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Nama Pelajar:
                </span>
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <input
                    type='text'
                    value={filterNama}
                    placeholder='SILA MASUKKAN NAMA PELAJAR'
                    onChange={(e) => {
                      setFilterNama(e.target.value.toUpperCase());
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  />
                </span>
              </div>
              <div
                className='grid grid-cols-[1fr_3fr] pb-1 row-span-2'
                // ref={statusRawatanRef}
              >
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end  mr-2'>
                  Status Murid:
                </span>
                <span className='text-xs lg:text-sm w-full relative'>
                  {/* {pilihanTahunTingkatan ? (
                    <input
                      type='text'
                      className='appearance-none text-xs lg:text-sm w-full px-2 py-1 text-user1 uppercase border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent cursor-pointer'
                      value={selectedOptions.join(', ')}
                      placeholder='SILA PILIH STATUS'
                      readOnly
                      onClick={() => setShowOptions(!showOptions)}
                    />
                  ) : (
                    <input
                      type='text'
                      className='appearance-none text-xs text-user1 lg:text-sm w-full px-2 py-1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent cursor-not-allowed'
                      value='SILA PILIH TAHUN/TINGKATAN'
                      readOnly
                    />
                  )} */}
                  <span className='grid grid-cols-3 justify-start text-left bg-userWhite'>
                    {optionsFiltered.map((option) => (
                      <label
                        key={option.value}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type='checkbox'
                          value={option.value}
                          checked={selectedOptions.includes(option.value)}
                          onChange={(event) => {
                            const { value, checked } = event.target;
                            if (checked) {
                              setSelectedOptions((prevSelectedOptions) => [
                                ...prevSelectedOptions,
                                value,
                              ]);
                            } else {
                              setSelectedOptions((prevSelectedOptions) =>
                                prevSelectedOptions.filter(
                                  (valueOption) => valueOption !== value
                                )
                              );
                            }
                          }}
                        />
                        <span className='uppercase'>{option.label}</span>
                      </label>
                    ))}
                  </span>
                </span>
              </div>
              <div className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Status sekolah:
                </span>{' '}
                {pilihanSekolah ? (
                  <span className='uppercase text-xs lg:text-sm w-full'>
                    {pilihanSekolah &&
                    fasilitiSekolah.sekolahSelesaiReten === true ? (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-user7 font-semibold border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='SUDAH SELESAI'
                        readOnly
                      />
                    ) : (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-user9 font-semibold border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='BELUM SELESAI'
                        readOnly
                      />
                    )}
                  </span>
                ) : (
                  <input
                    type='text'
                    className='appearance-none text-xs lg:text-sm w-full px-2 py-1 text-userBlack border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent'
                    value='SEDANG MEMUAT...'
                    readOnly
                  />
                )}
              </div>
              <div className='grid grid-cols-[1fr_3fr] pb-1'>
                <span />
              </div>
            </div>
          </div>
        </div>
        <div className='m-auto text-xs lg:text-sm rounded-md h-min max-w-max overflow-x-auto'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-2 w-96'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-2 w-96'>
                  MAKLUMAT TAMBAHAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap w-41'>
                  OPERATOR PEMERIKSAAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-5 py-1 w-36'>
                  STATUS
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-40'>
                  PEMERIKSAAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-40'>
                  RAWATAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-36'>
                  STATUS <i>CRA</i>
                </th>
                {pilihanSekolah &&
                pilihanTahunTingkatan &&
                !pilihanTahunTingkatan.includes('TINGKATAN') ? (
                  <th className='outline outline-1 outline-offset-1 px-2 py-1 w-36'>
                    AKTIVITI BEGIN
                  </th>
                ) : null}
                <th className='px-2 py-1 outline outline-1 outline-offset-1 w-36'>
                  HAPUS
                </th>
              </tr>
            </thead>
            {/* TODO disable semua data input if person sekolah berpindah === true */}
            {!isLoading &&
              pilihanSekolah &&
              pilihanTahunTingkatan &&
              allPersonSekolahs
                .filter(
                  (person) =>
                    // person.namaSekolah.includes(pilihanSekolah) &&
                    person.tahunTingkatan.includes(pilihanTahunTingkatan) &&
                    person.nama.includes(filterNama)
                )
                .filter((person) => {
                  if (selectedOptions.length === 0) {
                    return true;
                  }
                  return selectedOptions.includes(person.statusRawatan);
                })
                .map((singlePersonSekolah, index) => {
                  return (
                    <>
                      <tbody className='bg-user4'>
                        <tr key={singlePersonSekolah._id}>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            {index + 1}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-2 px-3 text-left'>
                            {singlePersonSekolah.nama}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-2 px-3 text-left'>
                            <div className='text-justify'>
                              {/* <p className='whitespace-nowrap'>
                                NOMBOR PENGENALAN :{' '}
                                {singlePersonSekolah.nomborId}
                              </p> */}
                              <p className='whitespace-nowrap'>
                                JANTINA : {singlePersonSekolah.jantina}
                              </p>
                              {/* <p className='whitespace-nowrap'>
                                TARIKH LAHIR :{' '}
                                {moment(singlePersonSekolah.tarikhLahir).format(
                                  'DD/MM/YYYY'
                                )}
                              </p> */}
                              <p className='whitespace-nowrap'>
                                UMUR : {singlePersonSekolah.umur}
                              </p>
                              <p className='whitespace-nowrap'>
                                KETURUNAN :{' '}
                                {singlePersonSekolah.keturunan ===
                                'TIADA MAKLUMAT' ? (
                                  <span className='font-semibold text-user9'>
                                    {singlePersonSekolah.keturunan}
                                  </span>
                                ) : (
                                  <span>{singlePersonSekolah.keturunan}</span>
                                )}
                              </p>
                              <p className='whitespace-nowrap'>
                                WARGANEGARA :{' '}
                                {singlePersonSekolah.warganegara ? (
                                  singlePersonSekolah.warganegara
                                ) : (
                                  <span className='font-semibold text-user9'>
                                    TIADA MAKLUMAT
                                  </span>
                                )}
                              </p>
                              <p className='whitespace-nowrap'>
                                STATUS OKU :{' '}
                                {singlePersonSekolah.statusOku === ':'
                                  ? 'BUKAN OKU'
                                  : 'OKU'}
                              </p>
                              <span>
                                {fasilitiSekolah.sekolahSelesaiReten ===
                                true ? null : (
                                  <span className='md:flex md:shrink-0 text-center sm:text-left py-2'>
                                    {singlePersonSekolah.pemeriksaanSekolah ? null : (
                                      <button
                                        onClick={() => {
                                          setModalTambahKemaskiniPelajar(true);
                                          setKemaskiniPelajarId(
                                            singlePersonSekolah._id
                                          );
                                        }}
                                        className='bg-user3 hover:bg-user7 text-userWhite transition-all font-bold py-2 px-4 rounded shadow-md'
                                      >
                                        Kemaskini
                                      </button>
                                    )}
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-2 px-3 text-left'>
                            {singlePersonSekolah.pemeriksaanSekolah
                              ? singlePersonSekolah.pemeriksaanSekolah
                                  .createdByUsername
                              : null}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 whitespace-nowrap text-left pl-0.5'>
                            {singlePersonSekolah.statusRawatan === 'enggan' ? (
                              <FaTimes className='text-user9 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'tidak hadir' ? (
                              <FaCircle className='text-user9 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'enggan rawatan' ? (
                              <FaTimes className='text-user9 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'tidak hadir rawatan' ? (
                              <FaCircle className='text-user9 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'selesai' ? (
                              <FaCircle className='text-user7 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'belum selesai' ? (
                              <FaAdjust className='text-user8 mx-2 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'belum mula' ? (
                              <FaRegCircle className='text-user8 mx-2 inline-flex' />
                            ) : null}
                            {singlePersonSekolah.statusRawatan}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
                              rel='noreferrer'
                              to={`/pengguna/landing/senarai-sekolah/sekolah/form-sekolah/pemeriksaan/${
                                singlePersonSekolah._id
                              }/${
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? singlePersonSekolah.pemeriksaanSekolah._id
                                  : 'tambah-pemeriksaan'
                              }`}
                              className={`${
                                singlePersonSekolah.statusRawatan === 'enggan'
                                  ? 'pointer-events-none text-userBlack shadow-none'
                                  : singlePersonSekolah.statusRawatan ===
                                    'tidak hadir'
                                  ? 'pointer-events-none text-userBlack shadow-none'
                                  : singlePersonSekolah.pemeriksaanSekolah
                                  ? 'bg-user7 text-userWhite shadow-md'
                                  : fasilitiSekolah.sekolahSelesaiReten === true
                                  ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                                  : 'bg-user6 text-userWhite shadow-md'
                              } hover:bg-user8 rounded-sm p-1 m-1 transition-all`}
                            >
                              {singlePersonSekolah.statusRawatan === 'enggan'
                                ? 'Enggan'
                                : singlePersonSekolah.statusRawatan ===
                                  'tidak hadir'
                                ? 'Tidak Hadir'
                                : singlePersonSekolah.pemeriksaanSekolah
                                ? 'lihat pemeriksaan'
                                : fasilitiSekolah.sekolahSelesaiReten === true
                                ? 'Pemeriksaan Ditutup'
                                : 'Tambah Pemeriksaan'}
                            </Link>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            {fasilitiSekolah.sekolahSelesaiReten === false ? (
                              <Link
                                target='_blank'
                                rel='noreferrer'
                                to={`/pengguna/landing/senarai-sekolah/sekolah/form-sekolah/rawatan/${singlePersonSekolah._id}`}
                                className={`${
                                  singlePersonSekolah.statusRawatan === 'enggan'
                                    ? 'pointer-events-none text-userBlack shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'tidak hadir'
                                    ? 'pointer-events-none text-userBlack shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'enggan rawatan'
                                    ? 'pointer-events-none text-userBlack shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'tidak hadir rawatan'
                                    ? 'pointer-events-none text-userBlack shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'selesai'
                                    ? ' bg-user7 text-userWhite shadow-md hover:bg-user8'
                                    : !singlePersonSekolah.pemeriksaanSekolah
                                    ? 'pointer-events-none text-userWhite bg-user4 shadow-none'
                                    : 'bg-user3 text-userWhite hover:bg-user2 shadow-md'
                                } rounded-sm  p-1 m-1 transition-all`}
                              >
                                {singlePersonSekolah.statusRawatan === 'enggan'
                                  ? 'Enggan'
                                  : singlePersonSekolah.statusRawatan ===
                                    'tidak hadir'
                                  ? 'Tidak Hadir'
                                  : singlePersonSekolah.statusRawatan ===
                                    'enggan rawatan'
                                  ? 'Enggan Rawatan'
                                  : singlePersonSekolah.statusRawatan ===
                                    'tidak hadir rawatan'
                                  ? 'Tidak Hadir Rawatan'
                                  : singlePersonSekolah.statusRawatan ===
                                    'selesai'
                                  ? 'selesai rawatan'
                                  : 'tambah rawatan'}
                              </Link>
                            ) : (
                              <span className='bg-user4 text-userWhite rounded-sm  p-1 m-1 transition-all'>
                                rawatan ditutup
                              </span>
                            )}
                            {/* keluar berapa rawatan & rawatan apa */}
                            {singlePersonSekolah.rawatanSekolah.length >= 1 &&
                              (singlePersonSekolah.statusRawatan ===
                                'belum selesai' ||
                                singlePersonSekolah.statusRawatan ===
                                  'selesai') && (
                                <div className='inline-flex'>
                                  <span
                                    className='hover:cursor-pointer text-xs font-medium bg-user8 rounded-full px-2 py-1 capitalize transition-all whitespace-nowrap'
                                    onClick={() => {
                                      setIsShown({
                                        ...isShown,
                                        [singlePersonSekolah._id]: true,
                                      });
                                    }}
                                  >
                                    {singlePersonSekolah.rawatanSekolah.length}
                                  </span>
                                  <div
                                    className={`${
                                      isShown[singlePersonSekolah._id]
                                        ? 'block overflow-y-auto'
                                        : 'hidden '
                                    } absolute inset-x-0 inset-y-0 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 overflow-y-auto rounded-md shadow-sm shadow-user1`}
                                  >
                                    <div className='flex p-4'>
                                      <h1 className='text-lg font-medium'>
                                        Rawatan
                                      </h1>
                                    </div>
                                    {singlePersonSekolah.rawatanSekolah.map(
                                      (rawatan, index) => {
                                        return (
                                          <div key={rawatan._id}>
                                            <h1
                                              onClick={() =>
                                                handleAccordian(index)
                                              }
                                              className='text-sm text-start font-semibold bg-user1 bg-opacity-50 text-userWhite flex flex-row items-center rounded-md p-1 m-1 cursor-pointer shadow-sm shadow-user1'
                                            >
                                              {accordian.includes(index) ? (
                                                <FaMinus className='m-1' />
                                              ) : (
                                                <FaPlus className='m-1' />
                                              )}
                                              Kedatangan {index + 1} -{' '}
                                              {moment(
                                                rawatan.tarikhRawatanSemasa
                                              ).format('DD/MM/YYYY')}
                                            </h1>
                                            {accordian.includes(index) && (
                                              <>
                                                <div className='text-xs overflow-y-auto rounded-md m-1 shadow-sm shadow-user3'>
                                                  <div className='grid grid-cols-[1fr_2fr]'>
                                                    <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                      Operator
                                                    </p>
                                                    <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                      {
                                                        rawatan.createdByUsername
                                                      }
                                                    </p>
                                                  </div>
                                                  {rawatan.baruJumlahGigiKekalDibuatFs ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Pengapan Fisur (FS)
                                                        (E10):
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.baruJumlahGigiKekalDibuatFs >
                                                        0 ? (
                                                          <p>
                                                            Pesakit Dibuat:
                                                            {rawatan.baruJumlahGigiKekalDibuatFs >
                                                            0 ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.baruJumlahGigiKekalDibuatFs ? (
                                                          <p>
                                                            Jumlah Gigi Kekal
                                                            Dibuat:
                                                            {
                                                              rawatan.baruJumlahGigiKekalDibuatFs
                                                            }
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.penggunaanKPBMPB ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Penggunaan KPB/MPB
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {
                                                          rawatan.penggunaanKPBMPB
                                                        }
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.muridDiberiFv ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Sapuan Florida (FV)
                                                        (E13):
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.muridDiberiFv ? (
                                                          <p>
                                                            Pesakit Diberi
                                                            Sapuan Florida (FV)
                                                            (E13):
                                                            {rawatan.muridDiberiFv ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.baruJumlahGigiKekalDiberiPrrJenis1 ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Resin Pencegahan Jenis 1
                                                        (PRR Type I) (E12):
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.baruJumlahGigiKekalDiberiPrrJenis1 >
                                                        0 ? (
                                                          <p>
                                                            Pesakit Diberi:
                                                            {rawatan.baruJumlahGigiKekalDiberiPrrJenis1 >
                                                            0 ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.baruJumlahGigiKekalDiberiPrrJenis1 ? (
                                                          <p>
                                                            Jumlah Gigi Kekal
                                                            Diberi:
                                                            {
                                                              rawatan.baruJumlahGigiKekalDiberiPrrJenis1
                                                            }
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat ||
                                                  rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat ||
                                                  rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat ||
                                                  rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat ||
                                                  rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Jumlah Tampalan Dibuat:
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Baru Anterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Semula Anterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Baru Anterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Semula Anterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Baru Posterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Semula Posterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Baru Posterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Semula Posterior
                                                            Sewarna:{' '}
                                                            {
                                                              rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Baru Posterior
                                                            Amalgam:{' '}
                                                            {
                                                              rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                                                          <p>
                                                            GD Semula Posterior
                                                            Amalgam:{' '}
                                                            {
                                                              rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Baru Posterior
                                                            Amalgam:{' '}
                                                            {
                                                              rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat ? (
                                                          <p>
                                                            GK Semula Posterior
                                                            Amalgam:{' '}
                                                            {
                                                              rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat
                                                            }
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.cabutDesidusSekolahRawatan ||
                                                  rawatan.cabutKekalSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Cabutan :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.cabutDesidusSekolahRawatan ? (
                                                          <p>
                                                            Desidus:{' '}
                                                            {
                                                              rawatan.cabutDesidusSekolahRawatan
                                                            }
                                                          </p>
                                                        ) : null}
                                                        {rawatan.cabutKekalSekolahRawatan ? (
                                                          <p>
                                                            Kekal:{' '}
                                                            {
                                                              rawatan.cabutKekalSekolahRawatan
                                                            }
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.jumlahTampalanSementaraSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Tampalan Sementara
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {
                                                          rawatan.jumlahTampalanSementaraSekolahRawatan
                                                        }
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.pulpotomiSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Pulpotomi :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {
                                                          rawatan.pulpotomiSekolahRawatan
                                                        }
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.endodontikSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Endodontik :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {
                                                          rawatan.endodontikSekolahRawatan
                                                        }
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.absesSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Abses :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {
                                                          rawatan.absesSekolahRawatan
                                                        }
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.penskaleranSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Penskaleran :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.penskaleranSekolahRawatan ===
                                                        true ? (
                                                          <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                        ) : (
                                                          <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                        )}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.rujukKlinikSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Rujukan Ke Klinik
                                                        Pergigian
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.rujukKlinikRawatanEndo ? (
                                                          <p>
                                                            Pesakit Dirujuk
                                                            Rawatan Endo:
                                                            {rawatan.rujukKlinikRawatanEndo ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.rujukKlinikCabutanGigiKekal ? (
                                                          <p>
                                                            Pesakit Dirujuk
                                                            Cabutan Gigi Kekal:
                                                            {rawatan.rujukKlinikCabutanGigiKekal ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.rujukKesTrauma ? (
                                                          <p>
                                                            Pesakit Dirujuk Kes
                                                            Trauma:
                                                            {rawatan.rujukKesTrauma ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.rujukMasalahKesihatan ? (
                                                          <p>
                                                            Pesakit Dirujuk
                                                            Masalah Kesihatan:
                                                            {rawatan.rujukMasalahKesihatan ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.rujukBukanWarganegara ? (
                                                          <p>
                                                            Pesakit Dirujuk
                                                            Kerana Bukan
                                                            Warganegara:
                                                            {rawatan.rujukBukanWarganegara ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.rujukLainLain ? (
                                                          <p>
                                                            Pesakit Dirujuk
                                                            Lain-lain:
                                                            <p>
                                                              {rawatan.rujukLainLain &&
                                                                rawatan.rujukLainLanjutan}
                                                              {rawatan.rujukLainLanjutan && (
                                                                <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                              )}
                                                            </p>
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.kesSelesaiSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Status Rawatan :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.kesSelesaiSekolahRawatan ? (
                                                          <p>
                                                            Kes Selesai
                                                            {rawatan.kesSelesaiSekolahRawatan ===
                                                            'ya-kes-selesai-penyata-akhir-2' ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.kesSelesaiIcdasSekolahRawatan ? (
                                                          <p>
                                                            Kes Selesai ICDAS:
                                                            {rawatan.kesSelesaiIcdasSekolahRawatan ===
                                                            'ya-kes-selesai-icdas-penyata-akhir-2' ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.rujukRawatanOrtodontikSekolahRawatan ||
                                                  rawatan.rujukPakarPatologiSekolahRawatan ||
                                                  rawatan.rujukPakarRestoratifSekolahRawatan ||
                                                  rawatan.rujukPakarBedahMulutSekolahRawatan ||
                                                  rawatan.rujukPakarPediatrikSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Rujukan :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        <a>
                                                          {rawatan.rujukRawatanOrtodontikSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Pakar ortodontik'
                                                            : ''}
                                                        </a>
                                                        <a>
                                                          {rawatan.rujukPakarPatologiSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Pakar Patologi Mulut dan Perubatan Mulut'
                                                            : ''}
                                                        </a>
                                                        <a>
                                                          {rawatan.rujukPakarRestoratifSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Pakar Restoratif'
                                                            : ''}
                                                        </a>
                                                        <a>
                                                          {rawatan.rujukPakarBedahMulutSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Pakar Bedah Mulut Dan Maksilofasial'
                                                            : ''}
                                                        </a>
                                                        <a>
                                                          {rawatan.rujukPakarPediatrikSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Pakar Pergigian Pediatrik'
                                                            : ''}
                                                        </a>
                                                        <a>
                                                          {rawatan.rujukKlinikSekolahRawatan ===
                                                          true
                                                            ? 'Rujukan Ke Klinik'
                                                            : ''}
                                                        </a>
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        Aktiviti Begin :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                                                        'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2' ? (
                                                          <p>
                                                            Ya, Melaksanakan
                                                            Aktiviti Begin
                                                            Promosi
                                                            <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                          </p>
                                                        ) : (
                                                          <p>
                                                            Tidak, Melaksanakan
                                                            Aktiviti Begin
                                                            Promosi
                                                            <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                          </p>
                                                        )}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                  {rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ||
                                                  rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ||
                                                  rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ||
                                                  rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                                                    <div className='grid grid-cols-[1fr_2fr]'>
                                                      <p className='p-1 flex whitespace-pre-wrap justify-end text-right bg-user1 bg-opacity-5'>
                                                        menerima aktiviti
                                                        nasihat pergigian
                                                        individu :
                                                      </p>
                                                      <p className='p-1 flex flex-col justify-start text-left border-y border-y-user1 border-opacity-10'>
                                                        {rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ? (
                                                          <p>
                                                            nasihat berkaitan
                                                            plak gigi
                                                            {rawatan.plakGigiNasihatPergigianIndividuPromosiSekolahRawatan ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ? (
                                                          <p>
                                                            nasihat berkaitan
                                                            diet pemakanan
                                                            {rawatan.dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                                                          <p>
                                                            nasihat berkaitan
                                                            penjagaan kesihatan
                                                            oral
                                                            {rawatan.penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                        {rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ? (
                                                          <p>
                                                            nasihat berkaitan
                                                            kanser mulut
                                                            {rawatan.kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan ===
                                                            true ? (
                                                              <FaCheckCircle className='text-user7 text-center mx-1 inline-flex' />
                                                            ) : (
                                                              <FaTimesCircle className='text-user9 text-center mx-1 inline-flex' />
                                                            )}
                                                          </p>
                                                        ) : null}
                                                      </p>
                                                    </div>
                                                  ) : null}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              )}
                          </td>
                          {/* <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                              <Link
                                target='_blank'
                                rel='noreferrer'
                                to={`form-sekolah/kotak/${
                                  singlePersonSekolah._id
                                }/${
                                  singlePersonSekolah.kotakSekolah
                                    ? singlePersonSekolah.kotakSekolah._id
                                    : 'tambah-kotak'
                                }`}
                                className={`${
                                  !singlePersonSekolah.kotakSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah
                                    ? // .inginMelakukanIntervensiMerokok ===
                                      // 'ya-ingin-melakukan-intervensi-merokok'
                                      'bg-user6'
                                    : singlePersonSekolah.kotakSekolah &&
                                      singlePersonSekolah.pemeriksaanSekolah &&
                                      singlePersonSekolah.pemeriksaanSekolah
                                    ? // .inginMelakukanIntervensiMerokok ===
                                      // 'ya-ingin-melakukan-intervensi-merokok'
                                      'bg-user7'
                                    : 'pointer-events-none bg-user4'
                                } hover:bg-user8 text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                              >
                                {!singlePersonSekolah.kotakSekolah &&
                                singlePersonSekolah.pemeriksaanSekolah &&
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? // .inginMelakukanIntervensiMerokok ===
                                    // 'ya-ingin-melakukan-intervensi-merokok'
                                    'tambah KOTAK'
                                  : singlePersonSekolah.kotakSekolah &&
                                    singlePersonSekolah.pemeriksaanSekolah &&
                                    // singlePersonSekolah.pemeriksaanSekolah
                                    //   .inginMelakukanIntervensiMerokok ===
                                    'ya-ingin-melakukan-intervensi-merokok'
                                  ? 'ubah KOTAK'
                                  : 'tidak perlu KOTAK'}
                              </Link>
                            </td> */}
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2'>
                            {singlePersonSekolah.pemeriksaanSekolah ? (
                              <p className='text-sm text-userBlack text-center flex items-center justify-center'>
                                {
                                  singlePersonSekolah.pemeriksaanSekolah
                                    .penandaRisikoKaries
                                }
                                <FaCircle
                                  className={`${
                                    singlePersonSekolah.pemeriksaanSekolah
                                      .penandaRisikoKaries === 'rendah'
                                      ? 'text-user7'
                                      : singlePersonSekolah.pemeriksaanSekolah
                                          .penandaRisikoKaries === 'sederhana'
                                      ? 'text-user8'
                                      : singlePersonSekolah.pemeriksaanSekolah
                                          .penandaRisikoKaries === 'tinggi'
                                      ? 'text-user9'
                                      : ''
                                  } inline-flex text-center ml-1`}
                                />
                              </p>
                            ) : (
                              <p className='text-xs text-userWhite text-center flex items-center'>
                                Sila Tambah Pemeriksaan
                              </p>
                            )}
                          </td>
                          {!pilihanTahunTingkatan.includes('TINGKATAN') ? (
                            <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 '>
                              {singlePersonSekolah.pemeriksaanSekolah ? (
                                <button
                                  onClick={() => {
                                    setMuridBeginCurrentId(
                                      singlePersonSekolah._id
                                    );
                                    setModalBegin({
                                      ...modalBegin,
                                      [singlePersonSekolah._id]: true,
                                    });
                                  }}
                                  className={`hover:cursor-pointer hover:bg-user6 text-xs font-medium rounded-full px-2 py-1 capitalize transition-all whitespace-nowrap
                                  ${
                                    singlePersonSekolah.tarikhMelaksanakanBegin
                                      ? 'bg-user7'
                                      : 'bg-user8'
                                  }
                                  `}
                                >
                                  {singlePersonSekolah.tarikhMelaksanakanBegin ? (
                                    <span className='text-xs text-userWhite text-center flex items-center'>
                                      Selesai
                                      <FaCheckCircle className='text-userWhite inline-flex text-center ml-1' />
                                    </span>
                                  ) : (
                                    <span className='text-xs text-userBlack text-center flex items-center'>
                                      Tarikh Pelaksanaan
                                    </span>
                                  )}
                                </button>
                              ) : (
                                <p className='text-xs text-userWhite text-center flex items-center'>
                                  Sila Tambah Pemeriksaan
                                </p>
                              )}
                              {/* modal BEGIN */}
                              <div
                                className={`${
                                  modalBegin[singlePersonSekolah._id]
                                    ? 'block p-2 px-8 overflow-y-auto'
                                    : 'hidden '
                                } absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md m-2`}
                              >
                                <form onSubmit={handleSubmitBegin}>
                                  <p className='flex justify-center text-lg font-bold border-b border-b-user1 py-3'>
                                    Aktiviti BEGIN
                                  </p>
                                  <p className='flex justify-center whitespace-nowrap pt-3'>
                                    Tarikh murid ini melaksanakan Aktiviti
                                    BEGIN?
                                  </p>
                                  <p className='flex justify-center whitespace-nowrap pt-3'>
                                    <strong>{singlePersonSekolah.nama}</strong>{' '}
                                  </p>
                                  <div className='grid justify-center pt-5'>
                                    {singlePersonSekolah.tarikhMelaksanakanBegin ? (
                                      <div className='flex justify-center mt-3'>
                                        <span className='text-center text-base font-medium text-kaunter1'>
                                          Selesai pada{' '}
                                          <span className='text-xl font-semibold text-kaunter1'>
                                            {moment(
                                              singlePersonSekolah.tarikhMelaksanakanBegin
                                            ).format('DD/MM/YYYY')}
                                          </span>
                                        </span>
                                      </div>
                                    ) : (
                                      <TarikhBegin />
                                    )}
                                  </div>
                                  <div className='grid justify-center pt-5'>
                                    {singlePersonSekolah.namaPelaksanaBegin ? (
                                      <div className='flex justify-center mt-3'>
                                        <span className='text-center text-base font-medium text-kaunter1'>
                                          BEGIN telah dijalankan oleh{' '}
                                          <p className='text-xl font-semibold text-kaunter1'>
                                            {
                                              singlePersonSekolah.namaPelaksanaBegin
                                            }
                                          </p>
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className='flex justify-around absolute bottom-6 right-5 mt-2'>
                                    <span
                                      onClick={() => {
                                        setMuridBeginCurrentId('');
                                        setModalBegin(false);
                                      }}
                                      className='text-sm text-userBlack bg-userWhite py-2 px-7 rounded-md cursor-pointer focus:outline-none hover:bg-user5 ml-2'
                                    >
                                      Tutup
                                    </span>
                                    {singlePersonSekolah.tarikhMelaksanakanBegin ? null : submittingBegin ? (
                                      <button
                                        type='button'
                                        className='capitalize bg-user3 justify-center rounded-md p-2 mr-2 inline-flex cursor-not-allowed'
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
                                        Menghantar Data
                                      </button>
                                    ) : (
                                      <button
                                        type='submit'
                                        className='text-sm text-userWhite bg-user2 py-2 px-7 rounded-md cursor-pointer focus:outline-none hover:bg-user1 ml-2'
                                      >
                                        Hantar
                                      </button>
                                    )}
                                  </div>
                                </form>
                              </div>
                              {/* end of modal BEGIN */}
                            </td>
                          ) : null}
                          <td
                            className='
                               px-2 py-1 outline outline-1 outline-userWhite outline-offset-1'
                          >
                            {fasilitiSekolah.sekolahSelesaiReten == true ||
                            singlePersonSekolah.pemeriksaanSekolah ? null : (
                              <button
                                className='bg-user9 hover:bg-admin4 p-2 text-userWhite rounded-lg transition-all shadow-md'
                                onClick={() => {
                                  setModalHapus(true);
                                  setPilihanHapusId(singlePersonSekolah._id);
                                  setPilihanHapusNama(singlePersonSekolah.nama);
                                }}
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </>
                  );
                })}
            {isLoading ? (
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  {pilihanSekolah &&
                  pilihanTahunTingkatan &&
                  !pilihanTahunTingkatan.includes('TINGKATAN') ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  {pilihanSekolah &&
                  pilihanTahunTingkatan &&
                  !pilihanTahunTingkatan.includes('TINGKATAN') ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                </tr>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                  {pilihanSekolah &&
                  pilihanTahunTingkatan &&
                  !pilihanTahunTingkatan.includes('TINGKATAN') ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                  ) : null}
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            ) : (
              !pilihanTahunTingkatan && (
                <tbody className='bg-user4'>
                  <tr>
                    <td
                      colSpan={9}
                      className='px-2 py-2 outline outline-1 outline-userWhite font-semibold text-lg outline-offset-1 '
                    >
                      Sila pilih tahun/tingkatan dahulu
                    </td>
                  </tr>
                </tbody>
              )
            )}
          </table>
          {modalBegin && (
            <div
              className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
                modalBegin ? 'block' : 'hidden'
              }`}
              onClick={() => {
                setMuridBeginCurrentId('');
                setModalBegin(false);
              }}
            />
          )}
          <div
            className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
              isShown ? 'block' : 'hidden'
            }`}
            onClick={() => {
              setIsShown(false);
              setAccordian([]);
            }}
          />
        </div>
        {modalTambahKemaskiniPelajar && (
          <UserTambahKemaskiniPelajarSekolah
            modalTambahKemaskiniPelajar={modalTambahKemaskiniPelajar}
            setModalTambahKemaskiniPelajar={setModalTambahKemaskiniPelajar}
            kemaskiniPelajarId={kemaskiniPelajarId}
            setKemaskiniPelajarId={setKemaskiniPelajarId}
            submittingTambahPelajar={submittingTambahPelajar}
            setSubmittingTambahPelajar={setSubmittingTambahPelajar}
            reloadState={reloadState}
            setReloadState={setReloadState}
            dataFromPilihanTahunTingkatan={dataFromPilihanTahunTingkatan}
          />
        )}
        {modalTambahT1Sekolah && (
          <UserTambahT1Sekolah
            modalTambahT1Sekolah={modalTambahT1Sekolah}
            setModalTambahT1Sekolah={setModalTambahT1Sekolah}
            kemaskiniPelajarId={kemaskiniPelajarId}
            setKemaskiniPelajarId={setKemaskiniPelajarId}
            submittingTambahPelajar={submittingTambahPelajar}
            setSubmittingTambahPelajar={setSubmittingTambahPelajar}
            reloadState={reloadState}
            setReloadState={setReloadState}
            dataFromPilihanTahunTingkatan={dataFromPilihanTahunTingkatan}
            fasilitiSekolah={fasilitiSekolah}
          />
        )}
        {modalHapus && (
          <UserDeleteModal
            handleDelete={handleDelete}
            setModalHapus={setModalHapus}
            id={pilihanHapusId}
            nama={pilihanHapusNama}
          />
        )}
      </div>
    </>
  );
}

export default UserSekolah;
