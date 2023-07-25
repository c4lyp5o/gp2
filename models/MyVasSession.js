const mongoose = require('mongoose');

const MyVasSessionSchema = new mongoose.Schema({
  myVasSessionCookieId: {
    type: String,
    default: '',
  },
  myVasToken: {
    type: String,
    default: '',
  },
  myVasIdToken: {
    type: String,
    default: '',
  },
  lastLogin: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('MyVasSession', MyVasSessionSchema);
