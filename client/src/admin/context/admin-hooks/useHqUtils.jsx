import axios from 'axios';

import { useToken } from '../useToken';

export function useHqUtils() {
  const { adminToken } = useToken();

  const getAllNegeriAndDaerah = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'HqCenter',
      Fn: 'read',
      token: adminToken,
    });
    return response;
  };
  const getDetailedData = async ({ type, idn, idd, id }) => {
    const endpoint = '/api/v1/superadmin/newroute';
    const params = {
      main: 'HqCenter',
      Fn: 'readOne',
      token: adminToken,
    };

    switch (type) {
      case 'negeri':
        params.idn = idn;
        break;
      case 'daerah':
        params.idn = idn;
        params.idd = idd;
        break;
      case 'klinik':
        params.id = id;
        break;
      default:
        throw new Error('Invalid type');
    }

    const response = await axios.post(`${endpoint}`, params);
    return response;
  };
  const getStatsData = async (negeri, daerah) => {
    const response = await axios.get(
      `/api/v1/superadmin/getstats?negeri=${negeri}&daerah=${daerah}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response;
  };

  return {
    getAllNegeriAndDaerah,
    getDetailedData,
    getStatsData,
  };
}
