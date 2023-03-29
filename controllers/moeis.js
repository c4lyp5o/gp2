const https = require('https');
const axios = require('axios');

const getSekolahMOEIS = async (req, res) => {
  const { jkod, katkod, pkod, opskod, stpm, jnskod, special } = req.query;

  try {
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    const { data } = await axios.get(
      process.env.MOEIS_INTEGRATION_URL_SEKOLAH +
        `?jkod=${jkod}
          ${katkod ? `&katkod=${katkod}` : ''}${pkod ? `&pkod=${pkod}` : ''}${
          opskod ? `&opskod=${opskod}` : ''
        }${stpm ? `&stpm=${stpm}` : ''}${jnskod ? `&jnskod=${jnskod}` : ''}${
          special ? `&special=${special}` : ''
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
    return res.json({ msg: error });
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
    return res.json({ msg: error });
  }
};

module.exports = { getSekolahMOEIS, getPelajarMOEIS };
