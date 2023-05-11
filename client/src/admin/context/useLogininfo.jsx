import { useState } from 'react';

export function useLogininfo() {
  const getLoginInfo = () => {
    const loginInfo = JSON.parse(localStorage.getItem('logininfo'));
    return loginInfo;
  };

  const [loginInfo, setLoginInfo] = useState(getLoginInfo());

  const saveLoginInfo = (loginInfo) => {
    localStorage.setItem(
      'logininfo',
      JSON.stringify(loginInfo).replace(/</g, '\\u003c')
    );
    setLoginInfo(loginInfo);
  };

  const removeLoginInfo = () => {
    localStorage.removeItem('logininfo');
    setLoginInfo(null);
  };

  return {
    getLoginInfo,
    saveLoginInfo,
    removeLoginInfo,
    loginInfo,
    setLoginInfo,
  };
}
