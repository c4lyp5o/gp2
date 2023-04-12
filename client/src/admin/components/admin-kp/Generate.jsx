import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

import { useGlobalAdminAppContext } from '../../context/adminAppContext';

import { RiCloseLine } from 'react-icons/ri';
import styles from '../../Modal.module.css';

const ModalGenerateAdHoc = (props) => {
  const { toast, adminToken, masterDatePicker } = useGlobalAdminAppContext();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  //datepicker range
  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);

  const TarikhAwal = () => {
    return masterDatePicker({
      selected: startDatePicker,
      selectsStart: true,
      startDate: startDatePicker,
      endDate: endDatePicker,
      onChange: (startDate) => {
        setStartDate(moment(startDate).format('YYYY-MM-DD'));
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
        setEndDate(moment(endDate).format('YYYY-MM-DD'));
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
    if (props.pilihanKkia !== '') {
      file = `${
        props.jenisReten
      }_${props.namaKlinik.toUpperCase()}_${props.namaKkia
        .split(' | ')[1]
        .toUpperCase()}_${moment(new Date()).format('DDMMYYYY')}_token.xlsx`;
    }
    if (props.pilihanProgram !== '') {
      file = `${
        props.jenisReten
      }_${props.namaKlinik.toUpperCase()}_${props.pilihanProgram.toUpperCase()}_${moment(
        new Date()
      ).format('DDMMYYYY')}_token.xlsx`;
    }
    if (props.pilihanKpbMpb !== '') {
      file = `${props.jenisReten}_${props.pilihanKpbMpb}_${moment(
        new Date()
      ).format('DDMMYYYY')}_token.xlsx`;
    }
    if (
      props.pilihanKkia === '' &&
      props.pilihanProgram === '' &&
      props.pilihanKpbMpb === ''
    ) {
      file = `${props.jenisReten}_${props.namaKlinik.toUpperCase()}_${moment(
        new Date()
      ).format('DDMMYYYY')}_token.xlsx`;
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
        `/api/v1/generatekp/download?jenisReten=${props.jenisReten}&negeri=${
          props.loginInfo.negeri
        }&daerah=${props.loginInfo.daerah}&klinik=${
          props.loginInfo.kodFasiliti
        }${
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
        }&tarikhMula=${startDate}&tarikhAkhir=${endDate}&fromEtl=false`,
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
    setEndDate('');
    setEndDatePicker(null);
  }, [startDate]);

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
                    <div>
                      {props.jenisReten === 'PG101A' ? (
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
                      {props.jenisReten === 'PG101C' ? (
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
                      {props.jenisReten === 'PG206' ||
                      props.jenisReten === 'PG207' ? (
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
                      {props.jenisReten === 'PGPRO01' ||
                      props.jenisReten === 'PGPRO01Combined' ? (
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
                            stroke-width='4'
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
  const { toast, adminToken } = useGlobalAdminAppContext();

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
      props.pilihanKkia === '' &&
      props.pilihanProgram === '' &&
      props.pilihanKpbMpb === ''
    ) {
      file = `${props.jenisReten}_${props.namaKlinik.toUpperCase()}_${
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
        `/api/v1/generatekp/download?jenisReten=${props.jenisReten}&negeri=${
          props.loginInfo.negeri
        }&daerah=${props.loginInfo.daerah}&klinik=${
          props.loginInfo.kodFasiliti
        }${
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
                    <div>
                      {props.jenisReten === 'PG101A' ? (
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
                      {props.jenisReten === 'PG101A' &&
                      props.pilihanFasiliti === 'kkiakd' ? (
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
                      {props.jenisReten === 'PG101C' ? (
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
                      {props.jenisReten === 'PG206' ||
                      props.jenisReten === 'PG207' ? (
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
                      {props.jenisReten === 'PGPRO01' ||
                      props.jenisReten === 'PGPRO01Combined' ? (
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
                            stroke-width='4'
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
    readSpesifikKkiaDataForKp,
    readSpesifikProgramDataForKp,
    readSpesifikKPBMPBDataForKp,
    readSpesifikIndividuDataForKp,
    readGenerateTokenDataForKp,
    semuaJenisReten,
  } = useGlobalAdminAppContext();

  const init = useRef(false);

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
  const [kp, setKp] = useState('');

  const [statusToken, setStatusToken] = useState([]);

  // masalah negara
  const [namaKlinik, setNamaKlinik] = useState('');
  const [namaKkia, setNamaKkia] = useState('');
  const [pilihanFasiliti, setPilihanFasiliti] = useState('');
  const [pilihanKkia, setPilihanKkia] = useState('');
  const [pilihanProgram, setPilihanProgram] = useState('');
  const [pilihanKpbMpb, setPilihanKpbMpb] = useState('');
  const [pilihanIndividu, setPilihanIndividu] = useState('');

  const loginInfo = props.loginInfo;

  const handleGetKkia = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'klinik') {
      return;
    } else {
      await readSpesifikKkiaDataForKp(loginInfo.kodFasiliti)
        .then((res) => {
          setKkiaData(res.data);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: gkp-data-kkiakd'
          // );
        });
    }
  };

  const handleGetProgramEnKPBMPB = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'program') {
      await readSpesifikProgramDataForKp(loginInfo.kodFasiliti)
        .then((res) => {
          setProgramData(res.data);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: gkp-data-program'
          // );
        });
    } else if (e === 'kpbmpb') {
      await readSpesifikKPBMPBDataForKp(loginInfo.kodFasiliti)
        .then((res) => {
          setKpbmpbData(res.data);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: gkp-data-kpbmpb'
          // );
        });
    }
  };

  const handleGetIndividu = async (e) => {
    setPilihanFasiliti(e);
    if (e === 'klinik') {
      return;
    } else {
      await readSpesifikIndividuDataForKp(loginInfo.kodFasiliti)
        .then((res) => {
          setIndividuData(res.data);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: gkp-data-individu'
          // );
        });
    }
  };

  // reset stuff
  useEffect(() => {
    setPilihanKkia('');
    setPilihanProgram('');
    setPilihanKpbMpb('');
    setPilihanIndividu('');
  }, [pilihanFasiliti]);

  useEffect(() => {
    setPilihanFasiliti('');
    setPilihanKkia('');
    setPilihanProgram('');
    setPilihanKpbMpb('');
    setPilihanIndividu('');
    // refetch token after init.current = true
    if (init.current === true) {
      readGenerateTokenDataForKp()
        .then((res) => {
          setStatusToken(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [openModalGenerateAdHoc, openModalGenerateBulanan]);

  useEffect(() => {
    if (init.current === false) {
      setNamaKlinik(loginInfo.kp);
      readGenerateTokenDataForKp()
        .then((res) => {
          setStatusToken(res.data);
        })
        .catch((err) => {
          console.log(err);
          // toast.error(
          //   'Uh oh, server kita sedang mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: gkp-token'
          // );
        });
    }
    init.current = true;
  }, []);

  const propsGenerate = {
    openModalGenerateAdHoc,
    setOpenModalGenerateAdHoc,
    openModalGenerateBulanan,
    setOpenModalGenerateBulanan,
    jenisReten,
    // selections
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
    generating,
    setGenerating,
    generatingNoWayBack,
    setGeneratingNoWayBack,
    // trigger get data
    handleGetKkia,
    handleGetProgramEnKPBMPB,
    handleGetIndividu,
    // data
    kkiaData,
    programData,
    kpbmpbData,
    individuData,
    loginInfo,
  };

  return (
    <>
      <div className='h-full overflow-y-auto rounded-md'>
        <h1 className='font-bold text-lg text-user1 mb-2'>
          Penjanaan Laporan bagi {loginInfo.kp}
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
                            {statusToken.map
                              ? statusToken.map((token) => {
                                  if (token.jenisReten === jenis.kodRingkas) {
                                    return token.jumlahToken !== undefined
                                      ? token.jumlahToken
                                      : 0;
                                  }
                                  return null;
                                })
                              : null}
                          </div>
                          <div className='flex flex-col py-3 items-center gap-1 text-center border-l border-l-adminWhite border-off'>
                            {import.meta.env.VITE_JANA !== 'OFF' ? (
                              <button
                                type='button'
                                className='px-2 py-1 mx-3 bg-admin1 text-adminWhite rounded-md hover:bg-admin3'
                                onClick={() => {
                                  setJenisReten(jenis.kodRingkas);
                                  setOpenModalGenerateBulanan(false);
                                  setOpenModalGenerateAdHoc(true);
                                }}
                              >
                                Jana
                              </button>
                            ) : (
                              <span>Fungsi jana ditutup sementara</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className='px-1 py-1 outline outline-1 outline-adminWhite outline-offset-1'>
                        {import.meta.env.VITE_JANA !== 'OFF' ? (
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
                          <span className='p-3'>
                            Fungsi jana ditutup sementara
                          </span>
                        )}
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
