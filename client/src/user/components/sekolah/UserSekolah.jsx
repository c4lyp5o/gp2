import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {
  FaCheckCircle,
  FaCircle,
  FaAdjust,
  FaRegCircle,
  FaTooth,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserSekolah() {
  const {
    userToken,
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
  // const [dahFilterSekolahs, setDahFilterSekolahs] = useState([]);
  // const [dahFilterTahun, setDahFilterTahun] = useState([]);
  const [sekMenRen, setSekMenRen] = useState('');
  // const [isFiltering, setIsFiltering] = useState(false);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [tahunTingkatan, setTahunTingkatan] = useState([]);
  const [kelasPelajar, setKelasPelajar] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanTahunTingkatan, setPilihanTahunTingkatan] = useState('');
  const [pilihanKelasPelajar, setPilihanKelasPelajar] = useState('');
  const [pilihanBegin, setPilihanBegin] = useState('');
  const [filterNama, setFilterNama] = useState('');
  const [modalBegin, setModalBegin] = useState(false);
  const [muridBeginCurrentId, setMuridBeginCurrentId] = useState('');
  const [tarikhMelaksanakanBegin, setTarikhMelaksanakanBegin] = useState('');
  const [tarikhMelaksanakanBeginDP, setTarikhMelaksanakanBeginDP] =
    useState(null);

  // const [fasilitiSekolah, setFasilitiSekolah] = useState([]);
  const [filteredFasilitiSekolah, setFilteredFasilitiSekolah] = useState([]);

  //accordian
  const [accordian, setAccordian] = useState(false);

  const [reloadState, setReloadState] = useState(false);

  const init = useRef(false);

  const TarikhBegin = (singlePersonSekolah) => {
    return masterDatePicker({
      selected: tarikhMelaksanakanBeginDP,
      onChange: (tarikhMelaksanakanBegin) => {
        const tempDate = moment(tarikhMelaksanakanBegin).format('YYYY-MM-DD');
        setTarikhMelaksanakanBeginDP(tarikhMelaksanakanBegin);
        setTarikhMelaksanakanBegin(tempDate);
        const tempId = singlePersonSekolah.singlePersonSekolah._id;
        setMuridBeginCurrentId(tempId);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      className:
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-user3 focus:ring-2 focus:ring-user2 focus:outline-none rounded-md shadow-md uppercase flex flex-row lg:ml-2',
    });
  };

  // init fetch allPersonSekolahs
  useEffect(() => {
    const fetchAllPersonSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/sekolah/faceted/${kodSekolah}`,
          {
            headers: {
              Authorization: `Bearer ${
                reliefUserToken ? reliefUserToken : userToken
              }`,
            },
          }
        );
        // console.log(data);
        // const allPersonSekolahs = data.allPersonSekolahs;
        // const namaSekolahs = allPersonSekolahs.reduce(
        //   (arrNamaSekolahs, singlePersonSekolah) => {
        //     if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
        //       arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
        //     }
        //     return arrNamaSekolahs.filter((valid) => valid);
        //   },
        //   ['']
        // );
        setPilihanSekolah(data.fasilitiSekolahs[0].nama);
        setPilihanBegin(data.fasilitiSekolahs[0].jenisFasiliti);
        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs([...namaSekolahs, data.fasilitiSekolahs[0].nama]);
        // setFasilitiSekolah(data.fasilitiSekolahs);
        setFilteredFasilitiSekolah(data.fasilitiSekolahs);
        setRefreshTimer(!refreshTimer);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchAllPersonSekolahs'
        // );
      }
    };
    init.current = false;
    if (!init.current) {
      init.current = true;
      fetchAllPersonSekolahs();
    }
  }, [reloadState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .patch(
        `/api/v1/sekolah/ubah/${muridBeginCurrentId}`,
        {
          tarikhMelaksanakanBegin,
        },
        {
          headers: {
            Authorization: `Bearer ${
              reliefUserToken ? reliefUserToken : userToken
            }`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setModalBegin(false);
        setReloadState(!reloadState);
        toast.success('Berjaya mengemaskini maklumat BEGIN sekolah');
      })
      .catch((err) => {
        console.log(err);
        setModalBegin(false);
        toast.error('Gagal mengemaskini maklumat BEGIN sekolah');
      });
  };

  useEffect(() => {
    // const filteredSekolahs = allPersonSekolahs.filter((person) =>
    //   person.namaSekolah.includes(pilihanSekolah)
    // );
    const tahunTingkatan = allPersonSekolahs.reduce(
      (arrTahunTingkatan, singlePersonSekolah) => {
        if (!arrTahunTingkatan.includes(singlePersonSekolah.tahunTingkatan)) {
          arrTahunTingkatan.push(singlePersonSekolah.tahunTingkatan);
        }
        return arrTahunTingkatan.filter((valid) => valid);
      },
      ['']
    );
    // console.log(tahunTingkatan);
    setTahunTingkatan(tahunTingkatan);
    // setDahFilterSekolahs(filteredSekolahs);
  }, [pilihanSekolah]);

  useEffect(() => {
    const filteredTahun = allPersonSekolahs.filter((person) =>
      person.tahunTingkatan.includes(pilihanTahunTingkatan)
    );
    const kelasPelajar = filteredTahun.reduce(
      (arrKelasPelajar, singlePersonSekolah) => {
        if (!arrKelasPelajar.includes(singlePersonSekolah.kelasPelajar)) {
          arrKelasPelajar.push(singlePersonSekolah.kelasPelajar);
        }
        return arrKelasPelajar.filter((valid) => valid);
      },
      ['']
    );
    setKelasPelajar(kelasPelajar);
    // setDahFilterTahun(filteredTahun);
  }, [pilihanTahunTingkatan]);

  // reset value
  useEffect(() => {
    setPilihanTahunTingkatan('');
    setPilihanKelasPelajar('');
    setFilterNama('');
  }, [pilihanSekolah]);

  useEffect(() => {
    setPilihanKelasPelajar('');
    setFilterNama('');
  }, [pilihanTahunTingkatan]);

  useEffect(() => {
    setFilterNama('');
  }, [pilihanKelasPelajar]);

  // fetch fasiliti sekolah to determine selesai reten
  // useEffect(() => {
  //   const fetchFasilitiSekolahs = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `/api/v1/sekolah/faceted/${kodSekolah}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               reliefUserToken ? reliefUserToken : userToken
  //             }`,
  //           },
  //         }
  //       );
  //       setFasilitiSekolah(data.fasilitiSekolahs);
  //       setFilteredFasilitiSekolah(data.fasilitiSekolahs);
  //     } catch (error) {
  //       console.log(error);
  //       // toast.error(
  //       //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-sekolah-fetchFasilitiSekolahs'
  //       // );
  //     }
  //   };
  //   fetchFasilitiSekolahs();
  // }, []);

  // useEffect(() => {
  //   setFilteredFasilitiSekolah(
  //     fasilitiSekolah.filter((f) => f.nama.includes(pilihanSekolah))
  //   );
  // }, [pilihanSekolah]);

  // useEffect(() => {
  //   setSekMenRen(
  //     fasilitiSekolah.filter((f) => f.kodSekolah.includes(namaSekolahs[0]))
  //   );
  // }, [fasilitiSekolah]);

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
  }, [pilihanSekolah, pilihanTahunTingkatan, pilihanKelasPelajar, filterNama]);

  const handleAccordian = (e) => {
    if (accordian === e) {
      setAccordian('');
    } else {
      setAccordian(e);
    }
  };

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div className='relative shadow-md drop-shadow-sm mb-2'>
          <div className=''>
            <div className='flex justify-between'>
              <h2 className='text-sm lg:text-xl font-semibold flex flex-row pl-2 lg:pl-12 pt-2'>
                CARIAN MURID
              </h2>
              <div className='flex justify-end items-center text-right mt-2'>
                <button
                  onClick={() => {
                    navigate(-1);
                  }}
                  className='capitalize bg-user3 text-xs text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
                >
                  kembali ke senarai sekolah
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2'>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Sekolah:
                </span>
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <input
                    disabled
                    type='text'
                    name='pilihan-sekolah'
                    id='pilihan-sekolah'
                    value={pilihanSekolah}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  />
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tahun:
                </span>{' '}
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <select
                    value={pilihanTahunTingkatan}
                    onChange={(e) => {
                      setPilihanTahunTingkatan(e.target.value);
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>SILA PILIH</option>
                    {pilihanSekolah ? (
                      tahunTingkatan.map((singleTahun, index) => {
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
                    ) : (
                      <option value=''>SILA PILIH SEKOLAH</option>
                    )}
                  </select>
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
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
                    {pilihanTahunTingkatan ? (
                      kelasPelajar.map((singleNamaKelas, index) => {
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
                    ) : (
                      <option value=''>SILA PILIH TAHUN</option>
                    )}
                  </select>
                </span>
              </p>
              {/* <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tarikh Mula:
                </span>
                {pilihanSekolah ? (
                  <span className='uppercase text-xs lg:text-sm w-full'>
                    {pilihanSekolah &&
                    filteredFasilitiSekolah[0].tarikhMulaSekolah ? (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user7 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value={filteredFasilitiSekolah[0].tarikhMulaSekolah}
                        readOnly
                      />
                    ) : (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user9 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='BELUM MULA'
                        readOnly
                      />
                    )}
                  </span>
                ) : (
                  <input
                    type='text'
                    className='appearance-none text-xs lg:text-sm w-full px-2 py-1 text-userBlack border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent'
                    value='SILA PILIH SEKOLAH'
                    readOnly
                  />
                )}
              </p> */}
              {/* <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Tarikh Tamat:
                </span>
              </p> */}
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Nama Pelajar:
                </span>
                <span className=' uppercase text-xs lg:text-sm w-full'>
                  <input
                    type='text'
                    value={filterNama}
                    onChange={(e) => {
                      setFilterNama(e.target.value.toUpperCase());
                    }}
                    className='appearance-none w-full px-2 py-1 text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  />
                </span>
              </p>
              <p className='grid grid-cols-[1fr_3fr] pb-1'>
                <span className='font-bold uppercase text-xs lg:text-sm flex justify-end place-items-center mr-2'>
                  Status sekolah:
                </span>{' '}
                {pilihanSekolah ? (
                  <span className='uppercase text-xs lg:text-sm w-full'>
                    {pilihanSekolah &&
                    filteredFasilitiSekolah[0].sekolahSelesaiReten === true ? (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user7 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='SEKOLAH SUDAH SELESAI RETEN'
                        readOnly
                      />
                    ) : (
                      <input
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-userBlack bg-user9 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        value='SEKOLAH BELUM SELESAI RETEN'
                        readOnly
                      />
                    )}
                  </span>
                ) : (
                  <input
                    type='text'
                    className='appearance-none text-xs lg:text-sm w-full px-2 py-1 text-userBlack border border-user1 rounded-lg shadow-sm focus:outline-none focus:border-transparent'
                    value='SILA PILIH SEKOLAH'
                    readOnly
                  />
                )}
              </p>
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
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap w-72'>
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
                {pilihanSekolah &&
                filteredFasilitiSekolah[0].jenisFasiliti ===
                  'sekolah-rendah' ? (
                  <th className='outline outline-1 outline-offset-1 px-2 py-1 w-40'>
                    AKTIVITI BEGIN
                  </th>
                ) : null}
              </tr>
            </thead>
            {!isLoading &&
              pilihanSekolah &&
              allPersonSekolahs
                .filter(
                  (person) =>
                    person.namaSekolah.includes(pilihanSekolah) &&
                    person.tahunTingkatan.includes(pilihanTahunTingkatan) &&
                    person.kelasPelajar.includes(pilihanKelasPelajar) &&
                    person.nama.includes(filterNama)
                )
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
                            {singlePersonSekolah.pemeriksaanSekolah
                              ? singlePersonSekolah.pemeriksaanSekolah
                                  .createdByUsername
                              : null}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1 whitespace-nowrap'>
                            {singlePersonSekolah.statusRawatan}
                            {singlePersonSekolah.statusRawatan === 'selesai' ? (
                              <FaCircle className='text-user7 ml-1 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'belum selesai' ? (
                              <FaAdjust className='text-user8 ml-1 inline-flex' />
                            ) : singlePersonSekolah.statusRawatan ===
                              'belum mula' ? (
                              <FaRegCircle className='text-user8 ml-1 inline-flex' />
                            ) : (
                              <FaCircle className='text-user9 ml-1 inline-flex' />
                            )}
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
                                  ? 'pointer-events-none bg-kaunter5 shadow-none'
                                  : singlePersonSekolah.statusRawatan ===
                                    'tidak hadir'
                                  ? 'pointer-events-none bg-kaunter4 shadow-none'
                                  : singlePersonSekolah.pemeriksaanSekolah
                                  ? 'bg-user7 shadow-md'
                                  : filteredFasilitiSekolah[0]
                                      .sekolahSelesaiReten === true
                                  ? 'pointer-events-none bg-user4 shadow-none'
                                  : 'bg-user6 shadow-md'
                              } hover:bg-user8 text-userWhite rounded-sm p-1 m-1 transition-all`}
                            >
                              {singlePersonSekolah.statusRawatan === 'enggan'
                                ? 'Enggan'
                                : singlePersonSekolah.statusRawatan ===
                                  'tidak hadir'
                                ? 'Tidak Hadir'
                                : singlePersonSekolah.pemeriksaanSekolah
                                ? 'lihat pemeriksaan'
                                : filteredFasilitiSekolah[0]
                                    .sekolahSelesaiReten === true
                                ? 'Pemeriksaan Ditutup'
                                : 'Tambah Pemeriksaan'}
                            </Link>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            {filteredFasilitiSekolah[0].sekolahSelesaiReten ===
                            false ? (
                              <Link
                                target='_blank'
                                rel='noreferrer'
                                to={`/pengguna/landing/senarai-sekolah/sekolah/form-sekolah/rawatan/${singlePersonSekolah._id}`}
                                className={`${
                                  singlePersonSekolah.statusRawatan === 'enggan'
                                    ? 'pointer-events-none bg-kaunter5 shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'tidak hadir'
                                    ? 'pointer-events-none bg-kaunter4 shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'enggan rawatan'
                                    ? 'pointer-events-none bg-kaunter5 shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'tidak hadir rawatan'
                                    ? 'pointer-events-none bg-kaunter4 shadow-none'
                                    : singlePersonSekolah.statusRawatan ===
                                      'selesai'
                                    ? ' bg-user7 shadow-md hover:bg-user8'
                                    : !singlePersonSekolah.pemeriksaanSekolah
                                    ? 'pointer-events-none bg-user4 shadow-none'
                                    : 'bg-user3 hover:bg-user2 shadow-md'
                                } text-userWhite rounded-sm  p-1 m-1 transition-all`}
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
                                        ? 'block p-2 px-5 overflow-y-auto'
                                        : 'hidden '
                                    } absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-10 lg:inset-y-28 bg-userWhite text-user1 rounded-md shadow-md m-2`}
                                  >
                                    <div className='flex justify-between'>
                                      <h1 className='text-lg font-medium'>
                                        Rawatan
                                      </h1>
                                    </div>
                                    {singlePersonSekolah.rawatanSekolah.map(
                                      (rawatan, index) => {
                                        // sum rawatan
                                        const semuaGD = [
                                          rawatan.gdBaruAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdBaruPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gdBaruPosteriorAmalgamJumlahTampalanDibuat,
                                          rawatan.gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
                                        ];
                                        const semuaGK = [
                                          rawatan.gkBaruAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkBaruPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
                                          rawatan.gkBaruPosteriorAmalgamJumlahTampalanDibuat,
                                          rawatan.gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
                                        ];
                                        const semuaICDAS = [
                                          rawatan.baruJumlahGigiKekalDibuatFs,
                                          rawatan.baruJumlahGigiKekalDiberiFv,
                                          rawatan.baruJumlahGigiKekalDiberiPrrJenis1,
                                        ];
                                        let sumGigiDesidus = 0;
                                        semuaGD.forEach((rawatan) => {
                                          sumGigiDesidus += rawatan;
                                        });
                                        let sumGigiKekal = 0;
                                        semuaGK.forEach((rawatan) => {
                                          sumGigiKekal += rawatan;
                                        });
                                        let sumICDAS = 0;
                                        semuaICDAS.forEach((rawatan) => {
                                          sumICDAS += rawatan;
                                        });
                                        return (
                                          <div
                                            key={rawatan._id}
                                            className='flex flex-col'
                                          >
                                            <h1
                                              onClick={() =>
                                                handleAccordian(index)
                                              }
                                              className='text-sm text-start font-semibold bg-user1 bg-opacity-5 flex flex-row items-center rounded-md p-1 m-1 cursor-pointer'
                                            >
                                              {accordian === index ? (
                                                <FaMinus className='m-1' />
                                              ) : (
                                                <FaPlus className='m-1' />
                                              )}
                                              Kedatangan {index + 1} -{' '}
                                              {moment(
                                                rawatan.tarikhRawatanSemasa
                                              ).format('DD/MM/YYYY')}
                                            </h1>
                                            {accordian === index && (
                                              <div className='flex flex-col mx-1 px-1'>
                                                <span className='text-xs font-semibold text-start flex flex-row items-center'>
                                                  <FaTooth className='mr-1' />{' '}
                                                  {rawatan.createdByUsername}
                                                </span>
                                                {rawatan.cabutDesidusSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    cabut desidus :
                                                    {
                                                      rawatan.cabutDesidusSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.cabutKekalSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    cabut desidus :
                                                    {
                                                      rawatan.cabutKekalSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {sumGigiDesidus >= 1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    tampalan gigi desidus :{' '}
                                                    {sumGigiDesidus}
                                                  </span>
                                                )}
                                                {sumGigiKekal >= 1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    tampalan gigi kekal :{' '}
                                                    {sumGigiKekal}
                                                  </span>
                                                )}
                                                {sumICDAS >= 1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    MMI : {sumICDAS}
                                                  </span>
                                                )}
                                                {rawatan.jumlahTampalanSementaraSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    tampalan sementara :{' '}
                                                    {
                                                      rawatan.jumlahTampalanSementaraSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.pulpotomiSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    pulpotomi :{' '}
                                                    {
                                                      rawatan.pulpotomiSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.endodontikSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    endodontik :{' '}
                                                    {
                                                      rawatan.endodontikSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.absesSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    abses :{' '}
                                                    {
                                                      rawatan.absesSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.penskaleranSekolahRawatan >=
                                                  1 && (
                                                  <span className='text-xs font-medium text-start'>
                                                    penskaleran :{' '}
                                                    {
                                                      rawatan.penskaleranSekolahRawatan
                                                    }
                                                  </span>
                                                )}
                                                {rawatan.rujukSekolahRawatan ===
                                                  true && (
                                                  <span className='text-xs font-medium text-start flex items-center flex-wrap'>
                                                    Dirujuk{' '}
                                                    <FaCheckCircle className='text-user7 text-center mx-1' />
                                                    untuk{' '}
                                                    {rawatan.rujukCabutanGigiKekalSekolahRawatan ===
                                                    true
                                                      ? 'cabutan ,'
                                                      : ''}
                                                    {rawatan.rujukRawatanEndodontikSekolahRawatan ===
                                                    true
                                                      ? 'rawatan endodontik ,'
                                                      : ''}
                                                    {rawatan.rujukRawatanOrtodontikSekolahRawatan ===
                                                    true
                                                      ? 'rawatan penskaleran ,'
                                                      : ''}
                                                    {rawatan.rujukRawatanPeriodontikSekolahRawatan ===
                                                    true
                                                      ? 'rawatan periodontik ,'
                                                      : ''}
                                                    {rawatan.rujukLainLainSekolahRawatan ===
                                                    true
                                                      ? rawatan.rujukLainLainTulisSekolahRawatan
                                                      : ''}
                                                  </span>
                                                )}
                                                {rawatan.kesSelesaiSekolahRawatan ===
                                                  'ya-kes-selesai-penyata-akhir-2' && (
                                                  <span className='text-xs font-medium text-start flex items-center'>
                                                    kes selesai{' '}
                                                    <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                                                  </span>
                                                )}
                                                {rawatan.kesSelesaiIcdasSekolahRawatan ===
                                                  'ya-kes-selesai-icdas-penyata-akhir-2' && (
                                                  <span className='text-xs font-medium text-start flex items-center'>
                                                    kes selesai MMI{' '}
                                                    <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                                                  </span>
                                                )}
                                              </div>
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
                          {singlePersonSekolah.jenisFasiliti ===
                          'sekolah-rendah' ? (
                            <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                              <button
                                onClick={() => {
                                  setModalBegin({
                                    ...modalBegin,
                                    [singlePersonSekolah._id]: true,
                                  });
                                }}
                                className='hover:cursor-pointer hover:bg-user6 text-xs font-medium bg-user8 rounded-full px-2 py-1 capitalize transition-all whitespace-nowrap'
                              >
                                {singlePersonSekolah.tarikhMelaksanakanBegin ? (
                                  <p className='text-xs text-userBlack text-center flex items-center'>
                                    Selesai
                                    <FaCheckCircle className='text-user7 inline-flex text-center ml-1' />
                                  </p>
                                ) : (
                                  <p className='text-xs text-userBlack text-center flex items-center'>
                                    Tarikh Pelaksanaan
                                  </p>
                                )}
                              </button>
                              <div
                                className={`${
                                  modalBegin[singlePersonSekolah._id]
                                    ? 'block p-2 px-8 overflow-y-auto'
                                    : 'hidden '
                                } absolute z-30 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md m-2`}
                              >
                                <form onSubmit={handleSubmit}>
                                  <p className='flex justify-center text-lg font-bold border-b border-b-user1 py-3'>
                                    Program BEGIN
                                  </p>
                                  <p className='flex whitespace-pre-wrap pt-3'>
                                    Tarikh {singlePersonSekolah.nama}{' '}
                                    melaksanakan Aktiviti BEGIN ?
                                  </p>
                                  <div className='grid justify-center'>
                                    {singlePersonSekolah.tarikhMelaksanakanBegin ? (
                                      <div className='flex justify-center mt-3'>
                                        <p className='text-center text-base font-medium'>
                                          YA , Pada Tarikh{' '}
                                          <span className='text-user2 text-xl font-semibold'>
                                            {moment(
                                              singlePersonSekolah.tarikhMelaksanakanBegin
                                            ).format('DD/MM/YYYY')}
                                          </span>
                                        </p>
                                      </div>
                                    ) : (
                                      <TarikhBegin
                                        singlePersonSekolah={
                                          singlePersonSekolah
                                        }
                                      />
                                    )}
                                  </div>
                                  <div className='flex justify-around absolute bottom-6 right-5 mt-2'>
                                    <span
                                      onClick={() => {
                                        setModalBegin(false);
                                      }}
                                      className='text-sm text-userBlack bg-userWhite py-2 px-7 rounded-md cursor-pointer focus:outline-none hover:bg-user5 ml-2'
                                    >
                                      Tutup
                                    </span>
                                    {singlePersonSekolah.tarikhMelaksanakanBegin ? null : (
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
                            </td>
                          ) : null}
                        </tr>
                      </tbody>
                    </>
                  );
                })}
            {isLoading && (
              <tbody className='bg-user4'>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
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
                  {pilihanSekolah &&
                  filteredFasilitiSekolah[0].jenisFasiliti ===
                    'sekolah-rendah' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                  ) : null}
                </tr>
                <tr>
                  <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
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
                  {pilihanSekolah &&
                  filteredFasilitiSekolah[0].jenisFasiliti ===
                    'sekolah-rendah' ? (
                    <td className='px-2 py-2 outline outline-1 outline-userWhite outline-offset-1'>
                      <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-10 rounded-xl'></span>
                    </td>
                  ) : null}
                </tr>
              </tbody>
            )}
          </table>
          {modalBegin && (
            <div
              className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
                modalBegin ? 'block' : 'hidden'
              }`}
              onClick={() => setModalBegin(false)}
            />
          )}
          <div
            className={`absolute z-10 inset-0 bg-user1 bg-opacity-30 ${
              isShown ? 'block' : 'hidden'
            }`}
            onClick={() => setIsShown(false)}
          />
        </div>
      </div>
    </>
  );
}

export default UserSekolah;
