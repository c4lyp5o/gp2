import { useEffect, useState, useId } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Spinner } from 'react-awesome-spinners';
import { MdSupervisedUserCircle, MdOutlineSmartToy } from 'react-icons/md';

import { useGlobalUserAppContext } from '../context/userAppContext';

export default function UserSummary() {
  const { userToken, userinfo, toast } = useGlobalUserAppContext();
  const [data, setData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // const uploadImage = useId();

  // async function resizeImage(data) {
  //   const response = await axios.post('/api/v1/superadmin/newroute', {
  //     image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
  //     type: data.type,
  //     main: 'ImageResizer',
  //     Fn: 'resize',
  //     token: userToken,
  //   });
  //   return response;
  // }

  // const encodeImageFileAsURL = (e) => {
  //   const filesSelected = document.getElementById(uploadImage).files;

  //   if (filesSelected.length > 0) {
  //     const fileToLoad = filesSelected[0];
  //     if (fileToLoad.size > 1000000) {
  //       toast.error(
  //         'Gambar terlalu besar. Sila muat naik gambar yang lebih kecil. Maksimum 1MB.'
  //       );
  //       return;
  //     }
  //     const fileReader = new FileReader();
  //     fileReader.onload = async function (fileLoadedEvent) {
  //       const srcData = fileLoadedEvent.target.result;
  //       const data = {
  //         type: fileToLoad.type,
  //         image: srcData,
  //       };
  //       try {
  //         const resizedImage = await resizeImage(data);
  //         setProfileImage(resizedImage.data.imgSrc);
  //         // upload image to server
  //         const res = await axios.patch(
  //           `/api/v1/operator/${userinfo._id}`,
  //           {
  //             image: resizedImage.data.imgSrc,
  //           },
  //           {
  //             headers: { Authorization: `Bearer ${userToken}` },
  //           }
  //         );
  //         toast.success(res.data.msg);
  //       } catch (error) {
  //         toast.error('Gambar tidak sah.');
  //       }
  //     };
  //     fileReader.readAsDataURL(fileToLoad);
  //   }
  // };

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
      toast.error(
        'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: user-summary-fetchData'
      );
    });
    return () => {
      setData(null);
    };
  }, [userToken]);

  if (!data) {
    return (
      <div className='mt-5'>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className='px-3 lg:px-10 h-full p-3 overflow-y-auto'>
        <h2 className='text-2xl font-bold'>Ringkasan Beban Kerja</h2>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-1'>
          <div className='flex flex-row justify-start border-l-8 border-user2 shadow-lg py-2 pr-2 space-y-2'>
            {/* <img
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
        /> */}
            <div className='flex flex-col justify-start text-left ml-2'>
              <MdOutlineSmartToy className='text-user2 text-5xl m-1' />
              <h2 className='text-xl font-bold'>{userinfo.nama}</h2>
              <h3 className='text-base'>
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
          </div>
          <div className='grid grid-cols-2 gap-1 items-center'>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Jumlah Pesakit</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {data.length}
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Kes Selesai</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {
                      data.filter((item) => item.kesSelesaiRawatanUmum === true)
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Pesakit Baru</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {
                      data.filter(
                        (item) => item.kedatangan === 'baru-kedatangan'
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
              <div className='flex flex-row items-center'>
                <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
                <div>
                  <p className='text-xs flex flex-row'>Pesakit Ulangan</p>
                  <span className='font-mono text-5xl flex flex-row'>
                    {
                      data.filter(
                        (item) => item.kedatangan === 'ulangan-kedatangan'
                      ).length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className='grid grid-cols-2 gap-1 items-center'>
          <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
            <div className='flex flex-row items-center'>
              <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Tampalan Gigi Kekal</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {data
                    .map((item) => {
                      const semuaTampalanKekal = [
                        item.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
                        item.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum,
                        item.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
                        item.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum,
                        item.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
                        item.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum,
                      ];
                      let sumTampalanKekal = 0;
                      semuaTampalanKekal.forEach((item) => {
                        sumTampalanKekal += item;
                      });
                      return sumTampalanKekal;
                    })
                    .reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </div>
          </div>
          <div className='border-l-8 border-user2 shadow-lg py-2 pr-2'>
            <div className='flex flex-row items-center'>
              <MdSupervisedUserCircle className='text-user2 text-5xl m-1' />
              <div>
                <p className='text-xs flex flex-row'>Kes Selesai</p>
                <span className='font-mono text-5xl flex flex-row'>
                  {
                    data.filter((item) => item.kesSelesaiRawatanUmum === true)
                      .length
                  }
                </span>
              </div>
            </div>
          </div>
        </div> */}
        </div>
        {data.length > 0 ? (
          <section className='my-5 p-1'>
            {/* <div className='flex flex-col items-center mt-5'> */}
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
                    <tbody key={item._id} className='text-userBlack bg-user4'>
                      <tr>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {index + 1}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite md:w-screen md:max-w-md lg:w-screen lg:max-w-screen-lg'>
                          {item.nama}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {moment(item.tarikhKedatangan).format('DD/MM/YYYY')}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.kedatangan === 'baru-kedatangan' ? (
                            <span className='bg-user7 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              Baru
                            </span>
                          ) : (
                            <span className='bg-user9 text-adminWhite text-md font-semibold px-1.5 py-0.5 rounded whitespace-nowrap'>
                              Ulangan
                            </span>
                          )}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
                          {item.ic}
                        </td>
                        <td className='px-2 py-1 outline outline-1 outline-offset-1 outline-userWhite'>
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
    </>
  );
}
