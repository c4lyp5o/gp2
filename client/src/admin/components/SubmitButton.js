export default function SubmitButtton({ func }) {
  return (
    <button
      type='submit'
      className='capitalize bg-admin3 text-adminWhite rounded-md shadow-xl p-2 hover:bg-admin1 transition-all'
    >
      {func === 'add' ? 'Tambah Maklumat' : null}
      {func === 'del' ? 'Hapus Maklumat' : null}
      {func === 'edit' ? 'Kemaskini Maklumat' : null}
    </button>
  );
}
