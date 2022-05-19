import { Outlet } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserFooter from '../components/UserFooter';

const UserSharedHomeLayout = () => {
  return (
    <>
      <UserHeader />
      <UserFooter />
      <Outlet />
    </>
  );
};

export default UserSharedHomeLayout;
