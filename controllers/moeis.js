const https = require('https');
const axios = require('axios');
// const async = require('async');
const Sekolah = require('../models/Sekolah');
const Fasiliti = require('../models/Fasiliti');
const PrioritySekolah = require('../models/PrioritySekolah');
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
  const { awaitOrNot, reversed } = req.query;

  const sesiTakwim = sesiTakwimSekolah();

  // return dlu response
  res.status(402).json({ msg: 'Tgh running manual insert pelajar. Bayar la' });

  if (awaitOrNot === 'true' && reversed === 'false') {
    logger.info(
      `[manual-insert-pelajar] started manual-insert-pelajar awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSMNormal = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
    });

    for (let i = 0; i < allCurrentSRSMNormal.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSMNormal[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log(
          'Sekolah ni tak ada budak: ' + allCurrentSRSMNormal[i].nama
        );
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSMNormal[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          await insertToSekolah(allCurrentSRSMNormal[i], data); // one by one
        } catch (error) {
          logger.error(
            `[manual-insert-pelajar] error for sekolah ${allCurrentSRSMNormal[i].nama} ${allCurrentSRSMNormal[i].idInstitusi} ${allCurrentSRSMNormal[i].kodSekolah}, error is: ${error}`
          );
          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
    return;
  }

  if (awaitOrNot === 'true' && reversed === 'true') {
    logger.info(
      `[manual-insert-pelajar] started manual-insert-pelajar awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSMReversed = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
    }).sort({ _id: -1 });

    for (let i = 0; i < allCurrentSRSMReversed.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSMReversed[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log(
          'Sekolah ni tak ada budak: ' + allCurrentSRSMReversed[i].nama
        );
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSMReversed[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          await insertToSekolah(allCurrentSRSMReversed[i], data); // one by one
        } catch (error) {
          logger.error(`[manual-insert-pelajar] ${error.message}`);
          logger.error(
            `[manual-insert-pelajar] error for sekolah ${allCurrentSRSMReversed[i].nama} ${allCurrentSRSMReversed[i].idInstitusi} ${allCurrentSRSMReversed[i].kodSekolah}, error is: ${error}`
          );

          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
    return;
  }

  if (awaitOrNot === 'false') {
    logger.info(
      `[manual-insert-pelajar] started manual-insert-pelajar awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSM = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
    });

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
        } catch (error) {
          logger.error(
            `[manual-insert-pelajar] error for sekolah ${allCurrentSRSM[i].nama} ${allCurrentSRSM[i].idInstitusi} ${allCurrentSRSM[i].kodSekolah}, error is: ${error}`
          );
          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
    return;
  }

  logger.error(
    `[manual-insert-perlajar] your params awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
  );
  return;
};

// GET /priority-sekolah
const getPrioritySekolahMOEIS = async (req, res) => {
  const { awaitOrNot, reversed } = req.query;

  const sesiTakwim = sesiTakwimSekolah();

  const prioritySekolahList = await PrioritySekolah.findOne({
    nama: 'current',
  });

  // return dlu response
  res.status(402).json({ msg: 'Tgh running priority sekolah. Bayar la' });

  if (awaitOrNot === 'true' && reversed === 'false') {
    logger.info(
      `[priority-sekolah] started priority-sekolah awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSMNormal = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
      kodSekolah: { $in: [...prioritySekolahList.kodSekolah] },
    });

    for (let i = 0; i < allCurrentSRSMNormal.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSMNormal[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log(
          'Priority sekolah ni tak ada budak: ' + allCurrentSRSMNormal[i].nama
        );
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSMNormal[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          await insertToSekolah(allCurrentSRSMNormal[i], data); // one by one
        } catch (error) {
          logger.error(
            `[priority-sekolah] error for sekolah ${allCurrentSRSMNormal[i].nama} ${allCurrentSRSMNormal[i].idInstitusi} ${allCurrentSRSMNormal[i].kodSekolah}, error is: ${error}`
          );
          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[priority-sekolah] finished ALL priority sekolah');
    return;
  }

  if (awaitOrNot === 'true' && reversed === 'true') {
    logger.info(
      `[priority-sekolah] started priority-sekolah awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSMReversed = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
      kodSekolah: { $in: [...prioritySekolahList.kodSekolah] },
    }).sort({ _id: -1 });

    for (let i = 0; i < allCurrentSRSMReversed.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSMReversed[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log(
          'Priority sekolah ni tak ada budak: ' + allCurrentSRSMReversed[i].nama
        );
        try {
          const agent = new https.Agent({
            rejectUnauthorized: false,
          });
          const { data } = await axios.get(
            process.env.MOEIS_INTEGRATION_URL_PELAJAR +
              `?inid=${allCurrentSRSMReversed[i].idInstitusi}`,
            {
              httpsAgent: agent,
              headers: {
                APIKEY: process.env.MOEIS_APIKEY,
              },
            }
          );
          await insertToSekolah(allCurrentSRSMReversed[i], data); // one by one
        } catch (error) {
          logger.error(
            `[priority-sekolah] error for sekolah ${allCurrentSRSMReversed[i].nama} ${allCurrentSRSMReversed[i].idInstitusi} ${allCurrentSRSMReversed[i].kodSekolah}, error is: ${error}`
          );
          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[priority-sekolah] finished ALL priority sekolah');
    return;
  }

  if (awaitOrNot === 'false') {
    logger.info(
      `[priority-sekolah] started priority-sekolah awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
    );

    const allCurrentSRSM = await Fasiliti.find({
      jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
      sesiTakwimSekolah: sesiTakwim,
      kodSekolah: { $in: [...prioritySekolahList.kodSekolah] },
    });

    for (let i = 0; i < allCurrentSRSM.length; i++) {
      const pelajarAlreadyAdded = await Sekolah.find({
        kodSekolah: allCurrentSRSM[i].kodSekolah,
        sesiTakwimPelajar: sesiTakwim,
      });
      if (pelajarAlreadyAdded.length === 0) {
        console.log(
          'Priority sekolah ni tak ada budak: ' + allCurrentSRSM[i].nama
        );
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
        } catch (error) {
          logger.error(
            `[priority-sekolah] error for sekolah ${allCurrentSRSM[i].nama} ${allCurrentSRSM[i].idInstitusi} ${allCurrentSRSM[i].kodSekolah}, error is: ${error}`
          );
          // return res.status(503).json({ msg: error.message });
        }
      }
    }
    logger.info('[priority-sekolah] finished ALL priority sekolah');
    return;
  }

  logger.error(
    `[priority-sekolah] your params awaitOrNot: ${awaitOrNot}, reversed: ${reversed}`
  );
  return;
};

// GET /refresh-pelajar
const getRefreshPelajarMOEIS = async (req, res) => {
  const { idInstitusi, kodSekolah } = req.query;

  const sesiTakwim = sesiTakwimSekolah();

  res.status(402).json({
    msg: `Tgh running refresh pelajar untuk sekolah ${
      idInstitusi || kodSekolah
    }. Bayar la`,
  });

  logger.info(
    `[refresh-pelajar] started refresh-pelajar idInstitusi: ${idInstitusi}, kodSekolah: ${kodSekolah}`
  );

  let fasilitiSekolah = {};

  if (idInstitusi) {
    fasilitiSekolah = await Fasiliti.findOne({
      idInstitusi: idInstitusi,
      sesiTakwimSekolah: sesiTakwim,
    });
  }
  if (kodSekolah) {
    fasilitiSekolah = await Fasiliti.findOne({
      kodSekolah: kodSekolah,
      sesiTakwimSekolah: sesiTakwim,
    });
  }

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_PELAJAR +
        `?inid=${fasilitiSekolah.idInstitusi}`,
      {
        httpsAgent: agent,
        headers: {
          APIKEY: process.env.MOEIS_APIKEY,
        },
      }
    );
    await insertToSekolah(fasilitiSekolah, data);
  } catch (error) {
    logger.error(
      `[refresh-pelajar] error for sekolah ${fasilitiSekolah.nama} ${fasilitiSekolah.idInstitusi} ${fasilitiSekolah.kodSekolah}, error is: ${error}`
    );
  }

  logger.info(
    `[refresh-pelajar] your params idInstitusi: ${idInstitusi}, kodSekolah: ${kodSekolah}`
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
  getPrioritySekolahMOEIS,
  getRefreshPelajarMOEIS,
};
