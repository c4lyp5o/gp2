export default function UserFormUmumHeader() {
  return (
    <>
      <div className='container px-10 h-full p-3 overflow-y-auto'>
        <div className='text-left'>
          <strong>carian</strong>
          <br />
          <strong>nama pesakit</strong>
          <input
            className='border-2 border-adminBlack'
            type='text'
            name=''
            id=''
          />
          <br />
          <strong>no. kad pengenalan</strong>
          <input
            className='border-2 border-adminBlack'
            type='text'
            name=''
            id=''
          />
          <br />
          <button className='border-2 border-adminBlack'>cari</button>
          <div className='border border-adminBlack mt-2'>
            <strong>SENARAI CARIAN</strong>
            <div>
              <table className='table-auto'>
                <tr>
                  <td>
                    <strong>Nama Pesakit</strong>
                  </td>
                  <td>
                    <strong>No. Kad Pengenalan</strong>
                  </td>
                  <td>
                    <strong>tarikh lawatan terakhir</strong>
                  </td>
                  <td>
                    <strong>aktifkan</strong>
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className='border border-adminBlack mt-2'>
            <strong>MAKLUMAT AM PESAKIT</strong>
            <p>nama: calypso</p>
            <p>umur: 5</p>
            <p>sex: always</p>
            <p>ic/passport: verified</p>
          </div>
        </div>
      </div>
    </>
  );
}
