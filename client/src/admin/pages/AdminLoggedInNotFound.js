import { Link } from 'react-router-dom';

function AdminLoggedInNotFound() {
  return (
    <>
      <div>Page not found</div>
      <Link to='/admin/landing'>Back to home</Link>
    </>
  );
}

export default AdminLoggedInNotFound;
