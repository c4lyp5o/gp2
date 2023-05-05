import { useState } from 'react';

export function useOndemandSetting() {
  const getCurrentOndemandSetting = () => {
    const currentOndemandSetting = localStorage.getItem(
      'currentondemandsetting'
    );
    return currentOndemandSetting;
  };

  const [currentOndemandSetting, setCurrentOndemandSetting] = useState(
    getCurrentOndemandSetting()
  );

  const saveCurrentondemandSetting = (currentOndemandSetting) => {
    localStorage.setItem('currentondemandsetting', currentOndemandSetting);
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
