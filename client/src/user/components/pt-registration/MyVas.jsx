import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaWindowClose } from 'react-icons/fa';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';
import moment from 'moment';

export default function MyVas({ handleSubmitMyVas }) {
  const { kaunterToken, myVasToken, navigate, toast } =
    useGlobalUserAppContext();

  const [appointmentList, setAppointmentList] = useState([]);
  const [findingAppointment, setFindingAppointment] = useState(false);

  useEffect(() => {
    const fetchMyVasData = async () => {
      setFindingAppointment(true);
      try {
        const response = await axios.get('/api/v1/myvas/appointment-list', {
          headers: {
            Authorization: `Bearer ${kaunterToken} ${
              myVasToken ? myVasToken : ''
            }`,
          },
        });
        if (
          response &&
          response.data.next_status &&
          response.data.next_status >= 400 &&
          response.data.next_status <= 599
        ) {
          if (response.data.redirect_uri) {
            window.location.href = response.data.redirect_uri;
            return;
          }
        }
        setAppointmentList(response.data.entry);
        setFindingAppointment(false);
      } catch (error) {
        toast.error('Log masuk ke MyVAS gagal');
        setFindingAppointment(false);
        navigate('/pendaftaran/daftar/kp');
      }
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
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 uppercase'>
            {patientname}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {patientIdentifier}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {moment(timeslot).format('hh:mm A')}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-2'>
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
      <div className=' bg-userWhite z-20 overflow-y-auto rounded-md px-24 pb-4'>
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
          MyVAS
        </div>
        <div className='my-4 mb-1 text-2xl font-semibold'>
          <h1> Senarai Temujanji Hari Ini </h1>
        </div>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2 rounded-t-md'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-40'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-60'>
                  MASA TEMUJANJI
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 w-60'>
                  PILIHAN
                </th>
              </tr>
            </thead>
            {findingAppointment ? (
              <tbody className='bg-kaunter3'>
                <tr>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                  </td>
                </tr>
                <tr>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-3 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-24 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                  </td>
                  <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
                    <span className='h-2 text-user1 bg-user1 bg-opacity-50 animate-pulse w-full px-12 rounded-xl'></span>
                  </td>
                </tr>
              </tbody>
            ) : (
              appointmentList.map((appointment, index) => (
                <AppointmentList
                  key={index}
                  appointment={appointment}
                  index={index}
                />
              ))
            )}
          </table>
        </div>
      </div>
    </>
  );
}
