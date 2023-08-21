import axios from 'axios';

import { useToken } from '../useToken';

export function useAdhocData() {
  const { adminToken } = useToken();

  const adhocQuery = async (payload) => {
    const response = await axios.post(
      `/api/v1/superadmin/ahq`,
      { payload: payload },
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };

  const downloadAdhocQuery = async (payload) => {
    const response = await axios.post(
      `/api/v1/superadmin/ahq-dl`,
      { payload: payload },
      {
        headers: {
          Authorization: adminToken,
        },
        responseType: 'blob',
      }
    );
    return response;
  };

  return {
    adhocQuery,
    downloadAdhocQuery,
  };
}
