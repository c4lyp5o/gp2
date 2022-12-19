import { useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';

import styles from '../../admin/Modal.module.css';

const ConfirmModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState(null);

  const show = (callback) => (event) => {
    event.preventDefault();
    setOpen(true);
    event = {
      ...event,
      target: { ...event.target, value: event.target.value },
    };
    setCallback({
      run: () => callback(event),
    });
  };

  const hide = () => {
    setCallback(null);
    setOpen(false);
  };

  const confirm = () => {
    callback.run();
    hide();
  };

  return (
    <>
      {children(show)}
      {open && (
        <>
          <div className='absolute inset-x-10 inset-y-5 lg:inset-x-1/3 lg:inset-y-6 text-sm bg-userWhite z-20 outline outline-1 outline-userBlack opacity-100 overflow-y-auto rounded-md'>
            <FaWindowClose
              onClick={hide}
              className='absolute mr-1 mt-1 text-xl text-userBlack right-0 hover:cursor-pointer hover:text-user2 transition-all'
            />
            <h5 className='bg-user9 text-userWhite font-semibold text-xl'>
              PERHATIAN
            </h5>
            <div className='mt-3 p-1'>
              <p>Anda YAKIN untuk menambah maklumat?</p>
              <div className='text-xs mt-3'>
                {data.adaCleftLipPemeriksaanUmum ? (
                  <p>
                    Cleft Lip/Palate:{' '}
                    {data.adaCleftLipPemeriksaanUmum ? 'Ya' : 'Tiada'}
                  </p>
                ) : null}
                <p>
                  Status denture:{' '}
                  {data.yaTidakSediaAdaStatusDenturePemeriksaanUmum ===
                  'Tidak-Sedia-Ada-Status-Denture-Pemeriksaan-Umum'
                    ? 'Ada'
                    : 'Tiada'}
                </p>
                {data.toothSurfaceLossTraumaPemeriksaanUmum ? (
                  <p>
                    Kehilangan Permukaan Gigi:{' '}
                    {data.toothSurfaceLossTraumaPemeriksaanUmum
                      ? 'Ya'
                      : 'Tiada'}
                  </p>
                ) : null}
                {data.fissureSealantPemeriksaanUmum ? (
                  <p>Pengapan Fisur: {data.fissureSealantPemeriksaanUmum}</p>
                ) : null}
                {data.fvPerluSapuanPemeriksaanUmum ? (
                  <p>Perlu Sapuan: {data.fvPerluSapuanPemeriksaanUmum}</p>
                ) : null}
                {data.prrJenis1PemeriksaanUmum ? (
                  <p>PRR Jenis 1: {data.prrJenis1PemeriksaanUmum}</p>
                ) : null}
                {data.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum ? (
                  <p>
                    Silver Diamine Fluoride:{' '}
                    {data.yaTidakSilverDiamineFluoridePerluSapuanPemeriksaanUmum
                      ? 'Ya'
                      : 'Tiada'}
                  </p>
                ) : null}
                <p>
                  Kebersihan Mulut:{' '}
                  {data.kebersihanMulutOralHygienePemeriksaanUmum}
                </p>
                {/* <p>BPE Skor: {data.skorBpeOralHygienePemeriksaanUmum}</p> */}
                <p>GIS Skor: {data.skorGisMulutOralHygienePemeriksaanUmum}</p>
                {data.perluPenskaleranPemeriksaanUmum ? (
                  <p>
                    Perlu Penskaleran:{' '}
                    {data.perluPenskaleranPemeriksaanUmum ? 'Ya' : 'Tiada'}
                  </p>
                ) : null}
                {data.adaDesidusPemeriksaanUmum ? (
                  <p>
                    Status Gigi Desidus:{' '}
                    {data.adaDesidusPemeriksaanUmum ? 'Ya' : 'Tiada'}, dmfx:{' '}
                    {data.sumDMFXDesidusUmum}
                  </p>
                ) : null}
                {data.adaKekalPemeriksaanUmum ? (
                  <p>
                    Status Gigi Kekal:{' '}
                    {data.adaKekalPemeriksaanUmum ? 'Ya' : 'Tiada'}, DMFX:{' '}
                    {data.sumDMFXKekalUmum}
                  </p>
                ) : null}
                {data.jumlahFaktorRisikoPemeriksaanUmum ? (
                  <p>
                    Jumlah Faktor Risiko:{' '}
                    {data.jumlahFaktorRisikoPemeriksaanUmum}
                  </p>
                ) : null}
                {data.disaringProgramKanserMulutPemeriksaanUmum ? (
                  <div>
                    <p>
                      Program Kanser Mulut:{' '}
                      {data.disaringProgramKanserMulutPemeriksaanUmum
                        ? 'Ya'
                        : 'Tiada'}
                    </p>
                    <p>
                      Lesi Mulut:{' '}
                      {data.lesiMulutPemeriksaanUmum ? 'Ya' : 'Tiada'}
                    </p>
                    <p>
                      Tabiat Berisiko Tinggi:{' '}
                      {data.tabiatBerisikoTinggiPemeriksaanUmum
                        ? 'Ya'
                        : 'Tiada'}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
            <div className='absolute grid grid-cols-2 bottom-0 right-0 left-0 m-2 mx-10'>
              <button
                className='capitalize bg-user9 text-userWhite rounded-md shadow-xl p-2 mr-3 hover:bg-user1 transition-all'
                onClick={confirm}
              >
                YA
              </button>
              <button
                className='capitalize bg-userWhite text-userBlack rounded-md p-2 ml-3 hover:bg-user5 transition-all'
                onClick={hide}
              >
                Tidak
              </button>
            </div>
          </div>
          <div
            onClick={hide}
            className='absolute inset-0 bg-user1 z-10 opacity-75'
          />
        </>
      )}
    </>
  );
};

export default ConfirmModal;
