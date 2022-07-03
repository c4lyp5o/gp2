const handleSubmit = (e) => {
  e.preventDefault();
  // do something..
};

function UserUmum() {
  return (
    <>
      <div className='px-10 h-full p-3 overflow-y-auto'>
        <form onSubmit={handleSubmit} className='text-left'>
          <h2 className='text-xl font-semibold flex flex-row p-2'>CARIAN</h2>
          <label htmlFor='nama-pesakit' className='flex flex-row p-2'>
            nama pesakit
          </label>
          <input
            type='text'
            name='nama-pesakit'
            id='nama-pesakit'
            className='appearance-none leading-7 px-3 py-1 ring-2 w-full focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
          />
          <label htmlFor='kad-pengenalan' className='flex flex-row p-2'>
            no. kad pengenalan
          </label>
          <input
            type='text'
            name='kad-pengenalan'
            id='kad-pengenalan'
            className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
          />
          <button
            type='submit'
            className='bg-user3 p-2 ml-3 w-1/5 justify-center hover:bg-user1 hover:text-userWhite transition-all'
          >
            CARI
          </button>
        </form>
        <section className='my-5 p-1 outline outline-1 outline-user1'>
          <h2 className='text-xl font-semibold flex flex-row pl-12 p-2'>
            SENARAI CARIAN
          </h2>
          <table className='m-auto mb-3 w-11/12 outline outline-1 outline-userBlack'>
            <tr className='bg-user3 p-2'>
              <th className='outline outline-1 outline-userBlack'>BIL</th>
              <th className='outline outline-1 outline-userBlack px-20'>
                NAMA PESAKIT
              </th>
              <th className='outline outline-1 outline-userBlack'>
                KAD PENGENALAN
              </th>
              <th className='outline outline-1 outline-userBlack'>
                TARIKH LAWATAN TERAKHIR
              </th>
              <th className='outline outline-1 outline-userBlack'>AKTIFKAN</th>
            </tr>
            <tr>
              <td className='outline outline-1 outline-userBlack'>1</td>
              <td className='outline outline-1 outline-userBlack px-20'>
                ahmad abu
              </td>
              <td className='outline outline-1 outline-userBlack'>
                210145-12-2344
              </td>
              <td className='outline outline-1 outline-userBlack'>
                04-07-2023
              </td>
              <td className='outline outline-1 outline-userBlack'>Pilih</td>
            </tr>
          </table>
        </section>
        <section className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2'>
          <div className='mb-3'>
            <div className='text-l font-bold flex flex-row pl-5 p-2'>
              <h1>MAKLUMAT AM PESAKIT</h1>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>NAMA :</h2>
              <p className='ml-1'>ahmad abu</p>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>UMUR :</h2>
              <p className='ml-1'>51 tahun</p>
            </div>
          </div>
          <div className='md:pt-10'>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>JANTINA :</h2>
              <p className='ml-1'>lelaki</p>
            </div>
            <div className='text-s flex flex-row pl-5'>
              <h2 className='font-semibold'>IC/Passport :</h2>
              <p className='ml-1'>210145-12-2344</p>
            </div>
            <button className='float-right m-2 p-2 capitalize bg-user3 hover:bg-user1 hover:text-userWhite transition-all'>
              masukkan reten
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default UserUmum;
