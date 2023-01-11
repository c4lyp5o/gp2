import { useState } from 'react';

export function useToken() {
  const getAdminToken = () => {
    const adminToken = localStorage.getItem('adminToken');
    return adminToken;
  };
  const getTotpToken = () => {
    const totpToken = localStorage.getItem('totpToken');
    return totpToken;
  };

  const [adminToken, setAdminToken] = useState(getAdminToken());
  const [totpToken, setTotpToken] = useState(getTotpToken());

  const saveAdminToken = (adminToken) => {
    localStorage.setItem('adminToken', adminToken);
    setAdminToken(adminToken);
  };

  const saveTotpToken = (totpToken) => {
    localStorage.setItem('totpToken', totpToken);
    setTotpToken(totpToken);
  };

  const removeAdminToken = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
  };

  const removeTotpToken = () => {
    localStorage.removeItem('totpToken');
    setTotpToken(null);
  };

  return {
    saveAdminToken,
    saveTotpToken,
    removeAdminToken,
    removeTotpToken,
    adminToken,
    totpToken,
  };
}
