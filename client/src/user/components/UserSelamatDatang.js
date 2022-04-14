import UserPilihNama from './UserPilihNama';
import UserPilihFasiliti from './UserPilihFasiliti';
import UserDashboard from './UserDashboard';

function UserSelamatDatang() {
  return (
    <div className='user-selamat-datang'>
      <div className='user-selamat-datang-container'>
        {/* <UserPilihNama /> */}
        {/* <UserPilihFasiliti /> */}
        <UserDashboard />
      </div>
    </div>
  );
}

export default UserSelamatDatang;
