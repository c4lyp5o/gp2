import { FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const optionsRawatan = [
  { value: 'lihat-semua', label: 'Lihat Semua' },
  { value: 'pengapan-fisur', label: 'Pengapan Fisur' },
  { value: 'sapuan-florida', label: 'Sapuan Florida' },
  { value: 'prr-jenis-1', label: 'PRR Jenis 1' },
  { value: 'cabutan', label: 'Cabutan' },
  { value: 'pembedahan-mulut', label: 'Pembedahan Mulut' },
  // { value: 'sdf', label: 'Silver Diamine Fluoride' },
  { value: 'prostodontik', label: 'Prostodontik' },
  { value: 'periodontik', label: 'Terapi Periodontium' },
  { value: 'rawatan-lain', label: 'Rawatan Lain' },
  { value: 'x-ray', label: 'Bilangan X-Ray Yang Diambil' },
  { value: 'tampalan', label: 'Jumlah Tampalan Dibuat' },
  { value: 'endodontik-selesai', label: 'Kes Endodontik Selesai' },
  { value: 'penskaleran', label: 'Penskaleran' },
  { value: 'rujukan', label: 'Rujukan' },
];

export default function Rawatan(props) {
  const [pilihanRawatan, setPilihanRawatan] = useState([]);
  const [showKesSelesai, setShowKesSelesai] = useState(false);
  let isDisabled = false;
  if (
    props.statusReten === 'telah diisi' ||
    props.statusReten === 'reten salah' ||
    (props.singlePersonUmum.rawatanDibuatOperatorLain === true &&
      !props.operatorLain)
  ) {
    isDisabled = true;
  }

  //reset value
  useEffect(() => {
    if (props.rujukanPakarPeriodontik === 'tidak-rujukan-pakar-periodontik') {
      props.setEngganLainRujukanPakarPeriodontik('');
    }
  }, [props.rujukanPakarPeriodontik]);

  useEffect(() => {
    if (props.yaTidakTraumaPembedahanRawatanUmum === false) {
      props.setKecederaanTulangMukaUmum(false);
      props.setKecederaanGigiUmum(false);
      props.setKecederaanTisuLembutUmum(false);
    }
  }, [props.yaTidakTraumaPembedahanRawatanUmum]);

  return (
    <>
      {props.statusKehadiran === false ? (
        <div className='p-2'>
          <div className='grid grid-cols-2'>
            <span className='flex bg-user3 p-2 w-full capitalize col-span-2'>
              <p className='ml-3 text-xl font-semibold'>Rawatan</p>
            </span>
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-2 mt-3 mb-3 w-full col-span-2 auto-rows-min'>
              {props.statusKehadiran === false ? (
                <>
                  {props.statusReten === 'belum diisi' ? (
                    <article className='grid border border-userBlack pl-3 px-2 p-2 rounded-md lg:col-span-2'>
                      <h1 className='flex flex-row text-base font-semibold p-1'>
                        rawatan yang dijalankan hari ini
                      </h1>
                      {props.statusKehadiran === false ? (
                        <Select
                          isMulti
                          name='rawatan'
                          options={optionsRawatan}
                          className='basic-multi-select'
                          classNamePrefix='select'
                          onChange={(e) => {
                            if (showKesSelesai === false) {
                              setShowKesSelesai(true);
                              setPilihanRawatan(
                                e.map((item) => {
                                  console.log(item.value);
                                  return item.value;
                                })
                              );
                              setPilihanRawatan((prev) => {
                                return [...prev, 'kes-selesai'];
                              });
                            }
                            if (showKesSelesai === true) {
                              setPilihanRawatan(
                                e.map((item) => {
                                  return item.value;
                                })
                              );
                            }
                            console.log(pilihanRawatan);
                          }}
                        />
                      ) : null}
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('pengapan-fisur') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.baruJumlahGigiKekalDibuatFSRawatanUmum ? (
                    <article
                      className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'
                      title='Fissure Sealant'
                    >
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Pengapan Fisur
                      </h4>
                      {/* <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='pesakit-dibuat-fissure-sealant'
                          id='pesakit-dibuat-fissure-sealant'
                          value='pesakit-dibuat-fissure-sealant'
                          checked={props.pesakitDibuatFissureSealant}
                          onChange={() => {
                            props.setPesakitDibuatFissureSealant(
                              !props.pesakitDibuatFissureSealant
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='pesakit-dibuat-fissure-sealant'
                          className='mx-2 text-sm font-m'
                        >
                          pesakit dibuat Pengapan Fisur
                        </label>
                      </div> */}
                      <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                        jumlah gigi kekal dibuat Pengapan Fisur
                      </p>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                          id='baru-jumlah-gigi-kekal-dibuat-fs-rawatan-umum'
                          value={props.baruJumlahGigiKekalDibuatFSRawatanUmum}
                          onChange={(e) => {
                            props.setBaruJumlahGigiKekalDibuatFSRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('sapuan-florida') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.pesakitDibuatFluorideVarnish ? (
                    <article
                      className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'
                      title='Fluoride Varnish'
                    >
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Sapuan Flourida
                      </h4>
                      <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='pesakit-dibuat-fluoride-varnish'
                          id='pesakit-dibuat-fluoride-varnish'
                          value='pesakit-dibuat-fluoride-varnish'
                          checked={props.pesakitDibuatFluorideVarnish}
                          onChange={() => {
                            props.setPesakitDibuatFluorideVarnish(
                              !props.pesakitDibuatFluorideVarnish
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label className='mx-2 text-sm font-m'>
                          Pesakit diberi Sapuan Flourida
                        </label>
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('prr-jenis-1') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Tampalan Resin Pencegahan Jenis 1 (PRR Type I)
                      </h4>
                      {/* <div className='flex flex-row items-center pl-5 pt-1 col-span-2'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='pesakit-dibuat-prr-jenis-1'
                          id='pesakit-dibuat-prr-jenis-1'
                          value='pesakit-dibuat-prr-jenis-1'
                          checked={props.pesakitDibuatPRRJenis1}
                          onChange={() => {
                            props.setPesakitDibuatPRRJenis1(
                              !props.pesakitDibuatPRRJenis1
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='pesakit-dibuat-prr-jenis-1'
                          className='mx-2 text-sm font-m'
                        >
                          pesakit diberi PRR jenis 1
                        </label>
                      </div> */}
                      <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                        jumlah gigi diberi Tampalan Resin Pencegahan Jenis 1
                        (PRR Type I)
                      </p>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                          id='baru-jumlah-gigi-kekal-diberi-prr-jenis-1-rawatan-umum'
                          value={
                            props.baruJumlahGigiKekalDiberiPRRJenis1RawatanUmum
                          }
                          onChange={(e) => {
                            props.setBaruJumlahGigiKekalDiberiPRRJenis1RawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('cabutan') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.cabutDesidusRawatanUmum ||
                  props.cabutKekalRawatanUmum ||
                  props.komplikasiSelepasCabutanRawatanUmum ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        cabutan
                      </h4>
                      <p className='flex items-center flex-row pl-5 text-m font-m col-span-2'>
                        Jumlah gigi telah dicabut
                      </p>
                      <div className='flex items-center justify-center'>
                        <p className='text-sm font-m'>Desidus: </p>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='cabut-desidus-rawatan-umum'
                          id='cabut-desidus-rawatan-umum'
                          value={props.cabutDesidusRawatanUmum}
                          onChange={(e) => {
                            props.setCabutDesidusRawatanUmum(e.target.value);
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='20'
                        />
                      </div>
                      <div className='flex items-center justify-center col-start-1'>
                        <p className='text-sm font-m'>Kekal: </p>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='cabut-kekal-rawatan-umum'
                          id='cabut-kekal-rawatan-umum'
                          value={props.cabutKekalRawatanUmum}
                          onChange={(e) => {
                            props.setCabutKekalRawatanUmum(e.target.value);
                            props.setCabutanDisebabkanPeriodontitisRawatanUmum(
                              0
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      {props.cabutKekalRawatanUmum > 0 ? (
                        <div className='flex items-center flex-row pl-5'>
                          <p className='text-sm font-m'>
                            Cabutan disebabkan periodontitis:
                          </p>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='cabutan-disebabkan-periodontitis-rawatan-umum'
                            id='cabutan-disebabkan-periodontitis-rawatan-umum'
                            value={
                              props.cabutanDisebabkanPeriodontitisRawatanUmum
                            }
                            onChange={(e) => {
                              props.setCabutanDisebabkanPeriodontitisRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max={props.cabutKekalRawatanUmum}
                          />
                        </div>
                      ) : null}
                      <div className='flex items-center flex-row col-span-2 pl-5'>
                        <p className='text-sm font-m'>
                          Komplikasi selepas cabutan:{' '}
                        </p>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='komplikasi-selepas-cabutan-rawatan-umum'
                          id='komplikasi-selepas-cabutan-rawatan-umum'
                          value={props.komplikasiSelepasCabutanRawatanUmum}
                          onChange={(e) => {
                            props.setKomplikasiSelepasCabutanRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('pembedahan-mulut') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.cabutanSurgikalPembedahanMulutRawatanUmum ||
                  props.yaTidakAbsesPembedahanRawatanUmum ||
                  props.yaTidakPembedahanKecilMulutPembedahanRawatanUmum ||
                  props.yaTidakTraumaPembedahanRawatanUmum ? (
                    <article className='grid grid-cols-1 grid-row-5 border border-userBlack rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 py-2'>
                        Pembedahan Mulut
                      </h4>
                      <div className='grid grid-cols-2 items-center py-2'>
                        <p className='text-sm font-m flex justify-start flex-row pl-5'>
                          Cabutan surgikal :
                        </p>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                          id='cabutan-surgikal-pembedahan-mulut-rawatan-umum'
                          value={
                            props.cabutanSurgikalPembedahanMulutRawatanUmum
                          }
                          onChange={(e) => {
                            props.setCabutanSurgikalPembedahanMulutRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ya-tidak-abses-pembedahan-rawatan-umum'
                          id='ya-tidak-abses-pembedahan-rawatan-umum'
                          value='ya-tidak-abses-pembedahan-rawatan-umum'
                          checked={
                            props.yaTidakAbsesPembedahanRawatanUmum
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setYaTidakAbsesPembedahanRawatanUmum(
                              !props.yaTidakAbsesPembedahanRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='ya-tidak-abses-pembedahan-rawatan-umum'
                          className='text-sm font-m flex justify-start flex-row pl-5'
                        >
                          Abses
                        </label>
                      </div>
                      {/* <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ya-tidak-fraktur-pembedahan-rawatan-umum'
                          id='ya-tidak-fraktur-pembedahan-rawatan-umum'
                          value='ya-tidak-fraktur-pembedahan-rawatan-umum'
                          checked={
                            props.yaTidakFrakturPembedahanRawatanUmum
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setYaTidakFrakturPembedahanRawatanUmum(
                              !props.yaTidakFrakturPembedahanRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='ya-tidak-fraktur-pembedahan-rawatan-umum'
                          className='text-sm font-m flex justify-start flex-row pl-5'
                        >
                          Fraktur
                        </label>
                      </div> */}
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          id='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          value='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          checked={
                            props.yaTidakPembedahanKecilMulutPembedahanRawatanUmum
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setYaTidakPembedahanKecilMulutPembedahanRawatanUmum(
                              !props.yaTidakPembedahanKecilMulutPembedahanRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='ya-tidak-pembedahan-kecil-mulut-pembedahan-rawatan-umum'
                          className='text-sm font-m flex justify-start flex-row pl-5'
                        >
                          Pembedahan Kecil Mulut
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ya-tidak-trauma-pembedahan-rawatan-umum'
                          id='ya-tidak-trauma-pembedahan-rawatan-umum'
                          value='ya-tidak-trauma-pembedahan-rawatan-umum'
                          checked={
                            props.yaTidakTraumaPembedahanRawatanUmum
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setYaTidakTraumaPembedahanRawatanUmum(
                              !props.yaTidakTraumaPembedahanRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='ya-tidak-trauma-pembedahan-rawatan-umum'
                          className='text-sm font-m flex justify-start flex-row pl-5'
                        >
                          Trauma
                        </label>
                      </div>
                      {props.yaTidakTraumaPembedahanRawatanUmum === true ? (
                        <article className='grid grid-cols-1 border border-userBlack pl-3 p-2 m-2'>
                          <h4 className='font-bold flex flex-row pl-2'>
                            Trauma
                          </h4>
                          <div className='flex items-center flex-row pl-2'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='kecederaan-tulang-muka-umum'
                              id='kecederaan-tulang-muka-umum'
                              checked={props.kecederaanTulangMukaUmum}
                              onChange={() => {
                                props.setKecederaanTulangMukaUmum(
                                  !props.kecederaanTulangMukaUmum
                                );
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='kecederaan-tulang-muka-umum'
                              className='m-2 text-sm font-m'
                            >
                              Kecederaan tulang muka
                            </label>
                          </div>
                          <div className='flex items-center flex-row pl-2'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='kecederaan-gigi-umum'
                              id='kecederaan-gigi-umum'
                              checked={props.kecederaanGigiUmum}
                              onChange={() => {
                                props.setKecederaanGigiUmum(
                                  !props.kecederaanGigiUmum
                                );
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='kecederaan-gigi-umum'
                              className='m-2 text-sm font-m'
                            >
                              Kecederaan gigi
                            </label>
                          </div>
                          <div className='flex items-center flex-row pl-2'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='kecederaan-tisu-lembut-umum'
                              id='kecederaan-tisu-lembut-umum'
                              checked={props.kecederaanTisuLembutUmum}
                              onChange={() => {
                                props.setKecederaanTisuLembutUmum(
                                  !props.kecederaanTisuLembutUmum
                                );
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='kecederaan-tisu-lembut-umum'
                              className='m-2 text-sm font-m'
                            >
                              Kecederaan tisu lembut
                            </label>
                          </div>
                        </article>
                      ) : null}
                    </article>
                  ) : null}
                  {/* akan digunakan masa depan */}
                  {/* {pilihanRawatan.includes('sdf') ||
                  pilihanRawatan.includes('lihat-semua') ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Silver Diamine Fluoride
                      </h4>
                      <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                        Jumlah gigi yang diberi SDF:
                      </p>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Baru
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          id='baru-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          value={props.baruJumlahGigiYangDiberiSdfRawatanUmum}
                          onChange={(e) => {
                            props.setBaruJumlahGigiYangDiberiSdfRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='16'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Semula
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          id='semula-jumlah-gigi-yang-diberi-sdf-rawatan-umum'
                          value={props.semulaJumlahGigiYangDiberiSdfRawatanUmum}
                          onChange={(e) => {
                            props.setSemulaJumlahGigiYangDiberiSdfRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='16'
                        />
                      </div>
                    </article>
                  ) : null} */}
                  {pilihanRawatan.includes('prostodontik') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.baruJumlahCrownBridgeRawatanUmum ||
                  props.semulaJumlahCrownBridgeRawatanUmum ||
                  props.baruJumlahPostCoreRawatanUmum ||
                  props.semulaJumlahPostCoreRawatanUmum ||
                  props.baruPenuhJumlahDenturProstodontikRawatanUmum ||
                  props.semulaPenuhJumlahDenturProstodontikRawatanUmum ||
                  props.baruSeparaJumlahDenturProstodontikRawatanUmum ||
                  props.semulaSeparaJumlahDenturProstodontikRawatanUmum ||
                  props.immediateDenturProstodontikRawatanUmum ||
                  props.pembaikanDenturProstodontikRawatanUmum ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Prostodontik Diisu
                      </h4>
                      <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                        crown / bridge diisu dan disimen:
                      </p>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='baru-jumlah-crown-bridge-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Baru
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='baru-jumlah-crown-bridge-rawatan-umum'
                          id='baru-jumlah-crown-bridge-rawatan-umum'
                          value={props.baruJumlahCrownBridgeRawatanUmum}
                          onChange={(e) => {
                            props.setBaruJumlahCrownBridgeRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='semula-jumlah-crown-bridge-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Semula
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='semula-jumlah-crown-bridge-rawatan-umum'
                          id='semula-jumlah-crown-bridge-rawatan-umum'
                          value={props.semulaJumlahCrownBridgeRawatanUmum}
                          onChange={(e) => {
                            props.setSemulaJumlahCrownBridgeRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      <p className='flex flex-row pl-5 text-sm font-m col-span-2'>
                        post & core:
                      </p>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='baru-jumlah-post-core-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Baru
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='baru-jumlah-post-core-rawatan-umum'
                          id='baru-jumlah-post-core-rawatan-umum'
                          value={props.baruJumlahPostCoreRawatanUmum}
                          onChange={(e) => {
                            props.setBaruJumlahPostCoreRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-5'>
                        <label
                          htmlFor='semula-jumlah-post-core-rawatan-umum'
                          className='text-sm font-m'
                        >
                          Semula
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='semula-jumlah-post-core-rawatan-umum'
                          id='semula-jumlah-post-core-rawatan-umum'
                          value={props.semulaJumlahPostCoreRawatanUmum}
                          onChange={(e) => {
                            props.setSemulaJumlahPostCoreRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='32'
                        />
                      </div>
                      <article className='grid grid-cols-2 col-span-2  border border-userBlack p-2 m-1 mx-1'>
                        <p className='flex flex-row pl-1 text-sm font-semibold col-span-2'>
                          dentur penuh diisu
                        </p>
                        <div className='flex flex-row items-center p-1'>
                          <label
                            htmlFor='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            className='text-sm font-m'
                          >
                            baru
                          </label>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            id='baru-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            value={
                              props.baruPenuhJumlahDenturProstodontikRawatanUmum
                            }
                            onChange={(e) => {
                              props.setBaruPenuhJumlahDenturProstodontikRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='2'
                          />
                        </div>
                        <div className='flex flex-row items-center p-1'>
                          <label
                            htmlFor='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            className='text-sm font-m'
                          >
                            semula
                          </label>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            id='semula-penuh-jumlah-dentur-prostodontik-rawatan-umum'
                            value={
                              props.semulaPenuhJumlahDenturProstodontikRawatanUmum
                            }
                            onChange={(e) => {
                              props.setSemulaPenuhJumlahDenturProstodontikRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='2'
                          />
                        </div>
                        <p className='flex flex-row pl-1 text-sm font-semibold col-span-2'>
                          dentur separa diisu
                        </p>
                        <div className='flex flex-row items-center p-1'>
                          <label
                            htmlFor='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            className='text-sm font-m'
                          >
                            baru
                          </label>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            id='baru-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            value={
                              props.baruSeparaJumlahDenturProstodontikRawatanUmum
                            }
                            onChange={(e) => {
                              props.setBaruSeparaJumlahDenturProstodontikRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='2'
                          />
                        </div>
                        <div className='flex flex-row items-center p-1'>
                          <label
                            htmlFor='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            className='text-sm font-m'
                          >
                            semula
                          </label>
                          <input
                            disabled={isDisabled}
                            type='number'
                            name='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            id='semula-separa-jumlah-dentur-prostodontik-rawatan-umum'
                            value={
                              props.semulaSeparaJumlahDenturProstodontikRawatanUmum
                            }
                            onChange={(e) => {
                              props.setSemulaSeparaJumlahDenturProstodontikRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            min='0'
                            max='2'
                          />
                        </div>
                        {props.singlePersonUmum.jenisFasiliti ===
                          'projek-komuniti-lain' && (
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              type='checkbox'
                              name='menggunakan-makmal-pergigian-bergerak'
                              id='menggunakan-makmal-pergigian-bergerak'
                              checked={
                                props.menggunakanMakmalPergigianBergerak
                                  ? true
                                  : false
                              }
                              onChange={() => {
                                props.setMenggunakanMakmalPergigianBergerak(
                                  !props.menggunakanMakmalPergigianBergerak
                                );
                              }}
                              className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500 focus:ring-2 '
                            />
                            <label
                              htmlFor='menggunakan-makmal-pergigian-bergerak'
                              className='text-sm pl-2'
                            >
                              menggunakan makmal pergigian bergerak
                            </label>
                          </div>
                        )}
                      </article>
                      <div className='flex flex-row items-center pl-5 col-span-2'>
                        <label
                          htmlFor='immediate-dentur-prostodontik-rawatan-umum'
                          className='text-sm font-m'
                        >
                          immediate dentur
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='immediate-dentur-prostodontik-rawatan-umum'
                          id='immediate-dentur-prostodontik-rawatan-umum'
                          value={props.immediateDenturProstodontikRawatanUmum}
                          onChange={(e) => {
                            props.setImmediateDenturProstodontikRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='2'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-5 col-span-2'>
                        <label
                          htmlFor='pembaikan-dentur-prostodontik-rawatan-umum'
                          className='text-sm font-m'
                        >
                          pembaikan dentur
                        </label>
                        <input
                          disabled={isDisabled}
                          type='number'
                          name='pembaikan-dentur-prostodontik-rawatan-umum'
                          id='pembaikan-dentur-prostodontik-rawatan-umum'
                          value={props.pembaikanDenturProstodontikRawatanUmum}
                          onChange={(e) => {
                            props.setPembaikanDenturProstodontikRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          min='0'
                          max='2'
                        />
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('tampalan') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum ||
                  props.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                  props.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                  props.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                  props.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum ||
                  props.baruInlayOnlayJumlahTampalanDibuatRawatanUmum ||
                  props.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum ||
                  props.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum ? (
                    <article className='border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Jumlah Tampalan Dibuat
                      </h4>
                      <div className='grid grid-rows-2 gap-2'>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                            Anterior Sewarna
                          </h4>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='12'
                              type='number'
                              name='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='12'
                              type='number'
                              name='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='12'
                              type='number'
                              name='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-baru-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-semula-anterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                            Posterior Sewarna
                          </h4>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='8'
                              type='number'
                              name='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='8'
                              type='number'
                              name='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-baru-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-semula-posterior-sewarna-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                            Posterior Amalgam
                          </h4>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='8'
                              type='number'
                              name='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='8'
                              type='number'
                              name='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gd-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GD Semula
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-baru-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              id='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setGkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='gk-semula-posterior-amalgam-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              GK Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-3 col-span-2'>
                            inlay / onlay
                          </h4>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              id='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.baruInlayOnlayJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setBaruInlayOnlayJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='baru-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              Baru
                            </label>
                          </div>
                          <div className='flex flex-row items-center pl-3'>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='20'
                              type='number'
                              name='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              id='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.semulaInlayOnlayJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setSemulaInlayOnlayJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                            <label
                              htmlFor='semula-inlay-onlay-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m ml-2 m-1'
                            >
                              Semula
                            </label>
                          </div>
                        </article>
                        <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                          <h4 className='font-semibold flex flex-row pl-3'>
                            tampalan sementara
                          </h4>
                          <div className='flex flex-row items-center pl-3'>
                            <label
                              htmlFor='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                              className='text-sm font-m m-1'
                            >
                              jumlah tampalan sementara :
                            </label>
                            <input
                              disabled={isDisabled}
                              min='0'
                              max='32'
                              type='number'
                              name='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                              id='jumlah-tampalan-sementara-jumlah-tampalan-dibuat-rawatan-umum'
                              value={
                                props.jumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum
                              }
                              onChange={(e) => {
                                props.setJumlahTampalanSementaraJumlahTampalanDibuatRawatanUmum(
                                  e.target.value
                                );
                              }}
                              className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                            />
                          </div>
                        </article>
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('periodontik') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.skorBpeOralHygienePemeriksaanUmum === '4' ||
                  props.nasihatBerhentiMerokok ||
                  props.lainLainPengurusanFaktorRisiko ||
                  props.pengilapanTampalanRungkup ||
                  props.adjustasiOklusi ||
                  props.ektiparsiPulpa ||
                  props.rawatanLainPeriodontikRawatanUmum ||
                  props.rujukanPakarPeriodontik ||
                  props.rujukanPakarScd ||
                  props.rujukanPakarUpkka ||
                  props.kesSelesaiPeriodontium ? (
                    <article className='grid grid-cols-2 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2'>
                        Terapi Periodontium
                      </h4>
                      <article className='grid grid-cols-[2fr_1fr] md:grid-cols-[3fr_2fr] gap-2 items-center border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-span-2 '>
                        <h4 className='font-semibold flex flex-row items-center pl-3 col-span-2'>
                          Pengurusan Faktor Risiko
                        </h4>
                        {/* <label
                          htmlFor='kaunseling-diet'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Kaunseling Diet :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='kaunseling-diet'
                          id='kaunseling-diet'
                          checked={props.kaunselingDiet ? true : false}
                          onChange={() => {
                            props.setKaunselingDiet(!props.kaunselingDiet);
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        /> */}
                        <label
                          htmlFor='nasihat-berhenti-merokok'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Nasihat Berhenti Merokok :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='nasihat-berhenti-merokok'
                          id='nasihat-berhenti-merokok'
                          checked={props.nasihatBerhentiMerokok ? true : false}
                          onChange={() => {
                            props.setNasihatBerhentiMerokok(
                              !props.nasihatBerhentiMerokok
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='lain-lain-pengurusan-faktor-risiko '
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Lain-lain :
                          <FaInfoCircle
                            className='text-xs ml-1'
                            title='Contoh: Rujukan kepada Pengamal Perubatan bagi pesakit yang disyaki mengidap diabetes atau rujukan semula pesakit yang tidak patuh kepada pengambilan ubat-ubatan'
                          />
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='lain-lain-pengurusan-faktor-risiko'
                          id='lain-lain-pengurusan-faktor-risiko'
                          checked={
                            props.lainLainPengurusanFaktorRisiko ? true : false
                          }
                          onChange={() => {
                            props.setLainLainPengurusanFaktorRisiko(
                              !props.lainLainPengurusanFaktorRisiko
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                      </article>
                      <article className='grid grid-cols-[2fr_1fr] md:grid-cols-[3fr_2fr] gap-2 items-center border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-span-2 '>
                        <h4 className='font-semibold flex flex-row items-center pl-3 col-span-2'>
                          Pengurusan Faktor Setempat
                        </h4>
                        {/* <label
                          htmlFor='ohe-pengurusan-faktor-setempat'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          OHE :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ohe-pengurusan-faktor-setempat'
                          id='ohe-pengurusan-faktor-setempat'
                          checked={
                            props.ohePengurusanFaktorSetempat ? true : false
                          }
                          onChange={() => {
                            props.setOhePengurusanFaktorSetempat(
                              !props.ohePengurusanFaktorSetempat
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        /> */}
                        <label
                          htmlFor='pengilapan-tampalan-rungkup'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Penggilapan Tampalan Rungkup :{' '}
                          <FaInfoCircle
                            className='text-xs ml-1'
                            title='Polished Overhanged Filling'
                          />
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='pengilapan-tampalan-rungkup'
                          id='pengilapan-tampalan-rungkup'
                          checked={
                            props.pengilapanTampalanRungkup ? true : false
                          }
                          onChange={() => {
                            props.setPengilapanTampalanRungkup(
                              !props.pengilapanTampalanRungkup
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='adjustasi-oklusi'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Adjustasi Oklusi :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='adjustasi-oklusi'
                          id='adjustasi-oklusi'
                          checked={props.adjustasiOklusi ? true : false}
                          onChange={() => {
                            props.setAdjustasiOklusi(!props.adjustasiOklusi);
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        {/* <label
                          htmlFor='cabutan-pengurusan-faktor-setempat'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Cabutan :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='cabutan-pengurusan-faktor-setempat'
                          id='cabutan-pengurusan-faktor-setempat'
                          checked={
                            props.cabutanPengurusanFaktorSetempat ? true : false
                          }
                          onChange={() => {
                            props.setCabutanPengurusanFaktorSetempat(
                              !props.cabutanPengurusanFaktorSetempat
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        /> */}
                        <label
                          htmlFor='ektiparsi-pulpa'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Ekstirpasi Disebabkan Periodontitis :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='ektiparsi-pulpa'
                          id='ektiparsi-pulpa'
                          checked={props.ektiparsiPulpa ? true : false}
                          onChange={() => {
                            props.setEktiparsiPulpa(!props.ektiparsiPulpa);
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rawatan-lain-periodontik-rawatan-umum'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Lain-Lain :
                          <FaInfoCircle
                            className='text-xs ml-1'
                            title='seperti penyahpekaan, pensplinan, pengurusan abses periodontium seperti incision and drainage'
                          />
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rawatan-lain-periodontik-rawatan-umum'
                          id='rawatan-lain-periodontik-rawatan-umum'
                          checked={
                            props.rawatanLainPeriodontikRawatanUmum
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setRawatanLainPeriodontikRawatanUmum(
                              !props.rawatanLainPeriodontikRawatanUmum
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                      </article>
                      <article className='grid grid-cols-[2fr_1fr] gap-2 items-center border border-userBlack pl-3 p-2 rounded-md auto-rows-min col-span-2'>
                        <h4 className='font-semibold flex flex-row pl-3 col-span-2 '>
                          Rujukan
                        </h4>
                        <label className='text-left flex justify-start items-center text-sm pl-3'>
                          Pakar Periodontik :
                          {props.skorBpeOralHygienePemeriksaanUmum === '4' && (
                            <span className='text-user6'>*</span>
                          )}
                        </label>
                        <div className='flex flex-row items-center whitespace-nowrap'>
                          <input
                            disabled={isDisabled}
                            required={
                              props.skorBpeOralHygienePemeriksaanUmum === '4'
                                ? true
                                : false
                            }
                            type='radio'
                            name='rujukan-pakar-periodontik'
                            id='ya-rujukan-pakar-periodontik'
                            value='ya-rujukan-pakar-periodontik'
                            checked={
                              props.rujukanPakarPeriodontik ===
                              'ya-rujukan-pakar-periodontik'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setRujukanPakarPeriodontik(e.target.value);
                            }}
                            className='w-4 h-4 rounded flex items-center'
                          />
                          <label
                            htmlFor='ya-rujukan-pakar-periodontik'
                            className='text-left flex justify-start items-center text-sm px-3'
                          >
                            Ya
                          </label>
                          <input
                            disabled={isDisabled}
                            required={
                              props.skorBpeOralHygienePemeriksaanUmum === '4'
                                ? true
                                : false
                            }
                            type='radio'
                            name='rujukan-pakar-periodontik'
                            id='tidak-rujukan-pakar-periodontik'
                            value='tidak-rujukan-pakar-periodontik'
                            checked={
                              props.rujukanPakarPeriodontik ===
                              'tidak-rujukan-pakar-periodontik'
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              props.setRujukanPakarPeriodontik(e.target.value);
                            }}
                            className='w-4 h-4 rounded flex items-center'
                          />
                          <label
                            htmlFor='tidak-rujukan-pakar-periodontik'
                            className='text-left flex justify-start items-center text-sm px-3'
                          >
                            Tidak
                          </label>
                          {props.rujukanPakarPeriodontik ? (
                            <span
                              className='px-2 py-1 bg-user4 text-userWhite text-xs rounded-full cursor-pointer hover:bg-user2'
                              onClick={() => {
                                props.setRujukanPakarPeriodontik('');
                              }}
                            >
                              X
                            </span>
                          ) : null}
                        </div>
                        {props.rujukanPakarPeriodontik ===
                          'tidak-rujukan-pakar-periodontik' && (
                          <div className='border border-userBlack flex flex-row items-center whitespace-nowrap p-2 col-start-2'>
                            <input
                              disabled={isDisabled}
                              type='radio'
                              name='enggan-lain-rujukan-pakar-periodontik'
                              id='enggan-rujukan-pakar-periodontik'
                              value='enggan-rujukan-pakar-periodontik'
                              checked={
                                props.engganLainRujukanPakarPeriodontik ===
                                'enggan-rujukan-pakar-periodontik'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                props.setEngganLainRujukanPakarPeriodontik(
                                  e.target.value
                                );
                              }}
                              className='w-4 h-4 rounded flex items-center'
                            />
                            <label
                              htmlFor='enggan-rujukan-pakar-periodontik'
                              className='text-left flex justify-start items-center text-sm px-3'
                            >
                              Enggan
                            </label>
                            <input
                              disabled={isDisabled}
                              type='radio'
                              name='enggan-lain-rujukan-pakar-periodontik'
                              id='lain-rujukan-pakar-periodontik'
                              value='lain-rujukan-pakar-periodontik'
                              checked={
                                props.engganLainRujukanPakarPeriodontik ===
                                'lain-rujukan-pakar-periodontik'
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                props.setEngganLainRujukanPakarPeriodontik(
                                  e.target.value
                                );
                              }}
                              className='w-4 h-4 rounded flex items-center'
                            />
                            <label
                              htmlFor='lain-rujukan-pakar-periodontik'
                              className='text-left flex justify-start items-center text-sm px-3'
                            >
                              Lain-lain
                              <FaInfoCircle
                                className='text-xs ml-1'
                                title='Contoh: Pesakit belum memutuskan boleh ke Klinik Pakar atau tidak, tidak sempat dirujuk kerana masa tidak mencukupi atau kekangan fasiliti'
                              />
                            </label>
                          </div>
                        )}
                        <label
                          htmlFor='rujukan-pakar-scd'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Pakar Pergigian Penjagaan Khas :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-scd'
                          id='rujukan-pakar-scd'
                          checked={props.rujukanPakarScd ? true : false}
                          onChange={() => {
                            props.setRujukanPakarScd(!props.rujukanPakarScd);
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rujukan-pakar-upkka'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Pakar Pergigian Kesihatan Awam :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-upkka'
                          id='rujukan-pakar-upkka'
                          checked={props.rujukanPakarUpkka ? true : false}
                          onChange={() => {
                            props.setRujukanPakarUpkka(
                              !props.rujukanPakarUpkka
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='kes-selesai-periodontium'
                          className='text-left flex justify-start items-center text-sm pl-3 whitespace-nowrap'
                        >
                          Kes Selesai Periodontium :
                        </label>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='kes-selesai-periodontium'
                          id='kes-selesai-periodontium'
                          checked={props.kesSelesaiPeriodontium ? true : false}
                          onChange={() => {
                            props.setKesSelesaiPeriodontium(
                              !props.kesSelesaiPeriodontium
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                      </article>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('rawatan-lain') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.rawatanOrtodontikRawatanUmum ||
                  props.kesPerubatanMulutRawatanUmum ||
                  props.rawatanLainPeriodontik ? (
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5'>
                        rawatan lain
                      </h4>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rawatan-ortodontik-rawatan-umum'
                          id='rawatan-ortodontik-rawatan-umum'
                          checked={
                            props.rawatanOrtodontikRawatanUmum ? true : false
                          }
                          onChange={() => {
                            props.setRawatanOrtodontikRawatanUmum(
                              !props.rawatanOrtodontikRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rawatan-ortodontik-rawatan-umum'
                          className='mx-2 text-sm font-m'
                        >
                          rawatan ortodontik
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='kes-perubatan-mulut-rawatan-umum'
                          id='kes-perubatan-mulut-rawatan-umum'
                          checked={
                            props.kesPerubatanMulutRawatanUmum ? true : false
                          }
                          onChange={() => {
                            props.setKesPerubatanMulutRawatanUmum(
                              !props.kesPerubatanMulutRawatanUmum
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='kes-perubatan-mulut-rawatan-umum'
                          className='mx-2 text-sm font-m'
                        >
                          kes perubatan mulut
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rawatan-lain-periodontik-rawatan-umum'
                          id='rawatan-lain-periodontik-rawatan-umum'
                          checked={props.rawatanLainPeriodontik ? true : false}
                          onChange={() => {
                            props.setRawatanLainPeriodontik(
                              !props.rawatanLainPeriodontik
                            );
                          }}
                          className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                        />
                        <label
                          htmlFor='rawatan-lain-periodontik-rawatan-umum'
                          className='mx-2 text-sm font-m'
                        >
                          rawatan lain periodontik
                        </label>
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('x-ray') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.bilanganXrayYangDiambilRawatanUmum ? (
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row px-5'>
                        bilangan x-ray yang diambil
                      </h4>
                      <input
                        disabled={isDisabled}
                        min='0'
                        max='32'
                        type='number'
                        name='bilangan-xray-yang-diambil-rawatan-umum'
                        id='bilangan-xray-yang-diambil-rawatan-umum'
                        value={props.bilanganXrayYangDiambilRawatanUmum}
                        onChange={(e) => {
                          props.setBilanganXrayYangDiambilRawatanUmum(
                            e.target.value
                          );
                        }}
                        className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg ml-5'
                      />
                    </article>
                  ) : null}
                  {/* pink */}
                  {pilihanRawatan.includes('endodontik-selesai') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.jumlahAnteriorKesEndodontikSelesaiRawatanUmum ||
                  props.jumlahPremolarKesEndodontikSelesaiRawatanUmum ||
                  props.jumlahMolarKesEndodontikSelesaiRawatanUmum ||
                  props.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum ||
                  props.jumlahAnteriorRawatanSemulaKeppRawatanUmum ||
                  props.jumlahPremolarRawatanSemulaKeppRawatanUmum ||
                  props.jumlahMolarRawatanSemulaKeppRawatanUmum ||
                  props.memenuhiRditnKod3KesRujukUpprRawatanUmum ||
                  props.restorasiPascaEndodontikKesRujukUpprRawatanUmum ||
                  props.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum ? (
                    <article className='grid grid-cols-1 auto-rows-min gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                      <h4 className='font-semibold flex flex-row pl-3'>
                        kes endodontik selesai
                      </h4>
                      <div className='flex flex-row items-center pl-3'>
                        <label
                          htmlFor='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                          className='text-sm font-m m-1'
                        >
                          anterior :
                        </label>
                        <input
                          disabled={isDisabled}
                          min='0'
                          max='12'
                          type='number'
                          name='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                          id='jumlah-anterior-kes-endodontik-selesai-rawatan-umum'
                          value={
                            props.jumlahAnteriorKesEndodontikSelesaiRawatanUmum
                          }
                          onChange={(e) => {
                            props.setJumlahAnteriorKesEndodontikSelesaiRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-3'>
                        <label
                          htmlFor='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                          className='text-sm font-m m-1'
                        >
                          premolar :
                        </label>
                        <input
                          disabled={isDisabled}
                          min='0'
                          max='8'
                          type='number'
                          name='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                          id='jumlah-premolar-kes-endodontik-selesai-rawatan-umum'
                          value={
                            props.jumlahPremolarKesEndodontikSelesaiRawatanUmum
                          }
                          onChange={(e) => {
                            props.setJumlahPremolarKesEndodontikSelesaiRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-3'>
                        <label
                          htmlFor='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                          className='text-sm font-m m-1'
                        >
                          molar :
                        </label>
                        <input
                          disabled={isDisabled}
                          min='0'
                          max='12'
                          type='number'
                          name='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                          id='jumlah-molar-kes-endodontik-selesai-rawatan-umum'
                          value={
                            props.jumlahMolarKesEndodontikSelesaiRawatanUmum
                          }
                          onChange={(e) => {
                            props.setJumlahMolarKesEndodontikSelesaiRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <div className='flex flex-row items-center pl-3'>
                        <label
                          htmlFor='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                          className='text-sm font-m m-1'
                        >
                          rawatan semula endodontik :
                        </label>
                        <input
                          disabled={isDisabled}
                          min='0'
                          max='32'
                          type='number'
                          name='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                          id='rawatan-semula-endodontik-dari-primer-kes-endodontik-selesai-rawatan-umum'
                          value={
                            props.rawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum
                          }
                          onChange={(e) => {
                            props.setRawatanSemulaEndodontikDariPrimerKesEndodontikSelesaiRawatanUmum(
                              e.target.value
                            );
                          }}
                          className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                        />
                      </div>
                      <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md'>
                        <h4 className='font-semibold flex flex-row pl-3'>
                          rawatan semula di KEPP
                        </h4>
                        <div className='flex flex-row items-center pl-3'>
                          <label
                            htmlFor='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                            className='text-sm font-m m-1'
                          >
                            anterior :
                          </label>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='12'
                            type='number'
                            name='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                            id='jumlah-anterior-rawatan-semula-kepp-rawatan-umum'
                            value={
                              props.jumlahAnteriorRawatanSemulaKeppRawatanUmum
                            }
                            onChange={(e) => {
                              props.setJumlahAnteriorRawatanSemulaKeppRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div className='flex flex-row items-center pl-3'>
                          <label
                            htmlFor='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                            className='text-sm font-m m-1'
                          >
                            premolar :
                          </label>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='8'
                            type='number'
                            name='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                            id='jumlah-premolar-rawatan-semula-kepp-rawatan-umum'
                            value={
                              props.jumlahPremolarRawatanSemulaKeppRawatanUmum
                            }
                            onChange={(e) => {
                              props.setJumlahPremolarRawatanSemulaKeppRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                        <div className='flex flex-row items-center pl-3'>
                          <label
                            htmlFor='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                            className='text-sm font-m m-1'
                          >
                            molar :
                          </label>
                          <input
                            disabled={isDisabled}
                            min='0'
                            max='12'
                            type='number'
                            name='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                            id='jumlah-molar-rawatan-semula-kepp-rawatan-umum'
                            value={
                              props.jumlahMolarRawatanSemulaKeppRawatanUmum
                            }
                            onChange={(e) => {
                              props.setJumlahMolarRawatanSemulaKeppRawatanUmum(
                                e.target.value
                              );
                            }}
                            className='appearance-none w-16 border-b-4 border-b-user4 py-1 px-2 text-base focus:border-b-user2 focus:outline-none m-1 drop-shadow-lg'
                          />
                        </div>
                      </article>
                      <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                        <h4 className='font-semibold flex flex-row pl-3'>
                          kes rujuk Unit Pakar Pergigian Restoratif
                        </h4>
                        <div className='grid grid-cols-[2fr_3fr] items-center pl-3'>
                          <label
                            htmlFor='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                            className='text-sm font-m m-1 flex flex-row'
                          >
                            memenuhi RDITN kod 3 :
                          </label>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                            id='memenuhi-rditn-kod3-kes-rujuk-uppr-rawatan-umum'
                            value={
                              props.memenuhiRditnKod3KesRujukUpprRawatanUmum
                            }
                            checked={
                              props.memenuhiRditnKod3KesRujukUpprRawatanUmum
                                ? true
                                : false
                            }
                            onChange={() => {
                              props.setMemenuhiRditnKod3KesRujukUpprRawatanUmum(
                                !props.memenuhiRditnKod3KesRujukUpprRawatanUmum
                              );
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                        </div>
                        <div className='grid grid-cols-[2fr_3fr] items-center pl-3'>
                          <label
                            htmlFor='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                            className='text-sm font-m m-1 flex flex-row'
                          >
                            restorasi pasca endodontik :
                          </label>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                            id='restorasi-pasca-endodontik-kes-rujuk-uppr-rawatan-umum'
                            value={
                              props.restorasiPascaEndodontikKesRujukUpprRawatanUmum
                            }
                            checked={
                              props.restorasiPascaEndodontikKesRujukUpprRawatanUmum
                                ? true
                                : false
                            }
                            onChange={() => {
                              props.setRestorasiPascaEndodontikKesRujukUpprRawatanUmum(
                                !props.restorasiPascaEndodontikKesRujukUpprRawatanUmum
                              );
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                        </div>
                        <div className='grid grid-cols-[2fr_3fr] items-center pl-3'>
                          <label
                            htmlFor='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                            className='text-sm font-m m-1 flex flex-row'
                          >
                            komplikasi semasa rawatan KEPP :
                          </label>
                          <input
                            disabled={isDisabled}
                            type='checkbox'
                            name='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                            id='komplikasi-semasa-rawatan-kepp-kes-rujuk-uppr-rawatan-umum'
                            checked={
                              props.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum
                                ? true
                                : false
                            }
                            onChange={() => {
                              props.setKomplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum(
                                !props.komplikasiSemasaRawatanKeppKesRujukUpprRawatanUmum
                              );
                            }}
                            className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                          />
                        </div>
                      </article>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('penskaleran') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.penskaleranRawatanUmum ? (
                    <article className='grid grid-cols-[2fr_1fr] gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 col-span-2 py-2'>
                        Penskaleran
                      </h4>
                      <div className='flex flex-row items-center pl-5'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='penskaleran-rawatan-umum'
                          id='penskaleran-rawatan-umum'
                          checked={props.penskaleranRawatanUmum ? true : false}
                          onChange={() => {
                            props.setPenskaleranRawatanUmum(
                              !props.penskaleranRawatanUmum
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='penskaleran-rawatan-umum'
                          className='flex items-center text-sm pl-3'
                        >
                          Penskaleran
                        </label>
                      </div>
                    </article>
                  ) : null}
                  {pilihanRawatan.includes('rujukan') ||
                  pilihanRawatan.includes('lihat-semua') ||
                  props.rujukanPakarOrtodontik ||
                  props.rujukanPakarPatologiMulutDanPerubatanMulut ||
                  props.rujukanPakarBedahMulut ||
                  props.rujukanPakarPergigianPediatrik ? (
                    <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                      <h4 className='font-bold flex flex-row pl-5 py-2'>
                        Rujukan
                      </h4>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-ortodontik'
                          id='rujukan-pakar-ortodontik'
                          checked={props.rujukanPakarOrtodontik ? true : false}
                          onChange={() => {
                            props.setRujukanPakarOrtodontik(
                              !props.rujukanPakarOrtodontik
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rujukan-pakar-ortodontik'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Rujukan Ke Pakar ortodontik
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-patologi-mulut-dan-perubatan-mulut'
                          id='rujukan-pakar-patologi-mulut-dan-perubatan-mulut'
                          checked={
                            props.rujukanPakarPatologiMulutDanPerubatanMulut
                              ? true
                              : false
                          }
                          onChange={() => {
                            props.setRujukanPakarPatologiMulutDanPerubatanMulut(
                              !props.rujukanPakarPatologiMulutDanPerubatanMulut
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rujukan-pakar-patologi-mulut-dan-perubatan-mulut'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Rujukan Ke Pakar Patologi Mulut dan Perubatan Mulut
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-bedah-mulut'
                          id='rujukan-pakar-bedah-mulut'
                          checked={props.rujukanPakarBedahMulut ? true : false}
                          onChange={() => {
                            props.setRujukanPakarBedahMulut(
                              !props.rujukanPakarBedahMulut
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rujukan-pakar-bedah-mulut'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Rujukan Ke Pakar bedah mulut dan maksilofasial
                        </label>
                      </div>
                      <div className='flex flex-row items-center pl-5 m-1'>
                        <input
                          disabled={isDisabled}
                          type='checkbox'
                          name='rujukan-pakar-pergigian-pediatrik'
                          id='rujukan-pakar-pergigian-pediatrik'
                          checked={
                            props.rujukanPakarPergigianPediatrik ? true : false
                          }
                          onChange={() => {
                            props.setRujukanPakarPergigianPediatrik(
                              !props.rujukanPakarPergigianPediatrik
                            );
                          }}
                          className='w-4 h-4 rounded flex items-center'
                        />
                        <label
                          htmlFor='rujukan-pakar-pergigian-pediatrik'
                          className='text-left flex justify-start items-center text-sm pl-3'
                        >
                          Rujukan Ke Pakar Pergigian Pediatrik
                        </label>
                      </div>
                    </article>
                  ) : null}
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      status rawatan
                    </h4>
                    <div className='flex flex-row items-center pl-5 m-1'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='kes-selesai-rawatan-umum'
                        id='kes-selesai-rawatan-umum'
                        checked={props.kesSelesaiRawatanUmum ? true : false}
                        onChange={() => {
                          props.setKesSelesaiRawatanUmum(
                            !props.kesSelesaiRawatanUmum
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                      />
                      <label
                        htmlFor='kes-selesai-rawatan-umum'
                        className='text-left flex justify-start items-center text-sm p-3 whitespace-nowrap'
                      >
                        kes selesai
                      </label>
                    </div>
                  </article>
                  <article className='grid grid-cols-1 gap-2 border border-userBlack pl-3 p-2 rounded-md auto-rows-min'>
                    <h4 className='font-bold flex flex-row pl-5'>
                      Rawatan dibuat oleh operator lain
                    </h4>
                    <div className='flex flex-row items-center pl-5 m-1'>
                      <input
                        disabled={isDisabled}
                        type='checkbox'
                        name='rawatan-dibuat-operator-lain-umum'
                        id='rawatan-dibuat-operator-lain-umum'
                        checked={props.rawatanDibuatOperatorLain ? true : false}
                        onChange={() => {
                          props.setRawatanDibuatOperatorLain(
                            !props.rawatanDibuatOperatorLain
                          );
                        }}
                        className='w-4 h-4 text-red-600 bg-gray-100 rounded border-gray-300 focus:ring-red-500'
                      />
                      <label
                        htmlFor='rawatan-dibuat-operator-lain-umum'
                        className='mx-2 text-sm font-m'
                      >
                        Rawatan ada dibuat oleh operator lain pada hari yang
                        sama sahaja
                      </label>
                    </div>
                  </article>
                </>
              ) : null}
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
