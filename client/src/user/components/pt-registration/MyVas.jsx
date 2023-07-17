import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';

export default function MyVas({ handleSubmitMyVas }) {
  const { kaunterToken, myVasToken, setMyVasToken, setMyVasIdToken, navigate } =
    useGlobalUserAppContext();

  const searchParamsic = new URLSearchParams(useLocation().search);
  const nricParam = searchParamsic.get('nric');
  const [patientId, setPatientId] = useState(
    searchParamsic.get('nric') || 'AMI004'
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

  // state untuk myvas code
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  const nodejs_patient = '/api/v1/myvas/appointment-list';

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

  // dapatkan token MyVas
  useEffect(() => {
    if (code) {
      const getMyVasToken = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${kaunterToken}`,
          },
        };
        await axios
          .get(`/api/v1/myvas/callback?code=${code}`, config)
          .then((res) => {
            localStorage.setItem('myVasToken', res.data.myVasToken);
            localStorage.setItem('myVasIdToken', res.data.myVasIdToken);
            setMyVasToken(res.data.myVasToken);
            setMyVasIdToken(res.data.myVasIdToken);
            navigate('/pendaftaran/daftar/kp/myvas');
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getMyVasToken();
    }
  }, []);

  const AppointmentList = ({ appointment, index }) => {
    const foundPatient = appointment.resource.contained.find(
      (resource) => resource.resourceType === 'Patient'
    );
    const patientIdentifier = foundPatient?.identifier[0].value;
    const patientname = foundPatient?.name[0].given[0];
    const timeslot = appointment.resource.start;
    return (
      <tbody className='bg-kaunter3'>
        <tr>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {index + 1}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {patientname}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {patientIdentifier}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {timeslot}
          </td>
          {/* <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {txtGender}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {txtAddress1}
          </td> */}
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            <span
              className='bg-user1 text-userWhite px-2 py-1 rounded-md'
              onClick={() => {
                handleSubmitMyVas(patientIdentifier);
                navigate('/pendaftaran/daftar/kp');
              }}
            >
              PILIH
            </span>
          </td>
        </tr>
      </tbody>
    );
  };

  return (
    <>
      <div className=' bg-userWhite z-20 overflow-y-auto rounded-md'>
        <FaWindowClose
          className='absolute top-0.5 right-2 text-xl cursor-pointer text-userWhite hover:text-kaunter3'
          onClick={() => {
            navigate('/pendaftaran/daftar/kp');
          }}
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
          <table className='table-auto'>
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
                  MASA TEMUJANJI
                </th>
                {/* <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  JANTINA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  ALAMAT
                </th> */}
                <th className='outline outline-1 outline-offset-1 px-2 py-1'>
                  PILIHAN
                </th>
              </tr>
            </thead>
            {appointmentList.map((appointment, index) => (
              <AppointmentList
                key={index}
                appointment={appointment}
                index={index}
              />
            ))}
          </table>
          {/* <div className='p-4 w-full border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 m-auto'>
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
          </div> */}
        </div>
      </div>
    </>
  );
}
