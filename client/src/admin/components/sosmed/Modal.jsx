import { useGlobalAdminAppContext } from '../../context/adminAppContext';
import { useAdminData } from '../../context/admin-hooks/useAdminData';
import { useKpData } from '../../context/kp-hooks/useKpData';
import { useLogininfo } from '../../context/useLogininfo';
import { useMiscData } from '../../context/useMiscData';
import { useUtils } from '../../context/useUtils';
import { useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { FaWindowClose } from 'react-icons/fa';

import { SubmitButton, BusyButton } from '../Buttons';
import { ConfirmModalForData } from '../Confirmation';

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
  const { masterDatePicker } = useUtils();
  const [date, setDate] = useState(null);
  return masterDatePicker({
    required: true,
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
  const { masterDatePicker } = useUtils();
  const [date, setDate] = useState(null);
  return masterDatePicker({
    required: true,
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
  const { createData } = useAdminData();
  const { createDataForKp } = useKpData();
  const { loginInfo } = useLogininfo();
  const [questionState, setQuestionState] = useState([]);

  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    try {
      setAddingData(true);

      let Data;

      Data = {
        ...Data,
        bulan: questionState.bulan,
        createdByKp: props.kp,
        createdByNegeri: props.negeri,
        createdByDaerah: props.daerah,
        namaPlatform: questionState.namaPlatform,
        jumlahFollowerBulanTerdahulu:
          questionState.jumlahFollowerBulanTerdahulu,
        jumlahFollowerBulanIni: questionState.jumlahFollowerBulanIni,
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

      switch (loginInfo.accountType) {
        case 'negeriSuperadmin':
        case 'daerahSuperadmin':
          const res = await createData(props.FType, Data);
          break;
        case 'kpUserAdmin':
          const resKp = await createDataForKp(props.FType, Data);
          break;
        default:
          break;
      }
      toast.info(`Data berjaya ditambah`);
    } catch (error) {
      toast.error(`Data tidak berjaya ditambah`);
      console.log(error);
    } finally {
      props.setReload(!props.reload);
      props.setShowSosMedModal(false);
      setAddingData(false);
    }
  };

  return (
    <ConfirmModalForData callbackFunction={handleSubmit} func='add'>
      {(confirm) => (
        <form onSubmit={confirm(handleSubmit)}>
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
                    required
                    className='appearance-none w-full text-sm leading-7 px-2 py-1 ring-1 ring-user1 ring-opacity-50 focus:ring-2 focus:ring-admin4 focus:outline-none rounded-md uppercase flex flex-row'
                    onChange={(e) => {
                      setQuestionState((prev) => ({
                        ...prev,
                        namaPlatform: e.target.value,
                      }));
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
                    required
                    type='number'
                    name='past-followers'
                    id='past-followers'
                    min={0}
                    className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
                    onChange={(e) => {
                      setQuestionState((prev) => ({
                        ...prev,
                        jumlahFollowerBulanTerdahulu: e.target.value,
                      }));
                    }}
                  />
                  <p>bilangan followers bulan terkini</p>
                  <input
                    required
                    type='number'
                    name='current-followers'
                    id='current-followers'
                    min={0}
                    className='appearance-none w-20 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 drop-shadow-lg'
                    onChange={(e) => {
                      setQuestionState((prev) => ({
                        ...prev,
                        jumlahFollowerBulanIni: e.target.value,
                      }));
                    }}
                  />
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
      )}
    </ConfirmModalForData>
  );
};

// modal add aktiviti media sosial
export const ModalSosMed = (props) => {
  const { toast } = useGlobalAdminAppContext();
  const { createData } = useAdminData();
  const { createDataForKp } = useKpData();
  const { readKodProgramData } = useMiscData();
  const { loginInfo } = useLogininfo();

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
    try {
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

      const Data = {
        createdByKp: props.kp,
        createdByDaerah: props.daerah,
        createdByNegeri: props.negeri,
        kodProgram: questionState.kodProgram,
        data: [newData],
        belongsTo: props.kp || props.daerah || props.negeri,
      };

      switch (loginInfo.accountType) {
        case 'negeriSuperadmin':
        case 'daerahSuperadmin':
          const res = await createData(props.FType, Data);
          toast.info(`Data berjaya ditambah`);
          break;
        case 'kpUserAdmin':
          const resKp = await createDataForKp(props.FType, Data);
          toast.info(`Data berjaya ditambah`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(`Data tidak berjaya ditambah`);
    } finally {
      props.setReload(!props.reload);
      props.setShowSosMedModal(false);
      setAddingData(false);
    }
  };

  const propsSosMed = {
    questionState,
    setQuestionState,
  };

  useEffect(() => {
    const fetchAllProgramPromosi = async () => {
      try {
        const { data: SemuaKodProgram } = await readKodProgramData();
        const withoutDuplicateJenisProgram = SemuaKodProgram.map(
          (a) => a.jenisProgram
        );
        const withoutDuplicate = [...new Set(withoutDuplicateJenisProgram)];
        setProgramPromosi({
          jenisProgram: withoutDuplicate,
          allProgramPromosi: SemuaKodProgram,
        });
      } catch (error) {
        console.log(error);
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
                      required
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
                      required
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
                    required
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
                  required
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
