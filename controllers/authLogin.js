const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

// GET /find
const authFind = async (req, res) => {
  const { kodFasiliti, accountType } = req.query;

  const user = await UserModel.findOne({
    kodFasiliti: kodFasiliti,
    accountType: accountType,
  });

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  // just give out the username
  const username = user.username;

  res.status(200).json({ username });
};

// POST /login
const authLogin = async (req, res) => {
  const { username, password, pilihanFasiliti, pilihanDaerah } = req.body;

  let user = '';

  if (pilihanFasiliti) {
    const { userToken } = req.body;

    if (!userToken) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const oldUserToken = userToken;

    const oldUserTokenVerified = jwt.verify(
      oldUserToken,
      process.env.JWT_SECRET
    );
    user = await UserModel.findOne({
      username: oldUserTokenVerified.username,
    });

    // replacing...
    user.kp = pilihanFasiliti;
    user.daerah = pilihanDaerah;

    const reliefUserToken = user.createJWT();

    user = '';

    return res.status(200).json({ reliefUserToken });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide username and password' });
  }
  user = await UserModel.findOne({
    username: username,
    password: password,
  });

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const userToken = user.createJWT();

  const payloadAccountType = jwt.verify(userToken, process.env.JWT_SECRET);
  if (payloadAccountType.accountType === 'kaunterUser') {
    return res.status(401).json({ msg: 'This is kaunter credentials' });
  }
  if (payloadAccountType.accountType === 'erkmUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  user = '';

  res.status(200).json({ userToken });
};

// POST /kaunter/login
const authKaunter = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide username and password' });
  }
  let user = '';
  user = await UserModel.findOne({
    username: username,
    password: password,
  });

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const kaunterToken = user.createJWT();

  const payloadAccountType = jwt.verify(kaunterToken, process.env.JWT_SECRET);
  if (payloadAccountType.accountType === 'kpUser') {
    return res.status(401).json({ msg: 'This is kp credentials' });
  }
  if (payloadAccountType.accountType === 'erkmUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  user = '';

  res.status(200).json({ kaunterToken });
};

module.exports = { authFind, authLogin, authKaunter };
