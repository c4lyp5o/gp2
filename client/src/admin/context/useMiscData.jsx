import axios from 'axios';

import { useToken } from '../context/useToken';

export function useMiscData() {
  const { adminToken } = useToken();

  const readFasilitiData = async ({ negeri, daerah }) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getfasiliti?negeri=${negeri}&daerah=${daerah}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
  const readOperatorData = async (type, nama) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getoperator?nama=${nama}&type=${type}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
  const readKkiaData = async ({ negeri }) => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkkiakd?negeri=${negeri}`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
  const readSekolahData = async (FType) => {
    const responseMOIES = await axios.get(
      `/api/v1/superadmin/getsekolahMOEIS?FType=${FType}`,
      {
        headers: {
          Authorization: adminToken,
        },
      }
    );
    return responseMOIES.data.SENARAI_INSTITUSI;

    // switch (FType) { // will be used later
    //   case 'sr':
    //     const currentSr = await readData('sr-sm-all');
    //     if (currentSr.data.length === 0) {
    //       return response.data[1].sekolahRendah;
    //     }
    //     for (let j = 0; j < currentSr.data.length; j++) {
    //       const deleteSr = response.data[1].sekolahRendah
    //         .map((e) => e.kodSekolah)
    //         .indexOf(currentSr.data[j].kodSekolah);
    //       response.data[1].sekolahRendah.splice(deleteSr, 1);
    //     }
    //     return response.data[1].sekolahRendah;
    //   default:
    //     const currentSm = await readData('sr-sm-all');
    //     if (currentSm.data.length === 0) {
    //       return response.data[2].sekolahMenengah;
    //     }
    //     for (let j = 0; j < currentSm.data.length; j++) {
    //       const deleteSm = response.data[2].sekolahMenengah
    //         .map((e) => e.kodSekolah)
    //         .indexOf(currentSm.data[j].kodSekolah);
    //       response.data[2].sekolahMenengah.splice(deleteSm, 1);
    //     }
    //     return response.data[2].sekolahMenengah;
    // }
  };
  const readKodProgramData = async () => {
    const response = await axios.post(`/api/v1/superadmin/newroute`, {
      main: 'PromosiManager',
      Fn: 'read',
      token: adminToken,
    });
    return response.data;
  };
  const readGenerateTokenData = async () => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getdata?FType=tokenbal`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
  const readGenerateTokenDataForKp = async () => {
    try {
      const response = await axios.get(
        `/api/v1/superadmin/getkpdata?FType=tokenbal`,
        {
          headers: {
            Authorization: adminToken,
          },
        }
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };

  return {
    readFasilitiData,
    readOperatorData,
    readKkiaData,
    readSekolahData,
    readKodProgramData,
    readGenerateTokenData,
    readGenerateTokenDataForKp,
  };
}
