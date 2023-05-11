import { useState } from 'react';

export function useOndemandSetting() {
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
    getCurrentOndemandSetting,
    saveCurrentondemandSetting,
    removeCurrentondemandSetting,
    currentOndemandSetting,
    setCurrentOndemandSetting,
  };
}
