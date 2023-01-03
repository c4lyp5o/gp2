export default function KemaskiniResit({ setShowKemaskiniResit, editId }) {
  return (
    <>
      <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
        <div>MODAL RESIT</div>
      </div>
      <div
        onClick={() => setShowKemaskiniResit(false)}
        className='absolute inset-0 bg-user1 z-10 opacity-75'
      />
    </>
  );
}
