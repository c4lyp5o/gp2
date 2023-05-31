import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { RiCloseLine } from 'react-icons/ri';
import { AiOutlineStop } from 'react-icons/ai';

import styles from '../../Modal.module.css';

const ModalGenerateAdHoc = (props) => {
  const { toast, adminToken, loginInfo, masterDatePicker, Dictionary } =
    useGlobalAdminAppContext();
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  const startDateRef = useRef('');
  const endDateRef = useRef('');

  //datepicker range
  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);

  const pilihanRetenAdaProgram = [
    'PG101C',
    'PG211C',
    'DEWASAMUDA',
    'KOM-OAP',
    'KOM-OKU-PDK',
    'KOM-Komuniti',
    'KOM-Penjara',
    'KOM-WE',
    'OAP',
    'PPR',
    'PPKPS',
    'PKAP2',
  ].includes(props.jenisReten);
  const pilihanRetenTunjukProgram =
    [
      'PG101C',
      'PG211C',
      'DEWASAMUDA',
      'KOM-OAP',
      'KOM-OKU-PDK',
      'KOM-Komuniti',
      'KOM-Penjara',
      'KOM-WE',
      'OAP',
      'PPR',
      'PPKPS',
      'PKAP2',
    ].includes(props.jenisReten) && props.pilihanFasiliti === 'program';

  const TarikhAwal = () => {
    return masterDatePicker({
      selected: startDatePicker,
      selectsStart: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      onChange: (startDate) => {
        startDateRef.current = moment(startDate).format('YYYY-MM-DD');
        setStartDatePicker(startDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      required: true,
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const TarikhAkhir = () => {
    return masterDatePicker({
      selected: endDatePicker,
      selectsEnd: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      minDate: startDatePicker,
      onChange: (endDate) => {
        endDateRef.current = moment(endDate).format('YYYY-MM-DD');
        setEndDatePicker(endDate);
      },
      filterDate: (date) => {
        return moment() > date;
      },
      required: true,
      className:
        'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
    });
  };

  const fileName = () => {
    let file = '';
    const date = moment(new Date()).format('DDMMYYYY');
    const { jenisReten, namaKlinik, pilihanProgram, pilihanKpbMpb } = props;
    if (loginInfo.accountType === 'hqSuperadmin') {
      const namaNegera = props.pilihanNegeri === 'all' ? 'MALAYSIA' : '';
      const namaNegeri =
        props.pilihanNegeri !== 'all' && props.pilihanDaerah === 'all'
          ? `${Dictionary[props.pilihanNegeri].toUpperCase()}`
          : '';
      const namaDaerah =
        props.pilihanNegeri !== 'all' && props.pilihanKlinik === 'all'
          ? `${props.pilihanDaerah.toUpperCase()}`
          : '';
      const namaKlinik =
        props.pilihanKlinik !== 'all'
          ? `${props.namaKlinik.toUpperCase()}`
          : '';
      file = `${jenisReten}_${namaNegera}${namaNegeri}${namaDaerah}${namaKlinik}_${date}_token.xlsx`;
      return file;
    }
    if (pilihanProgram !== '') {
      file = `${jenisReten}_${namaKlinik.toUpperCase()}_${pilihanProgram.toUpperCase()}_${date}_token.xlsx`;
    } else if (pilihanKpbMpb !== '') {
      file = `${jenisReten}_${pilihanKpbMpb}_${date}_token.xlsx`;
    } else if (
      props.pilihanDaerah !== 'all' &&
      props.pilihanKlinik !== 'all' &&
      pilihanProgram === '' &&
      pilihanKpbMpb === ''
    ) {
      file = `${jenisReten}_${namaKlinik.toUpperCase()}_${date}_token.xlsx`;
    } else if (props.pilihanDaerah !== 'all' && props.pilihanKlinik === 'all') {
      file = `${jenisReten}_${props.pilihanDaerah.toUpperCase()}_${date}_token.xlsx`;
    } else if (props.pilihanDaerah === 'all') {
      file = `${jenisReten}_${loginInfo.negeri.toUpperCase()}_${date}_token.xlsx`;
    }
    // console.log(file);
    return file;
  };

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = fileName();
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const penjanaanReten = async (e) => {
    try {
      const url = `/api/v1/generate/download?jenisReten=${
        props.jenisReten
      }&negeri=${
        loginInfo.accountType === 'hqSuperadmin'
          ? Dictionary[props.pilihanNegeri]
          : loginInfo.negeri
      }&daerah=${
        props.pilihanDaerah === '' ? 'all' : props.pilihanDaerah
      }&klinik=${props.pilihanKlinik === '' ? 'all' : props.pilihanKlinik}${
        props.pilihanFasiliti === 'kkiakd'
          ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanKkia=${props.pilihanKkia}`
          : ''
      }${
        props.pilihanFasiliti === 'program'
          ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanProgram=${props.pilihanProgram}`
          : ''
      }${
        props.pilihanFasiliti === 'kpbmpb'
          ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanKpbMpb=${props.pilihanKpbMpb}`
          : ''
      }${
        props.pilihanFasiliti === 'individu'
          ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanIndividu=${props.pilihanIndividu}`
          : ''
      }&tarikhMula=${startDateRef.current}&tarikhAkhir=${
        endDateRef.current
      }&fromEtl=false`;
      // console.log(url);
      const res = await axios.get(url, {
        headers: {
          Authorization: adminToken,
        },
        responseType: 'blob',
      });
      return res;
    } catch (err) {
      switch (err.response.status) {
        case 401:
          toast.error(
            `Anda telah mencapai jumlah batasan penjanaan ${props.jenisReten} bagi bulan ini`
          );
          break;
        case 403:
          toast.error('Anda tidak dibenarkan untuk menjana reten');
          break;
        case 404:
          toast.error('Tiada data untuk tarikh yang dipilih');
          break;
        case 0:
          toast.error('Network error');
          break;
        default:
          toast.error('Something wrong happened');
          break;
      }
    }
  };

  const handleJana = async (e) => {
    e.preventDefault();
    props.setGenerating(true);
    props.setGeneratingNoWayBack(true);
    const id = toast.loading('Sedang menjana reten...');
    setTimeout(async () => {
      await penjanaanReten()
        .then((res) => {
          saveFile(res.data);
        })
        .then(() => {
          toast.update(id, {
            render: 'Berjaya menjana reten',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
          props.setGeneratingNoWayBack(false);
          setTimeout(() => {
            props.setGenerating(false);
          }, 3000);
          props.setOpenModalGenerateAdHoc(false);
          props.setOpenModalGenerateBulanan(false);
        })
        .catch((err) => {
          toast.dismiss(id);
          props.setGenerating(false);
          props.setGeneratingNoWayBack(false);
        });
    }, 3000);
  };

  const noWayBack = () => {
    if (props.generatingNoWayBack) {
      toast.warning('Sila sabar menunggu...', {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    if (!props.generatingNoWayBack) {
      props.setOpenModalGenerateAdHoc(false);
    }
  };

  // reset endDate if change startDate
  useEffect(() => {
    endDateRef.current = '';
    setEndDatePicker(null);
  }, [startDateRef.current]);

  return (
    <>
      <form onSubmit={handleJana}>
        <div
          className='absolute inset-0 bg-user1 z-0 opacity-75'
          onClick={noWayBack}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>
                Penjanaan Reten {props.jenisReten}
              </h5>
            </div>
            <span className={styles.closeBtn} onClick={noWayBack}>
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                {props.jenisReten !== 'MASA' ? (
                  <div className='grid grid-cols-2 gap-2'>
                    <div className='px-3 py-1'>
                      <label
                        htmlFor='tarikhMula'
                        className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                      >
                        Daripada:
                      </label>
                      <TarikhAwal />
                    </div>
                    <div className='px-3 py-1'>
                      <label
                        htmlFor='tarikhAkhir'
                        className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                      >
                        Sehingga:
                      </label>
                      <TarikhAkhir />
                    </div>
                  </div>
                ) : (
                  <div className='grid grid-row-2 gap-2 p-2 normal-case'>
                    Penjanaan PIAGAM MASA dengan token adalah untuk SATU TAHUN
                    PENUH, maklumat yang akan dijana adalah yang terbaru
                    sehingga yang diisi sekarang
                  </div>
                )}
                <div className='mb-3'>
                  <div className='grid gap-1'>
                    {loginInfo.accountType === 'hqSuperadmin' ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='negeri'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Negeri:
                        </label>
                        <select
                          required
                          name='negeri'
                          id='negeri'
                          value={props.pilihanNegeri}
                          onChange={(e) => props.handlePilihNegeri(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>Semua Negeri</option>
                          {props.negeri.map((n, index) => {
                            return (
                              <option
                                value={n.username}
                                key={index}
                                className='capitalize'
                              >
                                {n.negeri}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    {loginInfo.accountType === 'negeriSuperadmin' ||
                    (props.pilihanNegeri !== '' &&
                      props.pilihanNegeri !== 'all') ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='daerah'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Daerah:
                        </label>
                        <select
                          required
                          name='daerah'
                          id='daerah'
                          value={props.pilihanDaerah}
                          onChange={(e) => props.handlePilihDaerah(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent capitalize'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>
                            Semua daerah (Jana Negeri)
                          </option>
                          {props.daerah.map((d, index) => {
                            return (
                              <option
                                value={d.daerah}
                                key={index}
                                className='capitalize'
                              >
                                {d.daerah}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    {loginInfo.accountType === 'daerahSuperadmin' ||
                    (props.pilihanDaerah !== '' &&
                      props.pilihanDaerah !== 'all') ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='klinik'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Klinik:
                        </label>
                        <select
                          required
                          name='klinik'
                          id='klinik'
                          value={props.pilihanKlinik}
                          onChange={(e) => props.handlePilihKlinik(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>
                            Semua klinik (Jana Daerah)
                          </option>
                          {props.klinik.map((k, index) => {
                            return (
                              <option
                                key={index}
                                data-key={k.kp}
                                value={k.kodFasiliti}
                                className='capitalize'
                              >
                                {k.kp}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      pilihanRetenAdaProgram ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            value={props.pilihanFasiliti}
                            onChange={(e) => {
                              props.handleGetProgramEnKPBMPB(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='program'>Program</option>
                            {props.jenisReten === 'PG101C' && (
                              <option value='kpbmpb'>KPB / MPB</option>
                            )}
                          </select>
                        </div>
                      ) : null}
                      {pilihanRetenTunjukProgram && (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='program'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Program
                          </label>
                          <select
                            required
                            name='program'
                            id='program'
                            value={props.pilihanProgram}
                            onChange={(e) => {
                              props.setPilihanProgram(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {/* <option value='all'>Semua Program</option> - tutup dulu */}
                            {props.programData &&
                              props.programData
                                .filter(
                                  (p) =>
                                    p &&
                                    p.tarikhStart >= startDateRef.current &&
                                    p.tarikhStart <= endDateRef.current
                                )
                                .filter((p) => {
                                  if (p && props.jenisReten !== 'PG101C') {
                                    const eventMap = {
                                      DEWASAMUDA: 'programDewasaMuda',
                                      'KOM-WE': 'we',
                                      'KOM-OKU-PDK': 'oku',
                                      'KOM-Komuniti': 'projek-komuniti',
                                      'KOM-Penjara': 'penjara-koreksional',
                                      'KOM-OAP': '',
                                      PPR: 'ppr',
                                      PPKPS: 'ppkps',
                                      PKAP2: 'kampungAngkatPergigian',
                                    };
                                    return (
                                      eventMap[props.jenisReten] ===
                                        undefined ||
                                      p.jenisEvent ===
                                        eventMap[props.jenisReten]
                                    );
                                  } else if (
                                    p &&
                                    props.jenisReten === 'PG101C'
                                  ) {
                                    return p;
                                  } else {
                                    return [];
                                  }
                                })
                                .map((p, index) => {
                                  return (
                                    <option
                                      key={index}
                                      value={p.nama}
                                      className='capitalize'
                                    >
                                      {p.nama}
                                    </option>
                                  );
                                })}
                          </select>
                        </div>
                      )}
                      {props.jenisReten === 'PG101C' &&
                        props.pilihanFasiliti === 'kpbmpb' && (
                          <div className='px-3 py-1'>
                            <label
                              htmlFor='program'
                              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                            >
                              KPB / MPB
                            </label>
                            <select
                              required
                              name='program'
                              id='program'
                              value={props.pilihanKpbMpb}
                              onChange={(e) => {
                                props.setPilihanKpbMpb(e.target.value);
                              }}
                              className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                            >
                              <option value=''>Sila pilih..</option>
                              {props.kpbmpbData.map((km, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={km.nama}
                                    className='capitalize'
                                  >
                                    {km.nama}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                    </div>
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      (props.jenisReten === 'PG206' ||
                        props.jenisReten === 'PG207') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='klinik'>Klinik</option>
                            <option value='individu'>Individu</option>
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      props.jenisReten === 'PG206' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData
                              .filter((i) => i.statusPegawai === 'jp')
                              .map((i, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={
                                      i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                    }
                                    className='capitalize'
                                  >
                                    {i.nama}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      props.jenisReten === 'PG207' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData
                              .filter((i) => i.statusPegawai === 'pp')
                              .map((i, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={
                                      i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                    }
                                    className='capitalize'
                                  >
                                    {i.nama}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      (props.jenisReten === 'PGPRO01' ||
                        props.jenisReten === 'PGPRO01Combined') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='klinik'>Klinik</option>
                            <option value='individu'>Individu</option>
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      (props.jenisReten === 'PGPRO01' ||
                        props.jenisReten === 'PGPRO01Combined') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData.map((i, index) => {
                              return (
                                <option
                                  key={index}
                                  value={
                                    i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                  }
                                  className='capitalize'
                                >
                                  {i.nama}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.generating ? (
                    <button
                      className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 transition-all col-start-2 lg:col-start-3 mt-3 cursor-not-allowed'
                      type='button'
                    >
                      <div className='flex flex-row items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-userWhite'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z'
                          ></path>
                        </svg>
                        <span>menjana...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 hover:bg-admin1 transition-all col-start-2 lg:col-start-3 mt-3'
                      type='submit'
                    >
                      jana
                    </button>
                  )}
                  <button
                    type='button'
                    className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 transition-all col-start-2 lg:col-start-3 mt-3'
                    onClick={noWayBack}
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const ModalGenerateBulanan = (props) => {
  const { toast, adminToken, loginInfo, Dictionary } =
    useGlobalAdminAppContext();

  const [bulan, setBulan] = useState('');

  const namaNamaBulan = {
    '01-01': 'JAN',
    '02-01': 'FEB',
    '03-01': 'MAC',
    '04-01': 'APR',
    '05-01': 'MEI',
    '06-01': 'JUN',
    '07-01': 'JUL',
    '08-01': 'OGOS',
    '09-01': 'SEP',
    '10-01': 'OKT',
    '11-01': 'NOV',
    '12-01': 'DIS',
  };

  const fileName = () => {
    let file = '';
    if (loginInfo.accountType === 'hqSuperadmin') {
      file = `${props.jenisReten}_${
        props.pilihanNegeri === 'all' ? 'MALAYSIA' : ''
      }${
        props.pilihanNegeri !== 'all' && props.pilihanDaerah === 'all'
          ? `${Dictionary[props.pilihanNegeri].toUpperCase()}`
          : ''
      }${
        props.pilihanNegeri !== 'all' && props.pilihanKlinik === 'all'
          ? `${props.pilihanDaerah.toUpperCase()}`
          : ''
      }${
        props.pilihanKlinik !== 'all' ? `${props.namaKlinik.toUpperCase()}` : ''
      }_${namaNamaBulan[bulan]}_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
      return file;
    }
    if (props.pilihanKkia !== '') {
      file = `${
        props.jenisReten
      }_${props.namaKlinik.toUpperCase()}_${props.namaKkia
        .split(' | ')[1]
        .toUpperCase()}_${namaNamaBulan[bulan]}_${moment(new Date()).format(
        'DDMMYYYY'
      )}.xlsx`;
    }
    if (props.pilihanProgram !== '') {
      file = `${
        props.jenisReten
      }_${props.namaKlinik.toUpperCase()}_${props.pilihanProgram.toUpperCase()}_${
        namaNamaBulan[bulan]
      }_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
    }
    if (props.pilihanKpbMpb !== '') {
      file = `${props.jenisReten}_${props.pilihanKpbMpb}_${
        namaNamaBulan[bulan]
      }_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
    }
    if (
      props.pilihanDaerah !== 'all' &&
      props.pilihanKlinik !== 'all' &&
      props.pilihanKkia === '' &&
      props.pilihanProgram === '' &&
      props.pilihanKpbMpb === ''
    ) {
      file = `${props.jenisReten}_${props.namaKlinik.toUpperCase()}_${
        namaNamaBulan[bulan]
      }_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
    }
    if (props.pilihanDaerah !== 'all' && props.pilihanKlinik === 'all') {
      file = `${props.jenisReten}_${props.pilihanDaerah.toUpperCase()}_${
        namaNamaBulan[bulan]
      }_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
    }
    if (props.pilihanDaerah === 'all') {
      file = `${props.jenisReten}_${loginInfo.negeri.toUpperCase()}_${
        namaNamaBulan[bulan]
      }_${moment(new Date()).format('DDMMYYYY')}.xlsx`;
    }
    return file;
  };

  const saveFile = (blob) => {
    const link = document.createElement('a');
    link.download = fileName();
    link.href = URL.createObjectURL(new Blob([blob]));
    link.addEventListener('click', (e) => {
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
    });
    link.click();
  };

  const penjanaanReten = async (e) => {
    try {
      const res = await axios.get(
        `/api/v1/generate/download?jenisReten=${props.jenisReten}&negeri=${
          loginInfo.accountType === 'hqSuperadmin'
            ? Dictionary[props.pilihanNegeri]
            : loginInfo.negeri
        }&daerah=${props.pilihanDaerah}&klinik=${props.pilihanKlinik}${
          props.pilihanFasiliti === 'kkiakd'
            ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanKkia=${props.pilihanKkia}`
            : ''
        }${
          props.pilihanFasiliti === 'program'
            ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanProgram=${props.pilihanProgram}`
            : ''
        }${
          props.pilihanFasiliti === 'kpbmpb'
            ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanKpbMpb=${props.pilihanKpbMpb}`
            : ''
        }${
          props.pilihanFasiliti === 'individu'
            ? `&pilihanFasiliti=${props.pilihanFasiliti}&pilihanIndividu=${props.pilihanIndividu}`
            : ''
        }&bulan=${new Date().getFullYear()}-${bulan}&fromEtl=true`,
        {
          headers: {
            Authorization: adminToken,
          },
          responseType: 'blob',
        }
      );
      return res;
    } catch (err) {
      switch (err.response.status) {
        case 401:
          toast.error(
            `Anda telah mencapai jumlah batasan penjanaan ${props.jenisReten} bagi bulan ini`
          );
          break;
        case 403:
          toast.error('Anda tidak dibenarkan untuk menjana reten');
          break;
        case 404:
          toast.error(
            'Maklumat bagi bulan yang anda pilih belum ada. Sila gunakan penjanaan mengikut tarikh'
          );
          break;
        case 0:
          toast.error('Network error');
          break;
        default:
          toast.error('Something wrong happened');
          break;
      }
    }
  };

  const handleJana = async (e) => {
    e.preventDefault();
    if (props.pilihanFasiliti === 'individu') {
      return toast.error(
        'Harap maaf, fungsi penjanaan individu bulanan belum tersedia. Sila gunakan penjanaan mengikut tarikh'
      );
    }
    props.setGenerating(true);
    props.setGeneratingNoWayBack(true);
    const id = toast.loading('Sedang menjana reten...');
    setTimeout(async () => {
      await penjanaanReten()
        .then((res) => {
          saveFile(res.data);
        })
        .then(() => {
          toast.update(id, {
            render: 'Berjaya menjana reten',
            type: 'success',
            isLoading: false,
            autoClose: 2000,
          });
          props.setGeneratingNoWayBack(false);
          setTimeout(() => {
            props.setGenerating(false);
          }, 3000);
          props.setOpenModalGenerateBulanan(false);
          props.setOpenModalGenerateAdHoc(false);
        })
        .catch((err) => {
          toast.dismiss(id);
          props.setGenerating(false);
          props.setGeneratingNoWayBack(false);
        });
    }, 3000);
  };

  const noWayBack = () => {
    if (props.generatingNoWayBack) {
      toast.warning('Sila sabar menunggu...', {
        autoClose: 2000,
        pauseOnHover: false,
      });
      return;
    }
    if (!props.generatingNoWayBack) {
      props.setOpenModalGenerateBulanan(false);
    }
  };

  return (
    <>
      <form onSubmit={handleJana}>
        <div
          className='absolute inset-0 bg-user1 z-0 opacity-75'
          onClick={noWayBack}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>
                Penjanaan Reten {props.jenisReten}
              </h5>
            </div>
            <span className={styles.closeBtn} onClick={noWayBack}>
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='grid grid-flow-row'>
                  <div className='px-3 py-1'>
                    {props.jenisReten === 'MASA' ? (
                      <div className='grid grid-row-2 gap-2 p-2 normal-case'>
                        Penjanaan PIAGAM MASA mengikut bulan adalah maklumat
                        SATU TAHUN setakat yang dikira pada 7 haribulan bulan
                        berikutnya
                      </div>
                    ) : null}
                    <label
                      htmlFor='bulan'
                      className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                    >
                      Sila pilih bulan
                    </label>
                    <select
                      required
                      name='bulan'
                      id='bulan'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      onChange={(e) => {
                        setBulan(e.target.value);
                      }}
                    >
                      <option value=''>Sila pilih bulan</option>
                      <option value='01-01'>Januari</option>
                      <option value='02-01'>Februari</option>
                      <option value='03-01'>Mac</option>
                      <option value='04-01'>April</option>
                      <option value='05-01'>Mei</option>
                      <option value='06-01'>Jun</option>
                      <option value='07-01'>Julai</option>
                      <option value='08-01'>Ogos</option>
                      <option value='09-01'>September</option>
                      <option value='10-01'>Oktober</option>
                      <option value='11-01'>November</option>
                      <option value='12-01'>Disember</option>
                    </select>
                  </div>
                </div>
                <div className='mb-3'>
                  <div className='grid gap-1'>
                    {loginInfo.accountType === 'hqSuperadmin' ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='negeri'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Negeri:
                        </label>
                        <select
                          required
                          name='negeri'
                          id='negeri'
                          value={props.pilihanNegeri}
                          onChange={(e) => props.handlePilihNegeri(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>Semua Negeri</option>
                          {props.negeri.map((n, index) => {
                            return (
                              <option
                                value={n.username}
                                key={index}
                                className='capitalize'
                              >
                                {n.negeri}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    {loginInfo.accountType === 'negeriSuperadmin' ||
                    props.daerah.length > 0 ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='daerah'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Daerah:
                        </label>
                        <select
                          required
                          name='daerah'
                          id='daerah'
                          value={props.pilihanDaerah}
                          onChange={(e) => props.handlePilihDaerah(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent capitalize'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>
                            Semua daerah (Jana Negeri)
                          </option>
                          {props.daerah.map((d, index) => {
                            return (
                              <option
                                value={d.daerah}
                                key={index}
                                className='capitalize'
                              >
                                {d.daerah}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    {loginInfo.accountType === 'daerahSuperadmin' ||
                    (props.pilihanDaerah !== '' &&
                      props.pilihanDaerah !== 'all') ? (
                      <div className='px-3 py-1'>
                        <label
                          htmlFor='klinik'
                          className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                        >
                          Klinik:
                        </label>
                        <select
                          required
                          name='klinik'
                          id='klinik'
                          value={props.pilihanKlinik}
                          onChange={(e) => props.handlePilihKlinik(e)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        >
                          <option value=''>Sila pilih..</option>
                          <option value='all'>
                            Semua klinik (Jana Daerah)
                          </option>
                          {props.klinik.map((k, index) => {
                            return (
                              <option
                                key={index}
                                data-key={k.kp}
                                value={k.kodFasiliti}
                                className='capitalize'
                              >
                                {k.kp}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ) : null}
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      props.jenisReten === 'PG101A' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetKkia(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='klinik'>Klinik</option>
                            <option value='kkiakd'>KKIA / KD</option>
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'kkiakd' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            KKIA / KD
                          </label>
                          <select
                            required
                            name='kkia'
                            id='kkia'
                            value={props.pilihanKkia}
                            onChange={(e) => {
                              props.setPilihanKkia(e.target.value);
                              props.setNamaKkia(
                                e.target.options[
                                  e.target.selectedIndex
                                ].getAttribute('data-key')
                              );
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.kkiaData.map((k, index) => {
                              return (
                                <option
                                  key={index}
                                  data-key={k.nama}
                                  value={k.kodKkiaKd}
                                  className='capitalize'
                                >
                                  {k.nama}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      props.jenisReten === 'PG101C' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetProgramEnKPBMPB(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='program'>Program</option>
                            <option value='kpbmpb'>KPB / MPB</option>
                          </select>
                        </div>
                      ) : null}
                      {props.jenisReten === 'PG101C' &&
                        props.pilihanFasiliti === 'program' && (
                          <div className='px-3 py-1'>
                            <label
                              htmlFor='program'
                              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                            >
                              Program
                            </label>
                            <select
                              required
                              name='program'
                              id='program'
                              value={props.pilihanProgram}
                              onChange={(e) => {
                                props.setPilihanProgram(e.target.value);
                              }}
                              className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                            >
                              <option value=''>Sila pilih..</option>
                              {props.programData.map((p, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={p.nama}
                                    className='capitalize'
                                  >
                                    {p.nama}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                      {props.jenisReten === 'PG101C' &&
                        props.pilihanFasiliti === 'kpbmpb' && (
                          <div className='px-3 py-1'>
                            <label
                              htmlFor='program'
                              className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                            >
                              KPB / MPB
                            </label>
                            <select
                              required
                              name='program'
                              id='program'
                              value={props.pilihanKpbMpb}
                              onChange={(e) => {
                                props.setPilihanKpbMpb(e.target.value);
                              }}
                              className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                            >
                              <option value=''>Sila pilih..</option>
                              {props.kpbmpbData.map((km, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={km.nama}
                                    className='capitalize'
                                  >
                                    {km.nama}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                    </div>
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      (props.jenisReten === 'PG206' ||
                        props.jenisReten === 'PG207') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='klinik'>Klinik</option>
                            <option value='individu'>Individu</option>
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      props.jenisReten === 'PG206' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData
                              .filter((i) => i.statusPegawai === 'jp')
                              .map((i, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={
                                      i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                    }
                                    className='capitalize'
                                  >
                                    {i.nama}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      props.jenisReten === 'PG207' ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData
                              .filter((i) => i.statusPegawai === 'pp')
                              .map((i, index) => {
                                return (
                                  <option
                                    key={index}
                                    value={
                                      i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                    }
                                    className='capitalize'
                                  >
                                    {i.nama}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      {props.pilihanKlinik !== '' &&
                      props.pilihanKlinik !== 'all' &&
                      props.pilihanDaerah !== 'all' &&
                      (props.jenisReten === 'PGPRO01' ||
                        props.jenisReten === 'PGPRO01Combined') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='factype'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Fasiliti
                          </label>
                          <select
                            required
                            name='factype'
                            id='factype'
                            onChange={(e) => {
                              props.handleGetIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            <option value='klinik'>Klinik</option>
                            <option value='individu'>Individu</option>
                          </select>
                        </div>
                      ) : null}
                      {props.pilihanFasiliti === 'individu' &&
                      (props.jenisReten === 'PGPRO01' ||
                        props.jenisReten === 'PGPRO01Combined') ? (
                        <div className='px-3 py-1'>
                          <label
                            htmlFor='klinik'
                            className='text-sm font-semibold text-user1 flex flex-row items-center p-2'
                          >
                            Pegawai
                          </label>
                          <select
                            required
                            name='pegawai'
                            id='pegawai'
                            value={props.pilihanIndividu}
                            onChange={(e) => {
                              props.setPilihanIndividu(e.target.value);
                            }}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Sila pilih..</option>
                            {props.individuData.map((i, index) => {
                              return (
                                <option
                                  key={index}
                                  value={
                                    i.mdcNumber ? i.mdcNumber : i.mdtbNumber
                                  }
                                  className='capitalize'
                                >
                                  {i.nama}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.generating ? (
                    <button
                      className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 transition-all col-start-2 lg:col-start-3 mt-3 cursor-not-allowed'
                      type='button'
                    >
                      <div className='flex flex-row items-center'>
                        <svg
                          className='animate-spin -ml-1 mr-3 h-5 w-5 text-userWhite'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle
                            className='opacity-25'
                            cx='12'
                            cy='12'
                            r='10'
                            stroke='currentColor'
                            strokeWidth='4'
                          ></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z'
                          ></path>
                        </svg>
                        <span>menjana...</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 hover:bg-admin1 transition-all col-start-2 lg:col-start-3 mt-3'
                      type='submit'
                    >
                      jana
                    </button>
                  )}
                  <button
                    type='button'
                    className='capitalize bg-admin3 text-userWhite rounded-md shadow-xl px-3 py-2 mx-3 my-2 transition-all col-start-2 lg:col-start-3 mt-3'
                    onClick={noWayBack}
                  >
                    Kembali
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const Generate = (props) => {
  const {
    loginInfo,
    readNegeri,
    readDaerah,
    readKlinik,
    readSpesifikKkiaData,
    readSpesifikProgramData,
    readSpesifikKPBMPBData,
    readSpesifikIndividuData,
    readGenerateTokenData,
    readOndemandSetting,
    semuaJenisReten,
  } = useGlobalAdminAppContext();

  const init = useRef(false);

  const [currentUser, setCurrentUser] = useState('');

  const [openModalGenerateAdHoc, setOpenModalGenerateAdHoc] = useState(false);
  const [openModalGenerateBulanan, setOpenModalGenerateBulanan] =
    useState(false);
  const [jenisReten, setJenisReten] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingNoWayBack, setGeneratingNoWayBack] = useState(false);

  const [kkiaData, setKkiaData] = useState([]);
  const [programData, setProgramData] = useState([]);
  const [kpbmpbData, setKpbmpbData] = useState([]);
  const [individuData, setIndividuData] = useState([]);

  // nantilah itu
  const [pilihanSekolah, setPilihanSekolah] = useState('');
  const [allPersonSekolahs, setAllPersonSekolahs] = useState([]);
  const [namaSekolahs, setNamaSekolahs] = useState([]);

  const [statusToken, setStatusToken] = useState([]);
  const [statusReten, setStatusReten] = useState('');

  // masalah negara
  const [negeri, setNegeri] = useState([]);
  const [daerah, setDaerah] = useState([]);
  const [klinik, setKlinik] = useState([]);
  const [namaKlinik, setNamaKlinik] = useState('');
  const [namaKkia, setNamaKkia] = useState('');
  const [pilihanNegeri, setPilihanNegeri] = useState('');
  const [pilihanDaerah, setPilihanDaerah] = useState('');
  const [pilihanKlinik, setPilihanKlinik] = useState('');
  const [pilihanFasiliti, setPilihanFasiliti] = useState('');
  const [pilihanKkia, setPilihanKkia] = useState('');
  const [pilihanProgram, setPilihanProgram] = useState('');
  const [pilihanKpbMpb, setPilihanKpbMpb] = useState('');
  const [pilihanIndividu, setPilihanIndividu] = useState('');

  const pilihanRetenAdaProgram = [
    'DEWASAMUDA',
    'KOM-OAP',
    'KOM-OKU-PDK',
    'KOM-Komuniti',
    'KOM-Penjara',
    'KOM-WE',
    'KOM',
    'OAP',
    'PPR',
    'PPKPS',
    'PKAP2',
  ].includes(jenisReten);

  const handleGetKkia = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'klinik') {
      return;
    } else {
      await readSpesifikKkiaData(pilihanKlinik)
        .then((res) => {
          setKkiaData(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Sila cuba lagi');
        });
    }
  };

  const handleGetProgramEnKPBMPB = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'program') {
      await readSpesifikProgramData(pilihanKlinik)
        .then((res) => {
          setProgramData(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Sila cuba lagi');
        });
    } else if (e === 'kpbmpb') {
      await readSpesifikKPBMPBData(pilihanKlinik)
        .then((res) => {
          setKpbmpbData(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Sila cuba lagi');
        });
    }
  };

  const handleGetIndividu = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'klinik') {
      return;
    } else {
      await readSpesifikIndividuData(pilihanKlinik)
        .then((res) => {
          setIndividuData(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Sila cuba lagi');
        });
    }
  };

  // handling pilihan
  const handlePilihNegeri = (e) => {
    setPilihanNegeri(e.target.value);
    if (e.target.value === 'all') {
      setPilihanDaerah('all');
      setPilihanKlinik('all');
      return;
    }
    if (e.target.value === '') {
      setPilihanDaerah('');
      setPilihanKlinik('');
      setDaerah([]);
      setKlinik([]);
      resetPilihanBiasa();
      return;
    }
    resetPilihanBiasa();
    readDaerah(e.target.value).then((res) => {
      setDaerah(res.data);
    });
  };

  const handlePilihDaerah = (e) => {
    setPilihanDaerah(e.target.value);
    if (e.target.value === 'all') {
      setPilihanKlinik('all');
      return;
    }
    if (e.target.value === '') {
      setPilihanKlinik('');
      setNamaKlinik('');
      setKlinik([]);
      resetPilihanBiasa();
      return;
    }
    resetPilihanBiasa();
    readKlinik(e.target.value).then((res) => {
      setKlinik(res.data);
    });
  };

  const handlePilihKlinik = (e) => {
    setPilihanKlinik(e.target.value);
    if (e.target.value === 'all') {
      // console.log('all');
      if (pilihanRetenAdaProgram) {
        // console.log('setting program');
        setPilihanFasiliti('program');
      }
      return;
    }
    if (e.target.value === '') {
      setNamaKlinik('');
      resetPilihanBiasa();
      return;
    }
    if (e.target.value !== '' && e.target.value !== 'all') {
      // console.log('ada klinik');
      if (pilihanRetenAdaProgram) {
        // console.log('setting program');
        setPilihanFasiliti('program');
      }
      setNamaKlinik(
        e.target.options[e.target.selectedIndex].getAttribute('data-key')
      );
      return;
    }
    resetPilihanBiasa();
  };

  // reset the usual suspects
  const resetPilihanBiasa = () => {
    setPilihanFasiliti('');
    setPilihanKkia('');
    setPilihanProgram('');
    setPilihanKpbMpb('');
    setPilihanIndividu('');
  };

  // reset stuff
  useEffect(() => {
    setPilihanKkia('');
    setPilihanProgram('');
    setPilihanKpbMpb('');
    setPilihanIndividu('');
  }, [pilihanFasiliti]);

  // useEffect(() => {
  //   setPilihanFasiliti('');
  //   setPilihanKkia('');
  //   setPilihanProgram('');
  //   setPilihanKpbMpb('');
  //   setPilihanIndividu('');
  // }, [pilihanKlinik, pilihanDaerah, pilihanNegeri]);

  // useEffect(() => {
  //   setPilihanFasiliti('');
  //   setPilihanKkia('');
  //   setPilihanProgram('');
  //   setPilihanKpbMpb('');
  //   setPilihanIndividu('');
  // }, [pilihanDaerah]);

  useEffect(() => {
    if (loginInfo.accountType === 'hqSuperadmin') {
      setPilihanNegeri('');
    }
    if (
      loginInfo.accountType === 'hqSuperadmin' ||
      loginInfo.accountType === 'negeriSuperadmin'
    ) {
      setPilihanDaerah('');
    }
    setPilihanKlinik('');
    setPilihanFasiliti('');
    setPilihanKkia('');
    setPilihanProgram('');
    setPilihanKpbMpb('');
    setPilihanIndividu('');
    // refetch token after init.current = true
    if (init.current === true) {
      readGenerateTokenData()
        .then((res) => {
          setStatusToken(res.data);
        })
        .catch((err) => {
          console.log(err);
          setStatusToken([]);
        });
      readOndemandSetting().then((res) => {
        // console.log(res.data.currentOndemandSetting);
        setStatusReten(res.data.currentOndemandSetting);
      });
    }
  }, [openModalGenerateAdHoc, openModalGenerateBulanan]);

  useEffect(() => {
    async function initialize() {
      try {
        if (loginInfo.accountType === 'hqSuperadmin') {
          setCurrentUser('PKP KKM');
          const res = await readNegeri();
          setNegeri(res.data);
        }
        if (loginInfo.accountType === 'negeriSuperadmin') {
          setCurrentUser(`Negeri ${loginInfo.negeri}`);
          const res = await readDaerah(loginInfo.nama);
          setDaerah(res.data);
        }
        if (loginInfo.accountType === 'daerahSuperadmin') {
          setPilihanDaerah(loginInfo.daerah);
          setCurrentUser(`Daerah ${loginInfo.daerah}`);
          const res = await readKlinik(loginInfo.daerah);
          setKlinik(res.data);
        }
        const resToken = await readGenerateTokenData();
        setStatusToken(resToken.data);
        const resReten = await readOndemandSetting();
        setStatusReten(resReten.data.currentOndemandSetting);
      } catch (err) {
        console.log(err);
        setStatusToken([]);
      }
    }

    if (!init.current) {
      initialize();
      init.current = true;
    }
  }, []);

  const propsGenerate = {
    openModalGenerateAdHoc,
    setOpenModalGenerateAdHoc,
    openModalGenerateBulanan,
    setOpenModalGenerateBulanan,
    jenisReten,
    negeri,
    setNegeri,
    pilihanNegeri,
    setPilihanNegeri,
    daerah,
    setDaerah,
    pilihanDaerah,
    setPilihanDaerah,
    klinik,
    setKlinik,
    pilihanIndividu,
    setPilihanIndividu,
    pilihanProgram,
    setPilihanProgram,
    pilihanKpbMpb,
    setPilihanKpbMpb,
    pilihanFasiliti,
    setPilihanFasiliti,
    pilihanKkia,
    setPilihanKkia,
    namaKkia,
    setNamaKkia,
    namaKlinik,
    setNamaKlinik,
    pilihanKlinik,
    setPilihanKlinik,
    generating,
    setGenerating,
    generatingNoWayBack,
    setGeneratingNoWayBack,
    // handle pilih
    handlePilihNegeri,
    handlePilihDaerah,
    handlePilihKlinik,
    // trigger get data
    handleGetKkia,
    handleGetProgramEnKPBMPB,
    handleGetIndividu,
    // data
    kkiaData,
    programData,
    kpbmpbData,
    individuData,
  };

  return (
    <>
      <div className='h-full overflow-y-auto rounded-md'>
        <h1 className='font-bold text-lg text-user1 mb-2'>
          Penjanaan Laporan bagi {currentUser}
        </h1>
        <div className='flex flex-col items-center gap-1 normal-case'>
          <p>
            1. Penjanaan Laporan Mengikut Tarikh (secara adhoc) dihadkan kepada
            jumlah baki token yang tinggal (buat sementara waktu sahaja)
          </p>
          <p>
            2. Penjanaan Laporan Mengikut Bulan bagi bulan semasa boleh
            dilakukan pada 7 haribulan bulan seterusnya (tiada had)
          </p>
          <p>
            3. Token yang telah habis boleh direset semula dengan menghubungi
            meja bantuan
          </p>
        </div>
        <div className='flex flex-col items-center gap-5 mt-3'>
          <div className='m-auto overflow-x-auto text-sm rounded-md h-min max-w-max'>
            <table className='table-auto'>
              <thead className='text-adminWhite bg-admin3'>
                <tr>
                  <th className='px-3 py-1 outline outline-1 outline-offset-1'>
                    Bil.
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Nama Laporan
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Kod Reten
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1 w-56'>
                    <div className='border-b'>Jana Mengikut Tarikh</div>
                    <div className='grid grid-cols-2 items-center'>
                      <p className='flex flex-col items-center gap-1 text-center'>
                        Baki Token
                      </p>
                      <p className='flex flex-col items-center gap-1 text-center border-l'>
                        Jana
                      </p>
                    </div>
                  </th>
                  <th className='px-1 py-1 outline outline-1 outline-offset-1'>
                    Jana Mengikut Bulan
                  </th>
                </tr>
              </thead>
              <tbody className='bg-admin4'>
                {semuaJenisReten.map((jenis, index) => (
                  <>
                    <tr>
                      <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {index + 1}
                      </td>
                      <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1 text-start normal-case'>
                        <div className='ml-3 mr-1'>
                          {jenis.deskripsi}
                          <br />
                          {jenis.deskripsi2}
                        </div>
                      </td>
                      <td className='px-3 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {jenis.kod}
                      </td>
                      <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        <div className='grid grid-cols-2 items-center'>
                          <div className='flex flex-col py-3 items-center gap-1 text-center'>
                            {statusToken
                              ? statusToken.map((token) => {
                                  if (token.jenisReten === jenis.kodRingkas) {
                                    return token.jumlahToken !== undefined
                                      ? token.jumlahToken
                                      : 0;
                                  }
                                  return null;
                                })
                              : []}
                          </div>
                          <div className='flex flex-col py-3 items-center gap-1 text-center border-l border-l-adminWhite border-off'>
                            {loginInfo.accountType === 'hqSuperadmin' ||
                            (statusReten.janaTarikh &&
                              statusReten[jenis.kodRingkas]) ? (
                              <button
                                type='button'
                                className='px-2 py-1 mx-3 bg-admin1 text-adminWhite rounded-md hover:bg-admin3'
                                onClick={() => {
                                  setJenisReten(jenis.kodRingkas);
                                  setOpenModalGenerateAdHoc(true);
                                }}
                              >
                                Jana
                              </button>
                            ) : (
                              <span
                                className='text-admin2 text-5xl hover:cursor-not-allowed'
                                title='Penjanaan mengikut tarikh ditutup sementara'
                              >
                                <AiOutlineStop />
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        <div className='flex flex-col py-3 items-center gap-1 text-center border-l-adminWhite border-off'>
                          {loginInfo.accountType === 'hqSuperadmin' ||
                          (statusReten.janaBulan &&
                            statusReten[jenis.kodRingkas]) ? (
                            <button
                              type='button'
                              className='px-2 py-1 bg-admin1 text-adminWhite rounded-md hover:bg-admin3'
                              onClick={() => {
                                setJenisReten(jenis.kodRingkas);
                                setOpenModalGenerateAdHoc(false);
                                setOpenModalGenerateBulanan(true);
                              }}
                            >
                              Jana
                            </button>
                          ) : (
                            <span
                              className='text-admin2 text-5xl hover:cursor-not-allowed'
                              title='Penjanaan bulanan ditutup sementara'
                            >
                              <AiOutlineStop />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {openModalGenerateAdHoc && <ModalGenerateAdHoc {...propsGenerate} />}
        {openModalGenerateBulanan && (
          <ModalGenerateBulanan {...propsGenerate} />
        )}
      </div>
    </>
  );
};

export default Generate;
