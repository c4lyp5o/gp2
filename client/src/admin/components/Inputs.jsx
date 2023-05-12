import { useState, useEffect } from 'react';
import { SubmitButton, BusyButton } from './Buttons';
import { useGlobalAdminAppContext } from '../context/adminAppContext';
import moment from 'moment';

import { RiCloseLine } from 'react-icons/ri';
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

export function InputKlinik(props) {
  if (!props.klinik) {
    return <NothingToBeAdded {...props} />;
  }

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
              <h5 className={styles.heading}>Tambah Klinik Pergigian</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowAddModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='grid gap-1'>
                <div className='px-3 py-1'>
                  <label htmlFor='nama'>
                    Pilih Klinik{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedKlinik = props.klinik.find(
                        (k) => k.kodFasilitiGiret === e.target.value
                      );
                      props.setName(selectedKlinik.nama);
                      props.setKodFasiliti(selectedKlinik.kodFasilitiGiret); // PROBABLY ONE OF THE MOST IMPORTANT CODE EVER. PLEASE DON'T TOUCH OR CHANGE THIS AT THE LATER POINT IN LIFE. CAUSE THE ORIGINAL NAME OF PROPERTIES LATER ON IS JUST kodFasiliti
                    }}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Klinik</option>
                    {props.klinik.map((k) => (
                      <option key={k.bil} value={k.kodFasilitiGiret}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                  <label htmlFor='nama'>
                    Emel{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </label>
                  <input
                    required
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                    type='text'
                    name='email'
                    id='email'
                    onChange={(e) =>
                      props.setEmail(e.target.value.toLowerCase())
                    }
                  />
                </div>
                <p className='mt-3 font-semibold'>
                  Peranan Klinik Pergigian{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
                <div className='grid grid-cols-4 gap-1'>
                  <label htmlFor='nama'>KEPP</label>
                  <input
                    required
                    type='radio'
                    id='role'
                    name='checkbox'
                    value='kepp'
                    onChange={(e) =>
                      props.setRole(e.target.value.toLowerCase())
                    }
                  />
                  <label htmlFor='nama'>UTC</label>
                  <input
                    required
                    type='radio'
                    id='role'
                    name='checkbox'
                    value='utc'
                    onChange={(e) =>
                      props.setRole(e.target.value.toLowerCase())
                    }
                  />
                  <label htmlFor='nama'>RTC</label>
                  <input
                    required
                    type='radio'
                    id='role'
                    name='checkbox'
                    value='rtc'
                    onChange={(e) => props.setRole(e.target.value)}
                  />
                  <label htmlFor='nama'>Visiting</label>
                  <input
                    required
                    type='radio'
                    id='role'
                    name='checkbox'
                    value='visiting'
                    onChange={(e) => props.setRole(e.target.value)}
                  />
                  <div className='col-span-4'>
                    <label htmlFor='nama' className='m-3'>
                      Bukan pilihan di atas
                    </label>
                    <input
                      required
                      type='radio'
                      id='role'
                      name='checkbox'
                      value='klinik'
                      onChange={(e) => props.setRole(e.target.value)}
                    />
                  </div>
                </div>
                <p className='mt-3 font-semibold'>
                  Status Klinik Pergigian{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
                <div className='grid grid-cols-2 gap-1'>
                  <label htmlFor='nama'>Aktif</label>
                  <input
                    required
                    type='radio'
                    name='status'
                    value='active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <label htmlFor='nama'>Tidak Aktif</label>
                  <input
                    required
                    type='radio'
                    name='status'
                    value='non-active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {props.addingData ? (
                  <BusyButton func='add' />
                ) : (
                  <SubmitButton func='add' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => props.setShowAddModal(false)}
                >
                  Kembali
                </span>
              </div>
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
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowAddModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Tambah KKIA / KD</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowAddModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='text-xs text-admin1'>
                *Daerah pada senarai KKIA/KD adalah bukan mengikut daerah
                pentadbiran perkhidmatan pergigian
              </div>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label htmlFor='nama'>Pilih KKIA / KD</label>
                  <select
                    required
                    onChange={(e) => {
                      const selectedKkia = props.kkia.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      props.setName(selectedKkia.nama);
                      props.setKodKkiaKd(selectedKkia.kodFasiliti);
                    }}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih KKIA / KD</option>
                    {props.kkia.map((k) => (
                      <option key={k.kodFasiliti} value={k.kodFasiliti}>
                        {k.nama} | di {k.daerah}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid gap-1'>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                <p className='mt-3 font-semibold'>
                  Status KKIA / KD{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid grid-cols-2 gap-1'>
                  <label htmlFor='nama'>Aktif</label>
                  <input
                    required
                    type='radio'
                    name='status'
                    value='active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <label htmlFor='nama'>Tidak Aktif</label>
                  <input
                    required
                    type='radio'
                    name='status'
                    value='non-active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {props.addingData ? (
                  <BusyButton func='add' />
                ) : (
                  <SubmitButton func='add' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => props.setShowAddModal(false)}
                >
                  Kembali
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputPegawai(props) {
  const { Dictionary, toast, readOperatorData } = useGlobalAdminAppContext();
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
                <p>
                  Nama {Dictionary[props.FType]}{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                {props.FType === 'pp' && (
                  <div className='grid gap-1'>
                    <label
                      htmlFor='default-search'
                      className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300'
                    >
                      Cari
                    </label>
                    <div className='relative'>
                      <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <svg
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
                        </svg>
                      </div>
                      <input
                        autoFocus
                        value={props.carianNama}
                        type='search'
                        className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='Cari pegawai...'
                        onChange={(e) => {
                          props.setCarianNama(e.target.value);
                        }}
                      />
                      {props.searching === false ? (
                        <button
                          type='button'
                          className='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!props.carianNama) {
                              toast.error('Sila isi nama pegawai');
                              return;
                            }
                            props.setSearching(true);
                            props.setNoPpJp('');
                            props.setAllPegawai([]);
                            const res = await readOperatorData(
                              props.FType,
                              props.carianNama
                            );
                            if (res) {
                              props.setAllPegawai(res);
                            }
                            if (!res) {
                              props.setNoPpJp('Tiada pegawai dijumpai');
                            }
                            props.setSearching(false);
                          }}
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
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                )}
                {props.FType === 'jp' && (
                  <div className='grid gap-1'>
                    <label
                      htmlFor='default-search'
                      className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300'
                    >
                      Cari
                    </label>
                    <div className='relative'>
                      <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                        <svg
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
                        </svg>
                      </div>
                      <input
                        autoFocus
                        value={props.carianNama}
                        type='search'
                        className='block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='Cari juruterapi pergigian...'
                        onChange={(e) => {
                          props.setCarianNama(e.target.value);
                        }}
                      />
                      {props.searching === false ? (
                        <button
                          type='button'
                          className='text-white absolute right-2.5 bottom-2.5 bg-admin3 hover:bg-admin4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2'
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!props.carianNama) {
                              toast.error('Sila isi nama juruterapi pergigian');
                              return;
                            }
                            props.setSearching(true);
                            props.setNoPpJp('');
                            props.setAllJp([]);
                            const res = await readOperatorData(
                              props.FType,
                              props.carianNama
                            );
                            if (res) {
                              props.setAllJp(res);
                            }
                            if (!res) {
                              props.setNoPpJp(
                                'Tiada juruterapi pergigian dijumpai'
                              );
                            }
                            props.setSearching(false);
                          }}
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
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                <p>
                  Emel{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid gap-1'>
                  <input
                    required
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                    type='text'
                    name='nama'
                    id='nama'
                    onChange={(e) => props.setEmail(e.target.value)}
                  />
                </div>
                <p>
                  Gred{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid gap-1'>
                  {props.FType === 'pp' && (
                    <select
                      required
                      onChange={(e) => props.setGred(e.target.value)}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                <div className='grid gap-1'>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                <div className='grid gap-1'>
                  <p>
                    Peranan{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <select
                    required
                    onChange={(e) => props.setRole(e.target.value)}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Peranan</option>
                    <option value='admin'>Pentadbir Klinik</option>
                    <option value='umum'>Pengguna</option>
                  </select>
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
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowAddModal(false)}
                  >
                    Kembali
                  </span>
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
  const { Dictionary, DictionaryHurufNegeri } = useGlobalAdminAppContext();
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
                  {(props.FType === 'sm' || props.FType === 'sr') &&
                    props.statusMOEIS === true && (
                      <>
                        <div>
                          <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                            MOEIS Aktif
                          </span>
                        </div>
                        <div>
                          <span className='text-xs'>
                            Tarikh kemaskini:{' '}
                            {new Date().toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </>
                    )}
                  {(props.FType === 'sm' || props.FType === 'sr') &&
                    props.statusMOEIS === false &&
                    props.isLoadingMOEIS === false && (
                      <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                        MOEIS Tidak Aktif
                      </span>
                    )}
                  {(props.FType === 'sm' || props.FType === 'sr') &&
                    props.isLoadingMOEIS === true && (
                      <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                        <span className='animate-pulse'>
                          Menyemak status MOEIS
                        </span>
                      </span>
                    )}
                  {props.FType === 'kpb' || props.FType === 'mpb' ? (
                    <>
                      <div>
                        <span className='font-bold uppercase'>Nombor plat</span>{' '}
                        {Dictionary[props.FType]}{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </div>
                      <div className='text-user9 text-lg font-semibold uppercase'>
                        Pastikan diisi dengan huruf besar & jarak{' '}
                        <i className='mr-1'>space</i> yang betul
                      </div>
                    </>
                  ) : (
                    <div className='mb-2'>
                      <p>
                        Nama {Dictionary[props.FType]}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    </div>
                  )}
                  {props.FType !== 'sr' && props.FType !== 'sm' ? (
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
                  ) : (
                    <div>
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
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      >
                        <option value=''>Pilih Sekolah</option>
                        {props.sekolah.map((s) => (
                          <option
                            value={s.NAMA_INSTITUSI}
                            id={s.ID_INSTITUSI}
                            data-kod={s.KOD_INSTITUSI}
                          >
                            {s.NAMA_INSTITUSI}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {(props.FType === 'taska' || props.FType === 'tadika') && (
                    <>
                      <div className='grid gap-2'>
                        <div>
                          Kategori {props.FType}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </div>
                        <div>
                          <select
                            required
                            onChange={(e) => props.setGovKe(e.target.value)}
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                          >
                            <option value=''>Pilih kategori..</option>
                            <option value='kerajaan'>Kerajaan</option>
                            <option value='swasta'>Swasta</option>
                          </select>
                        </div>
                      </div>
                      <div className='grid gap-2'>
                        <div>
                          <p>
                            Kod {Dictionary[props.FType]}
                            <span className='font-semibold text-lg text-user6'>
                              *
                            </span>
                          </p>
                        </div>
                        <div className='grid grid-cols-5 gap-1'>
                          <div>
                            <input
                              readOnly
                              className='appearance-none w-full px-2 py-1 text-sm text-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                              type='text'
                              value={props.FType.substring(0, 3).toUpperCase()}
                            />
                          </div>
                          <div>-</div>
                          <div className='grid grid-cols-2'>
                            <div>
                              <input
                                readOnly
                                className='appearance-none w-full px-2 py-1 text-sm text-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                                type='text'
                                value={DictionaryHurufNegeri[props.negeri]}
                              />
                            </div>
                            <div>
                              <input
                                required
                                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                                type='text'
                                value={props.kodTastadTengah}
                                pattern='[0-9]+'
                                minLength='2'
                                maxLength='2'
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    props.setKodTastadTengah(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>-</div>
                          <div className='grid grid-cols-2'>
                            <div>
                              <input
                                required
                                className='appearance-none w-full px-2 py-1 text-sm text-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                                type='text'
                                value={
                                  props.govKe === ''
                                    ? ''
                                    : props.govKe === 'kerajaan'
                                    ? 'K'
                                    : 'S'
                                }
                                disabled={true}
                              />
                            </div>
                            <div>
                              <input
                                required
                                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                                type='text'
                                value={props.kodTastadHujung}
                                pattern='[0-9]+'
                                minLength='1'
                                maxLength='3'
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    props.setKodTastadHujung(e.target.value);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='grid gap-2'>
                        <div>
                          <p>
                            Alamat {Dictionary[props.FType]}
                            <span className='font-semibold text-lg text-user6'>
                              *
                            </span>
                          </p>
                        </div>
                        <div>
                          <input
                            required
                            className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                            type='text'
                            name='catatan'
                            id='catatan'
                            onChange={(e) =>
                              props.setAlamatTastad(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(props.FType === 'sr' || props.FType === 'sm') && (
                    <>
                      <div>
                        <p>
                          Klinik / Pusat Pergigian Sekolah{' '}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                        <div className='grid grid-cols-2 mb-3'>
                          <label htmlFor='nama'>Ya</label>
                          <input
                            required
                            type='radio'
                            id='act-stat'
                            name='checkbox'
                            value='kps'
                            onChange={(e) =>
                              props.setJenisPerkhidmatanSekolah(e.target.value)
                            }
                          />
                          <label htmlFor='nama'>Tidak</label>
                          <input
                            required
                            type='radio'
                            id='act-stat'
                            name='checkbox'
                            value='kpb'
                            onChange={(e) =>
                              props.setJenisPerkhidmatanSekolah(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {(props.FType === 'kpb' || props.FType === 'mpb') && (
                    <>
                      <div>
                        <span className='font-bold uppercase'>Jenis</span>{' '}
                        {Dictionary[props.FType]}{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                        <p>
                          Contoh:{' '}
                          <span className='font-bold'>
                            Lori Trak, Caravan, Van, Treler, Bas, Coaster
                          </span>
                        </p>
                      </div>
                      <div className='grid gap-1 mb-3'>
                        <input
                          required
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                          type='text'
                          name='nama'
                          id='nama'
                          onChange={(e) =>
                            props.setSubJenisKPBMPB(e.target.value)
                          }
                        />
                      </div>
                    </>
                  )}
                  {(props.FType === 'sr' || props.FType === 'sm') && (
                    <div className='grid gap-2'>
                      <div>
                        Risiko Sekolah (PERSiS){' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </div>
                      <div className='grid gap-1'>
                        <select
                          required
                          onChange={(e) => props.setRisiko(e.target.value)}
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        >
                          <option value=''>Pilih Risiko</option>
                          <option value='rendah'>Rendah</option>
                          <option value='tinggi'>Tinggi</option>
                        </select>
                      </div>
                    </div>
                  )}
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

export function InputEvent(props) {
  const [jenisEventDd, setJenisEventDd] = useState('');
  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowAddModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Tambah Program Komuniti</h5>
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
                  {/* <p>
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p> */}
                  {/* <input
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        type='date'
                        name='tarikh'
                        id='tarikh'
                        onChange={(e) =>
                          (currentTarikh.current = e.target.value)
                        }
                      /> */}
                  {/* <CustomDatePicker />
                    <CustomDatePicker2 /> */}
                  <p>
                    Jenis Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      onChange={(e) => {
                        props.setJenisEvent(e.target.value);
                        setJenisEventDd(e.target.value);
                      }}
                      name='jenisEvent'
                      id='jenisEvent'
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                      <option value='programDewasaMuda'>
                        Program Dewasa Muda
                      </option>
                      <option value='kampungAngkatPergigian'>
                        Kampung Angkat Pergigian
                      </option>
                      <option value='ppr'>Projek Perumahan Rakyat</option>
                      <option value='we'>Institusi Warga Emas</option>
                      <option value='oku'>Institusi OKU / PDK</option>
                    </select>
                  </div>
                  {jenisEventDd === 'programDewasaMuda' && (
                    <div className='grid gap-1'>
                      <p>
                        Jenis Institusi
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        onChange={(e) =>
                          props.setKategoriInstitusi(e.target.value)
                        }
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      >
                        <option value=''>Pilih Institusi</option>
                        <option value='kolej-komuniti'>Kolej Komuniti</option>
                        <option value='kolej-vokasional'>
                          Kolej Vokasional
                        </option>
                        <option value='ipg'>
                          Institusi Pendidikan Guru (IPG)
                        </option>
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
                  <p>
                    Nama Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <input
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      type='text'
                      name='nama'
                      id='nama'
                      onChange={(e) => props.setName(e.target.value)}
                    />
                  </div>
                  <div className='grid gap-1'>
                    <p>
                      Tempat
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => props.setTempat(e.target.value)}
                      />
                    </div>
                  </div>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
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
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowAddModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
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
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalAdd}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>KEMASKINI KLINIK PERGIGIAN</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='px-3 py-1'>
                <div className='grid gap-1'>
                  <label htmlFor='nama'>Nama Klinik</label>
                  <div className='grid gap-1 font-bold'>
                    {props.editedEntity.kp}
                  </div>
                  <label htmlFor='nama'>Kod Fasiliti</label>
                  <div className='grid gap-1 font-bold'>
                    {props.editedEntity.kodFasiliti}
                  </div>
                  <label htmlFor='nama'>Perkhidmatan Klinik</label>
                  <div className='grid gap-1 font-bold'>
                    {props.editedEntity.statusRoleKlinik}
                  </div>
                  <label htmlFor='nama'>
                    Email{' '}
                    <span className='font-semibold text-lg text-admin3'>*</span>
                  </label>
                  <input
                    required
                    value={props.editedEntity.email}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    type='text'
                    name='email'
                    id='email'
                    onChange={(e) =>
                      props.setEditedEntity({
                        ...props.editedEntity,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <label htmlFor='nama'>
                  Status Klinik Pergigian{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </label>
                <div className='grid grid-cols-2'>
                  <label htmlFor='statusAktif'>Aktif</label>
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
                  <label htmlFor='statusTidakAktif'>Tidak Aktif</label>
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
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {props.editingData ? (
                  <BusyButton func='edit' />
                ) : (
                  <SubmitButton func='edit' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => props.setShowEditModal(false)}
                >
                  Batal
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputEditPegawai(props) {
  const { Dictionary } = useGlobalAdminAppContext();
  return (
    <form onSubmit={props.confirm(props.handleSubmit)}>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowEditModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalAdd}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              KEMASKINI {Dictionary[props.FType]}
            </h5>
          </div>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowEditModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='px-3 py-1'>
              <p>Nama Pegawai</p>
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.nama}
              </div>
              {props.FType === 'pp' && <p>Nombor MDC</p>}
              {props.FType === 'jp' && <p>Nombor MDTB</p>}
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.mdcNumber ? (
                  <span>{props.editedEntity.mdcNumber}</span>
                ) : (
                  <span>{props.editedEntity.mdtbNumber}</span>
                )}
              </div>
              <p>
                Emel <span className='font-semibold text-lg text-user6'>*</span>
              </p>
              <div className='grid gap-1'>
                <input
                  required
                  defaultValue={props.editedEntity.email}
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                <p>
                  Gred{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                {props.FType === 'pp' && (
                  <select
                    required
                    defaultValue={props.editedEntity.gred}
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        gred: e.target.value,
                      });
                    }}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
                    defaultValue={props.editedEntity.gred}
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        gred: e.target.value,
                      });
                    }}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
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
              <div className='grid gap-1'>
                <p>
                  Klinik Bertugas{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
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
              <div className='grid gap-1'>
                <p>
                  Role{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <select
                  required
                  defaultValue={props.editedEntity.role}
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      role: e.target.value,
                    });
                  }}
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                >
                  <option value=''>Pilih Role</option>
                  <option value='admin'>Pentadbir Klinik</option>
                  <option value='umum'>Pengguna</option>
                </select>
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
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalActions}>
          <div className={styles.actionsContainer}>
            {props.editingData ? (
              <BusyButton func='edit' />
            ) : (
              <SubmitButton func='edit' />
            )}
            <span
              className={styles.cancelBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              Batal
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

export function InputEditFacility(props) {
  const { Dictionary } = useGlobalAdminAppContext();
  return (
    <form onSubmit={props.confirm(props.handleSubmit)}>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowEditModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalEdit}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              Kemaskini {Dictionary[props.FType]}{' '}
            </h5>
          </div>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowEditModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='px-3 py-1'>
              <div className='grid gap-1'>
                {props.FType !== 'kpb' && props.FType !== 'mp' ? (
                  <p>
                    Nama {Dictionary[props.FType]}: {props.editedEntity.nama}{' '}
                  </p>
                ) : (
                  <p>
                    Nombor Plat {Dictionary[props.FType]}:{' '}
                    {props.editedEntity.nama}{' '}
                  </p>
                )}
                <br />
                <p>
                  Klinik Bertanggungjawab{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
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
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                >
                  <option value=''>Pilih Klinik Baru..</option>
                  {props.klinik.map((k) => (
                    <option className='capitalize' value={k.kodFasiliti}>
                      {k.kp}
                    </option>
                  ))}
                </select>
                {props.FType !== 'sr' && props.FType !== 'sm' ? null : (
                  <>
                    <p>
                      Risiko Sekolah (PERSiS){' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      value={props.editedEntity.risikoSekolahPersis}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          risikoSekolahPersis: e.target.value,
                        });
                      }}
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                    >
                      <option value=''>Pilih Risiko</option>
                      <option value='rendah'>Rendah</option>
                      <option value='tinggi'>Tinggi</option>
                    </select>
                  </>
                )}
                <p>
                  Status {Dictionary[props.FType]}{' '}
                  <span className='font-semibold text-lg text-admin3'>*</span>
                </p>
                <div className='grid grid-cols-2'>
                  <label htmlFor='statusAktif'>Aktif</label>
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
                  <label htmlFor='statusTidakAktif'>Tidak Aktif</label>
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
                </div>
                {props.FType !== 'sr' ? null : (
                  <>
                    <p>
                      Program Kumuran Berflourida{' '}
                      <span className='font-semibold text-lg text-admin3'>
                        *
                      </span>
                    </p>
                    <div className='grid grid-cols-2'>
                      <label htmlFor='ya-fmr'>Ya</label>
                      <input
                        checked={
                          props.editedEntity.statusFMRSekolah === 'ya'
                            ? true
                            : false
                        }
                        type='radio'
                        name='ya-fmr'
                        value='ya'
                        onChange={(e) => {
                          props.setEditedEntity({
                            ...props.editedEntity,
                            statusFMRSekolah: e.target.value,
                          });
                        }}
                      />
                      <label htmlFor='tidak-fmr'>Tidak</label>
                      <input
                        checked={
                          props.editedEntity.statusFMRSekolah === 'tidak'
                            ? true
                            : false
                        }
                        type='radio'
                        name='tidak-fmr'
                        value='tidak'
                        onChange={(e) => {
                          props.setEditedEntity({
                            ...props.editedEntity,
                            statusFMRSekolah: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {props.editingData ? (
                  <BusyButton func='edit' />
                ) : (
                  <SubmitButton func='edit' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => props.setShowEditModal(false)}
                >
                  Batal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function InputEditEvent(props) {
  const [jenisEventDd, setJenisEventDd] = useState('');
  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Kemaskini Program Komuniti</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='px-3 py-1'>
                <div className='mb-3'>
                  {/* <p>
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p> */}
                  {/* <input
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        type='date'
                        name='tarikh'
                        id='tarikh'
                        onChange={(e) =>
                          (currentTarikh.current = e.target.value)
                        }
                      /> */}
                  {/* <CustomDatePicker />
                    <CustomDatePicker2 /> */}
                  <h1 className='m-3 text-2xl'>
                    Nama:{' '}
                    <span className='font-bold font'>
                      {props.editedEntity.nama}
                    </span>
                  </h1>
                  <p>
                    Jenis Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      value={props.editedEntity.jenisEvent}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          jenisEvent: e.target.value,
                        });
                        setJenisEventDd(e.target.value);
                      }}
                      name='jenisEvent'
                      id='jenisEvent'
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
                      <option value='programDewasaMuda'>
                        Program Dewasa Muda
                      </option>
                      <option value='kampungAngkatPergigian'>
                        Kampung Angkat Pergigian
                      </option>
                      <option value='ppr'>Projek Perumahan Rakyat</option>
                      <option value='we'>Institusi Warga Emas</option>
                      <option value='oku'>Institusi OKU / PDK</option>
                    </select>
                  </div>
                  {jenisEventDd === 'programDewasaMuda' && (
                    <div className='grid gap-1'>
                      <p>
                        Kategori Institusi
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                        <option value='kolej-vokasional'>
                          Kolej Vokasional
                        </option>
                        <option value='ipg'>
                          Institusi Pendidikan Guru (IPG)
                        </option>
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
                  {/* <p>
                    Nama Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <input
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      value={props.editedEntity.nama}
                      type='text'
                      name='nama'
                      id='nama'
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          nama: e.target.value,
                        });
                      }}
                    />
                  </div> */}
                  <div className='grid gap-1'>
                    <p>
                      Tempat
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                  </div>
                  <p>
                    Klinik Bertugas{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.editingData ? (
                    <BusyButton func='edit' />
                  ) : (
                    <SubmitButton func='edit' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowEditModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpAddEvent(props) {
  const { getCurrentUser, toast } = useGlobalAdminAppContext();

  const [loginInfo, setLoginInfo] = useState({
    negeri: 'SIAPA NEGERI KAU HA???', // initial state ni kena ada, kalau x nanti dia error
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await getCurrentUser();
      setLoginInfo({
        ...res.data,
        isLoggedIn: true,
      });
    };
    getUser().catch((err) => {
      console.log(err);
      // toast.error(
      //   'Uh oh, server kita mengalami masalah. Sila berhubung dengan team Gi-Ret 2.0 untuk bantuan. Kod: input-kp-tambah-program'
      // );
    });
  }, []);

  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowAddModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Tambah Program Komuniti</h5>
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
                  <p>
                    Jenis Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      onChange={(e) => {
                        props.setJenisEvent(e.target.value);
                      }}
                      name='jenisEvent'
                      id='jenisEvent'
                    >
                      <option value=''>Jenis Program / Aktiviti</option>
                      <option value='projek-komuniti'>Projek Komuniti</option>
                      <option value='ppkps'>
                        Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                        Sekolah
                      </option>
                      <option value='oap'>Program Orang Asli dan Penan</option>
                      <option value='penjara-koreksional'>
                        Institusi Penjara
                      </option>
                      {loginInfo.negeri === 'Sabah' && (
                        <option value='fds'>Flying Dental Service</option>
                      )}
                      {loginInfo.negeri === 'Kelantan' && (
                        <option value='rtc'>RTC Kelantan , Tunjung</option>
                      )}
                      {/* {206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211
                      <option value='incremental'>
                        Program Pergigian Sekolah Sesi 2022/2023
                      </option> */}
                    </select>
                  </div>
                  {/* <p>
                    Tarikh Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <StartDate {...props} />
                  <EndDate {...props} /> */}
                  {/* {props.editedEntity.jenisEvent === 'programDewasaMuda' ||
                  props.editedEntity.jenisEvent === 'we' ||
                  props.editedEntity.jenisEvent === 'oku' ? (
                    <div className='grid grid-gap-1 mt-2'>
                      <p>Enrolmen: </p>
                      <input
                        autoFocus
                        type='text'
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        value={
                          props.editedEntity.enrolmenInstitusi ===
                          'NOT APPLICABLE'
                            ? ''
                            : props.editedEntity.enrolmenInstitusi
                        }
                        onChange={(e) => {
                          props.setEditedEntity({
                            ...props.editedEntity,
                            enrolmenInstitusi: e.target.value,
                          });
                        }}
                      />
                    </div>
                  ) : null} */}
                  {/* <p className='mt-3 font-semibold'>
                    Mod Penyampaian Perkhidmatan
                  </p>
                  <div className='grid grid-cols-3 gap-1'>
                    <label htmlFor='modPpb'>Pasukan Pergigian Bergerak</label>
                    <input
                      type='checkbox'
                      name='mod'
                      value='ppb'
                      checked={
                        props.editedEntity.modPenyampaianPerkhidmatan
                          ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                              'ppb'
                            )
                          : false
                      }
                      onChange={(e) => {
                        props.eventModeChecker(e.target.value);
                      }}
                    />
                    <div />
                    <label htmlFor='modKpb'>Klinik Pergigian Bergerak</label>
                    <input
                      type='checkbox'
                      name='mod'
                      value='kpb'
                      checked={
                        props.editedEntity.modPenyampaianPerkhidmatan
                          ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                              'kpb'
                            )
                          : false
                      }
                      onChange={(e) => {
                        props.eventModeChecker(e.target.value);
                        setShowKpb(!showKpb);
                      }}
                    />
                    {showKpb ? (
                      <div className='grid gap-1'>
                        <select
                          name='kpb'
                          id='kpb'
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                          value={props.editedEntity.penggunaanKpb}
                          onChange={(e) => {
                            props.setEditedEntity({
                              ...props.editedEntity,
                              penggunaanKpb: e.target.value,
                            });
                          }}
                        >
                          <option value=''>Pilih KPB</option>
                          {kpb.map((item) => (
                            <option value={item.nama}>{item.nama}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div />
                    )}
                    <label htmlFor='modMpb'>Makmal Pergigian Bergerak</label>
                    <input
                      type='checkbox'
                      name='modMpb'
                      value='mpb'
                      checked={
                        props.editedEntity.modPenyampaianPerkhidmatan
                          ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                              'mpb'
                            )
                          : false
                      }
                      onChange={(e) => {
                        props.eventModeChecker(e.target.value);
                        setShowMpb(!showMpb);
                      }}
                    />
                    {showMpb ? (
                      <div className='grid gap-1'>
                        <select
                          name='mpb'
                          id='mpb'
                          className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                          value={props.editedEntity.penggunaanMpb}
                          onChange={(e) => {
                            props.setEditedEntity({
                              ...props.editedEntity,
                              penggunaanMpb: e.target.value,
                            });
                          }}
                        >
                          <option value=''>Pilih MPB</option>
                          {mpb.map((item) => (
                            <option value={item.nama}>{item.nama}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div> */}
                  <div className='grid gap-1'>
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      required
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      type='text'
                      name='nama'
                      id='nama'
                      value={props.name}
                      onChange={(e) => props.setName(e.target.value)}
                    />
                  </div>
                  <div className='grid gap-1'>
                    <p>
                      Tempat
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        type='text'
                        name='nama'
                        id='nama'
                        value={props.tempat}
                        onChange={(e) => props.setTempat(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.editingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowAddModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditPegawai(props) {
  const { Dictionary } = useGlobalAdminAppContext();
  return (
    <form onSubmit={props.confirm(props.handleSubmit)}>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowEditModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalAdd}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              Kemaskini {Dictionary[props.FType]}
            </h5>
          </div>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowEditModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='px-3 py-1'>
              <p>Nama Pegawai</p>
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.nama}
              </div>
              {props.FType === 'pp' && <p>Nombor MDC</p>}
              {props.FType === 'jp' && <p>Nombor MDTB</p>}
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.mdcNumber ? (
                  <span>{props.editedEntity.mdcNumber}</span>
                ) : (
                  <span>{props.editedEntity.mdtbNumber}</span>
                )}
              </div>
              <p>Gred</p>
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.gred}
              </div>
              <p>Emel</p>
              <div className='grid gap-1 font-bold normal-case'>
                {props.editedEntity.email}
              </div>
              <p>Peranan</p>
              <div className='grid gap-1 font-bold'>
                {props.editedEntity.role === 'admin'
                  ? 'Pentadbir Klinik'
                  : 'Pengguna'}
              </div>
              {/* <p>
                Emel <span className='font-semibold text-lg text-user6'>*</span>
              </p>
              <div className='grid gap-1'>
                <input
                  required
                  defaultValue={props.editedEntity.email}
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                  type='text'
                  name='email'
                  id='email'
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      email: e.target.value,
                    });
                  }
                  }
                />
              </div>
              <div className='grid gap-1'>
                <p>
                  Gred{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                {props.FType === 'pp' ? (
                  <select
                    readOnly={true}
                    value={props.editedEntity.gred}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                    // onChange={(e) => (currentGred.current = e.target.value)}
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
                ) : (
                  <select
                    defaultValue={props.editedEntity.gred}
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                    // onChange={(e) => (currentGred.current = e.target.value)}
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
              <div className='grid gap-1'>
                <p>
                  Role{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <select
                  readOnly={true}
                  value={props.editedEntity.role}
                  className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                  onChange={(e) => (currentRole.current = e.target.value)}
                >
                  <option value=''>Pilih Role</option>
                  <option value='admin'>Pentadbir Klinik</option>
                  <option value='umum'>Pengguna</option>
                </select>
              </div> */}
              <p>CSCSP Verified</p>
              <div className='grid grid-cols-2'>
                <label htmlFor='cscspYes'>Mempunyai Sijil CSCSP</label>
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
                <label htmlFor='cscspNo'>Tidak Mempunyai Sijil CSCSP</label>
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
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalActions}>
          <div className={styles.actionsContainer}>
            {props.editingData ? (
              <BusyButton func='edit' />
            ) : (
              <SubmitButton func='edit' />
            )}
            <span
              className={styles.cancelBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              Batal
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

export function InputKpEditFacility(props) {
  const { Dictionary } = useGlobalAdminAppContext();

  // calculate sum enrolmenTastad = enrolmenKurang4Tahun + enrolmen5Tahun + enrolmen6Tahun
  useEffect(() => {
    props.setEditedEntity({
      ...props.editedEntity,
      enrolmenTastad:
        parseInt(props.editedEntity.enrolmenKurang4Tahun) +
        parseInt(props.editedEntity.enrolmen5Tahun) +
        parseInt(props.editedEntity.enrolmen6Tahun),
    });
  }, [
    props.editedEntity.enrolmenKurang4Tahun,
    props.editedEntity.enrolmen5Tahun,
    props.editedEntity.enrolmen6Tahun,
  ]);

  return (
    <form onSubmit={props.confirm(props.handleSubmit)}>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowEditModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalEdit}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              Kemaskini {Dictionary[props.FType]}{' '}
            </h5>
          </div>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowEditModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='px-3 py-1'>
              <div className='grid gap-2'>
                <p>
                  Nama {Dictionary[props.FType]}: {props.editedEntity.nama}{' '}
                </p>
                <p>Jenis Fasiliti: {props.editedEntity.jenisFasiliti}</p>
                <div className='grid grid-cols-[3fr_1fr]'>
                  <label htmlFor='enrolmentKurang4Tahun'>
                    JUMLAH ENROLMEN :
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </label>
                  <input
                    disabled
                    required
                    type='number'
                    min='1'
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                  <label htmlFor='enrolmentKurang4Tahun'>
                    Enrolmen ≤ 4 Tahun:
                  </label>
                  <input
                    type='number'
                    min='0'
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                  <label htmlFor='enrolment5Tahun'>Enrolmen 5 Tahun:</label>
                  <input
                    type='number'
                    min='0'
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                  <label htmlFor='enrolment6Tahun'>Enrolmen 6 Tahun:</label>
                  <input
                    type='number'
                    min='0'
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                    value={props.editedEntity.enrolmen6Tahun}
                    onChange={(e) => {
                      props.setEditedEntity({
                        ...props.editedEntity,
                        enrolmen6Tahun: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.modalActions}>
              <div className={styles.actionsContainer}>
                {props.editingData ? (
                  <BusyButton func='edit' />
                ) : (
                  <SubmitButton func='edit' />
                )}
                <span
                  className={styles.cancelBtn}
                  onClick={() => props.setShowEditModal(false)}
                >
                  Batal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function InputKpEditEvent(props) {
  const { Dictionary, readDataForKp } = useGlobalAdminAppContext();
  const [showKpb, setShowKpb] = useState(false);
  const [showKpb2, setShowKpb2] = useState(false);
  const [showKpb3, setShowKpb3] = useState(false);
  const [showMpb, setShowMpb] = useState(false);
  const [showMpb2, setShowMpb2] = useState(false);
  const [showMpb3, setShowMpb3] = useState(false);
  const [kpb, setKpb] = useState([]);
  const [mpb, setMpb] = useState([]);

  useEffect(() => {
    readDataForKp('kpb-all').then((res) => {
      setKpb(res.data);
    });
    readDataForKp('mpb-all').then((res) => {
      setMpb(res.data);
    });
    if (props.editedEntity.penggunaanKpb !== 'NOT APPLICABLE') {
      setShowKpb(true);
    }
    if (props.editedEntity.penggunaanMpb !== 'NOT APPLICABLE') {
      setShowMpb(true);
    }
    return () => {
      setShowKpb(false);
      setShowMpb(false);
    };
  }, []);

  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Kemaskini Program / Aktiviti</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='px-3 py-1'>
                <div className='mb-3'>
                  <p className='mt-1'>Jenis Program Komuniti</p>
                  <div className='grid gap-1 font-bold mb-1'>
                    {Dictionary[props.editedEntity.jenisEvent]}
                  </div>
                  <h1 className='m-3 text-2xl'>
                    Nama:{' '}
                    <span className='font-bold font'>
                      {props.editedEntity.nama}
                    </span>
                  </h1>
                  <p className='font-semibold'>
                    Tarikh Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  {/* <input
                      readOnly
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={props.editedEntity.tarikh}
                    /> */}
                  <div className='flex flex-row justify-center items-center px-5'>
                    <p className='whitespace-nowrap text-xs text-right'>
                      tarikh mula :
                    </p>
                    <StartDate {...props} />
                    <p className='whitespace-nowrap text-xs text-right'>
                      tarikh akhir :
                    </p>
                    <EndDate {...props} />
                  </div>
                  {/* <div className='grid gap-1'> */}
                  {/* <input
                      disabled={true}
                      type='text'
                      name='jenisEvent'
                      id='jenisEvent'
                      readOnly
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent overflow-x-hidden'
                      value={Dictionary[props.editedEntity.jenisEvent]}
                    /> */}
                  {/* <select
                        disabled={true}
                        readOnly
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent overflow-x-hidden'
                        value={props.editedEntity.jenisEvent}
                        // onChange={(e) => {
                        //   currentJenisEvent.current = e.target.value;
                        //   setEditedEntity({
                        //     ...editedEntity,
                        //     jenisEvent: e.target.value,
                        //   });
                        // }}
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                        <option value='pps20'>
                          program pergigian sekolah sesi 2022/2023
                        </option>
                      </select> */}
                  {/* </div> */}
                  {props.editedEntity.jenisEvent === 'programDewasaMuda' ||
                  props.editedEntity.jenisEvent === 'we' ||
                  props.editedEntity.jenisEvent === 'oku' ? (
                    <div className='grid grid-gap-1 mt-2'>
                      <p>
                        Enrolmen:{' '}
                        {/* <span className='font-semibold text-lg text-user6'>
                          *
                        </span> */}
                      </p>
                      <input
                        // required
                        type='number'
                        min='0'
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                    </div>
                  ) : null}
                  <p className='mt-3 font-semibold'>
                    Mod Penyampaian Perkhidmatan
                  </p>
                  <div className='w-full'>
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modPpb'>
                          Pasukan Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='mod'
                          value='ppb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'ppb'
                                )
                              : false
                          }
                          onChange={(e) => {
                            props.eventModeChecker(e.target.value);
                          }}
                          className='w-5 h-5'
                        />
                      </div>
                    </div>
                    {/* {props.editedEntity.jenisEvent === 'incremental' ? (
                      <div className='grid grid-cols-2 py-1'>
                        <div className='grid grid-cols-[3fr_1fr]'>
                          <label htmlFor='modStatik'>
                            Kinik Pergigian Statik
                          </label>
                          <input
                            type='checkbox'
                            name='mod'
                            value='statik'
                            checked={
                              props.editedEntity.modPenyampaianPerkhidmatan
                                ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                    'statik'
                                  )
                                : false
                            }
                            onChange={(e) => {
                              props.eventModeChecker(e.target.value);
                            }}
                            className='w-5 h-5'
                          />
                        </div>
                      </div>
                    ) : null} */}
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modKpb'>
                          Klinik Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='mod'
                          value='kpb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'kpb'
                                )
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
                              name='kpb'
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
                                .map((k) => (
                                  <option key={k.id} value={k.nama}>
                                    {k.createdByDaerah} | {k.subJenisKPBMPB} |{' '}
                                    {k.nama}
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
                                name='kpb2'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih KPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
                                    </option>
                                  ))}
                              </select>
                              <span
                                className={` ${
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
                                name='kpb3'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih KPB
                                </option>
                                {kpb
                                  .filter(
                                    (k) =>
                                      ![
                                        props.editedEntity.penggunaanKpb,
                                        props.editedEntity.penggunaanKpb2,
                                      ].includes(k.nama)
                                  )
                                  .map((item) => (
                                    <option value={item.nama}>
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
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
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modMpb'>
                          Makmal Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='modMpb'
                          value='mpb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'mpb'
                                )
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
                              name='mpb'
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
                                    {item.createdByDaerah} |{' '}
                                    {item.subJenisKPBMPB} | {item.nama}
                                  </option>
                                ))}
                            </select>
                            {showMpb3 === false ? (
                              <span
                                className={` ${
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
                                name='mpb2'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih MPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
                                    </option>
                                  ))}
                              </select>
                              <span
                                className={` ${
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
                                name='mpb3'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih MPB
                                </option>
                                {mpb
                                  .filter(
                                    (k) =>
                                      ![
                                        props.editedEntity.penggunaanMpb,
                                        props.editedEntity.penggunaanMpb2,
                                      ].includes(k.nama)
                                  )
                                  .map((item) => (
                                    <option value={item.nama}>
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
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
                  </div>
                  {/* <div className='grid gap-1'>
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                      type='text'
                      name='nama'
                      id='nama'
                      value={props.editedEntity.nama}
                      onChange={(e) => {
                        props.setEditedEntity({
                          ...props.editedEntity,
                          nama: e.target.value,
                        });
                      }}
                    />
                  </div> */}
                  <div className='grid gap-1'>
                    <p>
                      Tempat
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                        type='text'
                        name='nama'
                        id='nama'
                        value={props.editedEntity.tempat}
                        onChange={(e) => {
                          props.setEditedEntity({
                            ...props.editedEntity,
                            tempat: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.editingData ? (
                    <BusyButton func='edit' />
                  ) : (
                    <SubmitButton func='edit' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowEditModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditEventFromDaerah(props) {
  const { Dictionary, readDataForKp } = useGlobalAdminAppContext();
  const [showKpb, setShowKpb] = useState(false);
  const [showKpb2, setShowKpb2] = useState(false);
  const [showKpb3, setShowKpb3] = useState(false);
  const [showMpb, setShowMpb] = useState(false);
  const [showMpb2, setShowMpb2] = useState(false);
  const [showMpb3, setShowMpb3] = useState(false);
  const [kpb, setKpb] = useState([]);
  const [mpb, setMpb] = useState([]);

  useEffect(() => {
    readDataForKp('kpb-all').then((res) => {
      setKpb(res.data);
    });
    readDataForKp('mpb-all').then((res) => {
      setMpb(res.data);
    });
    if (props.editedEntity.penggunaanKpb !== 'NOT APPLICABLE') {
      setShowKpb(true);
    }
    if (props.editedEntity.penggunaanMpb !== 'NOT APPLICABLE') {
      setShowMpb(true);
    }
    return () => {
      setShowKpb(false);
      setShowMpb(false);
    };
  }, []);

  return (
    <>
      <form onSubmit={props.confirm(props.handleSubmit)}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowEditModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalEvent}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Kemaskini Program / Aktiviti</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='px-3 py-1'>
                <div className='mb-3'>
                  <p className='mt-1'>Jenis Program Komuniti</p>
                  <div className='grid gap-1 font-bold mb-1'>
                    {Dictionary[props.editedEntity.jenisEvent]}
                  </div>
                  <h1 className='m-3 text-2xl'>
                    Nama:{' '}
                    <span className='font-bold font'>
                      {props.editedEntity.nama}
                    </span>
                  </h1>
                  <p>
                    Tarikh Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  {/* <input
                      readOnly
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={props.editedEntity.tarikh}
                    /> */}
                  <div className='flex flex-row justify-center items-center px-5'>
                    <p className='whitespace-nowrap text-xs text-right'>
                      tarikh mula :
                    </p>
                    <StartDate {...props} />
                    <p className='whitespace-nowrap text-xs text-right'>
                      tarikh akhir :
                    </p>
                    <EndDate {...props} />
                  </div>
                  {/* <div className='grid gap-1'> */}
                  {/* <input
                      disabled={true}
                      type='text'
                      name='jenisEvent'
                      id='jenisEvent'
                      readOnly
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
 overflow-x-hidden'
                      value={Dictionary[props.editedEntity.jenisEvent]}
                    /> */}
                  {/* <select
                        disabled={true}
                        readOnly
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
 overflow-x-hidden'
                        value={props.editedEntity.jenisEvent}
                        // onChange={(e) => {
                        //   currentJenisEvent.current = e.target.value;
                        //   setEditedEntity({
                        //     ...editedEntity,
                        //     jenisEvent: e.target.value,
                        //   });
                        // }}
                        name='jenisEvent'
                        id='jenisEvent'
                      >
                        <option value=''>Jenis Program / Aktiviti</option>
                        <option value='projek-komuniti'>Projek Komuniti</option>
                        <option value='ppkps'>
                          Program Pemasyarakatan Perkhidmatan Klinik Pergigian
                          Sekolah
                        </option>
                        <option value='oap'>
                          Program Orang Asli dan Penan
                        </option>
                        <option value='pps20'>
                          program pergigian sekolah sesi 2022/2023
                        </option>
                      </select> */}
                  {/* </div> */}
                  {props.editedEntity.jenisEvent === 'programDewasaMuda' ||
                  props.editedEntity.jenisEvent === 'we' ||
                  props.editedEntity.jenisEvent === 'oku' ? (
                    <div className='grid grid-gap-1 mt-2'>
                      <p>
                        Enrolmen:{' '}
                        {/* <span className='font-semibold text-lg text-user6'>
                          *
                        </span> */}
                      </p>
                      <input
                        // required
                        type='number'
                        min='0'
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
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
                    </div>
                  ) : null}
                  <p className='mt-3 font-semibold'>
                    Mod Penyampaian Perkhidmatan
                  </p>
                  <div className='w-full'>
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modPpb'>
                          Pasukan Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='mod'
                          value='ppb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'ppb'
                                )
                              : false
                          }
                          onChange={(e) => {
                            props.eventModeChecker(e.target.value);
                          }}
                          className='w-5 h-5'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modKpb'>
                          Klinik Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='mod'
                          value='kpb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'kpb'
                                )
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
                              name='kpb'
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
                                    {item.createdByDaerah} |{' '}
                                    {item.subJenisKPBMPB} | {item.nama}
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
                                name='kpb2'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih KPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
                                    </option>
                                  ))}
                              </select>
                              <span
                                className={` ${
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
                                name='kpb3'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih KPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
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
                    <div className='grid grid-cols-2 py-1'>
                      <div className='grid grid-cols-[3fr_1fr]'>
                        <label htmlFor='modMpb'>
                          Makmal Pergigian Bergerak
                        </label>
                        <input
                          type='checkbox'
                          name='modMpb'
                          value='mpb'
                          checked={
                            props.editedEntity.modPenyampaianPerkhidmatan
                              ? props.editedEntity.modPenyampaianPerkhidmatan.includes(
                                  'mpb'
                                )
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
                              name='mpb'
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
                                    {item.createdByDaerah} |{' '}
                                    {item.subJenisKPBMPB} | {item.nama}
                                  </option>
                                ))}
                            </select>
                            {showMpb3 === false ? (
                              <span
                                className={` ${
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
                                name='mpb2'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih MPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
                                    </option>
                                  ))}
                              </select>
                              <span
                                className={` ${
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
                                name='mpb3'
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
                                <option value='NOT APPLICABLE'>
                                  Pilih MPB
                                </option>
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
                                      {item.createdByDaerah} |{' '}
                                      {item.subJenisKPBMPB} | {item.nama}
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
                  </div>{' '}
                  {/* <div className='grid gap-1'>
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      readOnly
                      className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent
'
                      type='text'
                      name='nama'
                      id='nama'
                      value={props.editedEntity.nama}
                    />
                  </div> */}
                  <div className='grid gap-1'>
                    <p>
                      Tempat
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <div className='grid gap-1'>
                      <input
                        readOnly
                        className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                        type='text'
                        name='nama'
                        id='nama'
                        value={props.editedEntity.tempat}
                        onChange={(e) => {
                          props.setEditedEntity({
                            ...props.editedEntity,
                            tempat: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {props.editingData ? (
                    <BusyButton func='edit' />
                  ) : (
                    <SubmitButton func='edit' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowEditModal(false)}
                  >
                    Kembali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export function InputKpEditKPBMPB(props) {
  const { Dictionary } = useGlobalAdminAppContext();

  return (
    <form onSubmit={props.confirm(props.handleSubmit)}>
      <div
        className={styles.darkBG}
        onClick={() => props.setShowEditModal(false)}
      />
      <div className={styles.centered}>
        <div className={styles.modalEdit}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              Kemaskini {Dictionary[props.FType]}{' '}
            </h5>
          </div>
          <span
            className={styles.closeBtn}
            onClick={() => props.setShowEditModal(false)}
          >
            <RiCloseLine style={{ marginBottom: '-3px' }} />
          </span>
          <div className={styles.modalContent}>
            <div className='grid gap-1'>
              <p>
                Nombor Plat:{' '}
                <p className='capitalize'>{props.editedEntity.nama}</p>{' '}
              </p>
              {props.tempatPenggunaan !== 'sekolah-rendah' &&
              props.tempatPenggunaan !== 'sekolah-menengah' ? (
                <div className='grid grid-gap-1'>
                  <p>
                    Tarikh Beroperasi:{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='flex flex-row justify-center items-center px-5'>
                    <StartDate {...props} />
                    <EndDate {...props} />
                  </div>
                </div>
              ) : null}
              <p>
                Digunakan di:{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </p>
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
                className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
              >
                <option value=''>Pilih fasiliti</option>
                <option value='kp'>Klinik Pergigian</option>
                <option value='kkiakd'>KKIA / KD</option>
                <option value='tastad'>Taska / Tadika</option>
                <option value='sekolah-rendah'>Sekolah Rendah</option>
                <option value='sekolah-menengah'>Sekolah Menengah</option>
              </select>
              {props.tempatPenggunaan === 'kp' ? (
                <div className='grid gap-1'>
                  <p>
                    Klinik Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Klinik</option>
                    {props.allKlinik.map((k) => (
                      <option className='capitalize' value={k.kodFasiliti}>
                        {k.daerah} | {k.kp}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {props.tempatPenggunaan === 'kkiakd' ? (
                <div className='grid gap-1'>
                  <p>
                    KKIA / KD Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih KKIA / KD</option>
                    {props.allKkiaKd.map((k) => (
                      <option className='capitalize' value={k.kodKkiaKd}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {props.tempatPenggunaan === 'tastad' ? (
                <div className='grid gap-1'>
                  <p>
                    Taska / Tadika Bertanggungjawab{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Taska / Tadika</option>
                    {props.allTastad.map((tt) => (
                      <option className='capitalize' value={tt.kodTastad}>
                        {tt.createdByDaerah} | {tt.nama}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              {props.tempatPenggunaan === 'sekolah-rendah' && (
                <div className='grid gap-1'>
                  <p>
                    Nama Sekolah Rendah{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Sekolah Rendah</option>
                    {props.allSR.map((sr) => (
                      <option className='capitalize' value={sr.kodSekolah}>
                        {sr.nama} | {sr.kodSekolah}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {props.tempatPenggunaan === 'sekolah-menengah' && (
                <div className='grid gap-1'>
                  <p>
                    Nama Sekolah Menengah{' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
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
                    className='appearance-none w-full px-2 py-1 text-sm text-user1 border border-user1 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-user1 focus:border-transparent'
                  >
                    <option value=''>Pilih Sekolah Menengah</option>
                    {props.allSM.map((sm) => (
                      <option className='capitalize' value={sm.kodSekolah}>
                        {sm.nama} | {sm.kodSekolah}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              {props.editingData ? (
                <BusyButton func='edit' />
              ) : (
                <SubmitButton func='edit' />
              )}
              <span
                className={styles.cancelBtn}
                onClick={() => props.setShowEditModal(false)}
              >
                Batal
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}