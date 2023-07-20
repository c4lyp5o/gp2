// for MyVas library
const session = require('express-session');
const cors = require('cors');

// MyVas settings
const portalURL = process.env.MYVAS_PORTAL_URL;
const sessionSecret = process.env.MYVAS_SESSION_SECRET;
const corsOptions = {
  origin: portalURL,
  methods: 'GET, POST, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

// MyVas session
app.use(
  session({
    secret: sessionSecret,
    cookie: { maxAge: 60000 },
  })
);
app.use(cors(corsOptions));

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
