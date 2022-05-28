import { Navigate, Outlet } from 'react-router-dom';

import { useGlobalUserAppContext } from '../context/userAppContext';

function Redirector() {
  return (
    <>
      <div>lol</div>
      <Outlet />
    </>
  );
}

export default Redirector;
