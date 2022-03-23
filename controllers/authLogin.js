const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

const authLogin = async (req,res) => {
    const { username, password } = req.body;

    if (!username || !password ) {
        return res.status(400).json({ msg: 'Please provide username and password'});
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = user.createJWT();

    const payloadUserType = jwt.verify(token, process.env.JWT_SECRET);
    if (payloadUserType.accountType === 'negaraUser') {
        return res.status(401).json({ msg: 'This is admin credentials' });
    }
    if (payloadUserType.accountType === 'negeriUser') {
        return res.status(401).json({ msg: 'This is admin credentials' });
    }
    if (payloadUserType.accountType === 'daerahUser') {
        return res.status(401).json({ msg: 'This is admin credentials' });
    }

    res.status(200).json({ token, redirectLogin: 'modules/pilihOperator.html' });
}

module.exports = authLogin;