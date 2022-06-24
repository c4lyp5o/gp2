import KlinikData from './Data';

function KlinikCenter() {
  function KlinikStage() {
    return (
      <>
        <div className='h-full p-5 overflow-y-auto'>
          <KlinikData />
        </div>
      </>
    );
  }

  return (
    <>
      <KlinikStage />
    </>
  );
}

export default KlinikCenter;
