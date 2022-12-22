import { useEffect, useState, useId } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserSummary() {
  const { userToken, userinfo, toast } = useGlobalUserAppContext();
  const [data, setData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const uploadImage = useId();

  async function resizeImage(data) {
    const response = await axios.post('/api/v1/superadmin/newroute', {
      image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
      type: data.type,
      main: 'ImageResizer',
      Fn: 'resize',
      token: userToken,
    });
    return response;
  }

  const encodeImageFileAsURL = (e) => {
    const filesSelected = document.getElementById(uploadImage).files;

    if (filesSelected.length > 0) {
      const fileToLoad = filesSelected[0];
      if (fileToLoad.size > 1000000) {
        toast.error(
          'Gambar terlalu besar. Sila muat naik gambar yang lebih kecil. Maksimum 1MB.'
        );
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = async function (fileLoadedEvent) {
        const srcData = fileLoadedEvent.target.result;
        const data = {
          type: fileToLoad.type,
          image: srcData,
        };
        try {
          const resizedImage = await resizeImage(data);
          setProfileImage(resizedImage.data.imgSrc);
          // upload image to server
          const res = await axios.patch(
            `/api/v1/operator/${userinfo._id}`,
            {
              image: resizedImage.data.imgSrc,
            },
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
          toast.success(res.data.msg);
        } catch (error) {
          toast.error('Gambar tidak sah.');
        }
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/v1/operator/${userinfo._id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setProfileImage(res.data.singlePersonOperator.image);
      if (res.data.singlePersonOperator.summary.length === 0) {
        return setData([]);
      }
      setData(res.data.singlePersonOperator.summary);
    };
    fetchData().catch((err) => {
      console.log(err.response.data.msg);
    });
    return () => {
      setData(null);
    };
  }, [userToken]);

  if (!data) {
    return <Spinner />;
  }

  return (
    <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
      <div className='flex flex-col items-center'>
        <img
          src={profileImage}
          alt='profile'
          className='w-32 h-32 rounded-full'
          onClick={() => document.getElementById(uploadImage).click()}
        />
        <input
          hidden
          type='file'
          id={uploadImage}
          name={uploadImage}
          accept='image/*'
          onChange={(e) => {
            encodeImageFileAsURL(e);
          }}
        />
        <h2 className='text-2xl font-bold'>{userinfo.nama}</h2>
        <h3 className='text-lg'>
          {userinfo.statusPegawai === 'pp'
            ? 'Pegawai Pergigian'
            : 'Juruterapi Pergigian'}{' '}
          Gred {userinfo.gred.toUpperCase()}{' '}
          {userinfo.mdcNumber ? (
            <h4>Nombor MDC: {userinfo.mdcNumber}</h4>
          ) : (
            <h4>Nombor MDTB: {userinfo.mdtbNumber}</h4>
          )}
        </h3>
      </div>
      {data.length > 0 ? (
        <section className='my-5 p-1 outline outline-1 outline-user1'>
          {/* <div className='flex flex-col items-center mt-5'> */}
          <h2 className='text-2xl font-bold'>Ringkasan Beban Kerja</h2>
          <div className='m-auto overflow-x-auto text-xs lg:text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-userWhite bg-user2'>
                <tr>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1'>
                    BIL
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    NAMA
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    TARIKH KEDATANGAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                    KEDATANGAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    KAD PENGENALAN
                  </th>
                  <th className='px-2 py-1 outline outline-1 outline-offset-1 w-60'>
                    JENIS ETNIK
                  </th>
                </tr>
              </thead>
              {data.map((item, index) => {
                return (
                  <tbody key={item._id} className='text-user2 bg-user4'>
                    <tr>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1 md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                        {item.nama}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                        {moment(item.tarikhKedatangan).format('DD/MM/YYYY')}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                        {item.kedatangan === 'baru-kedatangan' ? (
                          <span className='bg-admin3 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                            Baru
                          </span>
                        ) : (
                          <span className='bg-user7 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                            Ulang
                          </span>
                        )}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                        {item.ic}
                      </td>
                      <td className='px-2 py-1 outline outline-1 outline-offset-1'>
                        {item.kumpulanEtnik.toUpperCase()}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
          {/* </div> */}
        </section>
      ) : (
        <div className='flex flex-col items-center mt-5'>
          <span className='bg-admin2 text-adminWhite text-3xl font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
            Tiada rekod beban kerja
          </span>
        </div>
      )}
    </div>
  );
}
