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
      console.log(updatedData);
      const { data } = initialNoData
        ? await createData('mda', updatedData)
        : await updateData('mda', updatedData.Id, updatedData);
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
        } = await readData('mda');
        setMaklumatAsasDaerah({ ...maklumatAsasDaerah });
        setInitialNoData(false);
        // console.log(maklumatAsasDaerah);
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
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold my-7'>
          Maklumat Asas Bagi Daerah {loginInfo?.daerah} Tahun{' '}
          {new Date().getFullYear()}
        </h1>
        <div className='grid grid-cols-2 grid-rows-3 gap-2 outline outline-1 outline-userBlack text-center p-2'>
          <div>
            <div className='bg-admin3 rounded-md flex items-center justify-center p-2 shadow-md hover:bg-admin4 transition-colors h-9'>
              <h1 className='text-xl font-bold'>Maklumat Asas</h1>
            </div>
            <div className='text-sm rounded-md outline outline-2 outline-userBlack text-center p-2 mt-2'>
              <article className='m-1'>
                Jumlah anggota kesihatan pergigian sedia ada yang sedang
                berkhidmat
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahPPSedangBerkhidmat || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahPPSedangBerkhidmat: e.target.value,
                      })
                    }
                  />
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahJPSedangBerkhidmat || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahJPSedangBerkhidmat: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Jumlah anggota kesihatan pergigian yang terlibat dalam program
                Incremental Dental Care
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahPPTerlibatIDC || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahPPTerlibatIDC: e.target.value,
                      })
                    }
                  />
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahJPTerlibatIDC || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahJPTerlibatIDC: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Bilangan anggota kesihatan pergigian yang BAHARU dilantik
                melapor diri pada tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahPPBaharuTahunSemasa || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahPPBaharuTahunSemasa: e.target.value,
                      })
                    }
                  />
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahJPBaharuTahunSemasa || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahJPBaharuTahunSemasa: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
            </div>
          </div>
          <div>
            <div className='bg-admin3 rounded-md flex items-center justify-center p-2 shadow-md hover:bg-admin4 transition-colors h-9'>
              <h1 className='text-xl font-bold'>Program KOTAK</h1>
            </div>
            <div className='text-sm rounded-md outline outline-2 outline-userBlack text-center p-2 mt-2'>
              <article className='m-1'>
                Bilangan anggota kesihatan pergigian yang BAHARU dilantik /
                dilatih untuk membuat saringan dan intervensi di sekolah diri
                pada tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={
                      maklumatAsasDaerah?.jumlahPPDilatihIntervensiSekolah || 0
                    }
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahPPDilatihIntervensiSekolah: e.target.value,
                      })
                    }
                  />
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={
                      maklumatAsasDaerah?.jumlahJPDilatihIntervensiSekolah || 0
                    }
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahJPDilatihIntervensiSekolah: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Bilangan latihan program KOTAK yang telah diadakan pada tahun
                semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
              </article>
            </div>
          </div>
          <div>
            <div className='bg-admin3 rounded-md flex items-center justify-center p-2 shadow-md hover:bg-admin4 transition-colors h-9'>
              <h1 className='text-xl font-bold'>Program BEGIN</h1>
            </div>
            <div className='text-sm rounded-md outline outline-2 outline-userBlack text-center p-2 mt-2'>
              <article className='prose'>
                Bilangan anggota kesihatan pergigian yang telah dilantik untuk
                melaksanakan aktiviti BEGIN
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahPPDilatihBEGIN || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahPPDilatihBEGIN: e.target.value,
                      })
                    }
                  />
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahJPDilatihBEGIN || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahJPDilatihBEGIN: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Bilangan ahli Dedicated Dental Promotion Team yang telah
                dilantik untuk melaksanakan aktiviti BEGIN (
                <span className='text-admin2'>*</span>bagi daerah yang mempunyai
                DPT)
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
                  <label className='text-center'>JP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
              </article>
              <article className='m-1'>
                Bilangan latihan program BEGIN yang telah diadakan pada tahun
                semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>PP</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
              </article>
            </div>
          </div>
          <div>
            <div className='bg-admin3 rounded-md flex items-center justify-center p-2 shadow-md hover:bg-admin4 transition-colors h-9'>
              <h1 className='text-xl font-bold'>Program KPMP</h1>
            </div>
            <div className='text-sm rounded-md outline outline-2 outline-userBlack text-center p-2 mt-2'>
              <article className='m-1'>
                Bilangan klinik pergigian yang dirancang untuk dijadikan sebagai
                Klinik Pergigian Mesra Promosi pada tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={
                      maklumatAsasDaerah?.jumlahKlinikDirancangMenjadiKPMP || 0
                    }
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahKlinikDirancangMenjadiKPMP: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Bilangan Klinik pergigian mesra promosi (KPMP) sedia ada
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahKlinikKPMPSediaAda || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahKlinikKPMPSediaAda: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
              <article className='m-1'>
                Jumlah Klinik pergigian mesra promosi (KPMP)
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
                    value={maklumatAsasDaerah?.jumlahKlinikKPMP || 0}
                    onChange={(e) =>
                      setMaklumatAsasDaerah({
                        ...maklumatAsasDaerah,
                        jumlahKlinikKPMP: e.target.value,
                      })
                    }
                  />
                </div>
              </article>
            </div>
          </div>
          <div className='col-span-2'>
            <div className='bg-admin3 rounded-md flex items-center justify-center p-2 shadow-md hover:bg-admin4 transition-colors h-9'>
              <h1 className='text-xl font-bold'>Program Wellness Hub</h1>
            </div>
            <div className='text-sm rounded-md outline outline-2 outline-userBlack text-center p-2 mt-2'>
              <article className='m-1'>
                Bilangan Wellness Hub yang di RANCANG untuk dilantik /
                dilaksanakan aktiviti promosi dan pendidikan kesihatan pergigian
                pada tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
              </article>
              <article className='m-1'>
                Bilangan wellness hub yang telah MELAKSANAKAN 4 kali aktiviti
                promosi dan pendidikan kesihatan pergigian pada tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center'
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
              </article>
              <article className='m-1'>
                Bilangan wellness hub yang telah MELAKSANAKAN sekurang-kurangnya
                3 kali aktiviti promosi dan pendidikan kesihatan pergigian pada
                tahun semasa
                <div className='grid grid-flow-col-dense gap-1 mt-2'>
                  <label className='text-center'>Jumlah</label>
                  <input
                    type='number'
                    className='w-20 h-8 rounded-md outline outline-2 outline-userBlack text-center text-center'
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
