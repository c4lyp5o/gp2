import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import Select from 'react-select';
import { FaWindowClose } from 'react-icons/fa';

import Confirmation from '../../superadmin/Confirmation';
import { SubmitButton, BusyButton } from '../../Buttons';
import { Loading } from '../../Screens';

import RenderSection from './Cards';

import Facebook from '../../../assets/socmed/facebook.svg';
import Instagram from '../../../assets/socmed/instagram.png';
import Twitter from '../../../assets/socmed/twitter.svg';
import Tiktok from '../../../assets/socmed/tiktok.svg';
import Youtube from '../../../assets/socmed/youtube.svg';

// const CustomDatePicker = ({ jenis, setQuestionState }) => {
//   const [date, setDate] = useState(null);
//   return (
//     <DatePicker
//       dateFormat='dd/MM/yyyy'
//       selected={date}
//       onChange={(date) => {
//         const tempDate = moment(date).format('YYYY-MM-DD');
//         setDate(date);
//         if (jenis === 'mula') {
//           setQuestionState((prev) => ({
//             ...prev,
//             tarikhMula: tempDate,
//           }));
//         }
//         if (jenis === 'akhir') {
//           setQuestionState((prev) => ({
//             ...prev,
//             tarikhAkhir: tempDate,
//           }));
//         }
//       }}
//       peekNextMonth
//       showMonthDropdown
//       showYearDropdown
//       dropdownMode='select'
//       className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2'
//     />
//   );
// };

export const ModalSosMed = (props) => {
  const { toast, createDataForKp, readKodProgramData, masterDatePicker } =
    useGlobalAdminAppContext();

  const JenisMediaSosial = [
    { id: 1, value: 'Facebook', label: 'Facebook', img: Facebook },
    { id: 2, value: 'Instagram', label: 'Instagram', img: Instagram },
    { id: 3, value: 'Youtube', label: 'Youtube', img: Youtube },
    { id: 4, value: 'Tiktok', label: 'Tiktok', img: Tiktok },
    { id: 5, value: 'Twitter', label: 'Twitter', img: Twitter },
  ];

  const CustomDatePicker = ({ jenis, setQuestionState }) => {
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
        'appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2',
    });
  };

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
      kodProgram: questionState.kodProgram,
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      createdByNegeri: props.negeri,
    };
    Data = {
      ...Data,
      data: [questionState],
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
            className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            onClick={() => {
              props.setShowSosMedModal(false);
            }}
          />
          <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
            AKTIVITI MEDIA SOSIAL
          </h5>
          <div className='grid grid-row-3 mx-auto'>
            <div className='m-2'>
              {/* <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                Kod Program:{' '}
              </p> */}
              {/* <input
                type='text'
                className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row mr-2 mb-2'
                placeholder='Kod Program'
                ref={currentName}
                onChange={(e) => {
                  setQuestionState({
                    ...questionState,
                    kodProgram: e.target.value,
                  });
                }}
              /> */}
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
            <div className='flex justify-center mb-1'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                tarikh mula: <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker
                jenis='mula'
                setQuestionState={setQuestionState}
              />
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                tarikh akhir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker
                jenis='akhir'
                setQuestionState={setQuestionState}
              />
            </div>
            <div className='flex mt-1'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                nama aktiviti:{' '}
                <span className='font-semibold text-user6'>*</span>
                <input
                  className='appearance-none w-96 text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2'
                  type='text'
                  placeholder='Nama Aktiviti'
                  onChange={(e) => {
                    setQuestionState({
                      ...questionState,
                      namaAktiviti: e.target.value,
                    });
                  }}
                />
              </p>
            </div>
          </div>
          <div className='mt-5 p-2'>
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
          <div className='flex justify-center'>
            {addingData ? (
              <BusyButton func='add' />
            ) : (
              <SubmitButton func='add' />
            )}
            <button
              className='bg-user9 text-userWhite font-semibold text-md w-32 rounded-md p-1 m-3'
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
  const { toast, readDataForKp } = useGlobalAdminAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    console.log('hey');
    readDataForKp('sosmedByKodProgram').then((res) => {
      console.log(res);
      setData(res.data);
    });
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
        {data.map((i, index) => (
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
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {i.namaAktiviti}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                          {i.tarikhMula} - {i.tarikhAkhir}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ))}
      </div>
      <div className='absolute inset-0 bg-user1 z-10 opacity-100' />
    </>
  );
};
