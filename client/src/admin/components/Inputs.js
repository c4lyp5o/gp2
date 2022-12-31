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
    className: 'border-2 w-full mb-2',
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
    className: 'border-2 w-full',
  });
};

export function InputKlinik(props) {
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
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
                  <div className='grid gap-1'>
                    <label htmlFor='nama'>
                      Pilih Klinik{' '}
                      <span className='font-semibold text-lg text-admin3'>
                        *
                      </span>
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
                      className='border-2 max-w-sm'
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
                      <span className='font-semibold text-lg text-admin3'>
                        *
                      </span>
                    </label>
                    <input
                      required
                      className='border-2'
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
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
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
                      className='border-2 max-w-sm'
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
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => {
                        const selectedKlinik = props.klinik.find(
                          (k) => k.kodFasiliti === e.target.value
                        );
                        props.setKp(selectedKlinik.kp);
                        props.setKodFasiliti(selectedKlinik.kodFasiliti);
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
  const { Dictionary, toast, readDpimsData, readMdtbData } =
    useGlobalAdminAppContext();
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
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
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
                              const res = await readDpimsData(props.carianNama);
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
                          className='border-2 max-w-sm'
                          onChange={(e) => {
                            const selectedPp = props.allPegawai.find(
                              (p) => p.mdcNumber === parseInt(e.target.value)
                            );
                            props.setName(selectedPp.nama);
                            props.setRegNumber(selectedPp.mdcNumber);
                          }}
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
                                toast.error(
                                  'Sila isi nama juruterapi pergigian'
                                );
                                return;
                              }
                              props.setSearching(true);
                              props.setNoPpJp('');
                              props.setAllJp([]);
                              const res = await readMdtbData(props.carianNama);
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
                          className='border-2 max-w-sm'
                          onChange={(e) => {
                            const selectedJp = props.allJp.find(
                              (p) => p.mdtbNumber === e.target.value
                            );
                            props.setName(selectedJp.nama);
                            props.setRegNumber(selectedJp.mdtbNumber);
                          }}
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
                      className='border-2'
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
                        className='border-2'
                        onChange={(e) => props.setGred(e.target.value)}
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
                        className='border-2'
                        onChange={(e) => props.setGred(e.target.value)}
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
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => {
                        const selectedKlinik = props.klinik.find(
                          (k) => k.kodFasiliti === e.target.value
                        );
                        props.setKp(selectedKlinik.kp);
                        props.setKodFasiliti(selectedKlinik.kodFasiliti);
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
                  <div className='grid gap-1'>
                    <p>
                      Peranan{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => props.setRole(e.target.value)}
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

export function InputFacility(props) {
  const { Dictionary } = useGlobalAdminAppContext();
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
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  {(props.FType === 'sm' || props.FType === 'sr') &&
                    (props.statusApdm === true ? (
                      <>
                        <div>
                          <span className='bg-user7 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                            APDM Aktif
                          </span>
                        </div>
                        <div>
                          <span className='text-xs'>
                            Tarikh kemaskini:{' '}
                            {new Date().toLocaleDateString('en-GB')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className='bg-admin2 text-kaunterWhite text-xs font-semibold px-2.5 py-0.5 rounded'>
                        APDM Tidak Aktif
                      </span>
                    ))}
                  {props.FType === 'kpb' || props.FType === 'mp' ? (
                    <div>
                      Nombor plat {Dictionary[props.FType]}{' '}
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p>
                        Nama {Dictionary[props.FType]}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    </div>
                  )}
                  {props.FType !== 'sr' && props.FType !== 'sm' ? (
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='nama'
                        id='nama'
                        onChange={(e) => props.setName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2 max-w-sm'
                        name='kp'
                        onChange={(e) => {
                          props.setName(e.target.value);
                          const index = e.target.selectedIndex;
                          const el = e.target.childNodes[index];
                          props.setKodSekolah(el.getAttribute('id'));
                        }}
                      >
                        <option value=''>Pilih Sekolah</option>
                        {props.sekolah.map((s) => (
                          <option value={s.namaSekolah} id={s.kodSekolah}>
                            {s.namaSekolah}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {props.FType === 'taska' || props.FType === 'tadika' ? (
                  <>
                    <div>
                      <p>
                        Kod {Dictionary[props.FType]}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    </div>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='kodTastad'
                        id='kodTastad'
                        onChange={(e) => props.setKodTastad(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>
                        Alamat {Dictionary[props.FType]}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    </div>
                    <div className='grid gap-1'>
                      <input
                        required
                        className='border-2'
                        type='text'
                        name='catatan'
                        id='catatan'
                        onChange={(e) => props.setAlamatTastad(e.target.value)}
                      />
                      <div>
                        <p>
                          Enrolmen {Dictionary[props.FType]}
                          <span className='font-semibold text-lg text-user6'>
                            *
                          </span>
                        </p>
                      </div>
                      <div className='grid gap-1'>
                        <input
                          required
                          className='border-2'
                          type='number'
                          min='1'
                          name='enrolmen'
                          id='enrolmen'
                          onChange={(e) =>
                            props.setEnrolmenTastad(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : null}
                {props.FType === 'ins' ? (
                  <>
                    <div>
                      <p>
                        Jenis {Dictionary[props.FType]}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                    </div>
                    <div className='grid gap-1'>
                      <select
                        required
                        className='border-2'
                        onChange={(e) =>
                          props.setKategoriInstitusi(e.target.value)
                        }
                      >
                        <option value=''>Pilih Jenis Institusi</option>
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
                  </>
                ) : null}
                <p>
                  Status {Dictionary[props.FType]}{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid grid-cols-2'>
                  <label htmlFor='nama'>Aktif</label>
                  <input
                    required
                    type='radio'
                    id='act-stat'
                    name='checkbox'
                    value='active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                  <label htmlFor='nama'>Tidak Aktif</label>
                  <input
                    required
                    type='radio'
                    id='act-stat'
                    name='checkbox'
                    value='non-active'
                    onChange={(e) =>
                      props.setStatusPerkhidmatan(e.target.value)
                    }
                  />
                </div>
                <p>
                  Klinik Bertanggungjawab{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <div className='grid gap-1'>
                  <select
                    required
                    className='border-2'
                    onChange={(e) => {
                      const selectedKlinik = props.klinik.find(
                        (k) => k.kodFasiliti === e.target.value
                      );
                      props.setKp(selectedKlinik.kp);
                      props.setKodFasiliti(selectedKlinik.kodFasiliti);
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
                {props.FType !== 'sr' && props.FType !== 'sm' ? null : (
                  <p>
                    Risiko Sekolah (PERSiS){' '}
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                )}
                {props.FType !== 'sr' && props.FType !== 'sm' ? null : (
                  <div className='grid gap-1'>
                    <select
                      required
                      className='border-2'
                      onChange={(e) => props.setRisiko(e.target.value)}
                    >
                      <option value=''>Pilih Risiko</option>
                      <option value='rendah'>Rendah</option>
                      <option value='tinggi'>Tinggi</option>
                    </select>
                  </div>
                )}
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
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  {/* <p>
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p> */}
                  {/* <input
                        required
                        className='border-2'
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
                      className='border-2 w-full'
                      onChange={(e) => {
                        props.setJenisEvent(e.target.value);
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
                        Jenis Institusi
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <select
                        required
                        className='border-2'
                        onChange={(e) =>
                          props.setKategoriInstitusi(e.target.value)
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
                  <p>
                    Nama Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <input
                      required
                      className='border-2'
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
                        className='border-2'
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
                      className='border-2'
                      onChange={(e) => {
                        const selectedKlinik = props.klinik.find(
                          (k) => k.kodFasiliti === e.target.value
                        );
                        props.setKp(selectedKlinik.kp);
                        props.setKodFasiliti(selectedKlinik.kodFasiliti);
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
              <div className='admin-pegawai-handler-container'>
                <div className='admin-pegawai-handler-input'>
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
                      <span className='font-semibold text-lg text-admin3'>
                        *
                      </span>
                    </label>
                    <input
                      required
                      value={props.editedEntity.email}
                      className='border-2 mb-2'
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
                  Cancel
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

// ni x pakai dato aku check, dia pakai inputEditFacility untuk edit kkiakd
// export function InputEditKkiakd(props) {
//   return (
//     <>
//       <form onSubmit={props.confirm(props.handleSubmit)}>
//         <div
//           className={styles.darkBG}
//           onClick={() => props.setShowEditModal(false)}
//         />
//         <div className={styles.centered}>
//           <div className={styles.modalAdd}>
//             <div className={styles.modalHeader}>
//               <h5 className={styles.heading}>Tambah KKIA / KD</h5>
//             </div>
//             <span
//               className={styles.closeBtn}
//               onClick={() => props.setShowEditModal(false)}
//             >
//               <RiCloseLine style={{ marginBottom: '-3px' }} />
//             </span>
//             <div className={styles.modalContent}>
//               <div className='admin-pegawai-handler-container'>
//                 <div className='admin-pegawai-handler-input'>
//                   <div className='grid gap-1'>
//                     <label htmlFor='nama'>Nama KKIA / KD</label>
//                     <div className='grid gap-1 font-bold'>
//                       {props.editedEntity.nama}
//                     </div>
//                   </div>
//                   <div className='grid gap-1'>
//                     <p>
//                       Klinik Bertanggungjawab{' '}
//                       <span className='font-semibold text-lg text-admin3'>
//                         *
//                       </span>
//                     </p>
//                     <select
//                       readOnly={true}
//                       value={props.editedEntity.kodFasilitiHandler}
//                       className='border-2'
//                       onChange={(e) => {
//                         const selectedKlinik = props.klinik.find(
//                           (k) => k.kodFasiliti === e.target.value
//                         );
//                         props.setEditedEntity({
//                           ...props.editedEntity,
//                           handler: selectedKlinik.kp,
//                           kodFasilitiHandler: selectedKlinik.kodFasiliti,
//                         });
//                       }}
//                     >
//                       <option value=''>Pilih Klinik Baru..</option>
//                       {props.klinik.map((k) => (
//                         <option className='capitalize' value={k.kodFasiliti}>
//                           {k.kp}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <p>Status KKIA / KD</p>
//                   <div className='grid grid-cols-2'>
//                     <label htmlFor='statusAktif'>Aktif</label>
//                     <input
//                       checked={
//                         props.editedEntity.statusPerkhidmatan === 'active'
//                           ? true
//                           : false
//                       }
//                       type='radio'
//                       name='statusAktif'
//                       value='active'
//                       onChange={(e) => {
//                         props.setEditedEntity({
//                           ...props.editedEntity,
//                           statusPerkhidmatan: e.target.value,
//                         });
//                         props.setStatusPerkhidmatan(e.target.value);
//                       }}
//                     />
//                     <label htmlFor='statusTidakAktif'>Tidak Aktif</label>
//                     <input
//                       checked={
//                         props.editedEntity.statusPerkhidmatan === 'non-active'
//                           ? true
//                           : false
//                       }
//                       type='radio'
//                       name='statusTidakAktif'
//                       value='non-active'
//                       onChange={(e) => {
//                         props.setEditedEntity({
//                           ...props.editedEntity,
//                           statusPerkhidmatan: e.target.value,
//                         });
//                         props.setStatusPerkhidmatan(e.target.value);
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.modalActions}>
//               <div className={styles.actionsContainer}>
//                 {props.editingData ? (
//                   <BusyButton func='add' />
//                 ) : (
//                   <SubmitButton func='add' />
//                 )}
//                 <span
//                   className={styles.cancelBtn}
//                   onClick={() => props.setShowEditModal(false)}
//                 >
//                   Kembali
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }

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
            <div className='admin-pegawai-handler-input'>
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
                  className='border-2'
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
                    className='border-2'
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
                    defaultValue={props.editedEntity.gred}
                    className='border-2'
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
              <div className='grid gap-1'>
                <p>
                  Klinik Bertugas{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <select
                  required
                  value={props.editedEntity.kodFasiliti}
                  className='border-2'
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
                  className='border-2'
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
              Cancel
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
              KEMASKINI {Dictionary[props.FType]}{' '}
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
                className='border-2'
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
              >
                <option value=''>Pilih Klinik Baru..</option>
                {props.klinik.map((k) => (
                  <option className='capitalize' value={k.kodFasiliti}>
                    {k.kp}
                  </option>
                ))}
              </select>
              {props.FType !== 'sr' && props.FType !== 'sm' ? null : (
                <p>
                  Risiko Sekolah (PERSiS){' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
              )}
              {props.FType !== 'sr' && props.FType !== 'sm' ? null : (
                <select
                  required
                  className='border-2'
                  value={props.editedEntity.risikoSekolahPersis}
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      risikoSekolahPersis: e.target.value,
                    });
                  }}
                >
                  <option value=''>Pilih Risiko</option>
                  <option value='rendah'>Rendah</option>
                  <option value='tinggi'>Tinggi</option>
                </select>
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
                Cancel
              </span>
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
              <h5 className={styles.heading}>Tambah Program Komuniti</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowEditModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  {/* <p>
                      Tarikh Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p> */}
                  {/* <input
                        required
                        className='border-2'
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
                      className='border-2 w-full'
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
                        className='border-2'
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
                  <p>
                    Nama Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <input
                      required
                      className='border-2'
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
                        className='border-2'
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
                      className='border-2'
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
  const { getCurrentUser } = useGlobalAdminAppContext();

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
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  <p>
                    Jenis Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  <div className='grid gap-1'>
                    <select
                      required
                      className='border-2 w-full'
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
                        Program di Penjara / Pusat Koreksional
                      </option>
                      {loginInfo.negeri === 'Sabah' && (
                        <option value='fds'>
                          Flying Dental Service (Sabah)
                        </option>
                      )}
                      {loginInfo.negeri === 'Kelantan' && (
                        <option value='rtc'>RTC (Kelantan)</option>
                      )}
                      {/* {206,207} shaja(sementara je tpi smpai bulan 3)***data jgn buang *****data tak masuk ke program koumniti & sekolah & pg211 */}
                      <option value='incremental'>
                        Program Pergigian Sekolah Sesi 2022/2023
                      </option>
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
                        className='border-2'
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
                          className='border-2'
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
                          className='border-2'
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
                      className='border-2'
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
                        className='border-2'
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
                    <BusyButton func='edit' />
                  ) : (
                    <SubmitButton func='edit' />
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
            <div className='admin-pegawai-handler-input'>
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
                  className='border-2'
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
                    className='border-2'
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
                    className='border-2'
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
                  className='border-2'
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
              Cancel
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}

export function InputKpEditFacility(props) {
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
                Nama {Dictionary[props.FType]}: {props.editedEntity.nama}{' '}
              </p>
              <p>Jenis Fasiliti: {props.editedEntity.jenisFasiliti}</p>
              <p>
                Enrolmen:{' '}
                <span className='font-semibold text-lg text-user6'>*</span>
              </p>
              <div className='grid grid-gap-1'>
                <input
                  required
                  autoFocus
                  type='number'
                  min='1'
                  className='border-2'
                  value={props.editedEntity.enrolmenTastad}
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      enrolmenTastad: e.target.value,
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
                Cancel
              </span>
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
  const [showMpb, setShowMpb] = useState(false);
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
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  <p className='mt-1'>Jenis Program Komuniti</p>
                  <div className='grid gap-1 font-bold mb-1'>
                    {Dictionary[props.editedEntity.jenisEvent]}
                  </div>
                  <p>
                    Tarikh Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  {/* <input
                      readOnly
                      className='border-2'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={props.editedEntity.tarikh}
                    /> */}
                  <StartDate {...props} />
                  <EndDate {...props} />
                  <div className='grid gap-1'>
                    {/* <input
                      disabled={true}
                      type='text'
                      name='jenisEvent'
                      id='jenisEvent'
                      readOnly
                      className='border-2 w-full overflow-x-hidden'
                      value={Dictionary[props.editedEntity.jenisEvent]}
                    /> */}
                    {/* <select
                        disabled={true}
                        readOnly
                        className='border-2 w-full overflow-x-hidden'
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
                  </div>
                  {props.editedEntity.jenisEvent === 'programDewasaMuda' ||
                  props.editedEntity.jenisEvent === 'we' ||
                  props.editedEntity.jenisEvent === 'oku' ? (
                    <div className='grid grid-gap-1 mt-2'>
                      <p>
                        Enrolmen:{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <input
                        required
                        type='number'
                        min='1'
                        className='border-2'
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
                  ) : null}
                  <p className='mt-3 font-semibold'>
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
                          className='border-2'
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
                          className='border-2'
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
                  </div>
                  <div className='grid gap-1'>
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      className='border-2'
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
                        className='border-2'
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
  const [showMpb, setShowMpb] = useState(false);
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
              <div className='admin-pegawai-handler-container'>
                <div className='mb-3'>
                  <p className='mt-1'>Jenis Program Komuniti</p>
                  <div className='grid gap-1 font-bold mb-1'>
                    {Dictionary[props.editedEntity.jenisEvent]}
                  </div>
                  <p>
                    Tarikh Program Komuniti
                    <span className='font-semibold text-lg text-user6'>*</span>
                  </p>
                  {/* <input
                      readOnly
                      className='border-2'
                      type='date'
                      name='tarikh'
                      id='tarikh'
                      value={props.editedEntity.tarikh}
                    /> */}
                  <StartDate {...props} />
                  <EndDate {...props} />
                  <div className='grid gap-1'>
                    {/* <input
                      disabled={true}
                      type='text'
                      name='jenisEvent'
                      id='jenisEvent'
                      readOnly
                      className='border-2 w-full overflow-x-hidden'
                      value={Dictionary[props.editedEntity.jenisEvent]}
                    /> */}
                    {/* <select
                        disabled={true}
                        readOnly
                        className='border-2 w-full overflow-x-hidden'
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
                  </div>
                  {props.editedEntity.jenisEvent === 'programDewasaMuda' ||
                  props.editedEntity.jenisEvent === 'we' ||
                  props.editedEntity.jenisEvent === 'oku' ? (
                    <div className='grid grid-gap-1 mt-2'>
                      <p>
                        Enrolmen:{' '}
                        <span className='font-semibold text-lg text-user6'>
                          *
                        </span>
                      </p>
                      <input
                        required
                        type='number'
                        min='1'
                        className='border-2'
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
                  ) : null}
                  <p className='mt-3 font-semibold'>
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
                          className='border-2'
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
                          className='border-2'
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
                  </div>
                  <div className='grid gap-1'>
                    <p>
                      Nama Program Komuniti
                      <span className='font-semibold text-lg text-user6'>
                        *
                      </span>
                    </p>
                    <input
                      readOnly
                      className='border-2'
                      type='text'
                      name='nama'
                      id='nama'
                      value={props.editedEntity.nama}
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
                        readOnly
                        className='border-2'
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

export function InputKpEditInstitusi(props) {
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
                Nama {Dictionary[props.FType]}: {props.editedEntity.nama}{' '}
              </p>
              <p>
                Jenis Fasiliti:{' '}
                {Dictionary[props.editedEntity.kategoriInstitusi]}
              </p>
              <div className='grid grid-gap-1'>
                <p>Enrolmen: </p>
                <input
                  autoFocus
                  type='text'
                  className='border-2'
                  value={
                    props.editedEntity.enrolmenInstitusi === 'NOT APPLICABLE'
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
                Cancel
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
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
              <div className='grid grid-gap-1'>
                <p>Tarikh Beroperasi: </p>
                {/* <input
                  type='text'
                  className='border-2'
                  value={
                    props.editedEntity.jumlahHariBeroperasi === 'NOT APPLICABLE'
                      ? ''
                      : props.editedEntity.jumlahHariBeroperasi
                  }
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      jumlahHariBeroperasi: e.target.value,
                    });
                  }}
                /> */}
                <StartDate {...props} />
                <EndDate {...props} />
              </div>
              {/* <div className='grid grid-gap-1'>
                <p>Jumlah Pesakit Baru: </p>
                <input
                  type='text'
                  className='border-2'
                  value={
                    props.editedEntity.jumlahPesakitBaru === 'NOT APPLICABLE'
                      ? ''
                      : props.editedEntity.jumlahPesakitBaru
                  }
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      jumlahPesakitBaru: e.target.value,
                    });
                  }}
                />
              </div>
              <div className='grid grid-gap-1'>
                <p>Jumlah Pesakit Ulangan: </p>
                <input
                  type='text'
                  className='border-2'
                  value={
                    props.editedEntity.jumlahPesakitUlangan === 'NOT APPLICABLE'
                      ? ''
                      : props.editedEntity.jumlahPesakitUlangan
                  }
                  onChange={(e) => {
                    props.setEditedEntity({
                      ...props.editedEntity,
                      jumlahPesakitUlangan: e.target.value,
                    });
                  }}
                />
              </div> */}
              <div className='grid gap-1'>
                <p>
                  Klinik Bertanggungjawab{' '}
                  <span className='font-semibold text-lg text-user6'>*</span>
                </p>
                <select
                  required
                  className='border-2'
                  onChange={(e) => {
                    const selectedKlinik = props.allKlinik.find(
                      (k) => k.kodFasiliti === e.target.value
                    );
                    console.log(selectedKlinik);
                    props.setEditedEntity({
                      ...props.editedEntity,
                      handler: selectedKlinik.kp,
                      kodFasilitiHandler: selectedKlinik.kodFasiliti,
                    });
                  }}
                >
                  <option value=''>Pilih Klinik</option>
                  {props.allKlinik.map((k) => (
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
                Cancel
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
