import { useState, useEffect } from 'react';
import { SubmitButton, BusyButton } from './Buttons';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import { useMiscData } from '../context/useMiscData';
import { useLogininfo } from '../context/useLogininfo';
import { useDictionary } from '../context/useDictionary';

import moment from 'moment';

import { RiCloseLine } from 'react-icons/ri';
import { BiSearchAlt } from 'react-icons/bi';
import styles from '../Modal.module.css';

const StartDate = (props) => {
  const { masterDatePicker } = useGlobalAdminAppContext();
  return masterDatePicker({
    selected: props.startDateDP,
    selectsStart: true,
    startDate: props.startDateDP,
    endDate: props.endDateDP,
    required: true,
    onChange: (date) => {
      const tempDate = moment(date).format('YYYY-MM-DD');
      props.setStartDateDP(date);
      props.setEditedEntity({ ...props.editedEntity, tarikhStart: tempDate });
    },
    className:
      'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
  });
};

const EndDate = (props) => {
  const { masterDatePicker } = useGlobalAdminAppContext();
  return masterDatePicker({
    selected: props.endDateDP,
    selectsEnd: true,
    startDate: props.startDateDP,
    endDate: props.endDateDP,
    minDate: props.startDateDP,
    required: true,
    onChange: (date) => {
      const tempDate = moment(date).format('YYYY-MM-DD');
      props.setEndDateDP(date);
      props.setEditedEntity({ ...props.editedEntity, tarikhEnd: tempDate });
    },
    className:
      'appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent',
  });
};

// sub program punya hal mmg buat hal lah
const pilihanSubProgramPKAP = [
  {
    sub: 'oap',
    nama: 'Program Orang Asli dan Penan',
  },
  {
    sub: 'ppr',
    nama: 'Program Perumahan Rakyat',
  },
  {
    sub: 'hrc',
    nama: 'Komuniti Berisiko Tinggi',
  },
];

const pilihanSubProgram2 = [
  {
    sub: 'kampungAngkatPergigian',
    nama: 'Program Kampung Angkat Pergigian',
  },
  {
    sub: 'hrc',
    nama: 'Komuniti Berisiko Tinggi',
  },
];

const pilihanSubProgram3 = [
  {
    sub: 'hrc',
    nama: 'Komuniti Berisiko Tinggi',
  },
];

const PasukanPergigianBergerakSelector = (props) => {
  return (
    <div className='grid grid-cols-2 py-1'>
      <div className='grid grid-cols-[3fr_1fr]'>
        <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
        <input
          type='checkbox'
          name='mod'
          value='ppb'
          checked={
            props.editedEntity.modPenyampaianPerkhidmatan
              ? props.editedEntity.modPenyampaianPerkhidmatan.includes('ppb')
              : false
          }
          onChange={(e) => {
            props.eventModeChecker(e.target.value);
          }}
          className='w-5 h-5'
        />
      </div>
    </div>
  );
};

const KlinikPergigianBergerakSelector = (props) => {
  const { readDataForKp } = useGlobalAdminAppContext();

  const [showKpb, setShowKpb] = useState(false);
  const [showKpb2, setShowKpb2] = useState(false);
  const [showKpb3, setShowKpb3] = useState(false);
  const [kpb, setKpb] = useState([]);

  useEffect(() => {
    readDataForKp('kpb-all').then((res) => {
      setKpb(res.data);
    });
    if (props.editedEntity.penggunaanKpb !== 'NOT APPLICABLE') {
      setShowKpb(true);
    }
    return () => {
      setShowKpb(false);
    };
  }, []);

  return (
    <div className='grid grid-cols-2 py-1'>
      <div className='grid grid-cols-[3fr_1fr]'>
        <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
        <input
          id='modKpb'
          type='checkbox'
          value='kpb'
          checked={
            props.editedEntity.modPenyampaianPerkhidmatan
              ? props.editedEntity.modPenyampaianPerkhidmatan.includes('kpb')
              : false
          }
          onChange={(e) => {
            props.eventModeChecker(e.target.value);
            setShowKpb(!showKpb);
          }}
          className='w-5 h-5'
        />
      </div>
      {showKpb ? (
        <div className='grid gap-1 w-full'>
          <div className='flex flex-row'>
            <select
              id='kpb'
              className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={props.editedEntity.penggunaanKpb}
              onChange={(e) => {
                props.setEditedEntity({
                  ...props.editedEntity,
                  penggunaanKpb: e.target.value,
                });
              }}
            >
              <option value='NOT APPLICABLE'>Pilih KPB</option>
              {kpb
                .filter(
                  (k) =>
                    ![
                      props.editedEntity.penggunaanKpb2,
                      props.editedEntity.penggunaanKpb3,
                    ].includes(k.nama)
                )
                .map((item) => (
                  <option value={item.nama}>
                    {item.createdByDaerah} | {item.subJenisKPBMPB} | {item.nama}
                  </option>
                ))}
            </select>
            {showKpb3 === false ? (
              <span
                className={` ${
                  showKpb2 ? 'px-2.5 py-1' : 'px-2 py-1'
                } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                onClick={() => {
                  setShowKpb2(!showKpb2);
                }}
              >
                {showKpb2 ? '-' : '+'}
              </span>
            ) : (
              <span className='px-2.5 py-1 bg-admin4 font-bold text-userWhite text-xs rounded-full'>
                -
              </span>
            )}
          </div>
          {showKpb2 ? (
            <div className='flex flex-row'>
              <select
                id='kpb2'
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={props.editedEntity.penggunaanKpb2}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    penggunaanKpb2: e.target.value,
                  });
                }}
              >
                <option value='NOT APPLICABLE'>Pilih KPB</option>
                {kpb
                  .filter(
                    (k) =>
                      ![
                        props.editedEntity.penggunaanKpb,
                        props.editedEntity.penggunaanKpb3,
                      ].includes(k.nama)
                  )
                  .map((item) => (
                    <option value={item.nama}>
                      {item.createdByDaerah} | {item.subJenisKPBMPB} |{' '}
                      {item.nama}
                    </option>
                  ))}
              </select>
              <span
                className={`${
                  showKpb3 ? 'px-2.5 py-1' : 'px-2 py-1'
                } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                onClick={() => {
                  setShowKpb3(!showKpb3);
                }}
              >
                {showKpb3 ? '-' : '+'}
              </span>
            </div>
          ) : null}
          {showKpb3 ? (
            <div className='flex flex-row'>
              <select
                id='kpb3'
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={props.editedEntity.penggunaanKpb3}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    penggunaanKpb3: e.target.value,
                  });
                }}
              >
                <option value='NOT APPLICABLE'>Pilih KPB</option>
                {kpb
                  .filter(
                    (k) =>
                      ![
                        props.editedEntity.penggunaanKpb2,
                        props.editedEntity.penggunaanKpb,
                      ].includes(k.nama)
                  )
                  .map((item) => (
                    <option value={item.nama}>
                      {item.createdByDaerah} | {item.subJenisKPBMPB} |{' '}
                      {item.nama}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

const MakmalPergigianBergerakSelector = (props) => {
  const { readDataForKp } = useGlobalAdminAppContext();

  const [showMpb, setShowMpb] = useState(false);
  const [showMpb2, setShowMpb2] = useState(false);
  const [showMpb3, setShowMpb3] = useState(false);
  const [mpb, setMpb] = useState([]);

  useEffect(() => {
    readDataForKp('mpb-all').then((res) => {
      setMpb(res.data);
    });
    if (props.editedEntity.penggunaanMpb !== 'NOT APPLICABLE') {
      setShowMpb(true);
    }
    return () => {
      setShowMpb(false);
    };
  }, []);

  return (
    <div className='grid grid-cols-2 py-1'>
      <div className='grid grid-cols-[3fr_1fr]'>
        <label for='modMpb'>Makmal Pergigian Bergerak</label>
        <input
          id='modMpb'
          type='checkbox'
          value='mpb'
          checked={
            props.editedEntity.modPenyampaianPerkhidmatan
              ? props.editedEntity.modPenyampaianPerkhidmatan.includes('mpb')
              : false
          }
          onChange={(e) => {
            props.eventModeChecker(e.target.value);
            setShowMpb(!showMpb);
          }}
          className='w-5 h-5'
        />
      </div>
      {showMpb ? (
        <div className='grid gap-1 w-full'>
          <div className='flex flex-row'>
            <select
              id='mpb'
              className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              value={props.editedEntity.penggunaanMpb}
              onChange={(e) => {
                props.setEditedEntity({
                  ...props.editedEntity,
                  penggunaanMpb: e.target.value,
                });
              }}
            >
              <option value='NOT APPLICABLE'>Pilih MPB</option>
              {mpb
                .filter(
                  (k) =>
                    ![
                      props.editedEntity.penggunaanMpb2,
                      props.editedEntity.penggunaanMpb3,
                    ].includes(k.nama)
                )
                .map((item) => (
                  <option value={item.nama}>
                    {item.createdByDaerah} | {item.subJenisKPBMPB} | {item.nama}
                  </option>
                ))}
            </select>
            {showMpb3 === false ? (
              <span
                className={`${
                  showMpb2 ? 'px-2.5 py-1' : 'px-2 py-1'
                } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                onClick={() => {
                  setShowMpb2(!showMpb2);
                }}
              >
                {showMpb2 ? '-' : '+'}
              </span>
            ) : (
              <span className='px-2.5 py-1 bg-admin4 font-bold text-userWhite text-xs rounded-full'>
                -
              </span>
            )}
          </div>
          {showMpb2 ? (
            <div className='flex flex-row'>
              <select
                id='mpb2'
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={props.editedEntity.penggunaanMpb2}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    penggunaanMpb2: e.target.value,
                  });
                }}
              >
                <option value='NOT APPLICABLE'>Pilih MPB</option>
                {mpb
                  .filter(
                    (k) =>
                      ![
                        props.editedEntity.penggunaanMpb,
                        props.editedEntity.penggunaanMpb3,
                      ].includes(k.nama)
                  )
                  .map((item) => (
                    <option value={item.nama}>
                      {item.createdByDaerah} | {item.subJenisKPBMPB} |{' '}
                      {item.nama}
                    </option>
                  ))}
              </select>
              <span
                className={`${
                  showMpb3 ? 'px-2.5 py-1' : 'px-2 py-1'
                } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                onClick={() => {
                  setShowMpb3(!showMpb3);
                }}
              >
                {showMpb3 ? '-' : '+'}
              </span>
            </div>
          ) : null}
          {showMpb3 ? (
            <div className='flex flex-row'>
              <select
                id='mpb3'
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                value={props.editedEntity.penggunaanMpb3}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    penggunaanMpb3: e.target.value,
                  });
                }}
              >
                <option value='NOT APPLICABLE'>Pilih MPB</option>
                {mpb
                  .filter(
                    (k) =>
                      ![
                        props.editedEntity.penggunaanKpb2,
                        props.editedEntity.penggunaanKpb,
                      ].includes(k.nama)
                  )
                  .map((item) => (
                    <option value={item.nama}>
                      {item.createdByDaerah} | {item.subJenisKPBMPB} |{' '}
                      {item.nama}
                    </option>
                  ))}
              </select>
            </div>
          ) : null}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

const SubProgramSelector = (props) => {
  const [showSubProgram2, setShowSubProgram2] = useState(false);
  const [showSubProgram3, setShowSubProgram3] = useState(false);

  const handleSubProgramChange = (index, value) => {
    const subProgram = [
      ...(props.editedEntity.subProgram ? props.editedEntity.subProgram : []),
    ];
    subProgram[index] = value;
    props.setEditedEntity({
      ...props.editedEntity,
      subProgram,
    });
  };

  const renderSubProgramOptions = () => {
    switch (props.editedEntity.jenisEvent) {
      case 'kampungAngkatPergigian':
        return pilihanSubProgramPKAP.map((item) => (
          <option key={item.sub} value={item.sub}>
            {item.nama}
          </option>
        ));
      case 'ppr':
      case 'oap':
        return pilihanSubProgram2.map((item) => (
          <option key={item.sub} value={item.sub}>
            {item.nama}
          </option>
        ));
      case 'projek-komuniti':
      case 'penjara-koreksional':
      case 'fds':
        return pilihanSubProgram3.map((item) => (
          <option key={item.sub} value={item.sub}>
            {item.nama}
          </option>
        ));
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      props.editedEntity.subProgram &&
      props.editedEntity.subProgram.length > 0
    ) {
      props.setShowSubProgram(true);
    }
  }, [props.editedEntity.subProgram]);

  return (
    <>
      {![
        'programDewasaMuda',
        'we',
        'oku',
        'ppkps',
        'rtc-tunjung',
        'isn',
      ].includes(props.editedEntity.jenisEvent) && (
        <div className='grid grid-cols-2 py-1'>
          <div className='grid grid-cols-[3fr_1fr]'>
            <label for='subProgramPicker'>Sub Program</label>
            <input
              id='subProgramPicker'
              type='checkbox'
              checked={props.showSubProgram}
              onChange={() => {
                props.setShowSubProgram(!props.showSubProgram);
                props.setEditedEntity({
                  ...props.editedEntity,
                  subProgram: [],
                });
              }}
              className='w-5 h-5'
            />
          </div>
          <div className='grid gap-1 w-full'>
            {props.showSubProgram && (
              <div className='flex flex-row'>
                <select
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  value={
                    props.editedEntity.subProgram
                      ? props.editedEntity.subProgram[0]
                      : ''
                  }
                  onChange={(e) => handleSubProgramChange(0, e.target.value)}
                >
                  <option value='NOT APPLICABLE'>
                    Sila pilih sub program...
                  </option>
                  {renderSubProgramOptions()}
                </select>
                {['ppr', 'oap', 'kampungAngkatPergigian'].includes(
                  props.editedEntity.jenisEvent
                ) && showSubProgram3 === false ? (
                  <span
                    className={` ${
                      showSubProgram2 ? 'px-2.5 py-1' : 'px-2 py-1'
                    } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                    onClick={() => {
                      setShowSubProgram2(!showSubProgram2);
                    }}
                  >
                    {showSubProgram2 ? '-' : '+'}
                  </span>
                ) : (
                  <span className='px-2.5 py-1 bg-admin4 font-bold text-userWhite text-xs rounded-full'>
                    -
                  </span>
                )}
              </div>
            )}
            {showSubProgram2 && (
              <div className='flex flex-row'>
                <select
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  value={
                    props.editedEntity.subProgram
                      ? props.editedEntity.subProgram[1]
                      : ''
                  }
                  onChange={(e) => handleSubProgramChange(1, e.target.value)}
                >
                  <option value='NOT APPLICABLE'>
                    Sila pilih sub program...
                  </option>
                  {['kampungAngkatPergigian', 'oap', 'ppr'].includes(
                    props.editedEntity.jenisEvent
                  ) &&
                    renderSubProgramOptions()
                      .filter(
                        (item) => item.key !== props.editedEntity.subProgram[0]
                      )
                      .map((item) => item)}
                </select>
                {['kampungAngkatPergigian'].includes(
                  props.editedEntity.jenisEvent
                ) && (
                  <span
                    className={` ${
                      showSubProgram3 ? 'px-2.5 py-1' : 'px-2 py-1'
                    } bg-admin4 font-bold text-userWhite text-xs rounded-full cursor-pointer hover:bg-admin3`}
                    onClick={() => {
                      setShowSubProgram3(!showSubProgram3);
                    }}
                  >
                    {showSubProgram3 ? '-' : '+'}
                  </span>
                )}
              </div>
            )}
            {showSubProgram3 && (
              <div className='flex flex-row'>
                <select
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  value={
                    props.editedEntity.subProgram
                      ? props.editedEntity.subProgram[2]
                      : ''
                  }
                  onChange={(e) => handleSubProgramChange(2, e.target.value)}
                >
                  <option value='NOT APPLICABLE'>
                    Sila pilih sub program...
                  </option>
                  {['kampungAngkatPergigian'].includes(
                    props.editedEntity.jenisEvent
                  ) &&
                    renderSubProgramOptions()
                      .filter(
                        (item) =>
                          item.key !== props.editedEntity.subProgram[0] &&
                          item.key !== props.editedEntity.subProgram[1]
                      )
                      .map((item) => item)}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
// sub program punya hal mmg buat hal lah

export function NothingToBeAdded(props) {
  return (
    <>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowAddModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalAdd}>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowAddModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='admin-pegawai-handler-container'>
              <div className='admin-pegawai-handler-input'>
                <div className='flex-wrap justify-center'>
                  Tiada {props.FType} untuk ditambah
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//
// MODALS UNTUK HQ/NEGERI/DAERAH SUPERADMIN
//

export function InputKlinik(props) {
  if (!props.klinik) {
    return <NothingToBeAdded {...props} />;
  }

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>Tambah Klinik Pergigian</h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Pilih Klinik
                <span className='text-admin3'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasilitiGiret === e.target.value
                  );
                  props.setName(selectedKlinik.nama);
                  props.setKodFasiliti(selectedKlinik.kodFasilitiGiret);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option key='0' value=''>
                  Pilih Klinik...
                </option>
                {props.klinik.map((k) => (
                  <option key={k.bil} value={k.kodFasilitiGiret}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='email'
              >
                Emel
                <span className='text-admin3'>*</span>
              </label>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                type='text'
                onChange={(e) => props.setEmail(e.target.value.toLowerCase())}
              />
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Peranan Klinik Pergigian
                <span className='text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-4 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='kepp'
                >
                  <input
                    required
                    className='form-checkbox text-user3'
                    type='radio'
                    id='role'
                    name='perananKlinikPergigian'
                    value='kepp'
                    onChange={(e) =>
                      props.setRole(e.target.value.toLowerCase())
                    }
                  />
                  <span className='ml-2'>KEPP</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='utc'
                >
                  <input
                    required
                    className='form-checkbox text-user2'
                    type='radio'
                    id='role'
                    name='perananKlinikPergigian'
                    value='utc'
                    onChange={(e) =>
                      props.setRole(e.target.value.toLowerCase())
                    }
                  />
                  <span className='ml-2'>UTC</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='rtc'
                >
                  <input
                    required
                    className='form-checkbox text-user2'
                    type='radio'
                    id='role'
                    name='perananKlinikPergigian'
                    value='rtc'
                    onChange={(e) => props.setRole(e.target.value)}
                  />
                  <span className='ml-2'>RTC</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='rtc'
                >
                  <input
                    required
                    className='form-checkbox text-user2'
                    type='radio'
                    id='role'
                    name='perananKlinikPergigian'
                    value='klinik'
                    onChange={(e) => props.setRole(e.target.value)}
                  />
                  <span className='ml-2'>Klinik Pergigian</span>
                </label>
              </div>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status Klinik Pergigian
                <span className='text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusactive'
                >
                  <input
                    required
                    className='form-checkbox text-user3'
                    type='radio'
                    id='statusactive'
                    name='statusKp'
                    value='active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusinactive'
                >
                  <input
                    required
                    className='form-checkbox text-user2'
                    type='radio'
                    id='statusinactive'
                    name='statusKp'
                    value='non-active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKkiakd(props) {
  if (!props.kkia) {
    return <NothingToBeAdded {...props} />;
  }

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>Tambah KKIA / KD</h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-admin4'
                htmlFor='info'
              >
                *Daerah pada senarai KKIA/KD adalah bukan mengikut daerah
                pentadbiran perkhidmatan pergigian
              </label>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Pilih KKIA / KD
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKkia = props.kkia.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setName(selectedKkia.nama);
                  props.setKodKkiaKd(selectedKkia.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih KKIA / KD</option>
                {props.kkia.map((k) => (
                  <option key={k.kodFasiliti} value={k.kodFasiliti}>
                    {k.nama} | di {k.daerah}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Klinik Bertugas{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setKp(selectedKlinik.kp);
                  props.setKodFasiliti(selectedKlinik.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status KKIA / KD{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusactive'
                >
                  <input
                    required
                    className='form-checkbox text-user3'
                    type='radio'
                    id='statusactive'
                    name='status'
                    value='active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusinactive'
                >
                  <input
                    required
                    className='form-checkbox text-user2'
                    type='radio'
                    id='statusinactive'
                    name='status'
                    value='non-active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputPegawai(props) {
  const { toast } = useGlobalAdminAppContext();
  const { readOperatorData } = useMiscData();
  const { Dictionary } = useDictionary();

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!props.carianNama) {
      toast.error(
        props.FType === 'pp'
          ? 'Sila isi nama pegawai'
          : 'Sila isi nama juruterapi pergigian'
      );
      return;
    }

    props.setSearching(true);
    props.setNoPpJp('');
    props.setAllPegawai([]);

    const res = await readOperatorData(props.FType, props.carianNama);

    if (res) {
      if (props.FType === 'pp') {
        props.setAllPegawai(res);
      } else if (props.FType === 'jp') {
        props.setAllJp(res);
      }
    }

    if (!res) {
      props.setNoPpJp(
        props.FType === 'pp'
          ? 'Tiada pegawai dijumpai'
          : 'Tiada juruterapi pergigian dijumpai'
      );
    }

    props.setSearching(false);
  };

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Tambah {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='grid gap-1 mb-3'>
              <div className='px-3 py-1'>
                {props.FType === 'pp' && (
                  <>
                    <div className='grid gap-1 mt-2'>
                      <label className='block mb-2 text-sm font-medium text-adminBlack'>
                        Cari
                      </label>
                      <div className='relative'>
                        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                          <BiSearchAlt />
                        </div>
                        <input
                          value={props.carianNama}
                          type='search'
                          className='w-full rounded-md border-2 pl-8 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                          placeholder='Cari pegawai pergigian...'
                          onChange={(e) => {
                            props.setCarianNama(e.target.value);
                          }}
                        />
                      </div>
                      <button
                        type='button'
                        className='block mb-2 px-2 py-1 text-white bg-admin3 hover:bg-admin4 rounded-lg text-sm mt-2'
                        onClick={(e) => handleSearch(e)}
                      >
                        Cari
                      </button>
                      {props.allPegawai.length > 0 ? (
                        <select
                          required
                          onChange={(e) => {
                            const selectedPp = props.allPegawai.find(
                              (p) => p.mdcNumber === parseInt(e.target.value)
                            );
                            props.setName(selectedPp.nama);
                            props.setRegNumber(selectedPp.mdcNumber);
                          }}
                          className='block mb-2 w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                        >
                          <option key='no-value' value=''>
                            Pilih Pegawai...
                          </option>
                          {props.allPegawai.map((p) => (
                            <option className='capitalize' value={p.mdcNumber}>
                              {p.nama} | MDC {p.mdcNumber}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{props.noPpJp}</span>
                      )}
                    </div>
                  </>
                )}
                {props.FType === 'jp' && (
                  <div className='grid gap-1 mt-2'>
                    <label
                      className='block mb-2 text-sm font-medium text-adminBlack'
                      htmlFor='default-search'
                    >
                      Cari
                    </label>
                    <div className='relative'>
                      <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <BiSearchAlt />
                      </div>
                      <input
                        value={props.carianNama}
                        type='search'
                        className='block w-full rounded-md border-2 pl-8 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                        placeholder='Cari juruterapi pergigian...'
                        onChange={(e) => {
                          props.setCarianNama(e.target.value);
                        }}
                      />
                      {props.searching === false ? (
                        <button
                          type='button'
                          className='text-white absolute right-1 bottom-1 bg-admin3 hover:bg-admin4 font-medium rounded-lg text-sm px-4 py-1'
                          onClick={(e) => handleSearch(e)}
                        >
                          Cari
                        </button>
                      ) : (
                        <>
                          <button
                            type='button'
                            className='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                            disabled={true}
                          >
                            <svg
                              className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              ></path>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                    {props.allJp.length > 0 ? (
                      <select
                        required
                        onChange={(e) => {
                          const selectedJp = props.allJp.find(
                            (p) => p.mdtbNumber === e.target.value
                          );
                          props.setName(selectedJp.nama);
                          props.setRegNumber(selectedJp.mdtbNumber);
                        }}
                        className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                      >
                        <option key='no-value' value=''>
                          Pilih Juruterapi Pergigian...
                        </option>
                        {props.allJp.map((p) => (
                          <option className='capitalize' value={p.mdtbNumber}>
                            {p.nama} | {p.mdtbNumber}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{props.noPpJp}</span>
                    )}
                  </div>
                )}
              </div>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Emel{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <input
                    required
                    className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                    type='text'
                    onChange={(e) => props.setEmail(e.target.value)}
                  />
                </div>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Gred{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  {props.FType === 'pp' && (
                    <select
                      required
                      onChange={(e) => props.setGred(e.target.value)}
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                    >
                      <option value=''>Pilih Gred</option>
                      <option value='jusa'>JUSA</option>
                      <option value='ug56'>UG56</option>
                      <option value='ug54'>UG54</option>
                      <option value='ug52'>UG52</option>
                      <option value='ug48'>UG48</option>
                      <option value='ug44'>UG44</option>
                      <option value='ug41'>UG41</option>
                    </select>
                  )}
                  {props.FType === 'jp' && (
                    <select
                      required
                      onChange={(e) => props.setGred(e.target.value)}
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                    >
                      <option value=''>Pilih Gred</option>
                      <option value='u40'>U40</option>
                      <option value='u38'>U38</option>
                      <option value='u36'>U36</option>
                      <option value='u32'>U32</option>
                      <option value='u29'>U29</option>
                    </select>
                  )}
                </div>
              </div>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedKlinik = props.klinik.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      props.setKp(selectedKlinik.kp);
                      props.setKodFasiliti(selectedKlinik.kodFasiliti);
                    }}
                    className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                  >
                    <option value=''>Pilih Klinik</option>
                    {props.klinik.map((k) => (
                      <option className='capitalize' value={k.kodFasiliti}>
                        {k.kp}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Peranan{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => props.setRole(e.target.value)}
                    className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                  >
                    <option value=''>Pilih Peranan</option>
                    <option value='admin'>Pentadbir Klinik</option>
                    <option value='umum'>Pengguna</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='role-promosi-klinik' className='mr-3'>
                Pegawai promosi fasiliti?
              </label>
              <input
                type='checkbox'
                id='role-promosi-klinik'
                ref={props.currentRolePromosiKlinik}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='role-media-sosial-klinik' className='mr-3'>
                Pegawai media sosial fasiliti?
              </label>
              <input
                type='checkbox'
                id='role-media-sosial-klinik'
                ref={props.currentRoleMediaSosialKlinik}
              />
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputSMSR(props) {
  const { toast } = useGlobalAdminAppContext();
  const { Dictionary } = useDictionary();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!props.carianNama) {
      toast.error('Sila isi nama / kod sekolah');
      return;
    }
    props.setSearching(true);
    props.setFilteredSekolah([]);
    const filteredSekolah = props.sekolah.filter((sekolah) => {
      return (
        sekolah.NAMA_INSTITUSI.toLowerCase().includes(
          props.carianNama.toLowerCase()
        ) ||
        sekolah.KOD_INSTITUSI.toLowerCase().includes(
          props.carianNama.toLowerCase()
        )
      );
    });
    props.setFilteredSekolah(filteredSekolah);
    props.setSearching(false);
  };

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Tambah {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            {props.addingData && (
              <div className='text-user9 uppercase font-bold'>
                Mohon jangan tutup tetingkap ini sebelum proses menambah sekolah
                selesai, terima kasih
              </div>
            )}
            {props.statusMOEIS === true && (
              <>
                <div>
                  <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                    MOEIS Aktif
                  </span>
                </div>
                <div>
                  <span className='text-xs'>
                    Tarikh kemaskini: {new Date().toLocaleDateString('en-GB')}
                  </span>
                </div>
              </>
            )}
            {props.statusMOEIS === false && props.isLoadingMOEIS === false && (
              <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                MOEIS Tidak Aktif
              </span>
            )}
            {props.isLoadingMOEIS === true && (
              <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                <span className='animate-pulse'>Menyemak status MOEIS</span>
              </span>
            )}
            <div className='mb-3'>
              <label className='block text-sm font-medium text-adminBlack p-2'>
                Cari
              </label>
              <div className='relative'>
                <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                  {/* <svg
                    aria-hidden='true'
                    className='w-5 h-3 text-gray-500 dark:text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    ></path>
                  </svg> */}
                </div>
                <input
                  value={props.carianNama}
                  type='search'
                  className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                  placeholder='Cari sekolah...'
                  onChange={(e) => {
                    props.setCarianNama(e.target.value);
                  }}
                />
                {props.searching === false ? (
                  <button
                    type='button'
                    className='text-white absolute right-1 bottom-1 bg-admin3 hover:bg-admin4 font-medium rounded-lg text-sm px-4 py-1'
                    onClick={(e) => handleSearch(e)}
                  >
                    Cari
                  </button>
                ) : (
                  <>
                    <button
                      type='button'
                      className='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                      disabled={true}
                    >
                      <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
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
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {props.filteredSekolah.length > 0 ? (
                <>
                  <select
                    required
                    id='institusi'
                    name='institusi'
                    onChange={(e) => {
                      props.setName(e.target.value);
                      const index = e.target.selectedIndex;
                      const el = e.target.childNodes[index];
                      props.setIdInstitusi(el.getAttribute('id'));
                      props.setKodSekolah(el.getAttribute('data-kod'));
                    }}
                    className='block w-full rounded-md border-2 p-2 mt-3 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Sekolah</option>
                    {props.filteredSekolah.map((s) => (
                      <option
                        value={s.NAMA_INSTITUSI}
                        id={s.ID_INSTITUSI}
                        data-kod={s.KOD_INSTITUSI}
                      >
                        {s.NAMA_INSTITUSI} | {s.KOD_INSTITUSI} | {s.PPD}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <span className='p-2'>
                  Tiada Sekolah / Kod Sekolah dijumpai
                </span>
              )}
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Klinik / Pusat Pergigian Sekolah{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    name='kps-kpb'
                    value='kps'
                    onChange={(e) =>
                      props.setJenisPerkhidmatanSekolah(e.target.value)
                    }
                  />
                  <span className='ml-2'>Ya</span>
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    name='kps-kpb'
                    value='kpb'
                    onChange={(e) =>
                      props.setJenisPerkhidmatanSekolah(e.target.value)
                    }
                  />
                  <span className='ml-2'>Tidak</span>
                </label>
              </div>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Risiko Sekolah (PERSiS){' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => props.setRisiko(e.target.value)}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Risiko</option>
                <option value='rendah'>Rendah</option>
                <option value='tinggi'>Tinggi</option>
              </select>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Klinik Bertanggungjawab
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setKp(selectedKlinik.kp);
                  props.setKodFasiliti(selectedKlinik.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKPBMPB(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Tambah {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Nombor plat {Dictionary[props.FType]}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <p className='text-user9 text-lg font-semibold uppercase'>
                Pastikan diisi dengan huruf besar & jarak{' '}
                <i className='mr-1'>space</i> yang betul
              </p>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                type='text'
                onChange={(e) => props.setName(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Jenis {Dictionary[props.FType]}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <p>
                Contoh:{' '}
                <span className='font-bold'>
                  Lori Trak, Caravan, Van, Treler, Bas, Coaster
                </span>
              </p>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                type='text'
                onChange={(e) => props.setSubJenisKPBMPB(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Klinik Bertanggungjawab
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setKp(selectedKlinik.kp);
                  props.setKodFasiliti(selectedKlinik.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputTastad(props) {
  const { Dictionary, DictionaryHurufNegeri } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Tambah {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='email'
              >
                Nama {Dictionary[props.FType]}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                type='text'
                onChange={(e) => props.setName(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Kategori {props.FType}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => props.setGovKe(e.target.value)}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih kategori..</option>
                <option value='Kerajaan'>Kerajaan</option>
                <option value='Swasta'>Swasta</option>
              </select>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Kod {Dictionary[props.FType]}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-5 gap-1'>
                <div>
                  {/* <input
                    readOnly
                    className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                    type='text'
                    value={props.FType.substring(0, 3).toUpperCase()}
                  /> */}
                  {props.FType.substring(0, 3).toUpperCase()}
                </div>
                <div>-</div>
                <div className='grid grid-cols-2'>
                  <div>
                    {/* <input
                      readOnly
                      className='block mb-2 text-sm font-medium text-adminBlack'
                      type='text'
                      value={DictionaryHurufNegeri[props.negeri]}
                    /> */}
                    {DictionaryHurufNegeri[props.negeri]}
                  </div>
                  <div>
                    <input
                      required
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                      type='text'
                      value={props.kodTastadTengah}
                      pattern='[0-9]+'
                      minLength='2'
                      maxLength='2'
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          props.setKodTastadTengah(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>-</div>
                <div className='grid grid-cols-2'>
                  <div>
                    {/* <input
                      required
                      className='block mb-2 text-sm font-medium text-adminBlack'
                      type='text'
                      value={
                        props.govKe === ''
                          ? ''
                          : props.govKe === 'Kerajaan'
                          ? 'K'
                          : 'S'
                      }
                      disabled={true}
                    /> */}
                    {props.govKe === ''
                      ? ''
                      : props.govKe === 'Kerajaan'
                      ? 'K'
                      : 'S'}
                  </div>
                  <div>
                    <input
                      required
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                      type='text'
                      value={props.kodTastadHujung}
                      pattern='[0-9]+'
                      minLength='1'
                      maxLength='3'
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          props.setKodTastadHujung(e.target.value);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Alamat {Dictionary[props.FType]}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                type='text'
                onChange={(e) => props.setAlamatTastad(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setKp(selectedKlinik.kp);
                  props.setKodFasiliti(selectedKlinik.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

// tak pakai
export function InputFacilityOthers(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowAddModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>
                Tambah {Dictionary[props.FType]}
              </h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowAddModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='px-3 py-1'>
                <div className='mb-3'>
                  <div className='mb-2'>
                    <p>
                      Nama {Dictionary[props.FType]}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                  </div>
                  <div>
                    <input
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      type='text'
                      name='nama'
                      id='nama'
                      onChange={(e) => props.setName(e.target.value)}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <div>
                      Klinik Bertanggungjawab
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </div>
                    <div>
                      <select
                        required
                        onChange={(e) => {
                          const selectedKlinik = props.klinik.find(
                            (k) => k.kodFasiliti === e.target.value
                          );
                          props.setKp(selectedKlinik.kp);
                          props.setKodFasiliti(selectedKlinik.kodFasiliti);
                        }}
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      >
                        <option value=''>Pilih Klinik</option>
                        {props.klinik.map((k) => (
                          <option className='capitalize' value={k.kodFasiliti}>
                            {k.kp}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className='grid grid-cols-2 gap-3 px-3'>
                {props.addingData ? (
                  <BusyButton func='add' />
                ) : (
                  <SubmitButton func='add' />
                )}
                <div>
                  <button
                    type='button'
                    onClick={() => props.setShowAddModal(false)}
                    className='capitalize rounded-md shadow-xl p-2 transition-all duration-300 ease-in-out border-adminBlack border-2 text-adminBlack hover:text-admin3 w-full hover:outline-user3 hover:outline'
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputFacility(props) {
  switch (props.FType) {
    case 'sm':
    case 'sr':
      return <InputSMSR {...props} />;
    case 'kpb':
    case 'mpb':
      return <InputKPBMPB {...props} />;
    case 'taska':
    case 'tadika':
      return <InputTastad {...props} />;
    default:
      return <InputFacilityOthers {...props} />;
  }
}

export function InputEvent(props) {
  const [jenisEventDd, setJenisEventDd] = useState('');
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>Tambah Program Komuniti</h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Jenis Program Komuniti
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  props.setJenisEvent(e.target.value);
                  setJenisEventDd(e.target.value);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Jenis Program / Aktiviti</option>
                {/* <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='kgangkat'>
                          Kampung Angkat Pergigian
                        </option>
                        <option value='ppr'>Projek Perumahan Rakyat</option>
                        <option value='we'>Institusi Warga Emas</option>
                        <option value='oku'>Institusi OKU / PDK</option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option> */}
                <option value='programDewasaMuda'>Program Dewasa Muda</option>
                <option value='kampungAngkatPergigian'>
                  Program Kampung Angkat Pergigian
                </option>
                <option value='ppr'>Projek Perumahan Rakyat</option>
                <option value='we'>Institusi Warga Emas</option>
                <option value='oku'>Institusi OKU / PDK</option>
              </select>
              {jenisEventDd === 'programDewasaMuda' && (
                <div className='mb-3 mt-3'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Jenis Institusi
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => props.setKategoriInstitusi(e.target.value)}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Institusi</option>
                    <option value='kolej-komuniti'>Kolej Komuniti</option>
                    <option value='kolej-vokasional'>Kolej Vokasional</option>
                    <option value='ipg'>Institusi Pendidikan Guru (IPG)</option>
                    <option value='ipta'>
                      Institusi Pengajian Tinggi Awam
                    </option>
                    <option value='lain-lain'>
                      Lain-lain Institusi Pengajian
                    </option>
                  </select>
                </div>
              )}
              {/* <p className='mt-3 font-semibold'>
                      Mod Penyampaian Perkhidmatan
                    </p>
                    <div className='grid grid-cols-2 gap-1'>
                      <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='ppb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='kpb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                      <label htmlFor='modKpb'>Makmal Pergigian Bergerak</label>
                      <input
                        type='checkbox'
                        name='mod'
                        value='mpb'
                        onChange={(e) => {
                          eventModeChecker(e.target.value);
                        }}
                      />
                    </div> */}
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Nama Program Komuniti
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => props.setName(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Tempat
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => props.setTempat(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Klinik Bertugas{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setKp(selectedKlinik.kp);
                  props.setKodFasiliti(selectedKlinik.kodFasiliti);
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditKlinik(props) {
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini Klinik Pergigian
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block p-1 text-lg font-bold text-adminBlack'>
                {props.editedEntity.kp} / {props.editedEntity.kodFasiliti}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block p-1 text-lg font-bold text-adminBlack'>
                Perkhidmatan: {props.editedEntity.statusRoleKlinik}
              </label>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='email'
              >
                Emel
                <span className='text-admin3'>*</span>
              </label>
              <input
                required
                value={props.editedEntity.email}
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                type='text'
                onChange={(e) =>
                  props.setEditedEntity({
                    ...props.editedEntity,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status Klinik Pergigian
                <span className='text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack'>
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusAktif'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack'>
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusTidakAktif'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditKkiakd(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}{' '}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} / {props.editedEntity.kodKkiaKd}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusactive'
                    name='status'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusinactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusinactive'
                    name='status'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditPegawai(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='grid gap-1 mb-3'>
              <div className='px-3 py-1'>
                <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Nama Pegawai
                </label>
                <label className='block p-1 text-lg font-bold text-adminBlack'>
                  {props.editedEntity.nama}
                </label>
                {props.FType === 'pp' && (
                  <label className='block mb-3 mt-4 text-sm font-medium text-adminBlack'>
                    Nombor MDC
                  </label>
                )}
                {props.FType === 'jp' && (
                  <label className='block mb-3 mt-4 text-sm font-medium text-adminBlack'>
                    Nombor MDTB
                  </label>
                )}
                <label className='block p-1 text-lg font-bold text-adminBlack'>
                  {props.editedEntity.mdcNumber ? (
                    <span>{props.editedEntity.mdcNumber}</span>
                  ) : (
                    <span>{props.editedEntity.mdtbNumber}</span>
                  )}
                </label>
              </div>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Emel{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <input
                    required
                    defaultValue={props.editedEntity.email}
                    className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                    type='text'
                    name='email'
                    id='email'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Gred{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  {props.FType === 'pp' && (
                    <select
                      required
                      value={props.editedEntity.gred}
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          gred: e.target.value,
                        });
                      }}
                    >
                      <option value=''>Pilih Gred</option>
                      <option value='jusa'>JUSA</option>
                      <option value='ug56'>UG56</option>
                      <option value='ug54'>UG54</option>
                      <option value='ug52'>UG52</option>
                      <option value='ug48'>UG48</option>
                      <option value='ug44'>UG44</option>
                      <option value='ug41'>UG41</option>
                    </select>
                  )}
                  {props.FType === 'jp' && (
                    <select
                      required
                      value={props.editedEntity.gred}
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          gred: e.target.value,
                        });
                      }}
                    >
                      <option value=''>Pilih Gred</option>
                      <option value='u40'>U40</option>
                      <option value='u38'>U38</option>
                      <option value='u36'>U36</option>
                      <option value='u32'>U32</option>
                      <option value='u29'>U29</option>
                    </select>
                  )}
                </div>
              </div>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    value={props.editedEntity.kodFasiliti}
                    onChange={(e) => {
                      const selectedKlinik = props.klinik.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      props.setEditedEntity({
                        ...props.editedEntity,
                        kodFasiliti: selectedKlinik.kodFasiliti,
                        kpSkrg: selectedKlinik.kp,
                      });
                    }}
                    className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                  >
                    <option value=''>Pilih Klinik</option>
                    {props.klinik.map((k) => (
                      <option className='capitalize' value={k.kodFasiliti}>
                        {k.kp}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid gap-1'>
                  <label className='block mb-2 text-sm font-medium text-adminBlack'>
                    Peranan{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    value={props.editedEntity.role}
                    className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        role: e.target.value,
                      });
                    }}
                  >
                    <option value=''>Pilih Role</option>
                    <option value='admin'>Pentadbir Klinik</option>
                    <option value='umum'>Pengguna</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='mt-3'>
              <label htmlFor='role-promosi-klinik' className='mr-3'>
                Pegawai promosi fasiliti?
              </label>
              <input
                type='checkbox'
                id='role-promosi-klinik'
                checked={props.editedEntity.rolePromosiKlinik}
                ref={props.currentRolePromosiKlinik}
                onChange={() => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    rolePromosiKlinik: !props.editedEntity.rolePromosiKlinik,
                  });
                }}
              />
            </div>
            <div className='mt-3'>
              <label htmlFor='role-media-sosial-klinik' className='mr-3'>
                Pegawai media sosial fasiliti?
              </label>
              <input
                type='checkbox'
                id='role-media-sosial-klinik'
                checked={props.editedEntity.roleMediaSosialKlinik}
                ref={props.currentRoleMediaSosialKlinik}
                onChange={() => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    roleMediaSosialKlinik:
                      !props.editedEntity.roleMediaSosialKlinik,
                  });
                }}
              />
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditSR(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Risiko Sekolah (PERSiS){' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                value={props.editedEntity.risikoSekolahPersis}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    risikoSekolahPersis: e.target.value,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Risiko</option>
                <option value='rendah'>Rendah</option>
                <option value='tinggi'>Tinggi</option>
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Klinik / Pusat Pergigian Sekolah{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.jenisPerkhidmatanSekolah === 'kps'
                    }
                    name='kps-kpb'
                    value='kps'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        jenisPerkhidmatanSekolah: e.target.value,
                      })
                    }
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.jenisPerkhidmatanSekolah === 'kpb'
                    }
                    name='kps-kpb'
                    value='kpb'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        jenisPerkhidmatanSekolah: e.target.value,
                      })
                    }
                  />
                  Tidak
                </label>
              </div>
            </div>
            {/* <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Sekolah Pendidikan Khas{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={props.editedEntity.sekolahKki === 'ya-sekolah-kki'}
                    name='sekolah-kki'
                    value='ya-sekolah-kki'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahKki: e.target.value,
                      })
                    }
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.sekolahKki === 'tidak-sekolah-kki'
                    }
                    name='sekolah-kki'
                    value='tidak-sekolah-kki'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahKki: e.target.value,
                      })
                    }
                  />
                  Tidak
                </label>
              </div>
            </div> */}
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Program Kumuran Berfluorida{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    checked={
                      props.editedEntity.statusFMRSekolah === 'ya'
                        ? true
                        : false
                    }
                    type='radio'
                    name='sekolah-fmr'
                    value='ya'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusFMRSekolah: e.target.value,
                      });
                    }}
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    checked={
                      props.editedEntity.statusFMRSekolah === 'tidak'
                        ? true
                        : false
                    }
                    type='radio'
                    name='sekolah-fmr'
                    value='tidak'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusFMRSekolah: e.target.value,
                      });
                    }}
                  />
                  Tidak
                </label>
              </div>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusactive'
                    name='status'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusinactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusinactive'
                    name='status'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditSM(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Risiko Sekolah (PERSiS){' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                value={props.editedEntity.risikoSekolahPersis}
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    risikoSekolahPersis: e.target.value,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Risiko</option>
                <option value='rendah'>Rendah</option>
                <option value='tinggi'>Tinggi</option>
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Klinik / Pusat Pergigian Sekolah{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.jenisPerkhidmatanSekolah === 'kps'
                    }
                    name='kps-kpb'
                    value='kps'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        jenisPerkhidmatanSekolah: e.target.value,
                      })
                    }
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.jenisPerkhidmatanSekolah === 'kpb'
                    }
                    name='kps-kpb'
                    value='kpb'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        jenisPerkhidmatanSekolah: e.target.value,
                      })
                    }
                  />
                  Tidak
                </label>
              </div>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Sekolah MMI{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={props.editedEntity.sekolahMmi === 'ya-sekolah-mmi'}
                    name='sekolah-mmi'
                    value='ya-sekolah-mmi'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahMmi: e.target.value,
                      })
                    }
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.sekolahMmi === 'tidak-sekolah-mmi'
                    }
                    name='sekolah-mmi'
                    value='tidak-sekolah-mmi'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahMmi: e.target.value,
                      })
                    }
                  />
                  Tidak
                </label>
              </div>
            </div>
            {/* <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Sekolah Pendidikan Khas{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <div className='grid grid-cols-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={props.editedEntity.sekolahKki === 'ya-sekolah-kki'}
                    name='sekolah-kki'
                    value='ya-sekolah-kki'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahKki: e.target.value,
                      })
                    }
                  />
                  Ya
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    required
                    type='radio'
                    checked={
                      props.editedEntity.sekolahKki === 'tidak-sekolah-kki'
                    }
                    name='sekolah-kki'
                    value='tidak-sekolah-kki'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        sekolahKki: e.target.value,
                      })
                    }
                  />
                  Tidak
                </label>
              </div>
            </div> */}
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusactive'
                    name='status'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusinactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusinactive'
                    name='status'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditKPBMPB(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} / {props.editedEntity.subJenisKPBMPB}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusactive'
                    name='status'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusinactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusinactive'
                    name='status'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditTastad(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}{' '}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} / {props.editedEntity.kodTastad}
              </label>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.alamatTastad}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                required
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Kategori {props.FType}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) =>
                  props.setEditedEntity({
                    ...props.editedEntity,
                    govKe: e.target.value,
                  })
                }
                value={props.editedEntity.govKe ? props.editedEntity.govKe : ''}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih kategori..</option>
                <option value='Kerajaan'>Kerajaan</option>
                <option value='Swasta'>Swasta</option>
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusactive'
                >
                  <input
                    required
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusactive'
                    name='statusAktifTidakAktif'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'
                  htmlFor='statusinactive'
                >
                  <input
                    required
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    id='statusinactive'
                    name='statusAktifTidakAktif'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

// tak pakai rasanya
export function InputEditFacilityOthers(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}{' '}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} / {props.editedEntity.kodKkiaKd}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <select
                value={props.editedEntity.kodFasilitiHandler}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    handler: selectedKlinik.kp,
                    kodFasilitiHandler: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                Status {Dictionary[props.FType]}{' '}
                <span className='font-semibold text-lg text-admin3'>*</span>
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusAktif'
                    value='active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Aktif</span>
                </label>
                <label
                  className='inline-flex items-center text-sm font-medium text-adminBlack'
                  htmlFor='statusinactive'
                >
                  <input
                    checked={
                      props.editedEntity.statusPerkhidmatan === 'non-active'
                        ? true
                        : false
                    }
                    type='radio'
                    name='statusTidakAktif'
                    value='non-active'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        statusPerkhidmatan: e.target.value,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Aktif</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditFacility(props) {
  switch (props.FType) {
    case 'sr':
      return <InputEditSR {...props} />;
    case 'sm':
      return <InputEditSM {...props} />;
    case 'kpb':
    case 'mpb':
      return <InputEditKPBMPB {...props} />;
    case 'taska':
    case 'tadika':
      return <InputEditTastad {...props} />;
    default:
      return <InputEditFacilityOthers {...props} />;
  }
}

export function InputEditEvent(props) {
  const [jenisEventDd, setJenisEventDd] = useState(
    props.editedEntity.jenisEvent
  );
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>Tambah Program Komuniti</h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Jenis Program Komuniti
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                value={props.editedEntity.jenisEvent}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    jenisEvent: e.target.value,
                  });
                  setJenisEventDd(e.target.value);
                }}
              >
                <option value=''>Jenis Program / Aktiviti</option>
                {/* <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='kgangkat'>
                          Kampung Angkat Pergigian
                        </option>
                        <option value='ppr'>Projek Perumahan Rakyat</option>
                        <option value='we'>Institusi Warga Emas</option>
                        <option value='oku'>Institusi OKU / PDK</option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option> */}
                <option value='programDewasaMuda'>Program Dewasa Muda</option>
                <option value='kampungAngkatPergigian'>
                  Kampung Angkat Pergigian
                </option>
                <option value='ppr'>Projek Perumahan Rakyat</option>
                <option value='we'>Institusi Warga Emas</option>
                <option value='oku'>Institusi OKU / PDK</option>
              </select>
            </div>
            {jenisEventDd === 'programDewasaMuda' && (
              <div className='mb-3 mt-2'>
                <label className='block mb-2 text-sm font-medium text-adminBlack'>
                  Kategori Institusi
                  <span className='font-semibold text-lg text-user6'>*</span>
                </label>
                <select
                  required
                  className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  value={props.editedEntity.kategoriInstitusi}
                  onChange={(e) =>
                    props.setEditedEntity({
                      ...props.editedEntity,
                      kategoriInstitusi: e.target.value,
                    })
                  }
                >
                  <option value=''>Pilih Institusi</option>
                  <option value='kolej-komuniti'>Kolej Komuniti</option>
                  <option value='kolej-vokasional'>Kolej Vokasional</option>
                  <option value='ipg'>Institusi Pendidikan Guru (IPG)</option>
                  <option value='ipta'>Institusi Pengajian Tinggi Awam</option>
                  <option value='lain-lain'>
                    Lain-lain Institusi Pengajian
                  </option>
                </select>
              </div>
            )}
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Tempat
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack'
                value={props.editedEntity.tempat}
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => {
                  props.setEditedEntity({
                    ...props.editedEntity,
                    tempat: e.target.value,
                  });
                }}
              />
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Klinik Bertanggungjawab
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                value={props.editedEntity.createdByKodFasiliti}
                onChange={(e) => {
                  const selectedKlinik = props.klinik.find(
                    (k) => k.kodFasiliti === e.target.value
                  );
                  props.setEditedEntity({
                    ...props.editedEntity,
                    createdByKp: selectedKlinik.kp,
                    createdByKodFasiliti: selectedKlinik.kodFasiliti,
                  });
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih Klinik</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

//
// MODALS UNTUK KP SUPERADMIN
//

export function InputKpAddEvent(props) {
  const { loginInfo } = useLogininfo();

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowAddModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>Tambah Program Komuniti</h5>
              <button
                onClick={() => props.setShowAddModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-sm font-medium text-adminBlack'>
                Jenis Program Komuniti
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                onChange={(e) => {
                  props.setJenisEvent(e.target.value);
                }}
                name='jenisEvent'
                id='jenisEvent'
              >
                <option value=''>Jenis Program / Aktiviti</option>
                <option value='projek-komuniti'>Projek Komuniti</option>
                <option value='ppkps'>
                  Program Pemasyarakatan Perkhidmatan Klinik Pergigian Sekolah
                </option>
                <option value='oap'>Program Orang Asli dan Penan</option>
                <option value='penjara-koreksional'>Institusi Penjara</option>
                {loginInfo.negeri === 'Sabah' && (
                  <option value='fds'>Flying Dental Service</option>
                )}
                {loginInfo.negeri === 'Kelantan' && (
                  <option value='rtc'>RTC Kelantan, Tunjung</option>
                )}
                {/* {206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
                      <option value='incremental'>
                        Program Pergigian Sekolah Sesi 2022/2023
                      </option> */}
              </select>
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Nama Program Komuniti
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => props.setName(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label
                className='block mb-2 text-sm font-medium text-adminBlack'
                htmlFor='nama'
              >
                Tempat
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <input
                required
                className='w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => props.setTempat(e.target.value)}
              />
            </div>
            <div className='mt-5'>
              {props.addingData ? (
                <BusyButton func='add' />
              ) : (
                <SubmitButton func='add' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditPegawai(props) {
  const { Dictionary } = useDictionary();
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block p-1 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} /{' '}
                {props.editedEntity.mdcNumber ? (
                  <span>{props.editedEntity.mdcNumber}</span>
                ) : (
                  <span>{props.editedEntity.mdtbNumber}</span>
                )}{' '}
                / {props.editedEntity.gred}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block p-1 text-lg font-bold text-adminBlack'>
                {props.editedEntity.email}
              </label>
            </div>
            <div className='mb-3'>
              <label className='block mb-3 mt-2 text-lg font-bold text-adminBlack'>
                Peranan :{' '}
                {props.editedEntity.role === 'admin'
                  ? 'Pentadbir Klinik'
                  : 'Pengguna'}
              </label>
            </div>
            <div className='mb-3'>
              <label className='text-sm font-medium text-adminBlack'>
                CSCSP Verified
              </label>
              <div className='grid grid-cols-2 gap-2 mb-3 p-2'>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    checked={
                      props.editedEntity.cscspVerified === true ? true : false
                    }
                    type='radio'
                    name='statusAktif'
                    value='true'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        cscspVerified: true,
                      });
                    }}
                  />
                  <span className='ml-2'>Mempunyai Sijil CSCSP</span>
                </label>
                <label className='inline-flex items-center text-sm font-medium text-adminBlack m-auto'>
                  <input
                    checked={
                      props.editedEntity.cscspVerified === false ? true : false
                    }
                    type='radio'
                    name='statusTidakAktif'
                    value='false'
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        cscspVerified: false,
                      });
                    }}
                  />
                  <span className='ml-2'>Tidak Mempunyai Sijil CSCSP</span>
                </label>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditFacility(props) {
  const { Dictionary } = useDictionary();

  // calculate sum enrolmenTastad = enrolmenKurang4Tahun + enrolmen5Tahun + enrolmen6Tahun
  useEffect(() => {
    props.setEditedEntity({
      ...props.editedEntity,
      enrolmenTastad:
        parseInt(props.editedEntity.enrolmenKurang4Tahun) +
        parseInt(props.editedEntity.enrolmen5Tahun) +
        parseInt(props.editedEntity.enrolmen6Tahun) +
        parseInt(props.editedEntity.enrolmenMuridBerkeperluanKhas),
    });
  }, [
    props.editedEntity.enrolmenKurang4Tahun,
    props.editedEntity.enrolmen5Tahun,
    props.editedEntity.enrolmen6Tahun,
    props.editedEntity.enrolmenMuridBerkeperluanKhas,
  ]);

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini {Dictionary[props.FType]}{' '}
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <div className='px-3 py-1'>
                <div className='grid gap-2'>
                  <p>
                    <span className='bg-user15 text-userBlack py-1 px-2 rounded-md'>
                      {props.editedEntity.jenisFasiliti}{' '}
                      {props.editedEntity.govKe}
                    </span>
                  </p>
                  <p>
                    Nama {Dictionary[props.FType]}: {props.editedEntity.nama}{' '}
                  </p>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='enrolmentKurang4Tahun'
                      className='flex justify-start text-left'
                    >
                      JUMLAH ENROLMEN :
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </label>
                    <input
                      disabled
                      required
                      type='number'
                      min='1'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmenTastad}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenTastad: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='enrolmentKurang4Tahun'
                      className='flex justify-start text-left'
                    >
                      Enrolmen ≤ 4 Tahun Mengikut Tahun Kelahiran:
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmenKurang4Tahun}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenKurang4Tahun: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='enrolment5Tahun'
                      className='flex justify-start text-left'
                    >
                      Enrolmen Semua 5 Tahun Mengikut Tahun Kelahiran:
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmen5Tahun}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmen5Tahun: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='enrolment6Tahun'
                      className='flex justify-start text-left'
                    >
                      Enrolmen Semua 6 Tahun Mengikut Tahun Kelahiran:
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmen6Tahun}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmen6Tahun: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='enrolmenMuridBerkeperluanKhas'
                      className='flex justify-start text-left'
                    >
                      Enrolmen Murid Berkeperluan Khas:
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmenMuridBerkeperluanKhas}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenMuridBerkeperluanKhas: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr] border rounded-md p-2 place-items-center'>
                    <label
                      htmlFor='enrolmentMuridOaPenan'
                      className='flex justify-start text-left'
                    >
                      Enrolmen Murid OA/Penan:
                    </label>
                    <input
                      type='number'
                      min='0'
                      max={props.editedEntity.enrolmenTastad}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.enrolmenMuridOaPenan}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenMuridOaPenan: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='jumlahEngganTasTad'
                      className='flex justify-start text-left'
                    >
                      Jumlah Murid Enggan:
                    </label>
                    <input
                      type='number'
                      min='0'
                      max={props.editedEntity.enrolmenTastad}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.jumlahEngganTasTad}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          jumlahEngganTasTad: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className='grid grid-cols-[3fr_1fr]'>
                    <label
                      htmlFor='jumlahTidakHadirTasTad'
                      className='flex justify-start text-left'
                    >
                      Jumlah Murid Tidak Hadir:
                    </label>
                    <input
                      type='number'
                      min='0'
                      max={props.editedEntity.enrolmenTastad}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      value={props.editedEntity.jumlahTidakHadirTasTad}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          jumlahTidakHadirTasTad: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {props.editedEntity.govKe === 'Kerajaan' && (
                    <div className='grid grid-cols-3 gap-3'>
                      <p className='col-span-3'>
                        Jenis Tadika/Taska Kerajaan{' '}
                        <strong className='text-user9'>*</strong>
                      </p>
                      <label
                        htmlFor='kemasKerajaan'
                        className={`flex justify-center items-center space-x-2 py-2 rounded-md shadow-sm shadow-user1 ${
                          props.editedEntity.jenisTadikaKerajaan ===
                          'kemasKerajaan'
                            ? ' ring ring-offset-user12 transition-all duration-500'
                            : ''
                        }`}
                      >
                        <input
                          required
                          type='radio'
                          name='jenisTadikaKerajaan'
                          id='kemasKerajaan'
                          value='kemasKerajaan'
                          checked={
                            props.editedEntity.jenisTadikaKerajaan ===
                            'kemasKerajaan'
                          }
                          onChange={(e) => {
                            props.setEditedEntity({
                              ...props.editedEntity,
                              jenisTadikaKerajaan: e.target.value,
                            });
                          }}
                          className='w-4 h-4'
                        />
                        <span>KEMAS</span>
                      </label>
                      <label
                        htmlFor='perpaduanKerajaan'
                        className={`flex justify-center items-center space-x-2 py-2 rounded-md shadow-sm shadow-user1 ${
                          props.editedEntity.jenisTadikaKerajaan ===
                          'perpaduanKerajaan'
                            ? ' ring ring-offset-user12 transition-all duration-500'
                            : ''
                        }`}
                      >
                        <input
                          required
                          type='radio'
                          name='jenisTadikaKerajaan'
                          id='perpaduanKerajaan'
                          value='perpaduanKerajaan'
                          checked={
                            props.editedEntity.jenisTadikaKerajaan ===
                            'perpaduanKerajaan'
                          }
                          onChange={(e) => {
                            props.setEditedEntity({
                              ...props.editedEntity,
                              jenisTadikaKerajaan: e.target.value,
                            });
                          }}
                          className='w-4 h-4'
                        />
                        <span>Perpaduan</span>
                      </label>
                      <label
                        htmlFor='lainLainKerajaan'
                        className={`flex justify-center items-center space-x-2 py-2 rounded-md shadow-sm shadow-user1 ${
                          props.editedEntity.jenisTadikaKerajaan ===
                          'lainLainKerajaan'
                            ? ' ring ring-offset-user12 transition-all duration-500'
                            : ''
                        }`}
                      >
                        <input
                          required
                          type='radio'
                          name='jenisTadikaKerajaan'
                          id='lainLainKerajaan'
                          value='lainLainKerajaan'
                          checked={
                            props.editedEntity.jenisTadikaKerajaan ===
                            'lainLainKerajaan'
                          }
                          onChange={(e) => {
                            props.setEditedEntity({
                              ...props.editedEntity,
                              jenisTadikaKerajaan: e.target.value,
                            });
                          }}
                          className='w-4 h-4'
                        />
                        <span>Lain-lain</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditEvent(props) {
  const { Dictionary } = useDictionary();

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini Program / Aktiviti
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='grid gap-1 mb-3'>
              <div className='px-3 py-1'>
                <label className='block mb-3 mt-2 text-xl font-bold text-adminBlack'>
                  {Dictionary[props.editedEntity.jenisEvent]} /{' '}
                  {props.editedEntity.nama}
                </label>
                <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Tarikh Program Komuniti
                  <span className='font-semibold text-lg text-user6'>*</span>
                </label>
                <div className='flex flex-row justify-center items-center px-5'>
                  <p className='whitespace-nowrap text-sm text-bold text-right mr-2'>
                    tarikh mula :
                  </p>
                  <StartDate {...props} />
                  <p className='whitespace-nowrap text-sm text-bold text-right ml-2 mr-2'>
                    tarikh akhir :
                  </p>
                  <EndDate {...props} />
                </div>
              </div>
              <div className='px-3 py-1'>
                <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Tempat
                  <span className='font-semibold text-lg text-user6'>*</span>
                </label>
                <input
                  className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                  type='text'
                  value={props.editedEntity.tempat}
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      tempat: e.target.value,
                    });
                  }}
                />
                {['programDewasaMuda', 'we', 'oku'].includes(
                  props.editedEntity.jenisEvent
                ) ? (
                  <label className='block mb-3 mt-2 text-xl font-bold text-adminBlack'>
                    Enrolmen:
                    <input
                      // required
                      type='number'
                      min='0'
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                      value={
                        props.editedEntity.enrolmenInstitusi ===
                        'NOT APPLICABLE'
                          ? 0
                          : props.editedEntity.enrolmenInstitusi
                      }
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenInstitusi: e.target.value,
                        });
                      }}
                    />
                  </label>
                ) : null}
              </div>
              <div className='px-3 py-1'>
                <div className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Mod Penyampaian Perkhidmatan
                  <div className='w-auto mt-2'>
                    <PasukanPergigianBergerakSelector {...props} />
                    <KlinikPergigianBergerakSelector {...props} />
                    <MakmalPergigianBergerakSelector {...props} />
                    <SubProgramSelector {...props} />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditEventFromDaerah(props) {
  const { Dictionary } = useDictionary();

  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini Program / Aktiviti
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='grid gap-1 mb-3'>
              <div className='px-3 py-1'>
                <label className='block mb-3 mt-2 text-xl font-bold text-adminBlack'>
                  {Dictionary[props.editedEntity.jenisEvent]} /{' '}
                  {props.editedEntity.nama}
                </label>
                <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Tarikh Program Komuniti
                  <span className='font-semibold text-lg text-user6'>*</span>
                </label>
                <div className='flex flex-row justify-center items-center px-5'>
                  <p className='whitespace-nowrap text-sm text-bold text-right mr-2'>
                    tarikh mula :
                  </p>
                  <StartDate {...props} />
                  <p className='whitespace-nowrap text-sm text-bold text-right ml-2 mr-2'>
                    tarikh akhir :
                  </p>
                  <EndDate {...props} />
                </div>
              </div>
              <div className='px-3 py-1'>
                <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Tempat
                  <span className='font-semibold text-lg text-user6'>*</span>
                </label>
                <input
                  className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                  type='text'
                  value={props.editedEntity.tempat}
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      tempat: e.target.value,
                    });
                  }}
                />
                {['programDewasaMuda', 'we', 'oku'].includes(
                  props.editedEntity.jenisEvent
                ) ? (
                  <>
                    <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                      Enrolmen
                    </label>
                    <input
                      // required
                      type='number'
                      min='0'
                      className='block w-full rounded-md border-2 p-2 text-base leading-5 text-adminBlack focus:outline-none focus:border-black-dark'
                      value={
                        props.editedEntity.enrolmenInstitusi ===
                        'NOT APPLICABLE'
                          ? 0
                          : props.editedEntity.enrolmenInstitusi
                      }
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          enrolmenInstitusi: e.target.value,
                        });
                      }}
                    />
                  </>
                ) : null}
              </div>
              <div className='px-3 py-1'>
                <div className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                  Mod Penyampaian Perkhidmatan
                  <div className='w-auto mt-2'>
                    <PasukanPergigianBergerakSelector {...props} />
                    <KlinikPergigianBergerakSelector {...props} />
                    <MakmalPergigianBergerakSelector {...props} />
                    <SubProgramSelector {...props} />
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditKPBMPB(props) {
  return (
    <>
      <div
        className='absolute inset-0 bg-user1 z-10 opacity-75'
        onClick={() => props.setShowEditModal(false)}
      />
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div className='absolute inset-x-1/4 inset-y-7 mt-5 z-20 overflow-y-auto rounded-lg'>
          <div className='bg-adminWhite shadow-lg rounded-lg p-6 w-auto'>
            <div className='flex justify-between items-center mb-3'>
              <h5 className='text-lg font-medium'>
                Kemaskini Program / Aktiviti
              </h5>
              <button
                onClick={() => props.setShowEditModal(false)}
                className='text-2xl font-medium text-adminBlack'
              >
                <svg
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='x-circle w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  ></path>
                </svg>
              </button>
            </div>
            <div className='mb-3'>
              <label className='block mb-2 text-lg font-bold text-adminBlack'>
                {props.editedEntity.nama} / {props.editedEntity.subJenisKPBMPB}
              </label>
            </div>
            <div className='mb-3'>
              {props.tempatPenggunaan !== 'sekolah-rendah' &&
              props.tempatPenggunaan !== 'sekolah-menengah' ? (
                <div className='flex flex-row justify-center items-center px-5'>
                  <p className='whitespace-nowrap text-sm text-bold text-right mr-2'>
                    tarikh mula :
                  </p>
                  <StartDate {...props} />
                  <p className='whitespace-nowrap text-sm text-bold text-right ml-5 mr-2'>
                    tarikh akhir :
                  </p>
                  <EndDate {...props} />
                </div>
              ) : null}
            </div>
            <div className='mb-3'>
              <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                Tempat Penggunaan:{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </label>
              <select
                required
                onChange={(e) => {
                  props.setTempatPenggunaan(e.target.value);
                  // reset value
                  delete props.editedEntity.handlerKp;
                  delete props.editedEntity.kodKpHandler;
                  delete props.editedEntity.handlerKkiaKd;
                  delete props.editedEntity.kodKkiaKdHandler;
                  delete props.editedEntity.handlerTastad;
                  delete props.editedEntity.kodTastadHandler;
                  delete props.editedEntity.handlerSR;
                  delete props.editedEntity.handlerSM;
                  delete props.editedEntity.kodSekolahHandler;
                }}
                className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
              >
                <option value=''>Pilih fasiliti</option>
                <option value='kp'>Klinik Pergigian</option>
                <option value='kkiakd'>KKIA / KD</option>
                <option value='tastad'>Taska / Tadika</option>
                <option value='sekolah-rendah'>Sekolah Rendah</option>
                <option value='sekolah-menengah'>Sekolah Menengah</option>
              </select>
              {props.tempatPenggunaan === 'kp' ? (
                <>
                  <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                    Klinik Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedKlinik = props.allKlinik.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      props.setEditedEntity({
                        ...props.editedEntity,
                        handlerKp: selectedKlinik.kp,
                        kodKpHandler: selectedKlinik.kodFasiliti,
                      });
                    }}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Klinik</option>
                    {props.allKlinik.map((k) => (
                      <option className='capitalize' value={k.kodFasiliti}>
                        {k.daerah} | {k.kp}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              {props.tempatPenggunaan === 'kkiakd' ? (
                <>
                  <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                    KKIA / KD Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedKkiaKd = props.allKkiaKd.find(
                        (k) => k.kodKkiaKd === e.target.value
                      );
                      props.setEditedEntity({
                        ...props.editedEntity,
                        handlerKkiaKd: selectedKkiaKd.nama,
                        kodKkiaKdHandler: selectedKkiaKd.kodKkiaKd,
                      });
                    }}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih KKIA / KD</option>
                    {props.allKkiaKd.map((k) => (
                      <option className='capitalize' value={k.kodKkiaKd}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              {props.tempatPenggunaan === 'tastad' ? (
                <>
                  <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                    Taska / Tadika Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedTastad = props.allTastad.find(
                        (k) => k.kodTastad === e.target.value
                      );
                      props.setEditedEntity({
                        ...props.editedEntity,
                        handlerTastad: selectedTastad.nama,
                        kodTastadHandler: selectedTastad.kodTastad,
                      });
                    }}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Taska / Tadika</option>
                    {props.allTastad.map((tt) => (
                      <option className='capitalize' value={tt.kodTastad}>
                        {tt.createdByDaerah} | {tt.nama}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              {props.tempatPenggunaan === 'sekolah-rendah' && (
                <>
                  <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                    Nama Sekolah Rendah{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedSR = props.allSR.find(
                        (sr) => sr.kodSekolah === e.target.value
                      );
                      console.log(selectedSR);
                      props.setEditedEntity({
                        ...props.editedEntity,
                        handlerSR: selectedSR.nama,
                        kodSekolahHandler: selectedSR.kodSekolah,
                      });
                    }}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Sekolah Rendah</option>
                    {props.allSR.map((sr) => (
                      <option className='capitalize' value={sr.kodSekolah}>
                        {sr.nama} | {sr.kodSekolah}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {props.tempatPenggunaan === 'sekolah-menengah' && (
                <>
                  <label className='block mb-3 mt-2 text-sm font-medium text-adminBlack'>
                    Nama Sekolah Menengah{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedSM = props.allSM.find(
                        (sm) => sm.kodSekolah === e.target.value
                      );
                      props.setEditedEntity({
                        ...props.editedEntity,
                        handlerSM: selectedSM.nama,
                        kodSekolahHandler: selectedSM.kodSekolah,
                      });
                    }}
                    className='block w-full rounded-md border-2 p-2 leading-5 text-adminBlack'
                  >
                    <option value=''>Pilih Sekolah Menengah</option>
                    {props.allSM.map((sm) => (
                      <option className='capitalize' value={sm.kodSekolah}>
                        {sm.nama} | {sm.kodSekolah}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
            <div className='mt-5'>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
