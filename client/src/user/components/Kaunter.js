import { useState, useEffect } from 'react';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

import PatientData from './pt-registration/PatientData';
import FillableForm from './pt-registration/FillableForm';
import KaunterKomunitiLain from './KaunterKomunitiLain';

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
  const [philter, setPhilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState('');

  // state for program komuniti
  const [semuaProgram, setSemuaProgram] = useState([]);
  const [jenisProgram, setJenisProgram] = useState('');
  const [namaProgram, setNamaProgram] = useState('');
  const [showPilihanProgram, setShowPilihanProgram] = useState(false);
  const [dariFormProgramKomuniti, setDariFormProgramKomuniti] = useState(false);
  const [fetchProgramData, setFetchProgramData] = useState(false);

  useEffect(() => {
    if (showForm === false && jenisFasiliti !== 'projek-komuniti-lain') {
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
        }
      };
      setSemuaProgram([]);
      fetchPersonUmum();
    }
    if (
      showForm === false &&
      dariFormProgramKomuniti === false &&
      jenisFasiliti === 'projek-komuniti-lain'
    ) {
      const fetchJenisProgram = async () => {
        setIsLoading(true);
        setShowPilihanProgram(true);
        setJenisProgram('');
        try {
          const { data } = await axios.get(`/api/v1/query/kaunter/events`, {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          });
          setSemuaProgram(data.projekKomuniti);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchJenisProgram();
    }
    setDariFormProgramKomuniti(false);
    setRefreshTimer(!refreshTimer);
  }, [showForm, jenisFasiliti]);

  // fetching senarai pesakit program komuniti
  useEffect(() => {
    if (showForm === false && jenisFasiliti === 'projek-komuniti-lain') {
      const fetchPersonUmum = async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `/api/v1/query/kaunter?tarikhKedatangan=${dateToday}&namaProgram=${namaProgram}`,
            { headers: { Authorization: `Bearer ${kaunterToken}` } }
          );
          setData(data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPersonUmum();
      setRefreshTimer(!refreshTimer);
    }
  }, [fetchProgramData]);

  // IMPORTANT clearing jenisProgram & namaProgram state if jenisFasiliti !== 'projek-komuniti-lain'
  useEffect(() => {
    if (jenisFasiliti !== 'projek-komuniti-lain') {
      setJenisProgram('');
      setNamaProgram('');
    }
  }, [jenisFasiliti]);

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
            jenisFasiliti={jenisFasiliti}
            data={data}
            setData={setData}
            loading={loading}
            setIsLoading={setIsLoading}
            philter={philter}
            setPhilter={setPhilter}
            showForm={showForm}
            setShowForm={setShowForm}
            setEditId={setEditId}
            jenisProgram={jenisProgram}
            setJenisProgram={setJenisProgram}
            namaProgram={namaProgram}
            setNamaProgram={setNamaProgram}
            showPilihanProgram={showPilihanProgram}
            setShowPilihanProgram={setShowPilihanProgram}
            kp={createdByKp}
          />
        ) : null}
        <FillableForm
          jenisFasiliti={jenisFasiliti}
          showForm={showForm}
          setShowForm={setShowForm}
          editId={editId}
          setEditId={setEditId}
          jenisProgram={jenisProgram}
          namaProgram={namaProgram}
          setShowPilihanProgram={setShowPilihanProgram}
          dariFormProgramKomuniti={dariFormProgramKomuniti}
          setDariFormProgramKomuniti={setDariFormProgramKomuniti}
          fetchProgramData={fetchProgramData}
          setFetchProgramData={setFetchProgramData}
          kp={createdByKp}
        />
        {jenisFasiliti === 'projek-komuniti-lain' ? (
          <KaunterKomunitiLain
            jenisFasiliti={jenisFasiliti}
            semuaProgram={semuaProgram}
            setSemuaProgram={setSemuaProgram}
            jenisProgram={jenisProgram}
            setJenisProgram={setJenisProgram}
            namaProgram={namaProgram}
            setNamaProgram={setNamaProgram}
            showPilihanProgram={showPilihanProgram}
            setShowPilihanProgram={setShowPilihanProgram}
            fetchProgramData={fetchProgramData}
            setFetchProgramData={setFetchProgramData}
            kp={createdByKp}
          />
        ) : null}
      </div>
    </>
  );
}

export default Kaunter;
