import { Outlet } from 'react-router-dom';
import UserHeader from '../components/UserHeader';
import UserLogin from '../components/UserLogin';
import UserFooter from '../components/UserFooter';

const UserSharedHomeLayout = () => {
  return (
    <>
      <UserHeader />
      <UserLogin />
      <UserFooter />
      <Outlet />
    </>
  );
};

export default UserSharedHomeLayout;
