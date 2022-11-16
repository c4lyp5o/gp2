import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useRef, useState } from 'react';
import Select from 'react-select';
import { RiCloseLine } from 'react-icons/ri';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../Modal.module.css';

import Confirmation from '../../Confirmation';
import BusyButton from '../../BusyButton';
import SubmitButtton from '../../SubmitButton';

const ModalSosMed = (props) => {
  const { toast, createData } = useGlobalAdminAppContext();

  const [pilihanPromosi, setPilihanPromosi] = useState([]);
  const [questionState, setQuestionState] = useState([]);

  const currentName = useRef();

  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingData(true);
    let Data = {};
    Data = {
      ...Data,
      createdByKp: props.kp,
      createdByDaerah: props.daerah,
      cretedByNegeri: props.negeri,
    };
    Data = {
      ...questionState,
      ...Data,
    };
    // createData(props.FType, Data).then((res) => {
    //   console.log(res.data);
    //   if (res.status === 200) {
    //     toast.info(`Data berjaya ditambah`);
    //     props.setReload(!props.reload);
    //   } else {
    //     toast.error(`Data tidak berjaya ditambah`);
    //   }
    //   props.setShowAddModal(false);
    //   setAddingData(false);
    // });
    console.log(Data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionState({ ...questionState, [name]: value });
    setTimeout(() => {
      console.log(questionState);
    }, 1000);
  };

  const Section = ({ nama }) => {
    return (
      <div className='grid grid-cols-3 overflow-y-auto overflow-x-hidden'>
        {nama !== 'Twitter' ? (
          <article className='admin-pegawai-handler'>
            Promosi: {nama}
            <p>GO LIVE! </p>
            <div className='grid grid-cols-2'>
              <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_live_bilAktivitiShareKurang10',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_live_bilAktivitiShareLebih10',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Penonton</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_live_bilPenonton',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Reach</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_live_bilReach',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Share</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_live_bilShare',
                      value: e.target.value,
                    },
                  })
                }
              />
            </div>
          </article>
        ) : null}
        {nama !== 'Youtube' && nama !== 'Tiktok' ? (
          <article className='admin-pegawai-handler'>
            Promosi: {nama}
            <p>Poster Infografik </p>
            <div className='grid grid-cols-2'>
              <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_poster_bilAktivitiShareKurang10',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_poster_bilAktivitiShareLebih10',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Penonton</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_poster_bilPenonton',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Reach</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_poster_bilReach',
                      value: e.target.value,
                    },
                  })
                }
              />
              <p>Bil. Share</p>
              <input
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: nama + '_poster_bilShare',
                      value: e.target.value,
                    },
                  })
                }
              />
            </div>
          </article>
        ) : null}
        <article className='admin-pegawai-handler'>
          Promosi: {nama}
          <p>Video Promosi/Pendidikan Kesihatan Pergigian </p>
          <div className='grid grid-cols-2'>
            <p>Bil. Aktiviti Yang Mendapat Bil. Share kurang 10</p>
            <input
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilAktivitiShareKurang10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
            <input
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilAktivitiShareLebih10',
                    value: e.target.value,
                  },
                })
              }
            />
            <p>Bil. Penonton</p>
            <input
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilPenonton',
                    value: e.target.value,
                  },
                })
              }
            />
            <p>Bil. Reach</p>
            <input
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilReach',
                    value: e.target.value,
                  },
                })
              }
            />
            <p>Bil. Share</p>
            <input
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) =>
                handleChange({
                  target: {
                    name: nama + '_video_bilShare',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        </article>
      </div>
    );
  };

  const renderSection = (item) => {
    return <Section key={item.id} nama={item.value} />;
  };

  const JenisPromosi = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'Youtube', label: 'Youtube' },
    { value: 'Tiktok', label: 'Tiktok' },
    { value: 'Twitter', label: 'Twitter' },
  ];

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div
          className={styles.darkBG}
          onClick={() => props.setShowSosMedModal(false)}
        />
        <div className={styles.centered}>
          <div className={styles.modalPromosi}>
            <div className={styles.modalHeader}>
              <h5 className={styles.heading}>Sila pilih</h5>
            </div>
            <span
              className={styles.closeBtn}
              onClick={() => props.setShowSosMedModal(false)}
            >
              <RiCloseLine style={{ marginBottom: '-3px' }} />
            </span>
            <div className={styles.modalContent}>
              <div className='justify-between items-center'>
                <article>
                  <Select
                    isMulti
                    name='promosi'
                    options={JenisPromosi}
                    className='basic-multi-select'
                    classNamePrefix='select'
                    onChange={(e) => {
                      setPilihanPromosi(e);
                    }}
                  />
                </article>
                {pilihanPromosi.map((item) => renderSection(item))}
              </div>
              <div className={styles.modalActions}>
                <div className={styles.actionsContainer}>
                  {addingData ? (
                    <BusyButton func='add' />
                  ) : (
                    <SubmitButtton func='add' />
                  )}
                  <span
                    className={styles.cancelBtn}
                    onClick={() => props.setShowSosMedModal(false)}
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
};

export default ModalSosMed;
