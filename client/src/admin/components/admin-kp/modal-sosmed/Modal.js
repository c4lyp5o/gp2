import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useRef, useState } from 'react';
import Select from 'react-select';
import { FaWindowClose } from 'react-icons/fa';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Confirmation from '../../superadmin/Confirmation';
import { SubmitButton, BusyButton } from '../../Buttons';

import RenderSection from './Cards';

import Facebook from '../../../assets/socmed/facebook.svg';
import Instagram from '../../../assets/socmed/instagram.png';
import Twitter from '../../../assets/socmed/twitter.svg';
import Tiktok from '../../../assets/socmed/tiktok.svg';
import Youtube from '../../../assets/socmed/youtube.svg';

const CustomDatePicker = () => {
  return (
    <DatePicker
      dateFormat='dd/MM/yyyy'
      // selected={date}
      // onChange={(date) => {
      //   const tempDate = moment(date).format('YYYY-MM-DD');
      //   setDate(date);
      //   setPilihanTarikh(tempDate);
      // }}
      peekNextMonth
      showMonthDropdown
      showYearDropdown
      dropdownMode='select'
      className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2'
    />
  );
};

const ModalSosMed = (props) => {
  const { toast, createData } = useGlobalAdminAppContext();

  const JenisPromosi = [
    { id: 1, value: 'Facebook', label: 'Facebook', img: Facebook },
    { id: 2, value: 'Instagram', label: 'Instagram', img: Instagram },
    { id: 3, value: 'Youtube', label: 'Youtube', img: Youtube },
    { id: 4, value: 'Tiktok', label: 'Tiktok', img: Tiktok },
    { id: 5, value: 'Twitter', label: 'Twitter', img: Twitter },
  ];

  const [pilihanPromosi, setPilihanPromosi] = useState([]);
  const [questionState, setQuestionState] = useState([]);

  const currentName = useRef();

  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setAddingData(true);/
    let Data = {};
    Data = {
      ...Data,
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      cretedByNegeri: props.negeri,
    };
    Data = {
      ...questionState,
      ...Data,
    };
    // createData(props.FType, Data).then((res) => {
    //   console.log(res.data);
    //   if (res.status === 200) {
    //     toast.info(`Data berjaya ditambah`);
    //     props.setReload(!props.reload);
    //   } else {
    //     toast.error(`Data tidak berjaya ditambah`);
    //   }
    //   props.setShowAddModal(false);
    //   setAddingData(false);
    // });
    console.log(Data);
  };

  const props2 = {
    questionState,
    setQuestionState,
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='absolute inset-x-1 inset-y-1 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
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
            <div className='flex flex-row mt-1 mb-1'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                Kod Program:{' '}
              </p>
              <input
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
              />
              <button className='bg-user9 text-userWhite font-semibold text-md w-32 rounded-md p-1 m-3'>
                Cari
              </button>
            </div>
            <div className='flex justify-center mb-1'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                tarikh mula: <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker />
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                tarikh akhir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <CustomDatePicker />
            </div>
            <div className='flex mt-1'>
              <p className='text-xs md:text-sm text-right font-semibold flex justify-end items-center mr-4 md:whitespace-nowrap bg-user1 bg-opacity-5'>
                nama aktiviti:{' '}
                <span className='font-semibold text-user6'>*</span>
                <input
                  className='appearance-none w-auto text-sm leading-7 px-2 py-1 ring-2 ring-kaunter2 focus:ring-2 focus:ring-kaunter1 focus:outline-none rounded-md shadow-md uppercase flex flex-row ml-2'
                  type='text'
                />
              </p>
            </div>
          </div>
          <div className='mt-5 p-1'>
            <Select
              isMulti
              name='promosi'
              options={JenisPromosi}
              placeholder='Sila pilih promosi...'
              className='basic-multi-select'
              classNamePrefix='select'
              onChange={(e) => {
                setPilihanPromosi(e);
              }}
            />
            {pilihanPromosi.map((item) => RenderSection(item, props2))}
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

export default ModalSosMed;
