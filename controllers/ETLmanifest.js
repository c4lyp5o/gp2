const _ = require('lodash');
const moment = require('moment');

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
  { name: 'PGPR201', func: Helper.countPGPR201 },
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
      .select('kodFasiliti')
      .lean();
    const specKlinik = _.uniqBy(all, 'kodFasiliti');
    specKlinik.forEach((item) => {
      klinik.push(item.kodFasiliti);
    });
  }
  return klinik;
};

const initiateETL = async (req, res) => {
  try {
    // first launch
    const negeri = await initialDataNegeri();
    const daerah = await initialDataDaerah(negeri);
    const klinik = await initialDataKlinik(daerah);

    // negeri data
    // daily count
    for (let i = 0; i < negeri.length; i++) {
      for (let j = 0; j < dailyCount.length; j++) {
        let payload = {
          negeri: negeri[i],
          daerah: 'all',
          klinik: 'all',
          tarikhMula: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        };
        console.log(
          `generating daily data ${dailyCount[j].name} for ${negeri[i]}`
        );
        const data = await dailyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: negeri[i],
          createdByDaerah: 'all',
          createdByKodFasiliti: 'all',
          dataType: dailyCount[j].name,
          dataFormat: 'Daily',
          dataDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }

    // monthly count
    if (
      moment().endOf('month').format('YYYY-MM-DD') ===
      moment().format('YYYY-MM-DD')
    ) {
      for (let i = 0; i < negeri.length; i++) {
        for (let j = 0; j < monthlyCount.length; j++) {
          let payload = {
            negeri: negeri[i],
            daerah: 'all',
            klinik: 'all',
            bulan: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
          };
          console.log(
            `generating monthly data ${monthlyCount[j].name} for ${negeri[i]}`
          );
          const data = await monthlyCount[j].func(payload);
          const dataObj = {
            createdByNegeri: negeri[i],
            createdByDaerah: 'all',
            createdByKodFasiliti: 'all',
            dataType: monthlyCount[j].name,
            dataFormat: 'Monthly',
            dataDate: moment(new Date()).endOf('month').format('YYYY-MM-DD'),
            data: data,
          };
          await Reservoir.create(dataObj);
        }
      }
    }

    // daerah data
    // daily count
    for (let i = 0; i < daerah.length; i++) {
      for (let j = 0; j < dailyCount.length; j++) {
        let payload = {
          negeri: daerah[i].negeri,
          daerah: daerah[i].daerah,
          klinik: 'all',
          tarikhMula: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        };
        console.log(
          `generating daily data ${dailyCount[j].name} for ${daerah[i].daerah}`
        );
        const data = await dailyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: daerah[i].negeri,
          createdByDaerah: daerah[i].daerah,
          createdByKodFasiliti: 'all',
          dataType: dailyCount[j].name,
          dataFormat: 'Daily',
          dataDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }

    // monthly count
    if (
      moment().endOf('month').format('YYYY-MM-DD') ===
      moment().format('YYYY-MM-DD')
    ) {
      for (let i = 0; i < daerah.length; i++) {
        for (let j = 0; j < monthlyCount.length; j++) {
          let payload = {
            negeri: daerah[i].negeri,
            daerah: daerah[i].daerah,
            klinik: 'all',
            bulan: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
          };
          console.log(
            `generating monthly data ${monthlyCount[j].name} for ${daerah[i].daerah}`
          );
          const data = await monthlyCount[j].func(payload);
          const dataObj = {
            createdByNegeri: daerah[i].negeri,
            createdByDaerah: daerah[i].daerah,
            createdByKodFasiliti: 'all',
            dataType: monthlyCount[j].name,
            dataFormat: 'Monthly',
            dataDate: moment(new Date()).endOf('month').format('YYYY-MM-DD'),
            data: data,
          };
          await Reservoir.create(dataObj);
        }
      }
    }

    // klinik data
    // daily count
    for (let i = 0; i < klinik.length; i++) {
      for (let j = 0; j < dailyCount.length; j++) {
        let payload = {
          negeri: 'all',
          daerah: 'all',
          klinik: klinik[i],
          tarikhMula: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        };
        console.log(
          `generating daily data ${dailyCount[j].name} for ${klinik[i]}`
        );
        const data = await dailyCount[j].func(payload);
        const dataObj = {
          createdByNegeri: 'all',
          createdByDaerah: 'all',
          createdByKodFasiliti: klinik[i],
          dataType: dailyCount[j].name,
          dataFormat: 'Daily',
          dataDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          data: data,
        };
        await Reservoir.create(dataObj);
      }
    }

    // monthly count
    if (
      moment().endOf('month').format('YYYY-MM-DD') ===
      moment().format('YYYY-MM-DD')
    ) {
      for (let i = 0; i < klinik.length; i++) {
        for (let j = 0; j < monthlyCount.length; j++) {
          let payload = {
            negeri: 'all',
            daerah: 'all',
            klinik: klinik[i],
            bulan: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
          };
          console.log(
            `generating monthly data ${monthlyCount[j].name} for ${klinik[i]}`
          );
          const data = await monthlyCount[j].func(payload);
          const dataObj = {
            createdByNegeri: 'all',
            createdByDaerah: 'all',
            createdByKodFasiliti: klinik[i],
            dataType: monthlyCount[j].name,
            dataFormat: 'Monthly',
            dataDate: moment(new Date()).endOf('month').format('YYYY-MM-DD'),
            data: data,
          };
          await Reservoir.create(dataObj);
        }
      }
    }
    res.send('ETL initiated. May the server is not on fire now.');
  } catch (error) {
    console.log(error);
    res
      .status(error.statusCode || 500)
      .send(error.message || 'Internal Server Error');
  }
};

module.exports = { initiateETL };
