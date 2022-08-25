import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../context/userAppContext';

import PatientData from './pt-registration/PatientData';
import FillableForm from './pt-registration/FillableForm';
// import EditableForm from './pt-registration/EditableForm';

function Kaunter({
  jenisFasiliti,
  createdByKp,
  createdByDaerah,
  createdByNegeri,
}) {
  const { kaunterToken, dateToday } = useGlobalUserAppContext();

  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setIsError] = useState(false);
  const [philter, setPhilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    if (showForm === false && editForm === false) {
      const fetchPersonUmum = async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&jenisFasiliti=${jenisFasiliti}`,
            { headers: { Authorization: `Bearer ${kaunterToken}` } }
          );
          setData(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsError(true);
          setIsLoading(false);
        }
      };
      fetchPersonUmum();
    }
  }, [showForm, editForm, jenisFasiliti]);

  return (
    <>
      <div className='px-10 h-full p-3 overflow-y-auto'>
        <PatientData
          data={data}
          loading={loading}
          error={error}
          philter={philter}
          setPhilter={setPhilter}
          showForm={showForm}
          setShowForm={setShowForm}
          editForm={editForm}
          setEditForm={setEditForm}
          setEditId={setEditId}
          jenisFasiliti={jenisFasiliti}
        />
        <FillableForm
          showForm={showForm}
          setShowForm={setShowForm}
          jenisFasiliti={jenisFasiliti}
          editId={editId}
          setEditId={setEditId}
        />
        {/* <EditableForm
          editId={editId}
          editForm={editForm}
          setEditForm={setEditForm}
        /> */}
      </div>
    </>
  );
}

export default Kaunter;
