import { useState, useEffect } from 'react';
import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import moment from 'moment';

import {
  FaInfoCircle,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaShareAlt,
  FaTrashAlt,
} from 'react-icons/fa';

import { Loading, NothingHereBoi } from '../Screens';

export default function Sosmed(props) {
  const {
    readData,
    readDataForKp,
    deleteData,
    deleteDataForKp,
    InfoDecoder,
    toast,
  } = useGlobalAdminAppContext();
  const [dataIndex, setDataIndex] = useState();
  const [internalDataIndex, setInternalDataIndex] = useState();
  const [data, setData] = useState();
  const [showInfo, setShowInfo] = useState(false);

  const [loading, setLoading] = useState(true);

  const handleDelete = (kod, nama, id) => {
    const payload = {
      kodProgram: kod,
      id: id,
    };
    props.setShowDeleteModal(true);
    props.setId(payload);
    props.setDeleteCandidate(nama);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await (props.accountType === 'kpUser'
          ? readDataForKp('sosmedByKodProgram')
          : readData('sosmedByKodProgram'));
        setData(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setData(null);
      setDataIndex(null);
      setInternalDataIndex(null);
      setShowInfo(false);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!loading && !data) {
    return <NothingHereBoi FType={props.FType} />;
  } else {
    return (
      <>
        <div className='flex flex-col items-center gap-5'>
          <h1 className='text-3xl font-bold mt-10'>
            Senarai Aktiviti Promosi / Pendidikan Kesihatan Pergigian Di Media
            Sosial {props.kp}
          </h1>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max px-48'>
            {data
              //sort by kodProgram from 1000 to 9999
              .sort((a, b) => (a.kodProgram > b.kodProgram ? 1 : -1))
              .map((i, dataIndex) => {
                if (i.data.length === 0) {
                  return null;
                }
                return (
                  <>
                    <div className='m-2 justify-center'>
                      <h1 className='font-bold text-lg'>
                        KOD PROGRAM: {i.kodProgram}
                      </h1>
                    </div>
                    <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-2'>
                      <table className='table-auto'>
                        <thead className='text-adminWhite bg-admin3'>
                          <tr>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                              Bil.
                            </th>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1 w-52'>
                              Tarikh Muatnaik
                            </th>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1 w-52'>
                              Tarikh Kemaskini
                            </th>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                              Tajuk Bahan / Aktiviti
                            </th>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1 w-44'>
                              Jenis Media Sosial
                            </th>
                            <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                              Hapus
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-admin4'>
                          {i.data.map((int, index) => (
                            <>
                              <tr key={int.id}>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                                  {index + 1}
                                </td>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                                  {moment(int.tarikhMula).format('DD/MM/YYYY')}
                                </td>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                                  {moment(int.tarikhAkhir).format('DD/MM/YYYY')}
                                </td>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 text-left'>
                                  <div className='flex flex-row'>
                                    {int.namaAktiviti}{' '}
                                    <FaInfoCircle
                                      className='ml-2 mr-1 text-xl text-userBlack'
                                      onMouseEnter={(e) => {
                                        setShowInfo(true);
                                        setDataIndex(dataIndex);
                                        setInternalDataIndex(index);
                                      }}
                                      onMouseLeave={(e) => {
                                        setShowInfo(false);
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                                  <div className='flex justify-center'>
                                    {int.facebook.length > 0 ? (
                                      <FaFacebook className='text-2xl text-user2 m-2' />
                                    ) : null}
                                    {int.instagram.length > 0 ? (
                                      <FaInstagram className='text-2xl text-user6 m-2' />
                                    ) : null}
                                    {int.twitter.length > 0 ? (
                                      <FaTwitter className='text-2xl text-user3 m-2' />
                                    ) : null}
                                    {int.youtube.length > 0 ? (
                                      <FaYoutube className='text-2xl text-admin3 m-2' />
                                    ) : null}
                                    {int.tiktok.length > 0 ? (
                                      <FaTiktok className='text-2xl text-tiktok m-2' />
                                    ) : null}
                                    {int.lainLain.length > 0 ? (
                                      <FaShareAlt className='text-2xl text-user7 m-2' />
                                    ) : null}
                                  </div>
                                </td>
                                <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                                  <button
                                    key={int.id}
                                    onClick={(e) => {
                                      handleDelete(
                                        i.kodProgram,
                                        int.namaAktiviti,
                                        int.id
                                      );
                                    }}
                                  >
                                    <FaTrashAlt className='text-2xl text-admin3 mt-1' />
                                  </button>
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                );
              })}
            {showInfo && (
              <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack m-5 p-5 bg-userWhite top-10 left-1'>
                <div className='text-xs'>
                  <h2 className='font-mono underline font-bold whitespace-nowrap'>
                    INFO
                  </h2>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].facebook.length > 0
                      ? data[dataIndex].data[internalDataIndex].facebook.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].youtube.length > 0
                      ? data[dataIndex].data[internalDataIndex].youtube.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].instagram.length >
                    0
                      ? data[dataIndex].data[internalDataIndex].instagram.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].twitter.length > 0
                      ? data[dataIndex].data[internalDataIndex].twitter.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].tiktok.length > 0
                      ? data[dataIndex].data[internalDataIndex].tiktok.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                  <div className='mt-2'>
                    {data[dataIndex].data[internalDataIndex].lainLain.length > 0
                      ? data[dataIndex].data[internalDataIndex].lainLain.map(
                          (i) => {
                            if (i === '') return null;
                            return Object.keys(i).map((key) => {
                              return (
                                <p className='font-mono whitespace-nowrap'>
                                  {InfoDecoder(key)} : {i[key]}
                                </p>
                              );
                            });
                          }
                        )
                      : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}
