const https = require('https');
const axios = require('axios');
const moment = require('moment');
const Sekolah = require('../../models/Sekolah');
const sesiTakwimSekolah = require('./sesiTakwimSekolah');
const { logger } = require('../../logs/logger');

// get years regardless of birthdate
const getAge = (date) => {
  const years =
    parseInt(moment().format('YYYY')) - parseInt(moment(date).format('YYYY'));
  return years;
};

const insertToSekolah = async (fromDbFasilitiSRSM, SRSMPelajarMOEIS) => {
  // filter the pelajar to only include current sesi & wanted TAHUN_TINGKATAN only
  const MOEISPelajar =
    SRSMPelajarMOEIS['SENARAI MURID MENGIKUT KELAS / INSTITUSI'];
  const currentSesiPelajarAndWantedClass = MOEISPelajar.filter((sp) => {
    return (
      sp.SESI_TAKWIM === sesiTakwimSekolah() &&
      (sp.ID_TAHUN_TINGKATAN !== '86' ||
        sp.ID_TAHUN_TINGKATAN !== '87' ||
        sp.ID_TAHUN_TINGKATAN !== '105')
    );
  });

  // the interface
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
    statusOku: '',
    tarikhLahir: '',
    umur: 0,
    keturunan: '',
    warganegara: '',
  };

  // initialize array
  let allConvertedPelajar = [];

  // this will be blocking until it's complete
  logger.info(
    `[insertToSekolah] initiated insertToSekolah ${fromDbFasilitiSRSM.nama}`
  );
  for (let i = 0; i < currentSesiPelajarAndWantedClass.length; i++) {
    objPelajar.idInstitusi = fromDbFasilitiSRSM.idInstitusi;
    objPelajar.kodSekolah = fromDbFasilitiSRSM.kodSekolah;
    objPelajar.namaSekolah = fromDbFasilitiSRSM.nama;
    objPelajar.idIndividu = currentSesiPelajarAndWantedClass[i].ID_INDIVIDU;
    objPelajar.nomborId = currentSesiPelajarAndWantedClass[i].NOMBOR_ID;
    objPelajar.nama = currentSesiPelajarAndWantedClass[i].NAMA;
    objPelajar.sesiTakwimPelajar =
      currentSesiPelajarAndWantedClass[i].SESI_TAKWIM;
    objPelajar.tahunTingkatan =
      currentSesiPelajarAndWantedClass[i].TAHUN_TINGKATAN;
    objPelajar.kelasPelajar = currentSesiPelajarAndWantedClass[i]['NAMA KELAS'];
    objPelajar.jantina = currentSesiPelajarAndWantedClass[i].JANTINA;
    objPelajar.statusOku = currentSesiPelajarAndWantedClass[i].STATUS_OKU;
    if (
      process.env.BUILD_ENV === 'production' ||
      process.env.BUILD_ENV === 'dev'
    ) {
      try {
        console.log('Pelajar ' + fromDbFasilitiSRSM.nama + ' ' + i);
        const agent = new https.Agent({
          rejectUnauthorized: false,
        });
        const { data } = await axios.get(
          process.env.MOEIS_INTEGRATION_URL_SINGLE_PELAJAR +
            `?id_individu=${currentSesiPelajarAndWantedClass[i].ID_INDIVIDU}`,
          {
            httpsAgent: agent,
            headers: {
              APIKEY: process.env.MOEIS_APIKEY,
            },
          }
        );
        objPelajar.tarikhLahir = data.tarikh_lahir;
        objPelajar.umur = getAge(data.tarikh_lahir);
        objPelajar.keturunan = data.keturunan;
        objPelajar.warganegara = data.warganegara;
      } catch (error) {
        logger.error(`[insertToSekolah] ${error.message}`);
        return error.message;
      }
    }

    allConvertedPelajar.push({ ...objPelajar });
  }

  // get already registered pelajar
  const fromDbThisSekolahPelajar = await Sekolah.find({
    idInstitusi: fromDbFasilitiSRSM.idInstitusi,
    kodSekolah: fromDbFasilitiSRSM.kodSekolah,
    sesiTakwimPelajar: sesiTakwimSekolah(),
  }).select(
    'idInstitusi kodSekolah namaSekolah idIndividu nomborId nama sesiTakwimPelajar tahunTingkatan kelasPelajar jantina statusOku tarikhLahir umur keturunan warganegara'
  );

  // the diff between two array
  function getDiffTwoArrayOfObject(array1, array2) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.idIndividu === object2.idIndividu;
      });
    });
  }

  // yang dari MOEIS nak masuk DB
  const pelajarFromMOEISToDb = getDiffTwoArrayOfObject(
    allConvertedPelajar,
    fromDbThisSekolahPelajar
  );
  if (pelajarFromMOEISToDb.length > 0) {
    const createdPelajar = await Sekolah.insertMany(pelajarFromMOEISToDb);
    logger.info(
      `[insertToSekolah] siap register fresh pelajar ${fromDbFasilitiSRSM.nama}`
    );
  }

  // yang dari DB dah xda kat MOEIS
  const pelajarFromDbtoMOEIS = getDiffTwoArrayOfObject(
    fromDbThisSekolahPelajar,
    allConvertedPelajar
  );
  if (pelajarFromDbtoMOEIS.length > 0) {
    for (let i = 0; i < pelajarFromDbtoMOEIS.length; i++) {
      const pelajarSetToBerpindah = await Sekolah.findOneAndUpdate(
        pelajarFromDbtoMOEIS[i],
        {
          $set: { berpindah: true },
        },
        { new: true }
      );
    }
    logger.info(
      `[insertToSekolah] siap set pelajar berpindah ${fromDbFasilitiSRSM.nama}`
    );
  }

  // finished and close this process
  logger.info(
    `[insertToSekolah] finished insertToSekolah ${fromDbFasilitiSRSM.nama}`
  );
  return;
};

module.exports = insertToSekolah;
