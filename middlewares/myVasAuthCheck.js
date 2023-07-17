const jwt = require('jsonwebtoken');
const { redirectToAuth } = require('../controllers/myVas');
const { unauthorizedLogger } = require('../logs/logger');

const myVasAuthCheck = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    unauthorizedLogger.warn(
      `${req.method} [myVasAuthCheck] Unauthorized headers.authorization is ${req.headers.authorization} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
  const arrayOfHeader = authHeader.split(' ');
  try {
    const userTokenVerified = jwt.verify(
      arrayOfHeader[1],
      process.env.JWT_SECRET
    );
    req.user = {
      userId: userTokenVerified.userId,
      username: userTokenVerified.username,
      accountType: userTokenVerified.accountType,
      negeri: userTokenVerified.negeri,
      daerah: userTokenVerified.daerah,
      kp: userTokenVerified.kp,
      kodFasiliti: userTokenVerified.kodFasiliti,
    };
    if (!arrayOfHeader[2]) {
      redirectToAuth(req, res);
      return;
    }
    if (arrayOfHeader[2]) {
      next();
    }
  } catch (error) {
    unauthorizedLogger.warn(
      `${req.method} [myVasAuthCheck] Unauthorized jwt.verify ${arrayOfHeader[1]} from ${req.ip}`
    );
    return res
      .status(401)
      .json({ msg: 'Unauthorized. This behaviour will be reported' });
  }
};

module.exports = myVasAuthCheck;
