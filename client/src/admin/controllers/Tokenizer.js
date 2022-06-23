import { useState } from 'react';

export function useToken() {
  const getToken = () => {
    const adminToken = localStorage.getItem('adminToken');
    return adminToken;
  };
  const [token, setToken] = useState(getToken());
  const saveToken = (adminToken) => {
    localStorage.setItem('adminToken', adminToken);
    setToken(adminToken);
  };
  return {
    setToken: saveToken,
    token,
  };
}

export function getTokenized() {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken;
}
