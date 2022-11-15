function UserFormPromosi() {
  return (
    <>
      <div className='h-full p-1 px-2 md:px-10 grid gap-2 pb-2'>
        {/* maklumat acara */}
        <article className='outline outline-1 outline-userBlack '>
          <div className='flex flex-col pb-2'>
            <div>
              <h1>maklumat acara</h1>
            </div>
            <div>
              <p>jenis program:</p>
              <p>nama acara</p>
            </div>
            <div>
              <p>tarikh mula</p>
              <p>tarikh akhir</p>
            </div>
          </div>
        </article>
        {/* form promosi */}
        <div className='grid h-full overflow-scroll gap-2'>
          <form>
            <section className='grid grid-cols-1 gap-2 mt-3 mb-3 w-full col-span-2'>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md'></article>
            </section>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserFormPromosi;
