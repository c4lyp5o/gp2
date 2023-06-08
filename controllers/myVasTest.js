const axios = require('axios'); //library for API call
const qs = require('qs'); //library for query string

// log in constants
const loginSuccessMessage = 'Berjaya Log Masuk';
const invalidCode = 'invalid code!'; //auth server return invalid code for auth flow (not 200)
const Unauthorized = 'Unauthorized';

// log out constansts
const logoutSuccess = 'logout success!';
const sessionNotLogin = 'session wasnt login!';

function getMyVasToken(req, res) {
  const code = req.query.code;
  if (!code) {
    res.status(401).send(invalidCode);
    return;
  }

  let data = qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.MYVAS_CLIENT_ID,
    client_secret: process.env.MYVAS_SECRET,
    code: req.query.code,
    redirect_uri: process.env.MYVAS_REDIRECT_URI,
    scope: process.env.MYVAS_SCOPE,
  });

  let config = {
    withCredentials: true,
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_TOKEN_ENDPOINT}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      if (response.data) {
        if (response.data.access_token) {
          req.session[process.env.MYVAS_APP_TOKEN] = response.data.access_token;
          if (response.data.id_token)
            req.session[process.env.MYVAS_ID_TOKEN] = response.data.id_token;
          let newLandingPage = req.session[process.env.MYVAS_NEW_LANDING];
          if (!newLandingPage) newLandingPage = process.env.MYVAS_LANDING_PAGE;
          let echoSuccessLogin = `<script>
        alert("${loginSuccessMessage}");
        window.location.href = '${newLandingPage}';
        </script>`;
          req.session.save(() => {
            res.status(200).send(echoSuccessLogin);
          });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send(invalidCode);
      return;
    });
}

function redirectToAuth(req, res) {
  let myUrlEncode = {
    client_id: process.env.MYVAS_CLIENT_ID,
    redirect_uri: process.env.MYVAS_REDIRECT_URI,
    response_type: 'code',
    scope: process.env.MYVAS_SCOPE,
  };
  let myEncoded = qs.stringify(myUrlEncode);
  let authURL = `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_AUTH_ENDPOINT}?${myEncoded}`;
  res
    .status(200)
    .json({ next_status: 401, message: Unauthorized, redirect_uri: authURL });
}

function getPatientDetails(req, res) {
  let nric = req.query.nric;
  if (req.session[process.env.MYVAS_APP_TOKEN]) {
    delete req.session[process.env.MYVAS_NEW_LANDING];
    req.session.save();
    let config = {
      withCredentials: true,
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.MYVAS_API_ENDPOINT}?identifier=https://myvas.moh.gov.my/System/licence|${nric}`,
      headers: {
        Authorization: `Bearer ${req.session[process.env.MYVAS_APP_TOKEN]}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        res.status(200).send(response.data);
        return;
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send();
        return;
      });
  } else {
    redirectToAuth(req, res);
    return;
  }
}

function getAppointmentList(req, res) {
  if (req.session[process.env.MYVAS_APP_TOKEN]) {
    let branchcode = req.query.branchcode;
    let datefilter = req.query.datefilter;
    if (req.query.landingPage)
      req.session[process.env.MYVAS_NEW_LANDING] = req.query.landingPage;
    req.session.save();
    let config = {
      withCredentials: true,
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.MYVAS_API_APPOINTMENT}?actor:identifier=https://myvas.moh.gov.my/System/location|12-345678&date=2023-04-13`,
      headers: {
        Authorization: `Bearer ${req.session[process.env.MYVAS_APP_TOKEN]}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        res.status(200).send(response.data);
        return;
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send();
        return;
      });
  } else {
    if (req.query.landingPage)
      req.session[process.env.MYVAS_NEW_LANDING] = req.query.landingPage;
    req.session.save();
    redirectToAuth(req, res);
    return;
  }
}

function logOutMyVas(req, res) {
  if (req.session[process.env.MYVAS_APP_TOKEN]) {
    let idTokenHint = req.session[process.env.MYVAS_ID_TOKEN];
    axios
      .get(
        `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_LOGOUT_ENDPOINT}?id_token_hint=${idTokenHint}`
      )
      .then();
    delete req.session[process.env.MYVAS_APP_TOKEN];
    delete req.session[process.env.MYVAS_ID_TOKEN];
    req.session.save(() => {
      res.status(200).json({ next_status: 200, message: logoutSuccess });
    });
  } else {
    res.status(200).json({ next_status: 404, message: sessionNotLogin });
  }
}

module.exports = {
  getMyVasToken,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
};
