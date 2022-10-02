import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

function UserSekolah() {
  const { userToken, navigate } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);
  const [tahun, setTahun] = useState([]);
  const [namaKelas, setNamaKelas] = useState([]);
  // const [darjah, setDarjah] = useState([]);
  // const [tingkatan, setTingkatan] = useState([]);
  // const [namaKelasDarjah, setNamaKelasDarjah] = useState([]);
  // const [namaKelasTingkatan, setNamaKelasTingkatan] = useState([]);
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [pilihanDarjah, setPilihanDarjah] = useState('');
  const [pilihanTingkatan, setPilihanTingkatan] = useState('');
  const [pilihanKelasDarjah, setPilihanKelasDarjah] = useState('');
  const [pilihanKelasTingkatan, setPilihanKelasTingkatan] = useState('');

  // init fetch allPersonSekolahs
  useEffect(() => {
    const fetchAllPersonSekolahs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('/api/v1/sekolah/populate', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        const allPersonSekolahs = data.allPersonSekolahs;
        const namaSekolahs = allPersonSekolahs.reduce(
          (arrNamaSekolahs, singlePersonSekolah) => {
            if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
              arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
            }
            return arrNamaSekolahs.filter((valid) => valid);
          },
          ['']
        );
        // const tahun = allPersonSekolahs.reduce(
        //   (arrTahun, singlePersonSekolah) => {
        //     if (!arrTahun.includes(singlePersonSekolah.tahun)) {
        //       arrTahun.push(singlePersonSekolah.tahun);
        //     }
        //     return arrTahun.filter((valid) => valid);
        //   }
        // );
        // const namaKelas = allPersonSekolahs.reduce(
        //   (arrNamaKelas, singlePersonSekolah) => {
        //     if (!arrNamaKelas.includes(singlePersonSekolah.namaKelas)) {
        //       arrNamaKelas.push(singlePersonSekolah.namaKelas);
        //     }
        //     return arrNamaKelas.filter((valid) => valid);
        //   }
        // );
        // const darjah = allPersonSekolahs.reduce(
        //   (arrDarjah, singlePersonSekolah) => {
        //     if (!arrDarjah.includes(singlePersonSekolah.darjah)) {
        //       arrDarjah.push(singlePersonSekolah.darjah);
        //     }
        //     return arrDarjah.filter((valid) => valid);
        //   },
        //   ['']
        // );
        // const tingkatan = allPersonSekolahs.reduce(
        //   (arrTingkatan, singlePersonSekolah) => {
        //     if (!arrTingkatan.includes(singlePersonSekolah.tingkatan)) {
        //       arrTingkatan.push(singlePersonSekolah.tingkatan);
        //     }
        //     return arrTingkatan.filter((valid) => valid);
        //   },
        //   ['']
        // );
        // const namaKelasDarjah = allPersonSekolahs
        //   .filter((person) => person.darjah)
        //   .reduce(
        //     (arrNamaKelas, singlePersonSekolah) => {
        //       if (!arrNamaKelas.includes(singlePersonSekolah.kelas)) {
        //         arrNamaKelas.push(singlePersonSekolah.kelas);
        //       }
        //       return arrNamaKelas.filter((valid) => valid);
        //     },
        //     ['']
        //   );
        // const namaKelasTingkatan = allPersonSekolahs
        //   .filter((person) => person.tingkatan)
        //   .reduce(
        //     (arrNamaKelas, singlePersonSekolah) => {
        //       if (!arrNamaKelas.includes(singlePersonSekolah.kelas)) {
        //         arrNamaKelas.push(singlePersonSekolah.kelas);
        //       }
        //       return arrNamaKelas.filter((valid) => valid);
        //     },
        //     ['']
        //   );

        setAllPersonSekolahs(data.allPersonSekolahs);
        setNamaSekolahs(namaSekolahs);
        // setTahun(tahun);
        // setNamaKelas(namaKelas);
        // setDarjah(darjah);
        // setTingkatan(tingkatan);
        // setNamaKelasDarjah(namaKelasDarjah);
        // setNamaKelasTingkatan(namaKelasTingkatan);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPersonSekolahs();
  }, []);

  // reset value
  useEffect(() => {
    setPilihanDarjah('');
    setPilihanTingkatan('');
    setPilihanKelasDarjah('');
    setPilihanKelasTingkatan('');
  }, [pilihanSekolah]);

  useEffect(() => {
    setPilihanTingkatan('');
    setPilihanKelasDarjah('');
    setPilihanKelasTingkatan('');
  }, [pilihanDarjah]);

  useEffect(() => {
    setPilihanDarjah('');
    setPilihanKelasDarjah('');
    setPilihanKelasTingkatan('');
  }, [pilihanTingkatan]);

  useEffect(() => {
    setPilihanKelasTingkatan('');
  }, [pilihanKelasDarjah]);

  useEffect(() => {
    setPilihanKelasDarjah('');
  }, [pilihanKelasTingkatan]);

  // const reloadData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const { data } = await axios.get('/api/v1/sekolah/populate', {
  //       headers: { Authorization: `Bearer ${userToken}` },
  //     });
  //     const allPersonSekolahs = data.allPersonSekolahs;
  //     const namaSekolahs = allPersonSekolahs.reduce(
  //       (arrNamaSekolahs, singlePersonSekolah) => {
  //         if (!arrNamaSekolahs.includes(singlePersonSekolah.namaSekolah)) {
  //           arrNamaSekolahs.push(singlePersonSekolah.namaSekolah);
  //         }
  //         return arrNamaSekolahs.filter((valid) => valid);
  //       },
  //       ['']
  //     );
  //     const darjah = allPersonSekolahs.reduce(
  //       (arrDarjah, singlePersonSekolah) => {
  //         if (!arrDarjah.includes(singlePersonSekolah.darjah)) {
  //           arrDarjah.push(singlePersonSekolah.darjah);
  //         }
  //         return arrDarjah.filter((valid) => valid);
  //       },
  //       ['']
  //     );
  //     const tingkatan = allPersonSekolahs.reduce(
  //       (arrTingkatan, singlePersonSekolah) => {
  //         if (!arrTingkatan.includes(singlePersonSekolah.tingkatan)) {
  //           arrTingkatan.push(singlePersonSekolah.tingkatan);
  //         }
  //         return arrTingkatan.filter((valid) => valid);
  //       },
  //       ['']
  //     );
  //     const namaKelasDarjah = allPersonSekolahs
  //       .filter((person) => person.darjah)
  //       .reduce(
  //         (arrNamaKelas, singlePersonSekolah) => {
  //           if (!arrNamaKelas.includes(singlePersonSekolah.kelas)) {
  //             arrNamaKelas.push(singlePersonSekolah.kelas);
  //           }
  //           return arrNamaKelas.filter((valid) => valid);
  //         },
  //         ['']
  //       );
  //     const namaKelasTingkatan = allPersonSekolahs
  //       .filter((person) => person.tingkatan)
  //       .reduce(
  //         (arrNamaKelas, singlePersonSekolah) => {
  //           if (!arrNamaKelas.includes(singlePersonSekolah.kelas)) {
  //             arrNamaKelas.push(singlePersonSekolah.kelas);
  //           }
  //           return arrNamaKelas.filter((valid) => valid);
  //         },
  //         ['']
  //       );
  //     setAllPersonSekolahs(data.allPersonSekolahs);
  //     setNamaSekolahs(namaSekolahs);
  //     setDarjah(darjah);
  //     setTingkatan(tingkatan);
  //     setNamaKelasDarjah(namaKelasDarjah);
  //     setNamaKelasTingkatan(namaKelasTingkatan);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // on tab focus reload data
  // useEffect(() => {
  //   window.addEventListener('focus', reloadData);
  //   reloadData();
  //   return () => {
  //     window.removeEventListener('focus', reloadData);
  //   };
  // }, []);

  return (
    <>
      <div className='px-3 lg:px-7 h-full p-3 overflow-y-auto'>
        <div>
          <h2 className='text-xl font-semibold flex flex-row pl-5 lg:pl-12 p-2'>
            SILA PILIH
          </h2>
          <p className='flex flex-row pl-5 lg:pl-12 p-2'>Nama Sekolah</p>
          <select
            value={pilihanSekolah}
            onChange={(e) => {
              setPilihanSekolah(e.target.value);
            }}
            className='capitalize m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'
          >
            <option value=''>Sila pilih..</option>
            {namaSekolahs.map((singleNamaSekolah, index) => {
              return (
                <option
                  value={singleNamaSekolah}
                  key={index}
                  className='capitalize'
                >
                  {singleNamaSekolah}
                </option>
              );
            })}
          </select>
          {/* {!pilihanSekolah.includes('menengah') && pilihanSekolah !== '' && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Darjah</p>
              <select
                value={pilihanDarjah}
                onChange={(e) => {
                  setPilihanDarjah(e.target.value);
                }}
                className='capitalize m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'
              >
                <option value=''>Sila pilih..</option>
                {darjah.map((singleDarjah, index) => {
                  return (
                    <option
                      value={singleDarjah}
                      key={index}
                      className='capitalize'
                    >
                      {singleDarjah}
                    </option>
                  );
                })}
              </select>
            </>
          )}
          {pilihanSekolah.includes('menengah') && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Tingkatan</p>
              <select
                value={pilihanTingkatan}
                onChange={(e) => {
                  setPilihanTingkatan(e.target.value);
                }}
                className='capitalize m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'
              >
                <option value=''>Sila pilih..</option>
                {tingkatan.map((singleTingkatan, index) => {
                  return (
                    <option
                      value={singleTingkatan}
                      key={index}
                      className='capitalize'
                    >
                      {singleTingkatan}
                    </option>
                  );
                })}
              </select>
            </>
          )}
          {pilihanDarjah && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Kelas Darjah</p>
              <select
                value={pilihanKelasDarjah}
                onChange={(e) => {
                  setPilihanKelasDarjah(e.target.value);
                }}
                className='capitalize m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'
              >
                <option value=''>Sila pilih..</option>
                {namaKelasDarjah
                  .filter((kelasDarjah) => kelasDarjah.includes(pilihanDarjah))
                  .map((singleNamaKelas, index) => {
                    return (
                      <option
                        value={singleNamaKelas}
                        key={index}
                        className='capitalize'
                      >
                        {singleNamaKelas}
                      </option>
                    );
                  })}
              </select>
            </>
          )}
          {pilihanTingkatan && (
            <>
              <p className='flex flex-row pl-5 lg:pl-12 p-2'>Kelas Tingkatan</p>
              <select
                value={pilihanKelasTingkatan}
                onChange={(e) => {
                  setPilihanKelasTingkatan(e.target.value);
                }}
                className='capitalize m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'
              >
                <option value=''>Sila pilih..</option>
                {namaKelasTingkatan
                  .filter((kelasTingkatan) =>
                    kelasTingkatan.includes(pilihanTingkatan)
                  )
                  .map((singleNamaKelas, index) => {
                    return (
                      <option
                        value={singleNamaKelas}
                        key={index}
                        className='capitalize'
                      >
                        {singleNamaKelas}
                      </option>
                    );
                  })}
              </select>
            </>
          )} */}
          <div className='flex justify-end px-12 '>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className='capitalize bg-user3 text-sm text-userWhite rounded-md shadow-xl p-1 mb-2 mr-2 hover:bg-user1 transition-all'
            >
              kembali ke senarai sekolah
            </button>
            {/* <button
              onClick={reloadData}
              className='capitalize bg-user3 text-sm text-userWhite rounded-md shadow-xl p-1 mb-2 hover:bg-user1 transition-all'
            >
              refresh pelajar
            </button> */}
          </div>
        </div>
        <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-user2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 py-1 px-10 lg:px-20'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 whitespace-nowrap'>
                  OPERATOR TERAKHIR
                </th>
                <th className='outline outline-1 outline-offset-1 px-5 py-1'>
                  STATUS RAWATAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  PEMERIKSAAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  RAWATAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KOTAK
                </th>
              </tr>
            </thead>
            {!isLoading &&
              pilihanSekolah &&
              allPersonSekolahs
                .filter(
                  (person) => person.namaSekolah.includes(pilihanSekolah)
                  // person.kelas.includes(pilihanTingkatan) &&
                  // person.kelas.includes(pilihanDarjah) &&
                  // person.kelas.includes(pilihanKelasDarjah) &&
                  // person.kelas.includes(pilihanKelasTingkatan)
                )
                .map((singlePersonSekolah, index) => {
                  return (
                    <>
                      <tbody className='bg-user4'>
                        <tr>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            {index + 1}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            {singlePersonSekolah.nama}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                            {singlePersonSekolah.rawatanSekolah.length >= 1 &&
                              singlePersonSekolah.rawatanSekolah.at(-1)
                                .createdByUsername}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 py-1'>
                            {singlePersonSekolah.statusRawatan}
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
                              to={`form-sekolah/pemeriksaan/${
                                singlePersonSekolah._id
                              }/${
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? singlePersonSekolah.pemeriksaanSekolah._id
                                  : 'tambah-pemeriksaan'
                              }`}
                              className={`${
                                singlePersonSekolah.pemeriksaanSekolah
                                  ? 'bg-user7'
                                  : 'bg-user6'
                              } hover:bg-user8 text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                            >
                              {singlePersonSekolah.pemeriksaanSekolah
                                ? 'ubah pemeriksaan'
                                : 'tambah pemeriksaan'}
                            </Link>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
                              to={`form-sekolah/rawatan/${singlePersonSekolah._id}`}
                              className={`${
                                !singlePersonSekolah.pemeriksaanSekolah ||
                                singlePersonSekolah.statusRawatan === 'selesai'
                                  ? 'pointer-events-none bg-user4'
                                  : 'bg-user3 hover:bg-user2'
                              } text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                            >
                              tambah rawatan
                            </Link>
                          </td>
                          <td className='outline outline-1 outline-userWhite outline-offset-1 p-2 whitespace-nowrap'>
                            <Link
                              target='_blank'
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
                                  .inginMelakukanIntervensiMerokok ===
                                  'ya-ingin-melakukan-intervensi-merokok'
                                  ? 'bg-user6'
                                  : singlePersonSekolah.kotakSekolah &&
                                    singlePersonSekolah.pemeriksaanSekolah &&
                                    singlePersonSekolah.pemeriksaanSekolah
                                      .inginMelakukanIntervensiMerokok ===
                                      'ya-ingin-melakukan-intervensi-merokok'
                                  ? 'bg-user7'
                                  : 'pointer-events-none bg-user4'
                              } hover:bg-user8 text-userWhite rounded-sm shadow-md p-1 m-1 transition-all`}
                            >
                              {!singlePersonSekolah.kotakSekolah &&
                              singlePersonSekolah.pemeriksaanSekolah &&
                              singlePersonSekolah.pemeriksaanSekolah
                                .inginMelakukanIntervensiMerokok ===
                                'ya-ingin-melakukan-intervensi-merokok'
                                ? 'tambah KOTAK'
                                : singlePersonSekolah.kotakSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah &&
                                  singlePersonSekolah.pemeriksaanSekolah
                                    .inginMelakukanIntervensiMerokok ===
                                    'ya-ingin-melakukan-intervensi-merokok'
                                ? 'ubah KOTAK'
                                : 'tidak perlu KOTAK'}
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  );
                })}
          </table>
          {isLoading && (
            <p className='text-xl font-semibold'>
              <Spinner color='#1f315f' />
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default UserSekolah;
