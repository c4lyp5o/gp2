import { useGlobalAdminAppContext } from '../../../context/adminAppContext';
import { useRef, useState } from 'react';
import Select from 'react-select';
import { RiCloseLine } from 'react-icons/ri';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from '../../../Modal.module.css';

import Confirmation from '../../Confirmation';
import BusyButton from '../../BusyButton';
import SubmitButtton from '../../SubmitButton';

const ModalSosMed = (props) => {
  const { toast, createData } = useGlobalAdminAppContext();

  const [pilihanPromosi, setPilihanPromosi] = useState([]);
  const [questionState, setQuestionState] = useState(null);

  const currentName = useRef();
  const currentStatusPerkhidmatan = useRef();
  const currentKp = useRef();

  // event
  const currentJenisEvent = useRef();
  const currentModPenyampaian = useRef([]);
  const currentTarikh = useRef(moment(new Date()).format('YYYY-MM-DD'));
  const currentTempat = useRef();
  // data
  const [addingData, setAddingData] = useState(false);

  const handleSubmit = async (e) => {
    setAddingData(true);
    let Data = {};
    Data = {
      ...Data,
      nama: currentName.current,
      handler: currentKp.current,
      statusPerkhidmatan: currentStatusPerkhidmatan.current,
    };
    if (props.FType === 'event') {
      if (currentModPenyampaian.current.length < 1) {
        toast.error(
          'Sila pilih sekurang-kurangnya 1 kaedah penyampaian perkhidmatan'
        );
        setAddingData(false);
        return;
      }
      Data = {
        nama: currentName.current,
        createdByKp: props.kp,
        jenisEvent: currentJenisEvent.current,
        modPenyampaianPerkhidmatan: currentModPenyampaian.current,
        tarikh: currentTarikh.current,
        tempat: currentTempat.current,
      };
    }
    createData(props.FType, Data).then((res) => {
      console.log(res.data);
      if (res.status === 200) {
        toast.info(`Data berjaya ditambah`);
        props.setReload(!props.reload);
      } else {
        toast.error(`Data tidak berjaya ditambah`);
      }
      props.setShowAddModal(false);
      setAddingData(false);
    });
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
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Penonton</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Reach</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Share</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
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
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Penonton</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Reach</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
              />
              <p>Bil. Share</p>
              <input
                required
                className='border-2'
                type='text'
                name='nama'
                id='nama'
                onChange={(e) => (currentName.current = e.target.value)}
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
              required
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) => (currentName.current = e.target.value)}
            />
            <p>Bil. Aktiviti Yang Mendapat Bil. Share lebih 10</p>
            <input
              required
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) => (currentName.current = e.target.value)}
            />
            <p>Bil. Penonton</p>
            <input
              required
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) => (currentName.current = e.target.value)}
            />
            <p>Bil. Reach</p>
            <input
              required
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) => (currentName.current = e.target.value)}
            />
            <p>Bil. Share</p>
            <input
              required
              className='border-2'
              type='text'
              name='nama'
              id='nama'
              onChange={(e) => (currentName.current = e.target.value)}
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
