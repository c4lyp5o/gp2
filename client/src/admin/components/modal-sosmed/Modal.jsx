import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import {
  FaWindowClose,
  FaInfoCircle,
  FaYoutube,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaTrashAlt,
} from 'react-icons/fa';

import { SubmitButton, BusyButton } from '../Buttons';
import { ConfirmModalForData } from '../Confirmation';
import { Loading } from '../Screens';

import RenderSection from './Cards';

import Facebook from '../../assets/socmed/facebook.svg';
import Instagram from '../../assets/socmed/instagram.png';
import Twitter from '../../assets/socmed/twitter.svg';
import Tiktok from '../../assets/socmed/tiktok.svg';
import Youtube from '../../assets/socmed/youtube.svg';

import {
  SiInstagram,
  SiFacebook,
  SiTiktok,
  SiYoutube,
  SiTwitter,
  SiStackshare,
} from 'react-icons/si';

const JenisMediaSosial = [
  {
    id: 1,
    value: 'Facebook',
    label: 'Facebook',
    img: Facebook,
    logo: <SiFacebook />,
  },
  {
    id: 2,
    value: 'Instagram',
    label: 'Instagram',
    img: Instagram,
    logo: <SiInstagram />,
  },
  {
    id: 3,
    value: 'Twitter',
    label: 'Twitter',
    img: Twitter,
    logo: <SiTwitter />,
  },
  {
    id: 4,
    value: 'Youtube',
    label: 'Youtube',
    img: Youtube,
    logo: <SiYoutube />,
  },
  {
    id: 5,
    value: 'TikTok',
    label: 'TikTok',
    img: Tiktok,
    logo: <SiTiktok />,
  },
  {
    id: 6,
    value: 'Lain-lain',
    label: 'Lain-lain',
    img: <SiStackshare />,
    logo: <SiStackshare />,
  },
];

const CustomDatePicker = ({ jenis, setQuestionState }) => {
  const { masterDatePicker } = useGlobalAdminAppContext();
  const [date, setDate] = useState(null);
  return masterDatePicker({
    selected: date,
    onChange: (date) => {
      const tempDate = moment(date).format('YYYY-MM-DD');
      setDate(date);
      if (jenis === 'mula') {
        setQuestionState((prev) => ({
          ...prev,
          tarikhMula: tempDate,
        }));
      }
      if (jenis === 'akhir') {
        setQuestionState((prev) => ({
          ...prev,
          tarikhAkhir: tempDate,
        }));
      }
    },
    className:
      'appearance-none w-full text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row',
  });
};

const TarikhFollowers = ({ jenis, setQuestionState }) => {
  const { masterDatePicker } = useGlobalAdminAppContext();
  const [date, setDate] = useState(null);
  return masterDatePicker({
    selected: date,
    onChange: (date) => {
      const tempDate = moment(date).format('YYYY-MM-DD');
      setDate(date);
      if (jenis === 'mula') {
        setQuestionState((prev) => ({
          ...prev,
          tarikhMula: tempDate,
        }));
      }
      if (jenis === 'akhir') {
        setQuestionState((prev) => ({
          ...prev,
          tarikhAkhir: tempDate,
        }));
      }
    },
    className:
      'appearance-none w-full text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row',
  });
};

// modal add followers
export const ModalAddFollowers = (props) => {
  const { createDataForKp } = useGlobalAdminAppContext();
  const [questionState, setQuestionState] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let Data;
    Data = {
      ...Data,
      bulan: props.bulan,
      createdByKp: props.kp,
      createdByNegeri: props.negeri,
      createdByDaerah: props.daerah,
      namaPlatform: props.namaPlatform,
      jumlahFollowerBulanTerdahulu: props.jumlahBulanTerdahulu,
      jumlahFollowerBulanIni: props.jumlahBulanIni,
      tarikhMula: questionState.tarikhMula,
      tarikhAkhir: questionState.tarikhAkhir,
    };
    if (props.kp) {
      Data = {
        ...Data,
        belongsTo: props.kp,
      };
    }
    if (!props.kp) {
      Data = {
        ...Data,
        belongsTo: props.daerah,
      };
    }
    if (!props.daerah) {
      Data = {
        ...Data,
        belongsTo: props.negeri,
      };
    }
    createDataForKp('followers', Data).then((res) => {
      props.setShowFollowersModal(false);
      props.setReload(!props.reload);
    });
  };
  return (
    // <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
    //   {(confirm) => (
    <form onSubmit={handleSubmit}>
      <div className='absolute z-20 inset-x-1 lg:inset-x-1/3 inset-y-7 bg-userWhite text-user1 rounded-md shadow-md overflow-y-auto'>
        <FaWindowClose
          className='absolute mr-1 mt-1 text-xl text-adminWhite right-0 hover:cursor-pointer hover:text-admin4 transition-all'
          onClick={() => {
            props.setShowFollowersModal(false);
          }}
        />
        <h5 className='bg-admin2 text-userWhite font-semibold text-xl'>
          <i>FOLLOWERS</i> MEDIA SOSIAL
        </h5>
        <div className='grid mx-1 items-center justify-center'>
          <div className='grid grid-cols-1'>
            <div className='grid grid-cols-2 gap-2 mx-1 items-center my-3'>
              <label className='text-sm font-semibold'>
                Jenis Media Sosial :
              </label>
              <select
                className='appearance-none w-full text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row'
                onChange={(e) => {
                  props.setNamaPlatform(e.target.value);
                }}
              >
                <option value=''>Pilih Media Sosial...</option>
                <option value='facebook'>Facebook</option>
                <option value='instagram'>Instagram</option>
                <option value='youtube'>Youtube</option>
                <option value='tiktok'>TikTok</option>
                <option value='twitter'>Twitter</option>
                <option value='lain-lain'>Lain-lain</option>
              </select>
            </div>
            <div className='grid grid-cols-2 gap-2 mx-1 items-center mb-3'>
              <p>tarikh mula</p>
              <TarikhFollowers
                jenis='mula'
                setQuestionState={setQuestionState}
              />
            </div>
            <div className='grid grid-cols-2 gap-2 mx-1 items-center mb-3'>
              <p>tarikh akhir</p>
              <TarikhFollowers
                jenis='akhir'
                setQuestionState={setQuestionState}
              />
            </div>
            <div className='grid grid-cols-[2fr_1fr] gap-2 mx-auto items-center mb-3'>
              <p>bilangan followers bulan terdahulu</p>
              <input
                type='number'
                name='past-followers'
                id='past-followers'
                min={0}
                className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
                onChange={(e) => {
                  props.setJumlahBulanTerdahulu(e.target.value);
                }}
              />
              <p>bilangan followers bulan terkini</p>
              <input
                type='number'
                name='current-followers'
                id='current-followers'
                min={0}
                className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
                onChange={(e) => {
                  props.setJumlahBulanIni(e.target.value);
                }}
              />
            </div>
            <div className='flex justify-center mb-2'>
              <button
                type='submit'
                className='bg-user9 text-userWhite font-semibold text-md w-32 rounded-md p-2 mr-3 hover:bg-user8'
              >
                Hantar
              </button>
              <button
                className='bg-user9 text-userWhite font-semibold text-md w-32 rounded-md p-2 mr-3 hover:bg-user8'
                onClick={() => {
                  props.setShowFollowersModal(false);
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className='absolute inset-0 bg-user1 z-10 bg-opacity-50'
        onClick={() => {
          props.setShowFollowersModal(false);
        }}
      />
    </form>
    //   )}
    // </ConfirmModalForData>
  );
};

// modal add aktiviti media sosial
export const ModalSosMed = (props) => {
  const { toast, createData, createDataForKp, readKodProgramData } =
    useGlobalAdminAppContext();

  const [programPromosi, setProgramPromosi] = useState({
    jenisProgram: [],
    allProgramPromosi: [],
  });
  const [pilihanJenisProgram, setPilihanJenisProgram] = useState([]);
  const [pilihanMediaSosial, setPilihanMediaSosial] = useState([]);
  const [questionState, setQuestionState] = useState([]);

  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    setAddingData(true);

    const newData = {
      kodProgram: questionState.kodProgram,
      namaAktiviti: questionState.namaAktiviti,
      tarikhMula: questionState.tarikhMula,
      tarikhAkhir: questionState.tarikhAkhir,
      facebook: [],
      instagram: [],
      youtube: [],
      tiktok: [],
      twitter: [],
      lainLain: [],
    };

    Object.entries(questionState).forEach(([key, value]) => {
      if (key.includes('Facebook')) {
        newData.facebook.push({ [key]: value });
      } else if (key.includes('Instagram')) {
        newData.instagram.push({ [key]: value });
      } else if (key.includes('Youtube')) {
        newData.youtube.push({ [key]: value });
      } else if (key.includes('TikTok')) {
        newData.tiktok.push({ [key]: value });
      } else if (key.includes('Twitter')) {
        newData.twitter.push({ [key]: value });
      } else if (key.includes('Lain-lain')) {
        newData.lainLain.push({ [key]: value });
      }
    });

    const data = {
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      createdByNegeri: props.negeri,
      kodProgram: questionState.kodProgram,
      data: [newData],
      belongsTo: props.kp || props.daerah || props.negeri,
    };

    const res = await createData(props.FType, data);

    if (res.status === 200) {
      toast.info(`Data berjaya ditambah`);
      props.setReload(!props.reload);
    } else {
      toast.error(`Data tidak berjaya ditambah`);
    }

    props.setShowSosMedModal(false);
    setAddingData(false);
  };

  const propsSosMed = {
    questionState,
    setQuestionState,
  };

  useEffect(() => {
    const fetchAllProgramPromosi = async () => {
      try {
        const { data } = await readKodProgramData();
        const withoutDuplicateJenisProgram = data.map((a) => a.jenisProgram);
        const withoutDuplicate = [...new Set(withoutDuplicateJenisProgram)];
        setProgramPromosi({
          jenisProgram: withoutDuplicate,
          allProgramPromosi: data,
        });
      } catch (error) {
        console.log(error);
        // toast.error(
        //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-promosi-fetchAllProgramPromosi'
        // );
      }
    };
    fetchAllProgramPromosi();

    return () => {
      setPilihanJenisProgram([]);
      setPilihanMediaSosial([]);
      setQuestionState([]);
    };
  }, []);

  return (
    <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
      {(confirm) => (
        <form onSubmit={confirm(handleSubmit)}>
          <div className='absolute inset-x-10 inset-y-10 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              className='absolute mr-1 mt-1 text-xl text-adminWhite right-0 hover:cursor-pointer hover:text-admin4 transition-all'
              onClick={() => {
                props.setShowSosMedModal(false);
              }}
            />
            <h5 className='bg-admin2 text-userWhite font-semibold text-xl'>
              AKTIVITI MEDIA SOSIAL
            </h5>
            <div className='grid grid-row-3 mx-auto'>
              <div className='my-2'>
                <div className='grid grid-cols-[1fr_3fr_1fr_3fr] gap-2'>
                  <label
                    htmlFor='jenis-program'
                    className='flex flex-row items-center pl-3 text-sm font-semibold'
                  >
                    jenis program :
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <div className='pr-2'>
                    <select
                      type='text'
                      name='jenis-program'
                      id='jenis-program'
                      value={pilihanJenisProgram}
                      className='appearance-none w-full px-2 py-1.5 text-user1 ring-1 ring-user1 ring-opacity-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      onChange={(e) => setPilihanJenisProgram(e.target.value)}
                    >
                      <option value=''>Sila Pilih</option>
                      {programPromosi.jenisProgram.map((j) => (
                        <option key={j} value={j}>
                          {j}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor='kod-program'
                    className='flex flex-row items-center pl-3 text-sm font-semibold'
                  >
                    kod program :
                    <span className='font-semibold text-user6'>*</span>
                  </label>
                  <div className='pr-2'>
                    <select
                      type='text'
                      value={questionState.kodProgram}
                      onChange={(e) => {
                        setQuestionState({
                          ...questionState,
                          kodProgram: e.target.value,
                        });
                      }}
                      className='appearance-none w-full px-2 py-1.5 text-user1 ring-1 ring-user1 ring-opacity-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    >
                      <option value=''>Sila Pilih</option>
                      {programPromosi.allProgramPromosi
                        .filter((p) => p.jenisProgram === pilihanJenisProgram)
                        .map((p) => {
                          return (
                            <option value={p.kodProgram}>
                              {p.kodProgram} | {p.namaProgram}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-[1fr_3fr_1fr_3fr] gap-2 mb-1'>
                <p className='text-xs md:text-sm text-left font-semibold flex pl-3 items-center md:whitespace-nowrap'>
                  tarikh muatnaik:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <div className='pr-2'>
                  <CustomDatePicker
                    jenis='mula'
                    setQuestionState={setQuestionState}
                  />
                </div>
                <p className='text-xs md:text-sm text-left font-semibold flex pl-3 items-center md:whitespace-nowrap'>
                  tarikh kemaskini:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <div className='pr-2'>
                  <CustomDatePicker
                    jenis='akhir'
                    setQuestionState={setQuestionState}
                  />
                </div>
              </div>
              <div className='grid grid-cols-[1fr_7fr] mt-2'>
                <p className='text-xs md:text-sm text-right font-semibold flex items-center md:whitespace-nowrap pl-3'>
                  Tajuk Bahan / Aktiviti:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <div className='pr-2 pl-1.5'>
                  <input
                    className='appearance-none w-full px-2 py-1.5 text-user1 ring-1 ring-user1 ring-opacity-50 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    type='text'
                    placeholder='Sila Tulis Tajuk Bahan / Aktiviti'
                    onChange={(e) => {
                      setQuestionState({
                        ...questionState,
                        namaAktiviti: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-[1fr_7fr] mt-2'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-start items-center mr-1 md:whitespace-nowrap pl-3'>
                Jenis Media Sosial :{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <div className='pr-2 pl-1.5'>
                <Select
                  isMulti
                  name='promosi'
                  options={JenisMediaSosial}
                  placeholder='Sila Tulis Jenis Media Sosial'
                  className='basic-multi-select'
                  classNamePrefix='select'
                  onChange={(e) => {
                    setPilihanMediaSosial(e);
                  }}
                />
              </div>
            </div>
            <div>
              {pilihanMediaSosial.map((item) =>
                RenderSection(item, propsSosMed)
              )}
            </div>
            <div className='flex justify-center my-2'>
              {addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
              <button
                className='bg-user9 text-userWhite font-semibold text-md w-32 rounded-md p-2 mr-3 hover:bg-user8'
                onClick={() => {
                  props.setShowSosMedModal(false);
                }}
              >
                Batal
              </button>
            </div>
          </div>
          <div className='absolute inset-0 bg-user1 z-10 opacity-100' />
        </form>
      )}
    </ConfirmModalForData>
  );
};

export const ModalDataIkutProgram = (props) => {
  const { readData, readDataForKp, InfoDecoder, toast } =
    useGlobalAdminAppContext();
  const [dataIndex, setDataIndex] = useState();
  const [internalDataIndex, setInternalDataIndex] = useState();
  const [data, setData] = useState();
  const [showInfo, setShowInfo] = useState(false);
  const displayedIcons = [];

  useEffect(() => {
    if (
      props.accountType === 'daerahSuperadmin' ||
      props.accountType === 'negeriSuperadmin' ||
      props.accountType === 'hqSuperadmin'
    ) {
      readData('sosmedByKodProgram').then((res) => {
        setData(res.data);
      });
    }
    if (props.accountType === 'kpUserAdmin') {
      readDataForKp('sosmedByKodProgram').then((res) => {
        setData(res.data);
      });
    }
    return () => {
      setData();
      setDataIndex();
      setInternalDataIndex();
      setShowInfo(false);
      displayedIcons.length = 0;
    };
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <>
      <div className='absolute inset-x-10 inset-y-10 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
          onClick={() => {
            props.setShowSosMedDataModal(false);
          }}
        />
        <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
          DATA MENGIKUT KOD PROGRAM
        </h5>
        {data.map((i, dataIndex) => (
          <>
            <div className='m-2 justify-center'>
              <h1>KOD PROGRAM: {i.kodProgram}</h1>
            </div>
            <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-2'>
              <table className='table-auto'>
                <thead className='text-adminWhite bg-admin3'>
                  <tr>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Bil.
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Tarikh Muatnaik
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Tarikh Kemaskini
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Tajuk Bahan / Aktiviti
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
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
                          {moment(int.tarikhMula).format('DD-MM-YYYY')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {moment(int.tarikhAkhir).format('DD-MM-YYYY')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
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
                          <div className='flex flex-row justify-center'>
                            {int.facebook.length > 0 ? (
                              <FaFacebook className='text-2xl text-user2 m-2' />
                            ) : null}
                            {int.instagram.length > 0 ? (
                              <FaInstagram className='text-2xl text-user6 m-2' />
                            ) : null}
                            {int.twitter.length > 0 ? (
                              <FaTwitter className='text-2xl text-user4 m-2' />
                            ) : null}
                            {int.youtube.length > 0 ? (
                              <FaYoutube className='text-2xl text-admin3 m-2' />
                            ) : null}
                            {int.tiktok.length > 0 ? (
                              <FaTiktok className='text-2xl text-tiktok m-2' />
                            ) : null}
                          </div>
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          <button onClick={(e) => toast('Coming Soon')}>
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
        ))}
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
                  ? data[dataIndex].data[internalDataIndex].youtube.map((i) => {
                      if (i === '') return null;
                      return Object.keys(i).map((key) => {
                        return (
                          <p className='font-mono whitespace-nowrap'>
                            {InfoDecoder(key)} : {i[key]}
                          </p>
                        );
                      });
                    })
                  : null}
              </div>
              <div className='mt-2'>
                {data[dataIndex].data[internalDataIndex].instagram.length > 0
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
                  ? data[dataIndex].data[internalDataIndex].twitter.map((i) => {
                      if (i === '') return null;
                      return Object.keys(i).map((key) => {
                        return (
                          <p className='font-mono whitespace-nowrap'>
                            {InfoDecoder(key)} : {i[key]}
                          </p>
                        );
                      });
                    })
                  : null}
              </div>
              <div className='mt-2'>
                {data[dataIndex].data[internalDataIndex].tiktok.length > 0
                  ? data[dataIndex].data[internalDataIndex].tiktok.map((i) => {
                      if (i === '') return null;
                      return Object.keys(i).map((key) => {
                        return (
                          <p className='font-mono whitespace-nowrap'>
                            {InfoDecoder(key)} : {i[key]}
                          </p>
                        );
                      });
                    })
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
      <div className='absolute inset-0 bg-user1 z-10 opacity-100' />
    </>
  );
};
