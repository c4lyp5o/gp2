import Welcome from '../components/Welcome';
import Data from '../components/Data';

function AdminCenterStageLoggedIn({
  user,
  daerah,
  negeri,
  showWelcome,
  showData,
  facilityType,
  showFacility,
  showPegawai,
  showKlinik,
  data,
  loading,
  error,
  getOneFacility,
  oneFacility,
  loadingOneFacility,
  errorOneFacility,
  operators,
  getOperators,
  loadingOperators,
  errorOperators,
  refetchFacilities,
  refetchOperators,
  toast,
}) {
  return (
    <>
      <div className='h-full p-5 overflow-y-auto'>
        <Welcome showWelcome={showWelcome} />
        <Data
          // forms state
          showData={showData}
          showFacility={showFacility}
          showPegawai={showPegawai}
          showKlinik={showKlinik}
          // user data
          user={user}
          daerah={daerah}
          negeri={negeri}
          facilityType={facilityType}
          // facilities/operator data
          data={data}
          loading={loading}
          error={error}
          getOneFacility={getOneFacility}
          oneFacility={oneFacility}
          loadingOneFacility={loadingOneFacility}
          errorOneFacility={errorOneFacility}
          operators={operators}
          getOperators={getOperators}
          loadingOperators={loadingOperators}
          errorOperators={errorOperators}
          // refetch
          refetchFacilities={refetchFacilities}
          refetchOperators={refetchOperators}
          // toast
          toast={toast}
        />
      </div>
    </>
  );
}

export default AdminCenterStageLoggedIn;
