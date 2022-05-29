import { Link } from 'react-router-dom';

function UserLoggedInNotFound() {
  return (
    <>
      <div>Page not found</div>
      <Link to='/user'>Back to home</Link>
    </>
  );
}

export default UserLoggedInNotFound;
