import PegawaiData from './Data';

function PegawaiCenter() {
  function PegawaiStage() {
    return (
      <>
        <div className='h-full p-5 overflow-y-auto'>
          <PegawaiData />
        </div>
      </>
    );
  }

  return (
    <>
      <PegawaiStage />
    </>
  );
}

export default PegawaiCenter;
