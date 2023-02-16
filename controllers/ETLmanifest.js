const _ = require('lodash');
const moment = require('moment');
const { ETLLogger } = require('../logs/logger');

const Helper = require('../controllers/countHelper');

const Superadmin = require('../models/Superadmin');
const User = require('../models/User');
const Operator = require('../models/Operator');
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
  { name: 'PGPRO01', func: Helper.countPGPro01 },
  { name: 'PGPRO01Combined', func: Helper.countPGPro01Combined },
  { name: 'GENDER', func: Helper.countGender },
  { name: 'MASA', func: Helper.countMasa },
  { name: 'BP', func: Helper.countBp },
  { name: 'BPE', func: Helper.countBPE },
];

const initialDataNegeri = async () => {
  const all = await Superadmin.find({ accountType: 'negeriSuperadmin' })
    .select('negeri')
    .lean();
  const negeri = all.map((item) => item.negeri);
  return negeri;
};

const initialDataDaerah = async (allNegeri) => {
  const daerah = [];
  const promises = [];
  for (const negeri of allNegeri) {
    promises.push(
      Superadmin.find({
        negeri,
        accountType: 'daerahSuperadmin',
      })
        .select('negeri daerah')
        .lean()
    );
  }
  const allResults = await Promise.all(promises);
  allResults.forEach((results) => {
    results.forEach((result) => {
      const daerahObj = { negeri: result.negeri, daerah: result.daerah };
      daerah.push(daerahObj);
    });
  });
  return daerah;
};

const initialDataKlinik = async (allDaerah) => {
  const klinik = [];
  const promises = [];
  for (const { negeri, daerah } of allDaerah) {
    promises.push(
      User.find({
        negeri,
        daerah,
        accountType: 'kpUser',
      })
        .select('negeri daerah kodFasiliti kp')
        .lean()
    );
  }
  const allResults = await Promise.all(promises);
  allResults.forEach((results) => {
    results.forEach(({ negeri, daerah, kodFasiliti, kp }) => {
      klinik.push({ negeri, daerah, kodFasiliti, kp });
    });
  });
  return klinik;
};

const initialDataIndividual = async (allKlinik) => {
  const individu = [];
  const promises = [];
  for (const klinik of allKlinik) {
    const { kodFasiliti } = klinik;
    promises.push(
      Operator.find({ kodFasiliti })
        .select(
          'createdByNegeri createdByDaerah kodFasiliti nama mdcNumber mdtbNumber'
        )
        .lean()
        .then((results) => {
          return results.map(
            ({
              createdByNegeri,
              createdByDaerah,
              kodFasiliti,
              nama,
              mdcNumber,
              mdtbNumber,
            }) => ({
              createdByNegeri,
              createdByDaerah,
              kodFasiliti,
              nama,
              mdcNumber,
              mdtbNumber,
            })
          );
        })
    );
  }
  const allResults = await Promise.all(promises);
  individu.push(...allResults.flat());
  return individu;
};

const initiateETL = async (req, res) => {
  ETLLogger.info(
    `[ETL] initiated at ${moment().format('YYYY-MM-DD HH:mm:ss')}`
  );
  try {
    // first launch
    const negeri = await initialDataNegeri();
    const daerah = await initialDataDaerah(negeri);
    const klinik = await initialDataKlinik(daerah);
    // const individu = await initialDataIndividual(klinik);

    // negeri data
    // monthly count
    const countNegeri = [];
    const countDaerah = [];
    const countKlinik = [];
    // const countIndividu = [];

    negeri.forEach((negeri) => {
      monthlyCount.forEach((monthlyCount) => {
        const payload = {
          negeri: negeri,
          daerah: 'all',
          klinik: 'all',
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        const dataObj = {
          createdByNegeri: negeri,
          createdByDaerah: 'all',
          createdByKodFasiliti: 'all',
          dataType: monthlyCount.name,
          dataFormat: 'Monthly',
          dataDate: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format('YYYY-MM-DD'),
          createdAt: moment().format(),
        };
        const promise = monthlyCount.func(payload).then(async (data) => {
          dataObj.data = data;
          await Reservoir.create(dataObj);
          ETLLogger.info(
            `[ETL] monthly data ${monthlyCount.name} generated for ${negeri}`
          );
        });
        countNegeri.push(promise);
      });
    });

    await Promise.all([Promise.all(countNegeri)])
      .then(() => {
        ETLLogger.info(`[ETL] monthly data generated for all negeri`);
      })
      .catch((err) => {
        ETLLogger.error(
          `[ETL] monthly data generated for all negeri failed. Cause: ${err}`
        );
      });

    daerah.forEach((daerah) => {
      monthlyCount.forEach((monthlyCount) => {
        let payload = {
          negeri: daerah.negeri,
          daerah: daerah.daerah,
          klinik: 'all',
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        const promise = monthlyCount.func(payload).then(async (data) => {
          const dataObj = {
            createdByNegeri: daerah.negeri,
            createdByDaerah: daerah.daerah,
            createdByKodFasiliti: 'all',
            dataType: monthlyCount.name,
            dataFormat: 'Monthly',
            dataDate: moment()
              .subtract(1, 'month')
              .endOf('month')
              .format('YYYY-MM-DD'),
            createdAt: moment().format(),
            data: data,
          };
          await Reservoir.create(dataObj);
          ETLLogger.info(
            `[ETL] monthly data ${monthlyCount.name} generated for ${daerah.daerah}`
          );
        });
        countDaerah.push(promise);
      });
    });

    await Promise.all([Promise.all(countDaerah)])
      .then(() => {
        ETLLogger.info(`[ETL] monthly data generated for all daerah`);
      })
      .catch((err) => {
        ETLLogger.error(
          `[ETL] monthly data generated for all daerah failed. Cause: ${err}`
        );
      });

    klinik.forEach((klinik) => {
      monthlyCount.forEach((monthlyCount) => {
        let payload = {
          negeri: 'ETL',
          daerah: 'ETL',
          klinik: klinik.kodFasiliti,
          bulan: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format('YYYY-MM-DD'),
        };
        const promise = monthlyCount.func(payload).then(async (data) => {
          const dataObj = {
            createdByNegeri: klinik.negeri,
            createdByDaerah: klinik.daerah,
            createdByKodFasiliti: klinik.kodFasiliti,
            dataType: monthlyCount.name,
            dataFormat: 'Monthly',
            dataDate: moment()
              .subtract(1, 'month')
              .endOf('month')
              .format('YYYY-MM-DD'),
            createdAt: moment().format(),
            data: data,
          };
          await Reservoir.create(dataObj);
          ETLLogger.info(
            `[ETL] monthly data ${monthlyCount.name} generated for ${klinik.kp}`
          );
        });
        countKlinik.push(promise);
      });
    });

    await Promise.all([Promise.all(countKlinik)])
      .then(() => {
        ETLLogger.info(`[ETL] monthly data generated for all klinik`);
      })
      .catch((err) => {
        ETLLogger.error(
          `[ETL] monthly data generated for all klinik failed. Cause: ${err}`
        );
      });

    // for laterz
    // individu.forEach((individu) => {
    //   monthlyCount.forEach((monthlyCount) => {
    //     const mdcOrMdtb = individu.mdcNumber || individu.mdtbNumber;
    //     const payload = {
    //       negeri: 'ETL',
    //       daerah: 'ETL',
    //       klinik: individu.kodFasiliti,
    //       pilihanIndividu: mdcOrMdtb,
    //       bulan: moment()
    //         .subtract(1, 'month')
    //         .startOf('month')
    //         .format('YYYY-MM-DD'),
    //     };
    //     const dataObj = {
    //       createdByNegeri: individu.createdByNegeri,
    //       createdByDaerah: individu.createdByDaerah,
    //       createdByKodFasiliti: individu.kodFasiliti,
    //       createdByMdcMdtb: mdcOrMdtb,
    //       dataType: monthlyCount.name,
    //       dataFormat: 'Monthly',
    //       dataDate: moment()
    //         .subtract(1, 'month')
    //         .endOf('month')
    //         .format('YYYY-MM-DD'),
    //       createdAt: moment().format(),
    //     };
    //     switch (monthlyCount.name) {
    //       case 'PG206':
    //         const promise206 = monthlyCount
    //           .func(payload)
    //           .then(async (data) => {
    //             dataObj.data = data;
    //             await Reservoir.create(dataObj);
    //             ETLLogger.info(
    //               `[ETL] monthly data ${monthlyCount.name} generated for ${
    //                 individu.nama
    //               } | ${individu.mdcNumber ? 'MDC' : 'MDTB'}: ${mdcOrMdtb}`
    //             );
    //           })
    //           .catch((err) => {
    //             ETLLogger.error(
    //               `[ETL] Error running individu ETL. Cause: ${err}`
    //             );
    //           });
    //         countIndividu.push(promise206);
    //         break;
    //       case 'PG207':
    //         const promise207 = monthlyCount
    //           .func(payload)
    //           .then(async (data) => {
    //             dataObj.data = data;
    //             await Reservoir.create(dataObj);
    //             ETLLogger.info(
    //               `[ETL] monthly data ${monthlyCount.name} generated for ${individu.nama}`
    //             );
    //           })
    //           .catch((err) => {
    //             ETLLogger.error(
    //               `[ETL] Error running individu ETL. Cause: ${err}`
    //             );
    //           });
    //         countIndividu.push(promise207);
    //         break;
    //       case 'PGPRO01':
    //         const promisePGPRO01 = monthlyCount
    //           .func(payload)
    //           .then(async (data) => {
    //             dataObj.data = data;
    //             await Reservoir.create(dataObj);
    //             ETLLogger.info(
    //               `[ETL] monthly data ${monthlyCount.name} generated for ${individu.nama}`
    //             );
    //           })
    //           .catch((err) => {
    //             ETLLogger.error(
    //               `[ETL] Error running individu ETL. Cause: ${err}`
    //             );
    //           });
    //         countIndividu.push(promisePGPRO01);
    //         break;
    //       case 'PGPRO01Combined':
    //         const promisePGPRO01Combined = monthlyCount
    //           .func(payload)
    //           .then(async (data) => {
    //             dataObj.data = data;
    //             await Reservoir.create(dataObj);
    //             ETLLogger.info(
    //               `[ETL] monthly data ${monthlyCount.name} generated for ${individu.nama}`
    //             );
    //           })
    //           .catch((err) => {
    //             ETLLogger.error(
    //               `[ETL] Error running individu ETL. Cause: ${err}`
    //             );
    //           });
    //         countIndividu.push(promisePGPRO01Combined);
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // });

    // await Promise.all([Promise.all(countIndividu)]).then(() => {
    //   ETLLogger.info(`[ETL] monthly data generated for all individu`);
    // });

    ETLLogger.info(
      `ETL completed at ${moment().format('YYYY-MM-DD HH:mm:ss')}`
    );
    res
      .status(200)
      .json({ msg: 'ETL done. May the server is not on fire now' });
  } catch (error) {
    ETLLogger.error(`[ETL] Error running ETL. Cause: ${error}`);
    res
      .status(error.statusCode || 500)
      .json({ msg: error.message } || { msg: 'Internal Server Error' });
  }
};

module.exports = { initiateETL };
