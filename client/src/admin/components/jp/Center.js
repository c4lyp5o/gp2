import JPData from './Data';

function JPCenter() {
  function JPStage() {
    return (
      <>
        <div className='h-full p-5 overflow-y-auto'>
          <JPData />
        </div>
      </>
    );
  }

  return (
    <>
      <JPStage />
    </>
  );
}

export default JPCenter;
