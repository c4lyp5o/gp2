import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';
import moment from 'moment';

export default function MyVas({ handleSubmitMyVas }) {
  const { kaunterToken, myVasToken, navigate } = useGlobalUserAppContext();

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
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
            {patientname}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1  md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
            {patientIdentifier}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 w-60'>
            {moment(timeslot).format('hh:mm A')}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-2 w-60'>
            <span
              className='bg-user1 text-userWhite px-2 py-1 rounded-md cursor-pointer m-3'
              onClick={() => {
                handleSubmitMyVas(patientIdentifier, timeslot);
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
        <div className='flex justify-end'>
          <span
            onClick={() => {
              navigate('/pendaftaran/daftar/kp');
            }}
            className='capitalize whitespace-nowrap bg-kaunter1 text-xs text-userWhite rounded-md shadow-xl p-1 my-2 mr-2 hover:bg-user1 transition-all cursor-pointer'
          >
            kembali ke senarai pesakit
          </span>
        </div>
        <div className='flex justify-center items-center text-user1 normal-case font-bold text-4xl'>
          <img
            src={mysejahtera}
            alt='MySejahtera Logo'
            className='w-20 h-20 m-1 mr-5'
          />
          MyVas
        </div>
        <div className='my-4 mb-1 text-2xl font-semibold'>
          <h1> Senarai Temujanji Hari Ini </h1>
        </div>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2 px-24'>
          <table className='table-auto rounded-md'>
            <thead className='text-userWhite bg-kaunter2 rounded-t-md'>
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
        </div>
      </div>
    </>
  );
}
