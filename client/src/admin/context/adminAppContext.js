import React, { useState, useEffect, useContext } from "react";

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const [admin, setAdmin] = useState("");

  return (
    <AdminAppContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAppContext.Provider>
  );
}

const useGlobalAdminAppContext = () => {
  return useContext(AdminAppContext);
};

export { AdminAppProvider, useGlobalAdminAppContext };
