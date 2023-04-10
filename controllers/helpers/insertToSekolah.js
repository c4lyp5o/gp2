const https = require('https');
const axios = require('axios');
const moment = require('moment');
const Sekolah = require('../../models/Sekolah');
const { logger } = require('../../logs/logger');

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
    umur: 0,
    kaum: '',
    tarafWarganegara: '',
  };

  let allConvertedPelajar = [];

  const howOldAreYouMyFriendtahunV2 = (date) => {
    const years =
      parseInt(moment().format('YYYY')) - parseInt(moment(date).format('YYYY')); // get years regardless of birthdate
    return years;
  };

  currentSesiPelajar.forEach(async (sp) => {
    objPelajar.idInstitusi = dataCreatedSRSM.idInstitusi;
    objPelajar.kodSekolah = dataCreatedSRSM.kodSekolah;
    objPelajar.namaSekolah = dataCreatedSRSM.nama;
    objPelajar.idIndividu = sp.ID_INDIVIDU;
    objPelajar.nomborId = sp.NOMBOR_ID;
    objPelajar.nama = sp.NAMA;
    objPelajar.sesiTakwimPelajar = sp.SESI_TAKWIM;
    objPelajar.tahunTingkatan = sp.TAHUN_TINGKATAN;
    objPelajar.jantina = sp.JANTINA;

    if (
      process.env.BUILD_ENV === 'production' ||
      process.env.BUILD_ENV === 'dev'
    ) {
      try {
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        const { data } = await axios.get(
          process.env.MOEIS_INTEGRATION_URL_SINGLE_PELAJAR +
            `?id_individu=${sp.ID_INDIVIDU}`,
          {
            httpsAgent: agent,
            headers: {
              APIKEY: process.env.MOEIS_APIKEY,
            },
          }
        );
        objPelajar.kelasPelajar = data.TBA_KELAS_PELAJAR; // PENDING
        objPelajar.tarikhLahir = data.tarikh_lahir;
        objPelajar.umur = howOldAreYouMyFriendtahunV2(data.tarikh_lahir);
        objPelajar.kaum = data.keturunan;
        objPelajar.tarafWarganegara = data.TBA_TARAF_WARGANEGARA; // PENDING
      } catch (error) {
        logger.error(`[insertToSekolah] ${error.message}`);
        return error.message;
      }
    }

    allConvertedPelajar.push({ ...objPelajar });
  });

  console.log(allConvertedPelajar);
};

module.exports = insertToSekolah;
