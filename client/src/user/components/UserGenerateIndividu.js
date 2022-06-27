export default function UserGenerateIndividu() {
  return (
    <>
      <div className='display-flex'>
        <div className='grid grid-cols-4 grid-flow-col'>
          <strong>Reten: </strong>
          <select name='' id=''>
            <option value=''>PG201</option>
            <option value=''>PG202</option>
            <option value=''>PG203</option>
          </select>
          <strong>Daripada</strong>
          <input type='date' name='' id='' />
          <strong>Sehingga</strong>
          <input type='date' name='' id='' />
          <strong>Format: </strong>
          <select name='' id=''>
            <option value=''>Excel</option>
            <option value=''>PDF</option>
            <option value=''>Holy Grail</option>
          </select>
        </div>
        <div>
          <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 mr-2 hover:bg-user1 transition-all'>
            cetak
          </button>
          <button className='capitalize bg-user3 text-userWhite rounded-md shadow-xl p-2 ml-2 hover:bg-user1 transition-all'>
            jana
          </button>
        </div>
        <div className='p-2 items-center mt-2'>
          <iframe
            className='w-full'
            height='480'
            title='iframe'
            src='https://www.youtube.com/embed/dQw4w9WgXcQ'
            frameborder='0'
          ></iframe>
        </div>
      </div>
    </>
  );
}
