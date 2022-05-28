import React, { useState, useEffect, useContext } from 'react';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  return (
    <AdminAppContext.Provider value={{ admin: 'admin' }}>
      {children}
    </AdminAppContext.Provider>
  );
}

const useGlobalAdminAppContext = () => {
  return useContext(AdminAppContext);
};

export { AdminAppProvider, useGlobalAdminAppContext };
