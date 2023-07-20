const axios = require('axios');
const qs = require('qs');
const moment = require('moment');
const { logger } = require('../logs/logger');

async function redirectToAuth(req, res) {
  logger.info(
    `${req.method} ${req.url} [myVasController] redirectToAuth called`
  );
  const queryToEncode = {
    response_type: 'code',
    client_id: process.env.MYVAS_CLIENT_ID,
    scope: process.env.MYVAS_SCOPE,
    redirect_uri: process.env.MYVAS_REDIRECT_URI,
  };
  const encodedQuery = qs.stringify(queryToEncode);
  const myVasAuthURL = `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_AUTH_ENDPOINT}?${encodedQuery}`;
  res.status(200).json({
    next_status: 401,
    msg: 'Unauthorized',
    redirect_uri: myVasAuthURL,
  });
  return;
}

// GET /callback
async function getMyVasToken(req, res) {
  logger.info(
    `${req.method} ${req.url} [myVasController] getMyVasToken called`
  );

  const code = req.query.code;

  if (!code) {
    res.status(401).json({ msg: 'Unauthorized' });
    return;
  }

  const request_body = qs.stringify({
    grant_type: 'authorization_code',
    code: req.query.code,
    client_id: process.env.MYVAS_CLIENT_ID,
    scope: process.env.MYVAS_SCOPE,
    redirect_uri: process.env.MYVAS_REDIRECT_URI,
    client_secret: process.env.MYVAS_CLIENT_SECRET,
  });

  const config = {
    withCredentials: true,
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_TOKEN_ENDPOINT}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: request_body,
  };

  try {
    const { data } = await axios.request(config);
    return res.status(200).json({
      myVasToken: data.access_token,
      myVasIdToken: data.id_token,
    });
  } catch (error) {
    return res.status(401).json({ msg: 'Invalid code' });
  }
}

// GET /appointment-list
async function getAppointmentList(req, res) {
  logger.info(
    `${req.method} ${req.url} [myVasController] getAppointmentList called`
  );

  const authHeader = req.headers.authorization;
  const arrayOfHeader = authHeader.split(' ');

  const { data: allFasilitiKp } = await axios.get(
    `https://gpass.nocturnal.quest/api/getfs?negeri=${req.user.negeri}&daerah=${req.user.daerah}`
  );

  const currentFasilitiKp = allFasilitiKp.filter((el) => {
    return el.kodFasilitiGiret === req.user.kodFasiliti;
  });

  const branchCode = encodeURIComponent(currentFasilitiKp[0].kodFasiliti);
  const dateFilter = encodeURIComponent(moment().format('YYYY-MM-DD'));

  const config = {
    withCredentials: true,
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.MYVAS_API_APPOINTMENT_LISTS}?actor:identifier=https://myvas.moh.gov.my/System/location|${branchCode}&date=${dateFilter}`,
    headers: {
      Authorization: `Bearer ${arrayOfHeader[2]}`,
    },
  };

  console.log(config.url);

  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
//    redirectToAuth(req, res);
    console.log(error);
    return;
  }
}

// GET /patient-details
async function getPatientDetails(req, res) {
  logger.info(
    `${req.method} ${req.url} [myVasController] getPatientDetails called`
  );

  const authHeader = req.headers.authorization;
  const arrayOfHeader = authHeader.split(' ');

  const nric = req.query.nric;

  const config = {
    withCredentials: true,
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.MYVAS_API_PATIENT_DETAILS}?identifier=https://myvas.moh.gov.my/System/licence|${nric}`,
    headers: {
      Authorization: `Bearer ${arrayOfHeader[2]}`,
    },
  };
  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
    redirectToAuth(req, res);
    return;
  }
}

// GET /logout
async function logOutMyVas(req, res) {
  logger.info(`${req.method} ${req.url} [myVasController] logOutMyVas called`);

  const authHeader = req.headers.authorization;
  const arrayOfHeader = authHeader.split(' ');

  if (arrayOfHeader[3]) {
    await axios.get(
      `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_LOGOUT_ENDPOINT}?id_token_hint=${arrayOfHeader[3]}`
    );
    return res.status(200).json({ msg: 'Berjaya log keluar MyVas' });
  } else {
    return res.status(404).json({ msg: 'Sesi MyVas tidak wujud' });
  }
}

module.exports = {
  redirectToAuth,
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
};
