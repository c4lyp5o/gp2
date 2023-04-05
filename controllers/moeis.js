const https = require('https');
const axios = require('axios');

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

const getSekolahMOEIS = async (req, res) => {
  const { jkod, katkod, pkod, opskod, stpm, jnskod, special } = req.query;

  const URLquery =
    process.env.MOEIS_INTEGRATION_URL_SEKOLAH +
    `?jkod=${jkod}` +
    `${jnskod ? `&jnskod=${jnskod}` : ''}`;
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

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_PELAJAR +
        `?inid=${inid}
        ${pkid ? `&pkid=${pkid}` : ''}${
          statusoku ? `&statusoku=${statusoku}` : ''
        }`,
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

module.exports = {
  getJPNMOEIS,
  getSekolahMOEIS,
  getSingleSekolahMOEIS,
  getPelajarMOEIS,
  getSinglePelajarMOEIS,
};
