const jwt = require('jsonwebtoken');
const { unauthorizedLogger } = require('../logs/logger');

const adminAuth = (req, res, next) => {
  const authKey = req.headers.authorization;
  if (!authKey) {
    if (req.method !== 'GET') {
      unauthorizedLogger.warn(
        `${req.method} [adminAuth] Unauthorized headers.authorization is ${req.headers.authorization} from ${req.ip}`
      );
    }
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  try {
    const decoded = jwt.verify(authKey, process.env.JWT_SECRET);
    req.user = {
      userAccount: decoded.userAccount,
      accountType: decoded.accountType,
    };
    next();
  } catch (err) {
    if (req.method !== 'GET') {
      unauthorizedLogger.warn(
        `${req.method} [adminAuth] Unauthorized jwt.verify ${authKey} from ${req.ip}`
      );
    }
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
};

const adminAuthInt = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    if (req.method !== 'GET') {
      unauthorizedLogger.warn(
        `${req.method} [adminAuthInt] Unauthorized body.token is ${req.body.token} from ${req.ip}`
      );
    }
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userAccount: decoded.userAccount,
      accountType: decoded.accountType,
    };
    next();
  } catch (err) {
    if (req.method !== 'GET') {
      unauthorizedLogger.warn(
        `${req.method} [adminAuthInt] Unauthorized jwt.verify ${token} from ${req.ip}`
      );
    }
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
};

const refreshAuth = (req, res, next) => {
  const { 'x-api-key': apiKey } = req.headers;
  if (!apiKey || apiKey !== process.env.MANUAL_REFRESH_TOKENS_SECRET) {
    unauthorizedLogger.warn(
      `${req.method} [refreshAuth/killAuth] Unauthorized headers.x-api-key is ${apiKey} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  if (apiKey === process.env.MANUAL_REFRESH_TOKENS_SECRET) {
    next();
  }
};

const etlAuth = (req, res, next) => {
  const { 'x-api-key': apiKey } = req.headers;
  if (!apiKey || apiKey !== process.env.MANUAL_ETL_SECRET) {
    unauthorizedLogger.warn(
      `${req.method} [etlAuth] Unauthorized headers.x-api-key is ${apiKey} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  if (apiKey === process.env.MANUAL_ETL_SECRET) {
    next();
  }
};

const debugAuth = (req, res, next) => {
  const { 'x-api-key': apiKey } = req.headers;
  if (!apiKey || apiKey !== process.env.DEBUG_SECRET) {
    unauthorizedLogger.warn(
      `${req.method} [debugAuth] Unauthorized headers.x-api-key is ${apiKey} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  if (apiKey === process.env.DEBUG_SECRET) {
    next();
  }
};

module.exports = { adminAuth, adminAuthInt, etlAuth, refreshAuth, debugAuth };
