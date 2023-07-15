const axios = require('axios');
const qs = require('qs');
const MyVasSession = require('../models/MyVasSession');

// log in constants
const loginSuccessMessage = 'Berjaya Log Masuk';
const invalidCode = 'Invalid code!';
const Unauthorized = 'Unauthorized';

// log out constants
const logoutSuccess = 'Berjaya Log Keluar';
const sessionNotLogin = 'Sesi MyVas tidak wujud';

async function saveToken(req, res, token, idToken) {
  console.log('calling saveToken');
  let connect_sid = req.headers.cookie.split('=')[1];

  await MyVasSession.create({
    myVasSessionCookieId: connect_sid,
    myVasToken: token,
    myVasIdToken: idToken,
  });
}

async function retrieveToken(req, res) {
  console.log('calling retrieveToken');
  let connect_sid = req.headers?.cookie?.split('=')[1];
  if (connect_sid) {
    const token = await MyVasSession.findOne({
      myVasSessionCookieId: connect_sid,
    });
    if (!token) {
      delete req.session[process.env.MYVAS_APP_TOKEN];
      delete req.session[process.env.MYVAS_ID_TOKEN];
      return false;
    }
    if (token) {
      return token;
    }
  }
}

async function deleteToken(req, res) {
  console.log('calling deleteToken');
  let connect_sid = req.headers?.cookie?.split('=')[1];

  if (connect_sid) {
    const token = await MyVasSession.findOneAndDelete({
      myVasSessionCookieId: connect_sid,
    });
    if (!token) {
      delete req.session[process.env.MYVAS_APP_TOKEN];
      delete req.session[process.env.MYVAS_ID_TOKEN];
      return false;
    }
    if (token) {
      return token;
    }
  }
}

async function getMyVasToken(req, res) {
  console.log('calling getMyVasToken');
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
    .then(async (response) => {
      if (response.data) {
        if (response.data.access_token) {
          const newLandingPage = process.env.MYVAS_LANDING_PAGE;
          // await saveToken(
          //   req,
          //   res,
          //   response.data.access_token,
          //   response.data.id_token
          // );
          // let echoSuccessLogin = null;
          // {
          //   process.env.BUILD_ENV === 'dev'
          //     ? (echoSuccessLogin = `<script>
          //                         function postCrossDomainMessage(msg) {
          //                           const win = document.getElementById('ifr').contentWindow;
          //                           win.postMessage(msg, "http://localhost:3000/pendaftaran/daftar/kp");
          //                         }
          //                         const postMsg = {"login": "user"}; // this is just example
          //                         postCrossDomainMessage(postMsg);
          //                         alert("${loginSuccessMessage}");
          //                       </script>`)
          //     : (echoSuccessLogin = `<script>
          //                         localStorage.setItem('myVasToken', "${response.data.access_token}");
          //                         alert("${loginSuccessMessage}");
          //                         window.location.href = "${newLandingPage}";
          //                       </script>`);
          // }
          // res.status(200).send(echoSuccessLogin);
          res.status(200).json({
            myVasToken: response.data.access_token,
            myVasIdToken: response.data.id_token,
          });
          return;
        }
      }
    })
    .catch((error) => {
      res.status(401).json({ invalidCode });
      return;
    });
}

async function redirectToAuth(req, res) {
  console.log('calling redirectToAuth');
  const myUrlEncode = {
    client_id: process.env.MYVAS_CLIENT_ID,
    redirect_uri: process.env.MYVAS_REDIRECT_URI,
    response_type: 'code',
    scope: process.env.MYVAS_SCOPE,
  };
  const myEncoded = qs.stringify(myUrlEncode);
  const authURL = `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_AUTH_ENDPOINT}?${myEncoded}`;
  res
    .status(200)
    .json({ next_status: 401, message: Unauthorized, redirect_uri: authURL });
  return;
}

async function getPatientDetails(req, res) {
  console.log('calling getPatientDetails');
  return res.status(200).json({ msg: 'good patientDetails' });
  const nric = req.query.nric;
  const token = await retrieveToken(req, res);
  if (token) {
    req.session[process.env.MYVAS_APP_TOKEN] = token.myVasToken;
    req.session[process.env.MYVAS_ID_TOKEN] = token.myVasIdToken;
  }
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

async function getAppointmentList(req, res) {
  console.log('calling getAppointmentList');
  // const token = await retrieveToken(req, res);
  // if (token) {
  //   req.session[process.env.MYVAS_APP_TOKEN] = token.myVasToken;
  //   req.session[process.env.MYVAS_ID_TOKEN] = token.myVasIdToken;
  // }
  // if (req.session[process.env.MYVAS_APP_TOKEN]) {
  return res.status(200).json({ msg: 'good appt' });
  let branchcode = req.query.branchcode;
  let datefilter = req.query.datefilter;
  // if (req.query.landingPage)
  //   req.session[process.env.MYVAS_NEW_LANDING] = req.query.landingPage;
  // req.session.save();
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
  // } else {
  //   if (req.query.landingPage)
  //     req.session[process.env.MYVAS_NEW_LANDING] = req.query.landingPage;
  //   req.session.save();
  //   redirectToAuth(req, res);
  //   return;
  // }
}

async function logOutMyVas(req, res) {
  console.log('calling logOutMyVas');
  const authHeader = req.headers.authorization;
  const arrayOfHeader = authHeader.split(' ');
  // const token = await deleteToken(req, res);
  // if (token) {
  //   req.session[process.env.MYVAS_APP_TOKEN] = token.myVasToken;
  //   req.session[process.env.MYVAS_ID_TOKEN] = token.myVasIdToken;
  // }
  // if (req.session[process.env.MYVAS_APP_TOKEN]) {
  // let idTokenHint = req.session[process.env.MYVAS_ID_TOKEN];
  console.log(arrayOfHeader);
  if (arrayOfHeader[3]) {
    await axios.get(
      `${process.env.MYVAS_AUTH_SERVER}${process.env.MYVAS_LOGOUT_ENDPOINT}?id_token_hint=${arrayOfHeader[3]}`
    );
    // delete req.session[process.env.MYVAS_APP_TOKEN];
    // delete req.session[process.env.MYVAS_ID_TOKEN];
    return res.status(200).json({ message: logoutSuccess });
  } else {
    return res.status(200).json({ message: sessionNotLogin });
  }
}

module.exports = {
  getMyVasToken,
  redirectToAuth,
  getPatientDetails,
  getAppointmentList,
  logOutMyVas,
};
