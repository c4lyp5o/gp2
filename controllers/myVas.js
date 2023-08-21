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

  const currentFasilitiKp = allFasilitiKp.filter((f) => {
    return f.kodFasilitiGiret === req.user.kodFasiliti;
  });

  const branchCode = currentFasilitiKp[0].kodFasiliti;
  const dateFilter = moment().format('YYYY-MM-DD');

  let encodedUri = '';

  {
    process.env.BUILD_ENV === 'dev' &&
      (encodedUri = encodeURI(
        `${process.env.MYVAS_API_APPOINTMENT_LISTS}?actor:identifier=https://myvas.moh.gov.my/System/location|12-345678&date=2023-04-13`
      ));
  }

  {
    process.env.BUILD_ENV === 'production' ||
      process.env.BUILD_ENV === 'training' ||
      (process.env.BUILD_ENV === 'unstable' &&
        (encodedUri = encodeURI(
          `${process.env.MYVAS_API_APPOINTMENT_LISTS}?actor:identifier=https://myvas.moh.gov.my/System/location|${branchCode}&date=${dateFilter}`
        )));
  }

  const config = {
    withCredentials: true,
    method: 'get',
    maxBodyLength: Infinity,
    url: encodedUri,
    headers: {
      Authorization: `Bearer ${arrayOfHeader[2]}`,
    },
  };

  console.log(config.url);

  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response.status === 401) {
      redirectToAuth(req, res);
      return;
    }
    console.log(error);
    res.status(500).json({ msg: 'Problem MyVAS APPT' });
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

  const identifier = req.query.identifier;

  const encodedUri = encodeURI(
    `${process.env.MYVAS_API_PATIENT_DETAILS}?identifier=https://myvas.moh.gov.my/System.licence|${identifier}`
  );

  const config = {
    withCredentials: true,
    method: 'get',
    maxBodyLength: Infinity,
    url: encodedUri,
    headers: {
      Authorization: `Bearer ${arrayOfHeader[2]}`,
    },
  };

  console.log(config.url);

  try {
    const response = await axios.request(config);
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response.status === 401) {
      redirectToAuth(req, res);
      return;
    }
    console.log(error);
    res.status(500).json({ msg: 'Problem MyVAS PT DETAILS' });
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
    return res.status(200).json({ msg: 'Berjaya log keluar MyVAS' });
  } else {
    return res.status(404).json({ msg: 'Sesi MyVAS tidak wujud' });
  }
}

module.exports = {
  redirectToAuth,
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
};
