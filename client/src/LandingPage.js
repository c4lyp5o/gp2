import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      <div className='bg-user9 h-screen'>
        <p>Landing Page</p>
        <Link to='/kaunter'>Kaunter</Link>
        <Link to='/pengguna'>Pengguna</Link>
        <Link to='/admin'>Admin</Link>
      </div>
    </>
  );
}

export default LandingPage;
