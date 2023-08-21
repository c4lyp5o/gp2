import { useState } from 'react';
import axios from 'axios';

import { useToken } from './useToken';

export function useOndemandSetting() {
  const { adminToken } = useToken();

  // api calls
  const readOndemandSetting = async () => {
    const response = await axios.get('/api/v1/ondemand', {
      headers: {
        Authorization: adminToken,
      },
    });
    return response;
  };
  const saveOndemandSetting = async (data) => {
    const response = await axios.patch(
      '/api/v1/ondemand',
      { ondemandSetting: data },
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };

  // local storage manipulation
  const getCurrentOndemandSetting = () => {
    const currentOndemandSetting = JSON.parse(
      localStorage.getItem('currentondemandsetting')
    );
    return currentOndemandSetting;
  };
  const [currentOndemandSetting, setCurrentOndemandSetting] = useState(
    getCurrentOndemandSetting()
  );
  const saveCurrentondemandSetting = (currentOndemandSetting) => {
    localStorage.setItem(
      'currentondemandsetting',
      JSON.stringify(currentOndemandSetting).replace(/</g, '\\u003c')
    );
    setCurrentOndemandSetting(currentOndemandSetting);
  };
  const removeCurrentondemandSetting = () => {
    localStorage.removeItem('currentondemandsetting');
    setCurrentOndemandSetting(null);
  };

  return {
    readOndemandSetting,
    saveOndemandSetting,
    getCurrentOndemandSetting,
    saveCurrentondemandSetting,
    removeCurrentondemandSetting,
    currentOndemandSetting,
    setCurrentOndemandSetting,
  };
}
