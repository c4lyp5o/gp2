function UserDashboard() {
  return (
    <>
      <button>jumlah data entri</button>
      <section className='jumlah-data-entri-container'>
        <div className='jumlah-kedatangan-container'>
          <div className='jumlah-kedatangan'>jumlah kedatangan</div>
          <div className='jumlah-baru-ulangan'>6734</div>
          <div className='baru'>baru</div>
          <div className='jumlah-baru'>5389</div>
          <div className='ulangan'>ulangan</div>
          <div className='jumlah-ulangan'>1345</div>
        </div>
        <div>klinik pergigian</div>
        <div>taska</div>
        <div>tadika</div>
        <div>pra sekolah</div>
        <div>sekolah rendah</div>
        <div>sekolah menengah</div>
        <div>institusi</div>
      </section>
      <button>status kesihatan pergigian pelajar</button>
      <button>ranking pencapaian kesihantan pergigian sekolah</button>
    </>
  );
}

export default UserDashboard;
