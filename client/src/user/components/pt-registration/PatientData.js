import { useQuery, gql } from '@apollo/client';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function PatientData({ showForm, setShowForm }) {
  const { dateToday } = useGlobalUserAppContext();

  const GET_PATIENT_BY_TARIKH_KEDATANGAN = gql`
    query getPatientByTarikhKedatangan($tarikhKedatangan: String!) {
      listPatientByTarikhKedatangan(tarikhKedatangan: $tarikhKedatangan) {
        _id
        nama
        jenisIc
        ic
        tarikhLahir
        umur
        jantina
        tarikhKedatangan
        alamat
        waktuSampai
        kategoriPesakit
        kumpulanEtnik
        rujukDaripada
        createdAt
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PATIENT_BY_TARIKH_KEDATANGAN, {
    variables: {
      tarikhKedatangan: `${dateToday}`,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!showForm) {
    return (
      <>
        <input
          className='p-2 w-auto'
          type='text'
          name='carianPesakit'
          placeholder='Cari pesakit...'
        />
        <br />
        <button
          className='border border-1 border-userBlack bg-user3 p-2 mt-2 items-left'
          onClick={() => setShowForm(true)}
        >
          Daftar Pesakit Baru
        </button>
        <div className='border mt-2'>
          <div className='justify-center items-center'>
            {data.listPatientByTarikhKedatangan.map((p, index) => (
              <>
                <div key={index}>
                  <p>Nama: {p.nama}</p>
                  <p>IC: {p.ic}</p>
                  <p>Tarikh Lahir: {p.tarikhLahir}</p>
                  <p>Umur: {p.umur}</p>
                  <p>Jantina: {p.jantina}</p>
                  <p>Tarikh Kedatangan: {p.tarikhKedatangan}</p>
                  <br />
                </div>
              </>
            ))}
          </div>
        </div>
      </>
    );
  }
}
