const { unauthorizedLogger } = require('../logs/logger');

const moeisAuth = async (req, res, next) => {
  const apikey = req.headers.apikey;
  if (!apikey || apikey !== process.env.OWN_MIDDLEWARE_MOEIS_APIKEY) {
    unauthorizedLogger.warn(
      `${req.method} [moeisAuth] Unauthorized headers.apikey is ${req.headers.apikey} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  if (apikey === process.env.OWN_MIDDLEWARE_MOEIS_APIKEY) {
    next();
  }
};

module.exports = moeisAuth;
