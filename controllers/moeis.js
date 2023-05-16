const https = require('https');
const axios = require('axios');
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
const getRefreshPelajarMOEIS = async (req, res) => {
  logger.info('[manual-insert-pelajar] started manual-insert-pelajar');

  const sesiTakwim = sesiTakwimSekolah();

  const allCurrentSRSM = await Fasiliti.find({
    jenisFasiliti: ['sekolah-rendah', 'sekolah-menengah'],
    sesiTakwimSekolah: sesiTakwim,
  });

  // return dlu response
  res.status(402).json({ msg: 'Tgh running manual insert pelajar. Bayar la' });

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
        await insertToSekolah(allCurrentSRSM[i], data);
      } catch (error) {
        return res.status(503).json({ msg: error.message });
      }
    }
  }
  logger.info('[manual-insert-pelajar] finished ALL manual-insert-pelajar');
  return;
};

module.exports = {
  getJPNMOEIS,
  getSekolahMOEIS,
  getSingleSekolahMOEIS,
  getPelajarMOEIS,
  getSinglePelajarMOEIS,
  getRefreshPelajarMOEIS,
};
