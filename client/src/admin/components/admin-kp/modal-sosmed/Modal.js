import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
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

import { SubmitButton, BusyButton } from '../../Buttons';
import { ConfirmModalForData } from '../../superadmin/Confirmation';
import { Loading } from '../../Screens';

import RenderSection from './Cards';

import Facebook from '../../../assets/socmed/facebook.svg';
import Instagram from '../../../assets/socmed/instagram.png';
import Twitter from '../../../assets/socmed/twitter.svg';
import Tiktok from '../../../assets/socmed/tiktok.svg';
import Youtube from '../../../assets/socmed/youtube.svg';

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
    value: 'Youtube',
    label: 'Youtube',
    img: Youtube,
    logo: <SiYoutube />,
  },
  {
    id: 4,
    value: 'TikTok',
    label: 'TikTok',
    img: Tiktok,
    logo: <SiTiktok />,
  },
  {
    id: 5,
    value: 'Twitter',
    label: 'Twitter',
    img: Twitter,
    logo: <SiTwitter />,
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
      'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row ml-2',
  });
};

//modal add followers
export const ModalAddFollowers = (props) => {
  const { createDataForKp } = useGlobalAdminAppContext();

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
    console.log(Data);
    createDataForKp('followers', Data).then((res) => {
      console.log(res);
      props.setShowFollowersModal(false);
      props.setReload(!props.reload);
    });
  };
  return (
    // <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
    //   {(confirm) => (
    <form onSubmit={handleSubmit}>
      <div className='absolute inset-36 inset-x-96 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          className='absolute mr-1 mt-1 text-xl text-adminWhite right-0 hover:cursor-pointer hover:text-admin4 transition-all'
          onClick={() => {
            props.setShowFollowersModal(false);
          }}
        />
        <h5 className='bg-admin2 text-userWhite font-semibold text-xl'>
          <i>FOLLOWERS</i> MEDIA SOSIAL
        </h5>
        <div className='grid mx-auto items-center justify-center'>
          <div className='grid grid-cols-1'>
            <div className='flex flex-row justify-center items-center m-2'>
              <label className='text-sm font-semibold text-admin2'>
                Jenis Media Sosial :
              </label>
              <select
                className='appearance-none w-56 text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row ml-2'
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
            <div className='grid grid-cols-[2fr_1fr] gap-2 mx-auto items-center mb-3'>
              <p>bilangan followers bulan terdahulu</p>
              <input
                type='number'
                name='past-followers'
                id='past-followers'
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

export const ModalSosMed = (props) => {
  const { toast, createData, createDataForKp, readKodProgramData } =
    useGlobalAdminAppContext();

  const [pilihanKodProgram, setPilihanKodProgram] = useState([]);
  const [pilihanMediaSosial, setPilihanMediaSosial] = useState([]);
  const [questionState, setQuestionState] = useState([]);
  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    setAddingData(true);
    let Data = {};
    let newData = {};
    let fbData = {};
    let insData = {};
    let ytData = {};
    let ttData = {};
    let twData = {};
    let llData = {};
    let facebook = [];
    let instagram = [];
    let youtube = [];
    let tiktok = [];
    let twitter = [];
    let lainLain = [];
    Object.keys(questionState).map((key, value) => {
      if (key.includes('Facebook')) {
        fbData = {
          ...fbData,
          [key]: questionState[key],
        };
      } else if (key.includes('Instagram')) {
        insData = {
          ...insData,
          [key]: questionState[key],
        };
      } else if (key.includes('Youtube')) {
        ytData = {
          ...ytData,
          [key]: questionState[key],
        };
      } else if (key.includes('TikTok')) {
        ttData = {
          ...ttData,
          [key]: questionState[key],
        };
      } else if (key.includes('Twitter')) {
        twData = {
          ...twData,
          [key]: questionState[key],
        };
      } else if (key.includes('Lain-lain')) {
        llData = {
          ...llData,
          [key]: questionState[key],
        };
      }
    });
    //
    if (Object.keys(fbData).length !== 0) {
      facebook = [...facebook, fbData];
    }
    if (Object.keys(insData).length !== 0) {
      instagram = [...instagram, insData];
    }
    if (Object.keys(ytData).length !== 0) {
      youtube = [...youtube, ytData];
    }
    if (Object.keys(ttData).length !== 0) {
      tiktok = [...tiktok, ttData];
    }
    if (Object.keys(twData).length !== 0) {
      twitter = [...twitter, twData];
    }
    if (Object.keys(llData).length !== 0) {
      lainLain = [...lainLain, llData];
    }
    //
    newData = {
      ...newData,
      kodProgram: questionState.kodProgram,
      namaAktiviti: questionState.namaAktiviti,
      tarikhMula: questionState.tarikhMula,
      tarikhAkhir: questionState.tarikhAkhir,
      facebook,
      instagram,
      youtube,
      tiktok,
      twitter,
      lainLain,
    };
    //
    Data = {
      ...Data,
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      createdByNegeri: props.negeri,
      kodProgram: questionState.kodProgram,
      data: [newData],
    };
    if (props.kp) {
      Data = {
        ...Data,
        belongsTo: props.kp,
      };
      createDataForKp(props.FType, Data).then((res) => {
        if (res.status === 200) {
          toast.info(`Data berjaya ditambah`);
          props.setReload(!props.reload);
        } else {
          toast.error(`Data tidak berjaya ditambah`);
        }
        props.setShowSosMedModal(false);
        setAddingData(false);
      });
      return;
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
    console.log(Data);
    createData(props.FType, Data).then((res) => {
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        props.setReload(!props.reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
      }
      props.setShowSosMedModal(false);
      setAddingData(false);
    });
  };

  const propsSosMed = {
    questionState,
    setQuestionState,
  };

  useEffect(() => {
    readKodProgramData().then((res) => {
      if (res.status === 200) {
        setPilihanKodProgram(res.data);
      }
    });
    return () => {
      setPilihanKodProgram([]);
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
              <div className='m-2'>
                <p className='flex flex-row pl-1 text-sm font-semibold'>
                  Kod Program :
                </p>
                <Select
                  className='basic-single'
                  classNamePrefix='select'
                  placeholder='Sila pilih kod Program...'
                  options={pilihanKodProgram}
                  getOptionLabel={(option) =>
                    `${option.kodProgram} - ${option.jenisProgram} - ${option.namaProgram}`
                  }
                  getOptionValue={(option) => option.kodProgram}
                  isSearchable={true}
                  onChange={(e) => {
                    setQuestionState({
                      ...questionState,
                      kodProgram: e.kodProgram,
                    });
                  }}
                />
              </div>
              <div className='flex justify-center mb-1 pl-3'>
                <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap'>
                  tarikh muatnaik:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <CustomDatePicker
                  jenis='mula'
                  setQuestionState={setQuestionState}
                />
                <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap'>
                  tarikh kemaskini:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <CustomDatePicker
                  jenis='akhir'
                  setQuestionState={setQuestionState}
                />
              </div>
              <div className='flex mt-2'>
                <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-1 md:whitespace-nowrap pl-3'>
                  Tajuk Bahan / Aktiviti:{' '}
                  <span className='font-semibold text-user6'>*</span>
                </p>
                <input
                  className='appearance-none w-full text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50  rounded-md uppercase flex flex-row mx-2'
                  type='text'
                  placeholder='Nama Aktiviti'
                  onChange={(e) => {
                    setQuestionState({
                      ...questionState,
                      namaAktiviti: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className='p-2'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-start items-center mr-1 md:whitespace-nowrap pl-1'>
                Jenis Media Sosial :{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <Select
                isMulti
                name='promosi'
                options={JenisMediaSosial}
                placeholder='Sila pilih platform...'
                className='basic-multi-select'
                classNamePrefix='select'
                onChange={(e) => {
                  setPilihanMediaSosial(e);
                }}
              />
              {pilihanMediaSosial.map((item) =>
                RenderSection(item, propsSosMed)
              )}
            </div>
            <div className='flex justify-center mb-2'>
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
    if (props.accountType !== 'kpUser') {
      readData('sosmedByKodProgram').then((res) => {
        setData(res.data);
      });
    }
    if (props.accountType === 'kpUser') {
      readDataForKp('sosmedByKodProgram').then((res) => {
        console.log(res);
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
