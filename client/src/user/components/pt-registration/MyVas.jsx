import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';

export default function MyVas({ setShowMyVas, handleSubmitMyVas }) {
  const { kaunterToken, myVasToken } = useGlobalUserAppContext();

  const searchParams = new URLSearchParams(useLocation().search);
  const nricParam = searchParams.get('nric');
  const [patientId, setPatientId] = useState(
    searchParams.get('nric') || 'AMI004'
  );
  const [txtName, setTxtName] = useState('');
  const [txtPhone, setTxtPhone] = useState('');
  const [txtGender, setTxtGender] = useState('');
  const [txtDOB, setTxtDOB] = useState('');
  const [txtPostcode, setTxtPostcode] = useState('');
  const [txtAddress1, setTxtAddress1] = useState('');
  const [txtAddress2, setTxtAddress2] = useState('');
  const [txtCity, setTxtCity] = useState('');

  const [appointmentList, setAppointmentList] = useState([]);

  const nodejs_patient = '/api/v1/myvastest/appointment-list';

  useEffect(() => {
    const fetchMyVasData = async () => {
      const config = {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${kaunterToken} ${
            myVasToken ? myVasToken : ''
          }`,
        },
      };
      await axios.get(`${nodejs_patient}`, config).then((res) => {
        if (
          res &&
          res.data.next_status &&
          res.data.next_status >= 400 &&
          res.data.next_status <= 599
        ) {
          if (res.data.redirect_uri) {
            window.location.href = res.data.redirect_uri;
            return;
          }
        }
        setAppointmentList(res.data.entry);
      });
    };
    fetchMyVasData();
  }, []);

  const AppointmentList = ({ appointment }) => {
    const foundPatient = appointment.resource.contained.find(
      (resource) => resource.resourceType === 'Patient'
    );
    const patientIdentifier = foundPatient?.identifier[0].value;
    const patientname = foundPatient?.name[0].given[0];
    const timeslot = appointment.resource.start;
    return (
      <div className='flex flex-col sm:flex-row'>
        <div className='w-1/4 sm:w-3/12 bg-white rounded-tl-lg rounded-tr-lg p-4 '>
          <p className=''>{timeslot}</p>
        </div>
        <div className='w-1/4 sm:w-3/12 bg-white p-4'>
          <p
            className='text-user6'
            onClick={() => {
              handleSubmitMyVas(patientIdentifier);
              setShowMyVas(false);
            }}
          >
            {patientIdentifier}
          </p>
        </div>
        <div className='w-1/2 sm:w-6/12 bg-white rounded-tr-lg rounded-bl-lg p-4 text-center '>
          <p className='text-user7'>{patientname}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='absolute inset-x-40 inset-y-1 bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <FaWindowClose
          className='absolute top-0.5 right-2 text-xl cursor-pointer text-userWhite hover:text-kaunter3'
          onClick={() => setShowMyVas(false)}
        />
        <div className='h-7 bg-userBlack bg-opacity-90 flex justify-center items-center text-userWhite normal-case font-semibold text-lg'>
          <img
            src={mysejahtera}
            alt='MySejahtera Logo'
            className='w-6 h-6 inline-block m-1'
          />{' '}
          MyVas
        </div>
        <div className='my-4 mb-1 text-lg font-bold'>
          <h1> MyKAD & MyKID </h1>
        </div>
        <h1 className='my-2 text-lg font-bold'>Patient Detail</h1>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
          {/* <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  JANTINA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  ALAMAT
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  PILIHAN
                </th>
              </tr>
            </thead>
            <tbody className='bg-kaunter3'>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  1
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  {txtName}
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  {patientId}
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  {txtPhone}
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  {txtGender}
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  {txtAddress1}
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  2
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  ABDUL RAHMAN BIN ABDUL RAZAK
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  900101-01-5555
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  012-3456789
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  12:00 PM
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  HADIR
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
            </tbody>
          </table> */}
          <div className='p-4 w-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 m-auto'>
            <div className='flex flex-col sm:flex-row bg-black rounded-lg text-white'>
              <div className='w-1/4 sm:w-3/12 bg-black rounded-tl-lg rounded-tr-lg p-4'>
                <h2 className='text-left font-bold'>Timeslot</h2>
              </div>
              <div className='w-1/4 sm:w-3/12 bg-black p-4'>
                <h2 className='text-left font-bold'>ID</h2>
              </div>
              <div className='w-1/2 sm:w-6/12 bg-black rounded-tr-lg rounded-bl-lg p-4'>
                <h2 className='text-center font-bold'>Name</h2>
              </div>
            </div>
            {appointmentList.map((appointment, index) => (
              <AppointmentList key={index} appointment={appointment} />
            ))}
          </div>
        </div>
        {/* <div className='my-5 mb-2 text-lg font-bold'>
          <h1> MySejahtera</h1>
        </div>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2 '>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NAME
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  NO. TELEFON
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  PILIHAN
                </th>
              </tr>
            </thead>
            <tbody className='bg-kaunter3'>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  1
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  MOHAMMAD AMIRUDDIN BIN KAMIL
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  901205-08-5201
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  017-2932241
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
              <tr>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  2
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  FATIN SOFEA BINTI DAUD
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2'>
                  951202-06-5220
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  011-1125676
                </td>
                <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                  <span className='bg-user1 text-userWhite px-2 py-1 rounded-md'>
                    PILIH
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
        {/* <div className='mt-10 mb-2 flex flex-col justify-center items-center'>
          <div className='text-lext flex flex-col w-96'>
            <span className='flex justify-center my-6'>
              <img
                src={mysejahtera}
                alt='MySejahtera Logo'
                className='w-32 h-32 inline-block m-1'
              />
            </span>
            <h1 className='text-lext flex justify-start text-lg font-semibold'>
              Login
            </h1>
            <h2 className='text-lext flex justify-start text-xs mb-4'>
              Please fill in details
            </h2>
            <form>
              <div className='flex flex-col justify-center'>
                <label htmlFor='email' className='text-xs flex justify-start'>
                  Email Address
                </label>
                <input
                  required
                  type='email'
                  name='email'
                  placeholder='Email'
                  className='appearance-none w-full leading-7 px-3 py-1 ring-1 ring-kaunter4 focus:ring-1 focus:ring-user2 focus:outline-none rounded shadow-md mt-1 mb-4'
                  data-cy='email'
                />
                <button
                  type='button'
                  className='w-full rounded bg-userBlack bg-opacity-90 hover:ring-4 hover:ring-user1 hover:ring-opacity-50 text-userWhite hover:cursor-pointer shadow-md transition-all px-2 py-1'
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div> */}
      </div>
      <div
        onClick={() => setShowMyVas(false)}
        className='absolute inset-0 bg-user1 opacity-75 z-10'
      />
    </>
  );
}
