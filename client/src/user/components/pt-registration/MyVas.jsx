import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../context/userAppContext';

import mysejahtera from '../../../assets/MySejahtera.png';
import moment from 'moment';

export default function MyVas({ handleSubmitMyVas }) {
  const {
    kaunterToken,
    myVasToken,
    navigate,
    destroyMyVasSessionOnly,
    dateToday,
    formatTime,
    toast,
  } = useGlobalUserAppContext();

  const [appointmentList, setAppointmentList] = useState([]);
  const [dahDaftarPt, setDahDaftarPt] = useState([]);
  const [jumpaPt, setJumpaPt] = useState({});
  const [findingAppointment, setFindingAppointment] = useState(false);

  useEffect(() => {
    const fetchMyVasData = async () => {
      setFindingAppointment(true);
      try {
        const dataMyVasAppointmentList = await axios.get(
          '/api/v1/myvas/appointment-list',
          {
            headers: {
              Authorization: `Bearer ${kaunterToken} ${
                myVasToken ? myVasToken : ''
              }`,
            },
          }
        );
        if (
          dataMyVasAppointmentList &&
          dataMyVasAppointmentList.data.next_status &&
          dataMyVasAppointmentList.data.next_status >= 400 &&
          dataMyVasAppointmentList.data.next_status <= 599
        ) {
          if (dataMyVasAppointmentList.data.redirect_uri) {
            window.location.href = dataMyVasAppointmentList.data.redirect_uri;
            return;
          }
        }
        setAppointmentList(dataMyVasAppointmentList.data.entry);
        setFindingAppointment(false);
      } catch (error) {
        toast.error('Log masuk ke MyVAS gagal');
        setFindingAppointment(false);
        destroyMyVasSessionOnly();
        navigate('/pendaftaran/daftar/kp');
      }
    };
    fetchMyVasData();
  }, []);

  useEffect(() => {
    const fetchKaunterList = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/query/kaunter?tarikhKedatangan=${moment(dateToday).format(
            'YYYY-MM-DD'
          )}&jenisFasiliti=kp`,
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        );
        setDahDaftarPt(data.kaunterResultQuery);
      } catch (error) {
        console.log(error);
      }
    };
    fetchKaunterList();
  }, []);

  // function betweeen two array if has same ic registered
  function listRegistered(arr1, arr2) {
    return arr1.filter((element1) => {
      return arr2.some((element2) => {
        const foundPatient = element1.resource.contained.find(
          (resource) => resource.resourceType === 'Patient'
        );
        const patientIdentifier = foundPatient?.identifier[0].value;
        return patientIdentifier === element2.ic;
      });
    });
  }

  // function betweeen two array if has same ic unregistered
  function listUnregistered(arr1, arr2) {
    return arr1.filter((element1) => {
      return !arr2.some((element2) => {
        const foundPatient = element1.resource.contained.find(
          (resource) => resource.resourceType === 'Patient'
        );
        const patientIdentifier = foundPatient?.identifier[0].value;
        return patientIdentifier === element2.ic;
      });
    });
  }

  const listDaftarPt = listRegistered(appointmentList, dahDaftarPt);
  const listBelumDaftarPt = listUnregistered(appointmentList, dahDaftarPt);

  const AppointmentListBelumDaftar = ({ appointment, index }) => {
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
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 uppercase text-left pl-3'>
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
              className='bg-user1 text-userWhite px-2 py-1 rounded-md cursor-pointer m-3 hover:bg-kaunter2'
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

  const AppointmentListSudahDaftar = ({ appointment, index }) => {
    const foundPatient = appointment.resource.contained.find(
      (resource) => resource.resourceType === 'Patient'
    );
    const patientIdentifier = foundPatient?.identifier[0].value;
    const patientname = foundPatient?.name[0].given[0];
    const timeslot = appointment.resource.start;

    // Find the relevant data for the registered patient from dahDaftarPt
    const registeredPatientData = dahDaftarPt.find(
      (dahDaftarPtItem) => dahDaftarPtItem.ic === patientIdentifier
    );

    // Check if the patient is registered (exists in dahDaftarPt)
    const isRegistered = !!registeredPatientData;

    return (
      <tbody className='bg-kaunter3'>
        <tr>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {index + 1}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1 uppercase text-left pl-3'>
            {patientname}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {patientIdentifier}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-1'>
            {moment(timeslot).format('hh:mm A')}
          </td>
          <td className='outline outline-1 outline-userWhite outline-offset-1 px-2 py-2'>
            {isRegistered && formatTime(registeredPatientData.waktuSampai)}
          </td>
        </tr>
      </tbody>
    );
  };

  return (
    <>
      <div className=' bg-userWhite z-20 overflow-y-auto rounded-md px-5 lg:px-24 pb-4'>
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
        <div className='my-2 mb-1 text-2xl font-semibold flex flex-row justify-center place-items-center'>
          <h1>Senarai Pesakit Janji Temu Hari Ini (MyVAS)</h1>
          {/* <span className='flex justify-center items-center normal-case mx-2'>
            (
            <img
              src={mysejahtera}
              alt='MySejahtera Logo'
              className='w-5 h-5 mx-2'
            />
            MyVAS)
          </span> */}
        </div>
        <div className='flex m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
          <table className='table-auto'>
            <thead className='text-userWhite bg-kaunter2 rounded-t-md'>
              <tr>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-40'>
                  BIL
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                  NAMA
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
                  KAD PENGENALAN
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
                  MASA JANJI TEMU
                </th>
                <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
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
              listBelumDaftarPt.map((appointment, index) => (
                <AppointmentListBelumDaftar
                  key={appointment.resource.id}
                  appointment={appointment}
                  index={index}
                />
              ))
            )}
          </table>
        </div>
        {listDaftarPt.length > 0 && (
          <>
            <div className='my-2 mb-1 text-2xl font-semibold flex flex-row justify-center place-items-center mt-9'>
              <h1>Senarai pesakit janji temu yang sudah didaftarkan</h1>
            </div>
            <div className='flex flex-col m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max mt-2'>
              <table className='table-auto'>
                <thead className='text-userWhite bg-kaunter2 rounded-t-md'>
                  <tr>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-40'>
                      BIL
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                      NAMA
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
                      KAD PENGENALAN
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
                      MASA JANJI TEMU
                    </th>
                    <th className='outline outline-1 outline-offset-1 px-2 py-1 lg:w-60'>
                      WAKTU SAMPAI
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
                  listDaftarPt.map((appointment, index) => (
                    <AppointmentListSudahDaftar
                      key={appointment.resource.id}
                      appointment={appointment}
                      index={index}
                    />
                  ))
                )}
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
