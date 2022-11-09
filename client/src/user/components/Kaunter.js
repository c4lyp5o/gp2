import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

import PatientData from './pt-registration/PatientData';
import FillableForm from './pt-registration/FillableForm';
import KomunitiLain from './KaunterKomunitiLain';
// import EditableForm from './pt-registration/EditableForm';

function Kaunter({
  refreshTimer,
  setRefreshTimer,
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
  // program puyna hal
  const [semuaProgram, setSemuaProgram] = useState([]);
  const [namaProgram, setNamaProgram] = useState('');
  const [jenisProgram, setJenisProgram] = useState('');
  const [fetchProgramData, setFetchProgramData] = useState(false);
  const [showPilihanProgram, setShowPilihanProgram] = useState(false);

  useEffect(() => {
    if (
      showForm === false &&
      editForm === false &&
      jenisFasiliti !== 'projek-komuniti-lain'
    ) {
      const fetchPersonUmum = async () => {
        try {
          setIsLoading(true);
          setShowPilihanProgram(false);
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
      setSemuaProgram([]);
      fetchPersonUmum();
    }
    if (
      showForm === false &&
      editForm === false &&
      jenisFasiliti === 'projek-komuniti-lain'
    ) {
      const fetchJenisProgram = async () => {
        setIsLoading(true);
        setShowPilihanProgram(true);
        try {
          const { data } = await axios.get(`/api/v1/query/events`, {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          });
          setSemuaProgram(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      };
      fetchJenisProgram();
    }
    setRefreshTimer(!refreshTimer);
  }, [showForm, editForm, jenisFasiliti]);

  useEffect(() => {
    if (
      showForm === false &&
      editForm === false &&
      jenisFasiliti === 'projek-komuniti-lain'
    ) {
      const fetchPersonUmum = async () => {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&jenisProgram=${jenisProgram}`,
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        );
        return data;
      };
      fetchPersonUmum()
        .then((res) => {
          setData(res);
        })
        .then(() => {
          setIsLoading(false);
        });
    }
  }, [fetchProgramData]);

  // useEffect(() => {
  //   setRefreshTimer(!refreshTimer);
  // }, []);

  if (loading) {
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='px-2 lg:px-10 h-full p-3 overflow-y-auto'>
        {!showPilihanProgram ? (
          <PatientData
            data={data}
            setData={setData}
            loading={loading}
            setIsLoading={setIsLoading}
            error={error}
            setIsError={setIsError}
            philter={philter}
            setPhilter={setPhilter}
            showForm={showForm}
            setShowForm={setShowForm}
            editForm={editForm}
            setEditForm={setEditForm}
            setEditId={setEditId}
            showPilihanProgram={showPilihanProgram}
            jenisProgram={jenisProgram}
            namaProgram={namaProgram}
            jenisFasiliti={jenisFasiliti}
            kp={createdByKp}
          />
        ) : null}
        <FillableForm
          showForm={showForm}
          setShowForm={setShowForm}
          editId={editId}
          setEditId={setEditId}
          jenisFasiliti={jenisFasiliti}
          namaProgram={namaProgram}
          jenisProgram={jenisProgram}
          kp={createdByKp}
        />
        {/* <EditableForm
          editId={editId}
          editForm={editForm}
          setEditForm={setEditForm}
        /> */}
        {jenisFasiliti === 'projek-komuniti-lain' ? (
          <KomunitiLain
            jenisFasiliti={jenisFasiliti}
            semuaProgram={semuaProgram}
            setSemuaProgram={setSemuaProgram}
            setNamaProgram={setNamaProgram}
            jenisProgram={jenisProgram}
            setJenisProgram={setJenisProgram}
            showPilihanProgram={showPilihanProgram}
            setShowPilihanProgram={setShowPilihanProgram}
            setFetchProgramData={setFetchProgramData}
            fetchProgramData={fetchProgramData}
          />
        ) : null}
      </div>
    </>
  );
}

export default Kaunter;
