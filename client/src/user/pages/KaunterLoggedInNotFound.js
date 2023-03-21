import { Link } from 'react-router-dom';

function KaunterLoggedInNotFound() {
  return (
    <>
      <div>Page not found</div>
      <Link to='/pendaftaran/daftar'>Back to home</Link>
    </>
  );
}

export default KaunterLoggedInNotFound;
