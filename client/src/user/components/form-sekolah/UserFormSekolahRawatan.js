import { useState, useEffect } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import { Spinner } from 'react-awesome-spinners';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserFormSekolahRawatan() {
  const { userToken, username, useParams, toast } = useGlobalUserAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isShown, setIsShown] = useState(false);
  const [singlePersonSekolah, setSinglePersonSekolah] = useState([]);

  const { personSekolahId } = useParams();

  const createdByUsername = username;
  const [tarikhRawatanSemasa, setTarikhRawatanSemasa] = useState('');
  const [muridDibuatFs, setMuridDibuatFs] = useState(false);
  const [baruJumlahGigiKekalDibuatFs, setBaruJumlahGigiKekalDibuatFs] =
    useState(0);
  // const [semulaJumlahGigiKekalDibuatFs, setSemulaJumlahGigiKekalDibuatFs] =
  //   useState(0);
  // const [baruJumlahMuridDibuatFs, setBaruJumlahMuridDibuatFs] = useState(0);
  // const [semulaJumlahMuridDibuatFs, setSemulaJumlahMuridDibuatFs] = useState(0);
  // const [sumDibuatFs, setSumDibuatFs] = useState(0);
  const [muridDiberiFv, setMuridDiberiFv] = useState(false);
  const [baruJumlahGigiKekalDiberiFv, setBaruJumlahGigiKekalDiberiFv] =
    useState(0);
  // const [semulaJumlahGigiKekalDiberiFv, setSemulaJumlahGigiKekalDiberiFv] =
  //   useState(0);
  // const [sumDiberiFv, setSumDiberiFv] = useState(0);
  // const [baruJumlahMuridDiberiFv, setBaruJumlahMuridDiberiFv] = useState(0);
  // const [semulaJumlahMuridDiberiFv, setSemulaJumlahMuridDiberiFv] = useState(0);
  const [muridDiberiPrrJenis1, setMuridDiberiPrrJenis1] = useState(false);
  const [
    baruJumlahGigiKekalDiberiPrrJenis1,
    setBaruJumlahGigiKekalDiberiPrrJenis1,
  ] = useState(0);
  // const [
  //   semulaJumlahGigiKekalDiberiPrrJenis1,
  //   setSemulaJumlahGigiKekalDiberiPrrJenis1,
  // ] = useState(0);
  // const [sumDiberiPrr, setSumDiberiPrr] = useState(0);
  // const [baruJumlahMuridDiberiPrrJenis1, setBaruJumlahMuridDiberiPrrJenis1] =
  //   useState(0);
  // const [
  //   semulaJumlahMuridDiberiPrrJenis1,
  //   setSemulaJumlahMuridDiberiPrrJenis1,
  // ] = useState(0);
  const [baruJumlahGigiYangDiberiSdf, setBaruJumlahGigiYangDiberiSdf] =
    useState(0);
  const [semulaJumlahGigiYangDiberiSdf, setSemulaJumlahGigiYangDiberiSdf] =
    useState(0);
  const [
    gdBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGdBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruAnteriorSewarnaJumlahTampalanDibuat,
    setGkBaruAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaAnteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGdBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGdSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruPosteriorSewarnaJumlahTampalanDibuat,
    setGkBaruPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
    setGkSemulaPosteriorSewarnaJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGdBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGdSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkBaruPosteriorAmalgamJumlahTampalanDibuat,
    setGkBaruPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [
    gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
    setGkSemulaPosteriorAmalgamJumlahTampalanDibuat,
  ] = useState(0);
  const [cabutDesidusSekolahRawatan, setCabutDesidusSekolahRawatan] =
    useState(0);
  const [cabutKekalSekolahRawatan, setCabutKekalSekolahRawatan] = useState(0);
  const [
    jumlahTampalanSementaraSekolahRawatan,
    setJumlahTampalanSementaraSekolahRawatan,
  ] = useState(0);
  const [pulpotomiSekolahRawatan, setPulpotomiSekolahRawatan] = useState(0);
  const [endodontikSekolahRawatan, setEndodontikSekolahRawatan] = useState(0);
  const [absesSekolahRawatan, setAbsesSekolahRawatan] = useState(0);
  const [penskaleranSekolahRawatan, setPenskaleranSekolahRawatan] = useState(0);
  const [kesSelesaiSekolahRawatan, setKesSelesaiSekolahRawatan] =
    useState(false);
  const [kesSelesaiIcdasSekolahRawatan, setKesSelesaiIcdasSekolahRawatan] =
    useState(false);
  const [rujukSekolahRawatan, setRujukSekolahRawatan] = useState(false);
  const [ceramahPromosiSekolahRawatan, setCeramahPromosiSekolahRawatan] =
    useState('');
  const [lmgPromosiSekolahRawatan, setLmgPromosiSekolahRawatan] = useState('');
  const [
    yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
    setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
  ] = useState('');
  const [
    yaTidakLawatanKeRumahPromosiSekolahRawatan,
    setYaTidakLawatanKeRumahPromosiSekolahRawatan,
  ] = useState('');
  const [
    plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
    setPlakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
    setDietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
    setPenjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);
  const [
    kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
    setKanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
  ] = useState(false);

  // calculate total dibuat FS
  // useEffect(() => {
  //   setSumDibuatFs(
  //     parseInt(baruJumlahGigiKekalDibuatFs) +
  //       parseInt(semulaJumlahGigiKekalDibuatFs)
  //   );
  // }, [baruJumlahGigiKekalDibuatFs, semulaJumlahGigiKekalDibuatFs]);

  // calculate total diberi FV
  // useEffect(() => {
  //   setSumDiberiFv(
  //     parseInt(baruJumlahGigiKekalDiberiFv) +
  //       parseInt(semulaJumlahGigiKekalDiberiFv)
  //   );
  // }, [baruJumlahGigiKekalDiberiFv, semulaJumlahGigiKekalDiberiFv]);

  // calculate total diberi PRR
  // useEffect(() => {
  //   setSumDiberiPrr(
  //     parseInt(baruJumlahGigiKekalDiberiPrrJenis1) +
  //       parseInt(semulaJumlahGigiKekalDiberiPrrJenis1)
  //   );
  // }, [
  //   baruJumlahGigiKekalDiberiPrrJenis1,
  //   semulaJumlahGigiKekalDiberiPrrJenis1,
  // ]);

  // fetch singlePersonSekolah
  useEffect(() => {
    const fetchSinglePersonSekolah = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `/api/v1/sekolah/populate/${personSekolahId}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setSinglePersonSekolah(data.personSekolahWithPopulate);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSinglePersonSekolah();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (sumDibuatFs > 16) {
    //   toast.error('Jumlah dibuat FS tidak boleh lebih dari 16', {
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    // if (sumDiberiFv > 16) {
    //   toast.error('Jumlah diberi FV tidak boleh lebih dari 16', {
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    // if (sumDiberiPrr > 16) {
    //   toast.error('Jumlah diberi PRR tidak boleh lebih dari 16', {
    //     autoClose: 3000,
    //   });
    //   return;
    // }
    let statusRawatan = '';
    if (kesSelesaiSekolahRawatan === true) {
      statusRawatan = 'selesai';
    }
    if (kesSelesaiSekolahRawatan === false) {
      statusRawatan = 'belum selesai';
    }
    await toast
      .promise(
        axios.post(
          `/api/v1/sekolah/rawatan/${personSekolahId}`,
          {
            createdByUsername,
            statusRawatan,
            tarikhRawatanSemasa,
            baruJumlahGigiKekalDibuatFs,
            muridDibuatFs,
            // semulaJumlahGigiKekalDibuatFs,
            // baruJumlahMuridDibuatFs,
            // semulaJumlahMuridDibuatFs,
            muridDiberiFv,
            baruJumlahGigiKekalDiberiFv,
            // semulaJumlahGigiKekalDiberiFv,
            // baruJumlahMuridDiberiFv,
            // semulaJumlahMuridDiberiFv,
            muridDiberiPrrJenis1,
            baruJumlahGigiKekalDiberiPrrJenis1,
            // semulaJumlahGigiKekalDiberiPrrJenis1,
            // baruJumlahMuridDiberiPrrJenis1,
            // semulaJumlahMuridDiberiPrrJenis1,
            baruJumlahGigiYangDiberiSdf,
            semulaJumlahGigiYangDiberiSdf,
            gdBaruAnteriorSewarnaJumlahTampalanDibuat,
            gdSemulaAnteriorSewarnaJumlahTampalanDibuat,
            gkBaruAnteriorSewarnaJumlahTampalanDibuat,
            gkSemulaAnteriorSewarnaJumlahTampalanDibuat,
            gdBaruPosteriorSewarnaJumlahTampalanDibuat,
            gdSemulaPosteriorSewarnaJumlahTampalanDibuat,
            gkBaruPosteriorSewarnaJumlahTampalanDibuat,
            gkSemulaPosteriorSewarnaJumlahTampalanDibuat,
            gdBaruPosteriorAmalgamJumlahTampalanDibuat,
            gdSemulaPosteriorAmalgamJumlahTampalanDibuat,
            gkBaruPosteriorAmalgamJumlahTampalanDibuat,
            gkSemulaPosteriorAmalgamJumlahTampalanDibuat,
            cabutDesidusSekolahRawatan,
            cabutKekalSekolahRawatan,
            jumlahTampalanSementaraSekolahRawatan,
            pulpotomiSekolahRawatan,
            endodontikSekolahRawatan,
            absesSekolahRawatan,
            penskaleranSekolahRawatan,
            kesSelesaiSekolahRawatan,
            kesSelesaiIcdasSekolahRawatan,
            rujukSekolahRawatan,
            ceramahPromosiSekolahRawatan,
            lmgPromosiSekolahRawatan,
            yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan,
            yaTidakLawatanKeRumahPromosiSekolahRawatan,
            plakGigiNasihatPergigianIndividuPromosiSekolahRawatan,
            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan,
            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan,
            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan,
          },
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        ),
        {
          pending: 'Menghantar...',
          success: 'Rawatan pelajar berjaya dihantar',
          error: 'Rawatan pelajar gagal dihantar',
        },
        {
          autoClose: 2000,
        }
      )
      .then(() => {
        toast.info(`Tab akan ditutup dalam masa 3 saat...`, {
          autoClose: 2000,
        });
        setTimeout(() => {
          window.opener = null;
          window.open('', '_self');
          window.close();
        }, 3000);
      });
  };

  return (
    <>
      <div className='h-full p-1 px-2 md:px-10 grid gap-2'>
        <article className='outline outline-1 outline-userBlack grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-2'>
          {!isLoading && (
            <div>
              <div className='text-sm font-bold flex flex-row pl-5 p-2'>
                <h1>MAKLUMAT AM PESAKIT</h1>
                <FaInfoCircle
                  className='hover:cursor-pointer m-1 text-lg'
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                />
              </div>
              {isShown && (
                <div className='z-100 absolute float-right box-border outline outline-1 outline-userBlack left-64 p-5 bg-userWhite '>
                  <div className='text-xs flex flex-row'>
                    <h2 className='font-semibold'>NAMA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.nama}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>NO IC :</h2>
                    <p className='ml-1'>{singlePersonSekolah.ic}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>JANTINA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.jantina}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>TARIKH LAHIR :</h2>
                    <p className='ml-1'>{singlePersonSekolah.tarikhLahir}</p>
                  </div>
                  <div className='text-xs flex flex-row '>
                    <h2 className='font-semibold'>BANGSA :</h2>
                    <p className='ml-1'>{singlePersonSekolah.kumpulanEtnik}</p>
                  </div>
                </div>
              )}
              <div className='flex flex-row pl-5'>
                <h2 className='font-semibold text-xs'>NAMA :</h2>
                <p className='ml-1 text-xs'>{singlePersonSekolah.nama}</p>
              </div>
            </div>
          )}
          {!isLoading && (
            <>
              <div className='md:pt-10'>
                <div className='flex flex-row pl-5'>
                  <h2 className='font-semibold text-xs'>NAMA SEKOLAH :</h2>
                  <p className='ml-1 text-xs'>
                    {singlePersonSekolah.namaSekolah}
                  </p>
                </div>
              </div>
              <div className='lg:pt-10'>
                <div className='flex flex-row pl-5'>
                  <h2 className='font-semibold text-xs'>KELAS :</h2>
                  <p className='ml-1 text-xs'>{singlePersonSekolah.kelas}</p>
                </div>
              </div>
            </>
          )}
          {isLoading && (
            <p className='col-span-3 py-[19px] text-sm font-semibold'>
              <Spinner color='#1f315f' />
            </p>
          )}
        </article>
        <div className='grid h-full overflow-scroll gap-2'>
          <form onSubmit={handleSubmit}>
            <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
              <p className='ml-3 text-xl font-semibold'>Rawatan</p>
            </span>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
              <article className='grid grid-cols-2 border border-userBlack pl-3 p-2 rounded-md col-span-1 md:col-span-2'>
                <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                  tarikh rawatan
                </h4>
                <div className='grid grid-cols-2'>
                  <p className='flex items-center justify-center text-m font-m'>
                    tarikh:<span className='text-user6'>*</span>
                  </p>
                  <input
                    required
                    type='date'
                    name='tarikh-rawatan'
                    id='tarikh-rawatan'
                    value={tarikhRawatanSemasa}
                    onChange={(e) => {
                      setTarikhRawatanSemasa(e.target.value);
                    }}
                    className='outline outline-1 outline-userBlack m-2 text-sm font-m'
                  />
                </div>
              </article>
              <div className='grid gap-1 auto-rows-min'>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Pengapan Fisur{' '}
                    <FaInfoCircle title='Fissure Sealant' className='m-2' />
                  </h4>
                  <div className='flex flex-row items-center pl-11 col-span-2'>
                    <input
                      type='checkbox'
                      name='baru-jumlah-murid-dibuat-fs'
                      id='baru-jumlah-murid-dibuat-fs'
                      checked={muridDibuatFs}
                      onChange={() => {
                        setMuridDibuatFs(!muridDibuatFs);
                      }}
                      className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                    />
                    <label
                      htmlFor='baru-jumlah-murid-dibuat-fs'
                      className='text-sm font-m'
                    >
                      murid dibuat pengapan fisur
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-gigi-kekal-dibuat-fs'
                      className='text-sm font-m'
                    >
                      Jumlah gigi kekal dibuat pengapan fisur
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-gigi-kekal-dibuat-fs'
                      id='baru-jumlah-gigi-kekal-dibuat-fs'
                      value={baruJumlahGigiKekalDibuatFs}
                      onChange={(e) => {
                        setBaruJumlahGigiKekalDibuatFs(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-gigi-kekal-dibuat-fs'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-gigi-kekal-dibuat-fs'
                      id='semula-jumlah-gigi-kekal-dibuat-fs'
                      value={semulaJumlahGigiKekalDibuatFs}
                      onChange={(e) => {
                        setSemulaJumlahGigiKekalDibuatFs(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                  {/* {sumDibuatFs > 16 && (
                    <p className='col-span-2 text-user6 font-semibold'>
                      jumlah baru & semula FS tidak boleh melebihi 16
                    </p>
                  )} */}
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-murid-dibuat-fs'
                      className='text-sm font-m'
                    >
                      Baru
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-murid-dibuat-fs'
                      id='baru-jumlah-murid-dibuat-fs'
                      value={baruJumlahMuridDibuatFs}
                      onChange={(e) => {
                        setBaruJumlahMuridDibuatFs(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-murid-dibuat-fs'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-murid-dibuat-fs'
                      id='semula-jumlah-murid-dibuat-fs'
                      value={semulaJumlahMuridDibuatFs}
                      onChange={(e) => {
                        setSemulaJumlahMuridDibuatFs(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                </article>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Sapuan Fluorida{' '}
                    <FaInfoCircle
                      title='Fluoride Varnish Application'
                      className='m-2'
                    />
                  </h4>
                  <div className='flex flex-row items-center pl-11 col-span-2'>
                    <input
                      type='checkbox'
                      name='murid-diberi-fv'
                      id='murid-diberi-fv'
                      checked={muridDiberiFv}
                      onChange={() => {
                        setMuridDiberiFv(!muridDiberiFv);
                      }}
                      className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                    />
                    <label htmlFor='murid-diberi-fv' className='text-sm font-m'>
                      murid diberi sapuan fluorida
                    </label>
                  </div>
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-gigi-kekal-diberi-fv'
                      className='text-sm font-m'
                    >
                      jumlah gigi kekal diberi sapuan fluorida
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-gigi-kekal-diberi-fv'
                      id='baru-jumlah-gigi-kekal-diberi-fv'
                      value={baruJumlahGigiKekalDiberiFv}
                      onChange={(e) => {
                        setBaruJumlahGigiKekalDiberiFv(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-gigi-kekal-diberi-fv'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-gigi-kekal-diberi-fv'
                      id='semula-jumlah-gigi-kekal-diberi-fv'
                      value={semulaJumlahGigiKekalDiberiFv}
                      onChange={(e) => {
                        setSemulaJumlahGigiKekalDiberiFv(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                  {/* {sumDiberiFv > 16 && (
                    <p className='col-span-2 text-user6 font-semibold'>
                      jumlah baru & semula FV tidak boleh melebihi 16
                    </p>
                  )} */}
                  {/* <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                    murid diberi FV
                  </p>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-murid-diberi-fv'
                      className='text-sm font-m'
                    >
                      Baru
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-murid-diberi-fv'
                      id='baru-jumlah-murid-diberi-fv'
                      value={baruJumlahMuridDiberiFv}
                      onChange={(e) => {
                        setBaruJumlahMuridDiberiFv(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-murid-diberi-fv'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-murid-diberi-fv'
                      id='semula-jumlah-murid-diberi-fv'
                      value={semulaJumlahMuridDiberiFv}
                      onChange={(e) => {
                        setSemulaJumlahMuridDiberiFv(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                </article>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    PRR Jenis 1
                  </h4>
                  <div className='flex flex-row items-center pl-11 col-span-2'>
                    <input
                      type='checkbox'
                      name='baru-jumlah-murid-diberi-prr-jenis-1'
                      id='baru-jumlah-murid-diberi-prr-jenis-1'
                      checked={muridDiberiPrrJenis1}
                      onChange={() => {
                        setMuridDiberiPrrJenis1(!muridDiberiPrrJenis1);
                      }}
                      className='w-4 h-4 bg-user4 rounded focus:ring-user2 mr-3'
                    />
                    <label
                      htmlFor='baru-jumlah-murid-diberi-prr-jenis-1'
                      className='text-sm font-m'
                    >
                      murid diberi PRR Jenis 1
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <input
                      type='number'
                      name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      value={baruJumlahGigiKekalDiberiPrrJenis1}
                      onChange={(e) => {
                        setBaruJumlahGigiKekalDiberiPrrJenis1(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                    <label
                      htmlFor='baru-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      className='text-sm font-m'
                    >
                      jumlah gigi kekal perlu PRR jenis 1
                    </label>
                  </div>
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      id='semula-jumlah-gigi-kekal-diberi-prr-jenis-1'
                      value={semulaJumlahGigiKekalDiberiPrrJenis1}
                      onChange={(e) => {
                        setSemulaJumlahGigiKekalDiberiPrrJenis1(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                  {/* {sumDiberiPrr > 16 && (
                    <p className='col-span-2 text-user6 font-semibold'>
                      jumlah baru & semula PRR tidak boleh melebihi 16
                    </p>
                  )} */}
                  {/* <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-murid-diberi-prr-jenis-1'
                      className='text-sm font-m'
                    >
                      Baru
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-murid-diberi-prr-jenis-1'
                      id='baru-jumlah-murid-diberi-prr-jenis-1'
                      value={baruJumlahMuridDiberiPrrJenis1}
                      onChange={(e) => {
                        setBaruJumlahMuridDiberiPrrJenis1(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-murid-diberi-prr-jenis-1'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-murid-diberi-prr-jenis-1'
                      id='semula-jumlah-murid-diberi-prr-jenis-1'
                      value={semulaJumlahMuridDiberiPrrJenis1}
                      onChange={(e) => {
                        setSemulaJumlahMuridDiberiPrrJenis1(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div> */}
                </article>
              </div>
              <div className='grid gap-1 auto-rows-min'>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Silver Diamine Fluoride
                  </h4>
                  <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                    Jumlah gigi yang diberi SDF:
                  </p>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='baru-jumlah-gigi-yang-diberi-sdf'
                      className='text-sm font-m'
                    >
                      Baru
                    </label>
                    <input
                      type='number'
                      name='baru-jumlah-gigi-yang-diberi-sdf'
                      id='baru-jumlah-gigi-yang-diberi-sdf'
                      value={baruJumlahGigiYangDiberiSdf}
                      onChange={(e) => {
                        setBaruJumlahGigiYangDiberiSdf(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <label
                      htmlFor='semula-jumlah-gigi-yang-diberi-sdf'
                      className='text-sm font-m'
                    >
                      Semula
                    </label>
                    <input
                      type='number'
                      name='semula-jumlah-gigi-yang-diberi-sdf'
                      id='semula-jumlah-gigi-yang-diberi-sdf'
                      value={semulaJumlahGigiYangDiberiSdf}
                      onChange={(e) => {
                        setSemulaJumlahGigiYangDiberiSdf(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                      max='16'
                      required
                    />
                  </div>
                </article>
                <article className='border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    Jumlah Tampalan Dibuat
                  </h4>
                  <div className='grid grid-rows-2 gap-2'>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                        Anterior Sewarna
                      </h4>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          value={gdBaruAnteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdBaruAnteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          value={gdSemulaAnteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdSemulaAnteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Semula
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          value={gkBaruAnteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkBaruAnteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          value={gkSemulaAnteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkSemulaAnteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Semula
                        </label>
                      </div>
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                        Posterior Sewarna
                      </h4>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          value={gdBaruPosteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdBaruPosteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          value={gdSemulaPosteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdSemulaPosteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Semula
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          value={gkBaruPosteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkBaruPosteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          value={gkSemulaPosteriorSewarnaJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkSemulaPosteriorSewarnaJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Semula
                        </label>
                      </div>
                    </article>
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-semibold flex flex-row pl-5 col-span-2'>
                        Posterior Amalgam
                      </h4>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          value={gdBaruPosteriorAmalgamJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdBaruPosteriorAmalgamJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          value={gdSemulaPosteriorAmalgamJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGdSemulaPosteriorAmalgamJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GD Semula
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          value={gkBaruPosteriorAmalgamJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkBaruPosteriorAmalgamJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Baru
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          type='number'
                          name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          value={gkSemulaPosteriorAmalgamJumlahTampalanDibuat}
                          onChange={(e) => {
                            setGkSemulaPosteriorAmalgamJumlahTampalanDibuat(
                              e.target.value
                            );
                          }}
                          className='outline outline-1 outline-userBlack w-10 text-sm font-m'
                        />
                        <label
                          htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat'
                          className='text-sm font-m ml-2 m-1'
                        >
                          GK Semula
                        </label>
                      </div>
                    </article>
                  </div>
                </article>
              </div>
            </section>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2'>
              <div className='grid gap-2 auto-rows-min'>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    cabutan
                  </h4>
                  <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                    gigi telah dicabut
                  </p>
                  <div className='flex items-center justify-center'>
                    <p className='text-sm font-m'>Desidus: </p>
                    <input
                      type='number'
                      name='cabut-desidus-sekolah-rawatan'
                      id='cabut-desidus-sekolah-rawatan'
                      value={cabutDesidusSekolahRawatan}
                      onChange={(e) => {
                        setCabutDesidusSekolahRawatan(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                      min='0'
                      max='20'
                    />
                  </div>
                  <div className='flex items-center justify-center'>
                    <p className='text-sm font-m'>Kekal: </p>
                    <input
                      type='number'
                      name='cabut-kekal-penyata-akhir-2'
                      id='cabut-kekal-penyata-akhir-2'
                      value={cabutKekalSekolahRawatan}
                      onChange={(e) => {
                        setCabutKekalSekolahRawatan(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-1 text-sm font-m'
                      min='0'
                      max='32'
                    />
                  </div>
                </article>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    tampalan sementara
                  </h4>
                  <div className='flex items-center flex-row pl-5 col-span-2'>
                    <p className='text-sm font-m'>
                      jumlah tampalan sementara:{' '}
                    </p>
                    <input
                      type='number'
                      name='jumlah-tampalan-sementara-penyata-akhir-2'
                      id='jumlah-tampalan-sementara-penyata-akhir-2'
                      value={jumlahTampalanSementaraSekolahRawatan}
                      onChange={(e) => {
                        setJumlahTampalanSementaraSekolahRawatan(
                          e.target.value
                        );
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                    />
                  </div>
                </article>
                <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                    rawatan lain yang telah dilakukan
                  </h4>
                  <div className='grid grid-cols-1 lg:grid-cols-3 col-span-2'>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>pulpotomi: </p>
                      <input
                        type='number'
                        name='pulpotomi-penyata-akhir-2'
                        id='pulpotomi-penyata-akhir-2'
                        value={pulpotomiSekolahRawatan}
                        onChange={(e) => {
                          setPulpotomiSekolahRawatan(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                        min='0'
                        max='20'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>endodontik: </p>
                      <input
                        type='number'
                        name='endodontik-penyata-akhir-2'
                        id='endodontik-penyata-akhir-2'
                        value={endodontikSekolahRawatan}
                        onChange={(e) => {
                          setEndodontikSekolahRawatan(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                        min='0'
                        max='32'
                      />
                    </div>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-m'>abses: </p>
                      <input
                        type='number'
                        name='abses-penyata-akhir-2'
                        id='abses-penyata-akhir-2'
                        value={absesSekolahRawatan}
                        onChange={(e) => {
                          setAbsesSekolahRawatan(e.target.value);
                        }}
                        className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                        min='0'
                        max='1'
                      />
                    </div>
                  </div>
                  <div className='flex flex-row items-center pl-5'>
                    <p className='text-sm font-m'>Penskaleran:</p>
                    <input
                      type='number'
                      name='penskaleran-penyata-akhir-2'
                      id='penskaleran-penyata-akhir-2'
                      value={penskaleranSekolahRawatan}
                      onChange={(e) => {
                        setPenskaleranSekolahRawatan(e.target.value);
                      }}
                      className='outline outline-1 outline-userBlack w-10 m-3 text-sm font-m'
                      min='0'
                    />
                  </div>
                </article>
                <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    status rawatan
                  </h4>
                  <div className='flex flex-row items-center pl-5 m-2'>
                    <input
                      type='checkbox'
                      name='kes-selesai-penyata-akhir-2'
                      id='kes-selesai-penyata-akhir-2'
                      checked={kesSelesaiSekolahRawatan}
                      onChange={() => {
                        setKesSelesaiSekolahRawatan(!kesSelesaiSekolahRawatan);
                      }}
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='kes-selesai-penyata-akhir-2'
                      className='mx-2 text-sm font-m'
                    >
                      kes selesai
                    </label>
                  </div>
                  <div
                    className={`${
                      !kesSelesaiSekolahRawatan && 'hidden'
                    } flex flex-row items-center pl-5 m-2`}
                  >
                    <input
                      type='checkbox'
                      name='kes-selesai-icdas-penyata-akhir-2'
                      id='kes-selesai-icdas-penyata-akhir-2'
                      checked={kesSelesaiIcdasSekolahRawatan}
                      onChange={() => {
                        setKesSelesaiIcdasSekolahRawatan(
                          !kesSelesaiIcdasSekolahRawatan
                        );
                      }}
                      className='ml-7 w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='kes-selesai-icdas-penyata-akhir-2'
                      className='mx-2 text-sm font-m'
                    >
                      kes selesai ICDAS
                    </label>
                  </div>
                  <div className='flex flex-row items-center pl-5 m-2'>
                    <input
                      type='checkbox'
                      name='rujuk-penyata-akhir-2'
                      id='rujuk-penyata-akhir-2'
                      checked={rujukSekolahRawatan}
                      onChange={() => {
                        setRujukSekolahRawatan(!rujukSekolahRawatan);
                      }}
                      className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                    />
                    <label
                      htmlFor='rujuk-penyata-akhir-2'
                      className='mx-2 text-sm font-m'
                    >
                      rujuk
                    </label>
                  </div>
                </article>
              </div>
              <div className='grid gap-2 auto-rows-min'>
                <article className='grid gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                  <h4 className='font-bold flex flex-row pl-5'>
                    promosi & pendidikan kesihatan pergigian
                  </h4>
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                      menyertai aktiviti
                    </h4>
                    <div className='grid grid-cols-1 lg:grid-cols-2'>
                      <div className='flex flex-row items-center pl-5'>
                        <p className='text-sm font-m'>Ceramah: </p>
                        <select
                          name='ceramah-promosi-penyata-akhir-2'
                          id='ceramah-promosi-penyata-akhir-2'
                          value={ceramahPromosiSekolahRawatan}
                          onChange={(e) => {
                            setCeramahPromosiSekolahRawatan(e.target.value);
                          }}
                          className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                        >
                          <option value=''></option>
                          <option value='tiada'>Tiada</option>
                          <option value='baru'>Baru</option>
                          <option value='ulangan'>Ulangan</option>
                        </select>
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <p className='text-sm font-m'>LMG: </p>
                        <select
                          name='lmg-promosi-penyata-akhir-2'
                          id='lmg-promosi-penyata-akhir-2'
                          value={lmgPromosiSekolahRawatan}
                          onChange={(e) => {
                            setLmgPromosiSekolahRawatan(e.target.value);
                          }}
                          className='outline outline-1 outline-userBlack w-30 m-3 text-sm font-m'
                        >
                          <option value=''></option>
                          <option value='tiada'>Tiada</option>
                          <option value='baru'>Baru</option>
                          <option value='ulangan'>Ulangan</option>
                        </select>
                      </div>
                    </div>
                  </article>
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      melaksanakan aktiviti
                      <span className='text-user6 text-xl'>*</span>
                    </h4>
                    <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-semibold flex items-center justify-center pr-3'>
                        BEGIN:{' '}
                      </p>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          id='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          value='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          checked={
                            yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                            'ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          required
                        />
                        <label
                          htmlFor='ya-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>

                        <input
                          type='radio'
                          name='melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          id='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          value='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          checked={
                            yaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan ===
                            'tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setYaTidakMelaksanakanAktivitiBeginPromosiSekolahRawatan(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-melaksanakan-aktiviti-begin-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div>
                    {/* <div className='flex items-center flex-row pl-5'>
                      <p className='text-sm font-semibold flex items-center justify-center pr-3'>
                        lawatan ke rumah :{' '}
                      </p>
                      <div className='flex items-center justify-center'>
                        <input
                          type='radio'
                          name='lawatan-ke-rumah-promosi-penyata-akhir-2'
                          id='ya-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          value='ya-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          checked={
                            yaTidakLawatanKeRumahPromosiSekolahRawatan ===
                            'ya-lawatan-ke-rumah-promosi-penyata-akhir-2'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setYaTidakLawatanKeRumahPromosiSekolahRawatan(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                          required
                        />
                        <label
                          htmlFor='ya-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          Ya
                        </label>

                        <input
                          type='radio'
                          name='lawatan-ke-rumah-promosi-penyata-akhir-2'
                          id='tidak-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          value='tidak-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          checked={
                            yaTidakLawatanKeRumahPromosiSekolahRawatan ===
                            'tidak-lawatan-ke-rumah-promosi-penyata-akhir-2'
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setYaTidakLawatanKeRumahPromosiSekolahRawatan(
                              e.target.value
                            );
                          }}
                          className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500'
                        />
                        <label
                          htmlFor='tidak-lawatan-ke-rumah-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          Tidak
                        </label>
                      </div>
                    </div> */}
                  </article>
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      menerima aktiviti nasihat pergigian individu
                    </h4>
                    <div className='grid grid-cols-1'>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          type='checkbox'
                          name='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          id='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          checked={
                            plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
                          }
                          onChange={() => {
                            setPlakGigiNasihatPergigianIndividuPromosiSekolahRawatan(
                              !plakGigiNasihatPergigianIndividuPromosiSekolahRawatan
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='plak-gigi-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          penyakit pergigian
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          type='checkbox'
                          name='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          id='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          checked={
                            dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
                          }
                          onChange={() => {
                            setDietPemakananNasihatPergigianIndividuPromosiSekolahRawatan(
                              !dietPemakananNasihatPergigianIndividuPromosiSekolahRawatan
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='diet-pemakanan-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          diet pemakanan
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          type='checkbox'
                          name='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          id='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          checked={
                            penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
                          }
                          onChange={() => {
                            setPenjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan(
                              !penjagaanKesihatanMulutNasihatPergigianIndividuPromosiSekolahRawatan
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='penjagaan-kesihatan-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          penjagaan kesihatan mulut
                        </label>
                      </div>
                      <div className='flex items-center flex-row pl-5'>
                        <input
                          type='checkbox'
                          name='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          id='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          checked={
                            kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
                          }
                          onChange={() => {
                            setKanserMulutNasihatPergigianIndividuPromosiSekolahRawatan(
                              !kanserMulutNasihatPergigianIndividuPromosiSekolahRawatan
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                        />
                        <label
                          htmlFor='kanser-mulut-nasihat-pergigian-individu-promosi-penyata-akhir-2'
                          className='m-2 text-sm font-m'
                        >
                          kanser mulut
                        </label>
                      </div>
                    </div>
                  </article>
                </article>
              </div>
            </section>
            <div className='grid grid-cols-1 md:grid-cols-3 col-start-1 lg:col-start-2 gap-2 col-span-1 md:col-span-2 '>
              <span
                onClick={() => {
                  window.opener = null;
                  window.open('', '_self');
                  window.close();
                }}
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              >
                tutup
              </span>
              <input
                type='reset'
                value='reset'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all hover:cursor-pointer'
              />
              <button
                type='submit'
                className='flex bg-user3 p-2 w-full capitalize justify-center hover:bg-user1 hover:text-userWhite transition-all'
              >
                hantar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserFormSekolahRawatan;
