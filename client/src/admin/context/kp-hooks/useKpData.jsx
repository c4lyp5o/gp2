import axios from 'axios';

import { useToken } from '../useToken';

export function useKpData() {
  const { adminToken } = useToken();

  const createDataForKp = async (type, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'create',
        FType: type,
        Data: data,
        token: adminToken,
      });
      return response.data;
    } catch (err) {
      return err;
    }
  };
  const readDataForKp = async (type) => {
    const response = await axios.get(
      `/api/v1/superadmin/getkpdata?FType=${type}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response.data;
  };
  const readOneDataForKp = async (type, id) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getonekpdata?FType=${type}&Id=${id}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return err;
    }
  };
  const updateDataForKp = async (type, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'update',
        FType: type,
        Id: id,
        Data: data,
        token: adminToken,
      });
      return response.data;
    } catch (err) {
      return err;
    }
  };
  const deleteDataForKp = async (type, id) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'KpCenter',
        Fn: 'delete',
        FType: type,
        Id: id,
        token: adminToken,
      });
      return response.data;
    } catch (err) {
      return err;
    }
  };

  return {
    createDataForKp,
    readDataForKp,
    readOneDataForKp,
    updateDataForKp,
    deleteDataForKp,
  };
}
