const moment = require('moment');
const Sekolah = require('../../models/Sekolah');

const insertToSekolah = async (dataCreatedSRSM, currentSesiPelajar) => {
  // TODO iterate pelajar and register to model sekolah

  // yang nak
  // pra
  // tahun
  // tingkatan 1 sampai 5

  const objPelajar = {
    idInstitusi: '',
    kodSekolah: '',
    namaSekolah: '',
    idIndividu: '',
    nomborId: '',
    nama: '',
    sesiTakwimPelajar: '',
    tahunTingkatan: '',
    kelasPelajar: '',
    jantina: '',
    tarikhLahir: '',
    umur: '',
    kaum: '',
    tarafWarganegara: '',
  };

  let allConvertedPelajar = [];

  const howOldAreYouMyFriendtahunV2 = (date) => {
    const years = moment().diff(moment(date), 'years');
    return years;
  };

  currentSesiPelajar.forEach((sp) => {
    objPelajar.idInstitusi = dataCreatedSRSM.idInstitusi;
    objPelajar.kodSekolah = dataCreatedSRSM.kodSekolah;
    objPelajar.namaSekolah = dataCreatedSRSM.nama;
    objPelajar.idIndividu = sp.ID_INDIVIDU;
    objPelajar.nomborId = sp.NOMBOR_ID;
    objPelajar.nama = sp.NAMA;
    objPelajar.sesiTakwimPelajar = sp.SESI_TAKWIM;
    objPelajar.tahunTingkatan = sp.TAHUN_TINGKATAN;
    objPelajar.kelasPelajar = sp.TBA_KELAS_PELAJAR;
    objPelajar.jantina = sp.JANTINA;
    objPelajar.tarikhLahir = sp.TBA_TARIKH_LAHIR;
    objPelajar.umur = howOldAreYouMyFriendtahunV2(
      moment(sp.TBA_TARIKH_LAHIR).toDate()
    );
    objPelajar.kaum = sp.TBA_KAUM;
    objPelajar.tarafWarganegara = sp.TBA_TARAF_WARGANEGARA;

    allConvertedPelajar.push({ ...objPelajar });
  });

  console.log(allConvertedPelajar);
};

module.exports = insertToSekolah;
