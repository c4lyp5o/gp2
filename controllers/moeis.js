const https = require('https');
const axios = require('axios');
// const async = require('async');
const Sekolah = require('../models/Sekolah');
const Fasiliti = require('../models/Fasiliti');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');
const insertToSekolah = require('../controllers/helpers/insertToSekolah');
const { logger } = require('../logs/logger');

// GET /jpn
const getJPNMOEIS = async (req, res) => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(process.env.MOEIS_INTEGRATION_URL_JPN, {
      httpsAgent: agent,
      headers: {
        APIKEY: process.env.MOEIS_APIKEY,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /sekolah
const getSekolahMOEIS = async (req, res) => {
  const { jkod, katkod, pkod, opskod, stpm, jnskod, special } = req.query;

  const URLquery =
    process.env.MOEIS_INTEGRATION_URL_SEKOLAH +
    `?jkod=${jkod}` +
    `${jnskod ? `&jnskod=${jnskod}` : ''}` +
    `${stpm ? `&stpm=${stpm}` : ''}`;
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(URLquery, {
      httpsAgent: agent,
      headers: {
        APIKEY: process.env.MOEIS_APIKEY,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /singleSekolah
const getSingleSekolahMOEIS = async (req, res) => {
  const { inkod, inid } = req.query;

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_SINGLE_SEKOLAH +
        `?inkod=${inkod}
          ${inid ? `&inid=${inid}` : ''}`,
      {
        httpsAgent: agent,
        headers: {
          APIKEY: process.env.MOEIS_APIKEY,
        },
      }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /pelajar
const getPelajarMOEIS = async (req, res) => {
  const { inid, pkid, statusoku } = req.query;

  let URLquery = '';
  if (inid) {
    // query by inid
    URLquery = process.env.MOEIS_INTEGRATION_URL_PELAJAR + `?inid=${inid}`;
  }
  if (pkid) {
    // query by pkid
    URLquery = process.env.MOEIS_INTEGRATION_URL_PELAJAR + `?pkid=${pkid}`;
  }
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(URLquery, {
      httpsAgent: agent,
      headers: {
        APIKEY: process.env.MOEIS_APIKEY,
      },
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /singlePelajar
const getSinglePelajarMOEIS = async (req, res) => {
  const { id_individu } = req.query;

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_SINGLE_PELAJAR +
        `?id_individu=${id_individu}`,
      {
        httpsAgent: agent,
        headers: {
          APIKEY: process.env.MOEIS_APIKEY,
        },
      }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(503).json({ msg: error.message });
  }
};

// GET /manual-insert-pelajar
const getManualInsertPelajarMOEIS = async (req, res) => {
  const { awaitOrNot } = req.query;

  logger.info(
    `[manual-insert-pelajar] started manual-insert-pelajar awaitOrNot: ${awaitOrNot}`
  );

  const sesiTakwim = sesiTakwimSekolah();

  const allCurrentSRSM = await Fasiliti.find({
    jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
    sesiTakwimSekolah: sesiTakwim,
  });

  // return dlu response
  res.status(402).json({ msg: 'Tgh running manual insert pelajar. Bayar la' });

  if (awaitOrNot === 'true') {
    for (let i = 0; i < allCurrentSRSM.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSM[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log('Sekolah ni tak ada budak: ' + allCurrentSRSM[i].nama);
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSM[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          await insertToSekolah(allCurrentSRSM[i], data); // one by one
        } catch (error) {
          return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
    return;
  }

  if (awaitOrNot === 'false') {
    // let tasks = [];

    // const queue = async.queue((task, executed) => {
    //   console.log('Executing task: ' + task);

    //   setTimeout(() => {
    //     const tasksRemaining = queue.length();
    //     executed(null, { task, tasksRemaining });
    //   }, 1000);
    // }, 2);

    for (let i = 0; i < allCurrentSRSM.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSM[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log('Sekolah ni tak ada budak: ' + allCurrentSRSM[i].nama);
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSM[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          insertToSekolah(allCurrentSRSM[i], data); // tamak haloba
          // tasks.push({ twoInOne: [allCurrentSRSM[i], data] });
          // tasks.push(allCurrentSRSM[i], data);
        } catch (error) {
          return res.status(503).json({ msg: error.message });
        }
      }
    }

    // console.log(tasks);

    // tasks.forEach((task) => {
    //   queue.push(
    //     insertToSekolah(task.twoInOne[0], task.twoInOne[1]),
    //     (error, { task, tasksRemaining }) => {
    //       if (error) {
    //         console.log(`An error occurred while processing task ${task}`);
    //       } else {
    //         console.log(
    //           `Finished processing task ${task}. ${tasksRemaining} tasks remaining`
    //         );
    //       }
    //     }
    //   );
    // });

    logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
    return;
  }

  logger.error(
    `[manual-insert-perlajar] your params awaitOrNot: ${awaitOrNot}`
  );
  return;
};

module.exports = {
  getJPNMOEIS,
  getSekolahMOEIS,
  getSingleSekolahMOEIS,
  getPelajarMOEIS,
  getSinglePelajarMOEIS,
  getManualInsertPelajarMOEIS,
};
