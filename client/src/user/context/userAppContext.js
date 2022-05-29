import React, { useState, useEffect, useContext } from 'react';

const UserAppContext = React.createContext();

function UserAppProvider({ children }) {
  const [user, setUserName] = useState('');

  return (
    <UserAppContext.Provider value={{ user, setUserName }}>
      {children}
    </UserAppContext.Provider>
  );
}

const useGlobalUserAppContext = () => {
  return useContext(UserAppContext);
};

export { UserAppProvider, useGlobalUserAppContext };
