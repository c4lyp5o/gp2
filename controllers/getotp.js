const Operator = require('../models/Operator');
const simpleCrypto = require('simple-crypto-js').default;
const mailer = require('nodemailer');
const transporter = mailer.createTransport({
  host: process.env.EMAILER_HOST,
  port: process.env.EMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAILER_ACCT,
    pass: process.env.EMAILER_PASS,
  },
});

// save tempkey and send to email
const saveTempKey = async (req, res) => {
  const { id } = req.query;
  const operator = await Operator.findOne({ _id: id });

  if (!operator) {
    return res.status(404).json({ msg: 'No operator with that email' });
  }

  const key = simpleCrypto.generateRandomString(20);

  const updatedOperator = await Operator.findOneAndUpdate(
    { _id: operator._id },
    { tempKey: key },
    { new: true, runValidators: true }
  );

  // send email
  const mailOptions = {
    from: process.env.EMAILER_ACCT,
    to: operator.email,
    subject: 'Kunci Verifikasi',
    html: `<p>Hi ${operator.nama},</p>
              <p>Anda telah memohon untuk menghapus data pesakit. Key verifikasi anda adalah:</p>
              <br /><p>${key}</p><br />
              <p>Jika anda tidak memohon untuk penghapusan data, sila abaikan email ini.</p>
              <p>Terima kasih.</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        message: 'Email tidak dapat dihantar',
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Email telah dihantar',
      email: operator.email,
    });
  });
};

// verify tempkey
const verifyTempKey = async (req, res) => {
  const { id, otp } = req.query;
  const operator = await Operator.findOne({ _id: id });

  if (!operator) {
    return res.status(404).json({ msg: 'No operator with that id' });
  }

  if (operator.tempKey === otp) {
    return res.status(200).json({ msg: 'OTP verified' });
  }

  return res.status(401).json({ msg: 'OTP not verified' });
};

module.exports = { saveTempKey, verifyTempKey };
