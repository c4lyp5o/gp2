const _ = require('lodash');
const moment = require('moment');
const { ETLLogger } = require('../logs/logger');

const Helper = require('../controllers/countHelper');

const Superadmin = require('../models/Superadmin');
const User = require('../models/User');
const Reservoir = require('../models/Reservoir');

const dailyCount = [
  { name: 'PG101A', func: Helper.countPG101A },
  { name: 'PG101C', func: Helper.countPG101C },
];

const monthlyCount = [
  { name: 'PG211A', func: Helper.countPG211A },
  { name: 'PG211C', func: Helper.countPG211C },
  { name: 'PG214', func: Helper.countPG214 },
  { name: 'PG206', func: Helper.countPG206 },
  { name: 'PG207', func: Helper.countPG207 },
  { name: 'PGPR201', func: Helper.countPGPR201Baru },
  { name: 'PGPro01', func: Helper.countPGPro01 },
  { name: 'PGPro01Combined', func: Helper.countPGPro01Combined },
  { name: 'GENDER', func: Helper.countGender },
  { name: 'MASA', func: Helper.countMasa },
  { name: 'BP', func: Helper.countBp },
  { name: 'BPE', func: Helper.countBPE },
];

const initialDataNegeri = async () => {
  const all = await Superadmin.find({ accountType: 'negeriSuperadmin' })
    .select('negeri')
    .lean();
  const allNegeri = _.uniqBy(all, 'negeri');
  let negeri = [];
  allNegeri.forEach((item) => {
    negeri.push(item.negeri);
  });
  return negeri;
};

const initialDataDaerah = async (allNegeri) => {
  let daerah = [];
  for (let i = 0; i < allNegeri.length; i++) {
    const all = await Superadmin.find({
      negeri: allNegeri[i],
      accountType: 'daerahSuperadmin',
    })
      .select('negeri daerah')
      .lean();
    const specDaerah = _.uniqBy(all, 'daerah');
    specDaerah.forEach((item) => {
      let daerahObj = {
        negeri: item.negeri,
        daerah: item.daerah,
      };
      daerah.push(daerahObj);
    });
  }
  return daerah;
};

const initialDataKlinik = async (allDaerah) => {
  let klinik = [];
  for (let i = 0; i < allDaerah.length; i++) {
    const all = await User.find({
      negeri: allDaerah[i].negeri,
      daerah: allDaerah[i].daerah,
      accountType: 'kpUser',
    })
      .select('negeri daerah kodFasiliti')
      .lean();
    const specKlinik = _.uniqBy(all, 'kodFasiliti');
    specKlinik.forEach((item) => {
      let klinikObj = {
        negeri: item.negeri,
        daerah: item.daerah,
        kodFasiliti: item.kodFasiliti,
      };
      klinik.push(klinikObj);
    });
  }
  return klinik;
};

const initiateETL = async (req, res) => {
  ETLLogger.info(`[ETL]initiated at ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
  try {
    // first launch
    const negeri = await initialDataNegeri();
    const daerah = await initialDataDaerah(negeri);
    const klinik = await initialDataKlinik(daerah);

    // negeri data
    // monthly count
    // if (
    //   moment().startOf('month').add(7, 'days').format('YYYY-MM-DD') ===
    //   moment().format('YYYY-MM-DD')
    // ) {
    for (let i = 0; i < negeri.length; i++) {
      for (let j = 0; j < monthlyCount.length; j++) {
        let payload = {
          negeri: negeri[i],
          daerah: 'all',
          klinik: 'all',
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        ETLLogger.info(
          `[ETL] generating monthly data ${monthlyCount[j].name} for ${negeri[i]}`
        );
        const data = await monthlyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: negeri[i],
          createdByDaerah: 'all',
          createdByKodFasiliti: 'all',
          dataType: monthlyCount[j].name,
          dataFormat: 'Monthly',
          dataDate: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
          createdAt: moment().format(),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }
    // }

    // daerah data
    // monthly count
    // if (
    //   moment().startOf('month').add(6, 'days').format('YYYY-MM-DD') ===
    //   moment().format('YYYY-MM-DD')
    // ) {
    for (let i = 0; i < daerah.length; i++) {
      for (let j = 0; j < monthlyCount.length; j++) {
        let payload = {
          negeri: daerah[i].negeri,
          daerah: daerah[i].daerah,
          klinik: 'all',
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        ETLLogger.info(
          `[ETL] generating monthly data ${monthlyCount[j].name} for ${daerah[i].daerah}`
        );
        const data = await monthlyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: daerah[i].negeri,
          createdByDaerah: daerah[i].daerah,
          createdByKodFasiliti: 'all',
          dataType: monthlyCount[j].name,
          dataFormat: 'Monthly',
          dataDate: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
          createdAt: moment().format(),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }
    // }

    // negeri data
    // monthly count
    // if (
    //   moment().startOf('month').add(6, 'days').format('YYYY-MM-DD') ===
    //   moment().format('YYYY-MM-DD')
    // ) {
    for (let i = 0; i < klinik.length; i++) {
      for (let j = 0; j < monthlyCount.length; j++) {
        let payload = {
          negeri: 'ETL',
          daerah: 'ETL',
          klinik: klinik[i].kodFasiliti,
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        ETLLogger.info(
          `[ETL] generating monthly data ${monthlyCount[j].name} for ${klinik[i].kodFasiliti}`
        );
        const data = await monthlyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: klinik[i].negeri,
          createdByDaerah: klinik[i].daerah,
          createdByKodFasiliti: klinik[i].kodFasiliti,
          dataType: monthlyCount[j].name,
          dataFormat: 'Monthly',
          dataDate: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
          createdAt: moment().format(),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }
    // }
    ETLLogger.info(
      `ETL completed at ${moment().format('YYYY-MM-DD HH:mm:ss')}`
    );
    res
      .status(200)
      .json({ msg: 'ETL initiated. May the server is not on fire now' });
  } catch (error) {
    console.log(error);
    ETLLogger.error(error);
    res
      .status(error.statusCode || 500)
      .json({ msg: error.message } || { msg: 'Internal Server Error' });
  }
};

module.exports = { initiateETL };
