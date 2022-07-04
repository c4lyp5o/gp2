import { useQuery, gql } from '@apollo/client';

export default function PatientData({ showForm, setShowForm }) {
  const GET_PATIENTS = gql`
    query {
      patients {
        nama
        ic
        tarikhLahir
        umur
        jantina
        tarikhKedatangan
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PATIENTS);

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
        {/* <p className='text-center'>Selamat Datang ke Kaunter Pendaftaran</p> */}
        <button
          className='border border-1 border-userBlack bg-user3 p-2 mt-2 items-left'
          onClick={() => setShowForm(true)}
        >
          Daftar Pesakit Baru
        </button>
        <div className='border mt-2'>
          <div className='justify-center items-center'>
            {/* {allPesakit.map((p, index) => (
            <>
              <p>{p.nama}</p>
              <p>{p.ic}</p>
              <br />
            </>
          ))} */}
            {data.patients.map((p, index) => (
              <>
                <p>Nama: {p.nama}</p>
                <p>IC: {p.ic}</p>
                <p>Tarikh Lahir: {p.tarikhLahir}</p>
                <p>Umur: {p.umur}</p>
                <p>Jantina: {p.jantina}</p>
                <p>Tarikh Kedatangan: {p.tarikhKedatangan}</p>
                <br />
              </>
            ))}
          </div>
        </div>
      </>
    );
  }
}
