import UserPilihNama from './UserPilihNama';
import UserPilihFasiliti from './UserPilihFasiliti';

function UserSelamatDatang() {
  return (
    <div className='user-selamat-datang'>
      <div className='user-selamat-datang-container'>
        <UserPilihNama />
        {/* <UserPilihFasiliti /> */}
      </div>
    </div>
  );
}

export default UserSelamatDatang;
