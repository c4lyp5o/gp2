import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';

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
          <div className={styles.darkBG} onClick={hide} />
          <div className={styles.centered}>
            <div className={styles.modalAdd}>
              <div className={styles.modalHeader}>
                <h5 className={styles.heading}>PERHATIAN</h5>
              </div>
              <button className={styles.closeBtn} onClick={hide}>
                <RiCloseLine style={{ marginBottom: '-3px' }} />
              </button>
              <div className={styles.modalContent}>
                <p>Anda YAKIN untuk menambah data?</p>
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
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  <button className={styles.deleteBtn} onClick={confirm}>
                    YA
                  </button>
                  <button className={styles.cancelBtn} onClick={hide}>
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmModal;
