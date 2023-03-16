const jwt = require('jsonwebtoken');
const { unauthorizedLogger } = require('../logs/logger');

const authCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorizedLogger.warn(
      `${req.method} [authCheck] Unauthorized headers.authorization is ${req.headers.authorization} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  const userToken = authHeader.split(' ')[1];
  try {
    const userTokenVerified = jwt.verify(userToken, process.env.JWT_SECRET);
    req.user = {
      userId: userTokenVerified.userId,
      username: userTokenVerified.username,
      accountType: userTokenVerified.accountType,
      negeri: userTokenVerified.negeri,
      daerah: userTokenVerified.daerah,
      kp: userTokenVerified.kp,
      kodFasiliti: userTokenVerified.kodFasiliti,
    };
    next();
  } catch (error) {
    unauthorizedLogger.warn(
      `${req.method} [authCheck] Unauthorized jwt.verify ${userToken} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
};

module.exports = authCheck;
