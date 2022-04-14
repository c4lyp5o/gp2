function UserDashboard() {
  return (
    <>
      <button>jumlah data entri</button>
      <section className='jumlah-data-entri-container'>
        <article className='jumlah-kedatangan-container'>
          <h4 className='jumlah-kedatangan'>jumlah kedatangan</h4>
          <div className='jumlah-baru-ulangan'>6734</div>
          <div className='baru'>baru</div>
          <div className='jumlah-baru'>5389</div>
          <div className='ulangan'>ulangan</div>
          <div className='jumlah-ulangan'>1345</div>
        </article>
        <article className='taska-container'>
          <h4 className='taska'>taska</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>8/11</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>234</div>
        </article>
        <article className='pra-sekolah-container'>
          <h4 className='pra-sekolah'>pra sekolah</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>8/12</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>150</div>
        </article>
        <article className='sekolah-menengah-container'>
          <h4 className='sekolah-menengah'>sekolah menengah</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>8/9</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>4234</div>
        </article>
        <article className='klinik-pergigian-container'>
          <h4 className='klinik-pergigian'>klinik pergigian</h4>
          <div className='jumlah-klinik-pergigian'>1/1</div>
        </article>
        <article className='tadika-container'>
          <h4 className='tadika'>tadika</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>14/20</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>876</div>
        </article>
        <article className='sekolah-rendah-container'>
          <h4 className='sekola-rendah'>sekolah rendah</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>13/16</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>877</div>
        </article>
        <article className='institusi-container'>
          <h4 className='institusi'>institusi</h4>
          <div className='bilangan-dilawati'>bilangan dilawati</div>
          <div className='jumlah-bilangan-dilawati'>1/2</div>
          <div className='bilangan-diperiksa'>bilangan diperiksa</div>
          <div className='jumlah-bilangan-diperiksa'>363</div>
        </article>
      </section>
      <button>status kesihatan pergigian pelajar</button>
      <section className='status-kesihatan-pergigian-pelajar-container'>
        <select name='jenis-institusi' id='jenis-institusi'>
          <option selected disabled>
            institusi
          </option>
          <option value='taska'>taska</option>
          <option value='tadika'>tadika</option>
          <option value='pra sekolah'>pra sekolah</option>
          <option value='sekolah rendah'>sekolah rendah</option>
          <option value='sekolah menengah'>sekolah menengah</option>
        </select>
        <article className='mbk-container'>
          <h4 className='mbk'>MBK</h4>
          <div className='jumlah-mbk'>78%</div>
        </article>
        <article className='bk-container'>
          <h4 className='bk'>BK</h4>
          <div className='jumlah-bk'>---</div>
        </article>
        <article className='bk-container'>
          <h4 className='bk'>BK</h4>
          <div className='jumlah-bk'>---</div>
        </article>
        <article className='bk-container'>
          <h4 className='bk'>BK</h4>
          <div className='jumlah-bk'>---</div>
        </article>
        <article className='bk-container'>
          <h4 className='bk'>BK</h4>
          <div className='jumlah-bk'>---</div>
        </article>
      </section>
      <button>ranking pencapaian kesihantan pergigian sekolah</button>
    </>
  );
}

export default UserDashboard;
