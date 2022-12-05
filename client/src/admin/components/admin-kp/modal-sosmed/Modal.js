import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { FaWindowClose, FaInfoCircle } from 'react-icons/fa';

import Confirmation from '../../superadmin/Confirmation';
import { SubmitButton, BusyButton } from '../../Buttons';
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
  const { DictionarySosMedParam, DictionarySosMedAcronym } =
    useGlobalAdminAppContext();

  return (
    <>
      <form>
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
                <select className='appearance-none w-56 text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row ml-2'>
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
                />
                <p>bilangan followers bulan terkini</p>
                <input
                  type='number'
                  name='current-followers'
                  id='current-followers'
                  className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
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
    </>
  );
};

export const ModalSosMed = (props) => {
  const { toast, createData, createDataForKp, readKodProgramData } =
    useGlobalAdminAppContext();

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

  const [pilihanKodProgram, setPilihanKodProgram] = useState([]);
  const [pilihanMediaSosial, setPilihanMediaSosial] = useState([]);
  const [questionState, setQuestionState] = useState([]);

  const currentName = useRef();

  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingData(true);
    let Data = {};
    Data = {
      ...Data,
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      createdByNegeri: props.negeri,
      kodProgram: questionState.kodProgram,
      data: [questionState],
    };
    if (props.kp) {
      Data = {
        ...Data,
        belongsTo: props.kp,
      };
      createDataForKp(props.FType, Data).then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.info(`Data berjaya ditambah`);
          props.setReload(!props.reload);
        } else {
          toast.error(`Data tidak berjaya ditambah`);
        }
        props.setShowSosMedModal(false);
        setAddingData(false);
        return;
      });
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
    createData(props.FType, Data).then((res) => {
      console.log(res);
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        props.setReload(!props.reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
      }
      props.setShowSosMedModal(false);
      setAddingData(false);
      return;
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
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                tarikh mula: <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker
                jenis='mula'
                setQuestionState={setQuestionState}
              />
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap'>
                tarikh akhir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker
                jenis='akhir'
                setQuestionState={setQuestionState}
              />
            </div>
            <div className='flex mt-2'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-1 md:whitespace-nowrap pl-3'>
                nama aktiviti:{' '}
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
              Media Sosial : <span className='font-semibold text-user6'>*</span>
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
            {pilihanMediaSosial.map((item) => RenderSection(item, propsSosMed))}
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
    </>
  );
};

export const ModalDataIkutProgram = (props) => {
  const { readData, readDataForKp, InfoDecoder } = useGlobalAdminAppContext();
  const [dataIndex, setDataIndex] = useState();
  const [internalDataIndex, setInternalDataIndex] = useState();
  const [data, setData] = useState();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (props.accountType !== 'kpUser') {
      readData('sosmedByKodProgram').then((res) => {
        setData(res.data);
      });
    }
    if (props.accountType === 'kpUser') {
      readDataForKp('sosmedByKodProgram').then((res) => {
        setData(res.data);
      });
    }
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
              <h1>KOD PROGRAM: {i.kodProgram.toUpperCase()}</h1>
            </div>
            <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max mt-4'>
              <table className='table-auto'>
                <thead className='text-adminWhite bg-admin3'>
                  <tr>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Bil.
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Nama Aktiviti
                    </th>
                    <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                      Tarikh Aktiviti
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-admin4'>
                  {i.data.map((i, index) => (
                    <>
                      <tr key={i.id}>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {index + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1 flex'>
                          {i.namaAktiviti}{' '}
                          <FaInfoCircle
                            className='ml-2 text-xl text-userBlack'
                            onMouseEnter={(e) => {
                              setShowInfo(true);
                              setDataIndex(dataIndex);
                              setInternalDataIndex(index);
                            }}
                            onMouseLeave={(e) => {
                              setShowInfo(false);
                            }}
                          />
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {moment(i.tarikhMula).format('DD-MM-YYYY')} -{' '}
                          {moment(i.tarikhAkhir).format('DD-MM-YYYY')}
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
              <h2 className='font-mono whitespace-nowrap'>INFO:</h2>
              {Object.keys(data[dataIndex].data[internalDataIndex])
                .filter(
                  (i) =>
                    i !== 'id' &&
                    i !== 'tarikhMula' &&
                    i !== 'tarikhAkhir' &&
                    i !== 'namaAktiviti'
                )
                .map((key) => {
                  return (
                    <p className='font-mono whitespace-nowrap'>
                      {InfoDecoder(key)} :{' '}
                      {data[dataIndex].data[internalDataIndex][key]}
                    </p>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <div className='absolute inset-0 bg-user1 z-10 opacity-100' />
    </>
  );
};
