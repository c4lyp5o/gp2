import { useState, useEffect } from 'react';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { SubmitButton, BusyButton } from '../Buttons';

export default function MaklumatAsasDaerah() {
  const {
    loginInfo,
    readData,
    createData,
    updateData,
    newRouteCreateData,
    newRouteUpdateData,
    newRouteDeleteData,
    toast,
  } = useGlobalAdminAppContext();

  const [maklumatAsasDaerah, setMaklumatAsasDaerah] = useState(null);
  const [initialNoData, setInitialNoData] = useState(false);

  const [savingData, setSavingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingData(true);
    const updatedData = {
      ...maklumatAsasDaerah,
      ...(!initialNoData && { Id: maklumatAsasDaerah?._id }),
      ...(initialNoData && {
        tahunSemasa: new Date().getFullYear(),
        createdByNegeri: loginInfo?.negeri,
        createdByDaerah: loginInfo?.daerah,
      }),
    };
    try {
      const { data } = initialNoData
        ? await createData('mad', updatedData)
        : await updateData('mad', updatedData.Id, updatedData);
      setTimeout(() => {
        toast.success(
          `Maklumat Asas Daerah ${
            loginInfo?.daerah
          } Tahun ${new Date().getFullYear()} berjaya dikemaskini`
        );
        setSavingData(false);
      }, 2000);
    } catch (err) {
      console.log(err);
      setSavingData(false);
    }
  };

  useEffect(() => {
    async function fetchMaklumatAsasDaerah() {
      try {
        const {
          data: [maklumatAsasDaerah],
        } = await readData('mad');
        setMaklumatAsasDaerah({ ...maklumatAsasDaerah });
        setInitialNoData(false);
      } catch (error) {
        console.log(error);
        setInitialNoData(true);
      }
    }

    fetchMaklumatAsasDaerah();

    return () => {
      setInitialNoData(true);
      setMaklumatAsasDaerah(null);
    };
  }, [savingData]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold my-7'>
          Maklumat Asas Bagi Daerah {loginInfo?.daerah} Tahun{' '}
          {new Date().getFullYear()}
        </h1>
        <div className='grid grid-cols-1 gap-2 text-center p-2'>
          <div className='shadow-lg shadow-user1 rounded-md mt-2'>
            <div className='bg-admin3 rounded-t-md flex items-center justify-center p-2 transition-colors h-9'>
              <h1 className='text-xl font-bold text-userWhite'>
                Maklumat Asas
              </h1>
            </div>
            <div className='text-sm rounded-b-md text-center p-2'>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Jumlah anggota kesihatan pergigian sedia ada yang sedang
                    berkhidmat
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahPPSedangBerkhidmat || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPSedangBerkhidmat: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahJPSedangBerkhidmat || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPSedangBerkhidmat: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1 rounded-md'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan anggota kesihatan pergigian yang BAHARU dilantik
                    melapor diri pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahPPBaharuTahunSemasa || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPBaharuTahunSemasa: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahJPBaharuTahunSemasa || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPBaharuTahunSemasa: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Jumlah anggota kesihatan pergigian yang terlibat dalam
                    program <i className='ml-1'> Incremental Dental Care</i>
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahPPTerlibatIDC || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPTerlibatIDC: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahJPTerlibatIDC || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPTerlibatIDC: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div className='shadow-lg shadow-user1 rounded-md mt-2'>
            <div className='bg-admin3 rounded-t-md flex items-center justify-center p-2 shadow-md transition-colors h-9'>
              <h1 className='text-xl font-bold text-userWhite'>
                Program Kesihatan Oral Tanpa Amalan Merokok (KOTAK)
              </h1>
            </div>
            <div className='text-sm rounded-b-md text-center p-2'>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan anggota kesihatan pergigian yang BAHARU dilantik /
                    dilatih untuk membuat saringan dan intervensi di sekolah
                    diri pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahPPDilatihIntervensiSekolah ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPDilatihIntervensiSekolah: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahJPDilatihIntervensiSekolah ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPDilatihIntervensiSekolah: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan latihan program KOTAK yang telah diadakan pada
                    tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahLatihanKOTAKTahunSemasa || 0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahLatihanKOTAKTahunSemasa: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div className='shadow-lg shadow-user1 rounded-md mt-2'>
            <div className='bg-admin3 rounded-t-md flex items-center justify-center p-2 shadow-md transition-colors h-9'>
              <h1 className='text-xl font-bold text-userWhite'>
                Program latihan memberus gigi berkesan (BEGIN)
              </h1>
            </div>
            <div className='text-sm rounded-b-md text-center p-2'>
              <article className='prose'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan anggota kesihatan pergigian yang telah dilantik
                    untuk melaksanakan aktiviti BEGIN
                  </p>{' '}
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahPPDilatihBEGIN || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPDilatihBEGIN: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahJPDilatihBEGIN || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPDilatihBEGIN: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan ahli Dedicated Dental Promotion Team yang telah
                    dilatih untuk melaksanakan aktiviti BEGIN (** bagi daerah
                    yang mempunyai pasukan DPT)
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center'>Pegawai Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahPPDalamDPTDilatihBEGIN || 0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahPPDalamDPTDilatihBEGIN: e.target.value,
                        })
                      }
                    />
                    <label className='text-center'>Juruterapi Pergigian</label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahJPDalamDPTDilatihBEGIN || 0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahJPDalamDPTDilatihBEGIN: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Jumlah latihan program BEGIN yang telah diadakan pada tahun
                    semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahLatihanBEGINTahunSemasa || 0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahLatihanBEGINTahunSemasa: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div className='shadow-lg shadow-user1 rounded-md mt-2'>
            <div className='bg-admin3 rounded-t-md flex items-center justify-center p-2 shadow-md transition-colors h-9'>
              <h1 className='text-xl font-bold text-userWhite'>
                Program klinik pergigian mesra promosi (KPMP)
              </h1>
            </div>
            <div className='text-sm rounded-b-md p-2'>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan klinik pergigian yang dirancang untuk dijadikan
                    sebagai Klinik Pergigian Mesra Promosi pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahKlinikDirancangMenjadiKPMP ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahKlinikDirancangMenjadiKPMP: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan Klinik pergigian mesra promosi (KPMP) yang
                    diwujudkan di peringkat daerah
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahKlinikKPMPSediaAda || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahKlinikKPMPSediaAda: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Jumlah Klinik pergigian mesra promosi (KPMP) yang telah
                    menjalani audit dan penarafan bintang (kali pertama secara
                    rasmi)
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={maklumatAsasDaerah?.jumlahKlinikKPMP || 0}
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahKlinikKPMP: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
          <div className='shadow-lg shadow-user1 rounded-md mt-2'>
            <div className='bg-admin3 rounded-t-md flex items-center justify-center p-2 shadow-md transition-colors h-9'>
              <h1 className='text-xl font-bold text-userWhite'>
                Program <i> Wellness Hub</i>
              </h1>
            </div>
            <div className='text-sm rounded-b-md text-center p-2 '>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan Wellness Hub yang di RANCANG untuk dilawati /
                    dilaksanakan aktiviti promosi dan pendidikan kesihatan
                    pergigian pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahWellnessHubDirancangBuatAktivitiPromosi ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahWellnessHubDirancangBuatAktivitiPromosi:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan wellness hub yang telah MELAKSANAKAN 4 kali atau
                    lebih aktiviti promosi dan pendidikan kesihatan pergigian
                    pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahWellnessHubYangTelahLaksana4Aktiviti ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahWellnessHubYangTelahLaksana4Aktiviti:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
              <article className='m-1'>
                <div className='grid grid-cols-[6fr_4fr] gap-1 mt-2'>
                  <p className='flex items-center text-left pl-3'>
                    Bilangan wellness hub yang telah MELAKSANAKAN
                    sekurang-kurangnya 3 kali aktiviti promosi dan pendidikan
                    kesihatan pergigian pada tahun semasa
                  </p>
                  <div className='grid grid-cols-4'>
                    <label className='text-center flex items-center justify-center'>
                      Jumlah
                    </label>
                    <input
                      type='number'
                      className='appearance-none w-14 h-9 border-b-4 border-b-admin2 py-1 px-2 focus:border-b-admin1 focus:outline-none mb-1 shadow-md shadow-user1'
                      value={
                        maklumatAsasDaerah?.jumlahWellnessHubYangTelahLaksanaKurang4Aktiviti ||
                        0
                      }
                      onChange={(e) =>
                        setMaklumatAsasDaerah({
                          ...maklumatAsasDaerah,
                          jumlahWellnessHubYangTelahLaksanaKurang4Aktiviti:
                            e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
        <div className='flex-auto mt-5'>
          {savingData ? (
            initialNoData ? (
              <BusyButton func='add' />
            ) : (
              <BusyButton func='edit' />
            )
          ) : initialNoData ? (
            <SubmitButton func='add' />
          ) : (
            <SubmitButton func='edit' />
          )}
        </div>
      </form>
    </>
  );
}
