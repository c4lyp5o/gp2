import { Navigate } from 'react-router-dom';

import { useGlobalDeeprootsContext } from '../context/deeprootsAppContext';

function DeeprootsProtect({ children }) {
  const tempToken = localStorage.getItem('deeprootsToken');

  if (!tempToken) {
    return <Navigate to='/' />;
  }
  if (tempToken.expires < Date.now()) {
    return <Navigate to='/' />;
  }

  console.log('protect');
  return children;
}

export default DeeprootsProtect;
