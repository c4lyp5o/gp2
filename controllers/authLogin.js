const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

const authLogin = async (req, res) => {
  const { username, password, pilihanFasiliti } = req.body;

  let user = '';

  if (pilihanFasiliti) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const oldUserToken = authHeader.split(' ')[1];

    try {
      const oldUserTokenVerified = jwt.verify(
        oldUserToken,
        process.env.JWT_SECRET
      );
      user = await UserModel.findOne({
        username: oldUserTokenVerified.username,
      });
      console.log(user);

      user.kp = pilihanFasiliti;

      console.log(user);
    } catch (error) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    user = '';

    return res.status(200).json({ msg: 'ok' });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide username and password' });
  }
  // if (username === 'kpalorjanggus') {
  //   user = await UserModel.findOne({ username: username });
  //   if (!(user && (await user.comparePassword(password)))) {
  //     return res.status(401).json({ msg: 'Invalid credentials' });
  //   }
  // }
  // if (username !== 'kpalorjanggus') {
  user = await UserModel.findOne({
    username: username,
    password: password,
  });

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }
  // }

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

const authKaunter = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ msg: 'Please provide username and password' });
  }
  let user = '';
  // if (username === 'kaunterkpaj') {
  //   user = await UserModel.findOne({ username: username });
  //   if (!(user && (await user.comparePassword(password)))) {
  //     return res.status(401).json({ msg: 'Invalid credentials' });
  //   }
  // }
  // if (username !== 'kaunterkpaj') {
  user = await UserModel.findOne({
    username: username,
    password: password,
  });

  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }
  // }

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

module.exports = { authLogin, authKaunter };
