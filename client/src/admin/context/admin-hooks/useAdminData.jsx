import axios from 'axios';

import { useToken } from '../useToken';

export function useAdminData() {
  const { adminToken } = useToken();

  const createData = async (type, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'DataCenter',
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
  // yg ni berkaitan dengan Data.jsx, x perlu try catch sbb sana dah handle
  const readData = async (type) => {
    const response = await axios.get(
      `/api/v1/superadmin/getdata?FType=${type}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return response.data;
  };
  const readOneData = async (type, id) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getonedata?FType=${type}&Id=${id}`,
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
  const updateData = async (type, id, data) => {
    try {
      const response = await axios.post(`/api/v1/superadmin/newroute`, {
        main: 'DataCenter',
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
  // yg ni berkaitan dengan Modal.jsx, x perlu try catch sbb sana dah handle
  // x perlu response.data sbb nk tgk status
  const deleteData = async (type, id) => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'DataCenter',
      Fn: 'delete',
      FType: type,
      Id: id,
      token: adminToken,
    });
    return response;
  };

  return {
    createData,
    readData,
    readOneData,
    updateData,
    deleteData,
  };
}
