import { useState, useEffect } from 'react';
import { Spinner } from 'react-awesome-spinners';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function EditableForm({ editId, editForm, setEditForm }) {
  const { kaunterToken, toast } = useGlobalUserAppContext();

  const [editLoading, setIsEditLoading] = useState(false);
  const [editTarikhKedatangan, setTarikhKedatangan] = useState('');
  const [editWaktuSampai, setWaktuSampai] = useState('');
  const [editNama, setEditNama] = useState('');
  const [editJenisIc, setJenisIc] = useState('');
  const [editIc, setIc] = useState('');
  const [editTarikhLahir, setTarikhLahir] = useState('');
  const [editUmur, setUmur] = useState(0);
  const [editJantina, setJantina] = useState('');
  const [editAlamat, setAlamat] = useState('');
  const [editKategoriPesakit, setKategoriPesakit] = useState('');
  const [editStatusPesara, setStatusPesara] = useState('');
  const [editKumpulanEtnik, setKumpulanEtnik] = useState('');
  const [editRujukDaripada, setRujukDaripada] = useState('');

  const handleEdit = async (e) => {
    e.preventDefault();
    await toast
      .promise(
        axios.patch(
          `/api/v1/kaunter/${editId}`,
          {
            tarikhKedatangan: editTarikhKedatangan,
            waktuSampai: editWaktuSampai,
            nama: editNama.toLowerCase(),
            jenisIc: editJenisIc,
            ic: editIc,
            tarikhLahir: editTarikhLahir,
            umur: editUmur,
            jantina: editJantina,
            alamat: editAlamat,
            kategoriPesakit: editKategoriPesakit,
            statusPesara: editStatusPesara,
            kumpulanEtnik: editKumpulanEtnik,
            rujukDaripada: editRujukDaripada,
          },
          { headers: { Authorization: `Bearer ${kaunterToken}` } }
        ),
        {
          pending: 'Mengemaskini...',
          success: 'Pesakit berjaya dikemaskini',
          error: 'Pesakit gagal dikemaskini',
        },
        { autoClose: 2000 }
      )
      .then(() => {
        setEditForm(false);
      });
  };

  useEffect(() => {
    if (editForm === true) {
      const fetchSinglePersonKaunter = async () => {
        try {
          setIsEditLoading(true);
          const { data } = await axios.get(`/api/v1/kaunter/${editId}`, {
            headers: { Authorization: `Bearer ${kaunterToken}` },
          });
          setTarikhKedatangan(data.singlePersonKaunter.tarikhKedatangan);
          setWaktuSampai(data.singlePersonKaunter.waktuSampai);
          setEditNama(data.singlePersonKaunter.nama);
          setJenisIc(data.singlePersonKaunter.jenisIc);
          setIc(data.singlePersonKaunter.ic);
          setTarikhLahir(data.singlePersonKaunter.tarikhLahir);
          setUmur(data.singlePersonKaunter.umur);
          setJantina(data.singlePersonKaunter.jantina);
          setAlamat(data.singlePersonKaunter.alamat);
          setKategoriPesakit(data.singlePersonKaunter.kategoriPesakit);
          setStatusPesara(data.singlePersonKaunter.statusPesara);
          setKumpulanEtnik(data.singlePersonKaunter.kumpulanEtnik);
          setRujukDaripada(data.singlePersonKaunter.rujukDaripada);
          setIsEditLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchSinglePersonKaunter();
    }
  }, [editForm]);

  if (editLoading) {
    return (
      <div className='mt-20'>
        <Spinner />
      </div>
    );
  }

  if (editForm) {
    return (
      <>
        <form onSubmit={handleEdit}>
          <h1 className='bg-kaunter3 font-bold text-2xl'>pendaftaran</h1>
          <p className='font-semibold text-user6 text-left mt-3 ml-3'>
            * required
          </p>
          <div className='grid'>
            <div className='flex m-2 ml-auto'>
              <p className='mr-3 font-semibold'>
                tarikh kedatangan:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                disabled
                required
                value={editTarikhKedatangan}
                type='date'
                name='tarikhKedatangan'
                className='outline outline-1 outline-kaunterBlack'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                nama: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setEditNama(e.target.value)}
                type='text'
                name='namaUmum'
                value={editNama}
                className='capitalize appearance-none w-7/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jenis pengenalan{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='pengenalan'
                id='pengenalan'
                value={editJenisIc}
                onChange={(e) => setJenisIc(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='mykad'>MyKad</option>
                <option value='passport'>Passport</option>
                <option value='tentera'>Tentera</option>
                <option value='polis'>Polis</option>
                <option value='sijil-lahir'>Sijil lahir</option>
              </select>
              <input
                required
                onChange={(e) => setIc(e.target.value)}
                type='text'
                name='ic'
                placeholder='123456-09-0987'
                value={editIc}
                className='appearance-none leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                tarikh lahir:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setTarikhLahir(e.target.value)}
                type='date'
                value={editTarikhLahir}
                name='tarikhLahir'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                umur: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setUmur(parseInt(e.target.value))}
                type='number'
                name='umur'
                value={editUmur}
                className='outline outline-1 outline-kaunterBlack w-16 text-sm font-m'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                jantina: <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='jantina'
                id='jantina'
                value={editJantina}
                onChange={(e) => setJantina(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='lelaki'>Lelaki</option>
                <option value='perempuan'>Perempuan</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                alamat: <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setAlamat(e.target.value)}
                type='text'
                name='alamat'
                value={editAlamat}
                className='appearance-none w-10/12 leading-7 px-3 py-1 ring-2 focus:ring-2 focus:ring-user1 focus:outline-none rounded-md shadow-md'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                waktu sampai:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <input
                required
                onChange={(e) => setWaktuSampai(e.target.value)}
                type='time'
                name='waktuSampai'
                value={editWaktuSampai}
                className='outline outline-1 outline-kaunterBlack'
              />
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kategori pesakit:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='kategoriPesakit'
                id='kategoriPesakit'
                value={editKategoriPesakit}
                onChange={(e) => setKategoriPesakit(e.target.value)}
              >
                <option value=''>Sila pilih..</option>
                <option value='toddler'>Toddler (0 - 4) tahun</option>
                <option value='prasekolah'>Prasekolah (5 - 6) tahun</option>
                <option value='sekolahrendah'>Sekolah rendah</option>
                <option value='sekolahmenengah'>Sekolah menengah</option>
                <option value='oku'>OKU</option>
                <option value='hamil'>Ibu mengandung</option>
                <option value='dewasa'>Dewasa</option>
                <option value='warga-tua'>Warga tua</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>
                kumpulan etnik:{' '}
                <span className='font-semibold text-user6'>*</span>
              </p>
              <select
                required
                name='kumpulanEtnik'
                id='kumpulanEtnik'
                value={editKumpulanEtnik}
                onChange={(e) => {
                  setKumpulanEtnik(e.target.value);
                }}
              >
                <option value=''>Sila pilih..</option>
                <option value='melayu'>Melayu</option>
                <option value='cina'>Cina</option>
                <option value='india'>India</option>
                <option value='bajau'>Bajau</option>
                <option value='dusun'>Dusun</option>
                <option value='kadazan'>Kadazan</option>
                <option value='murut'>Murut</option>
                <option value='bumiputera sabah lain'>
                  Bumiputera sabah lain
                </option>
                <option value='melanau'>Melanau</option>
                <option value='kedayan'>Kedayan</option>
                <option value='iban'>Iban</option>
                <option value='bidayuh'>Bidayuh</option>
                <option value='bumiputera sarawak lain'>
                  Bumiputera sarawak lain
                </option>
                <option value='orang asli semenanjung'>
                  Orang asli semenanjung
                </option>
                <option value='lain-lain'>Lain-lain</option>
                <option value='bukan warganegara'>Bukan warganegara</option>
              </select>
            </div>
            <div className='flex m-2'>
              <p className='mr-3 font-semibold'>rujuk daripada: </p>
              <select
                required
                name='rujukDaripada'
                id='rujukDaripada'
                value={editRujukDaripada}
                onChange={(e) => setRujukDaripada(e.target.value)}
                className='mr-3'
              >
                <option value=''>Sila pilih..</option>
                <option value='dalaman'>Dalaman</option>
                <option value='kp'>Klinik Pergigian</option>
                <option value='kk'>Klinik Kesihatan</option>
                <option value='hospital'>Hospital</option>
                <option value='swasta'>Swasta</option>
                <option value='lain2'>Lain-lain</option>
              </select>
            </div>
          </div>
          <span
            className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
            onClick={() => setEditForm(false)}
          >
            kembali
          </span>
          <button
            type='submit'
            className='m-2 p-2 uppercase rounded bg-kaunter3 hover:bg-kaunter1 hover:text-userWhite hover:cursor-pointer shadow-md transition-all'
          >
            Submit
          </button>
        </form>
      </>
    );
  }
}
