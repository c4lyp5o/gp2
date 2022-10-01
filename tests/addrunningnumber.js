const Runningnumber = require('../models/Runningnumber.js');
const User = require('../models/User.js');

const deleteLah = async () => {
  const deleteData = await User.findByIdAndDelete('631eb93d514f14158e5097c3');
  console.log(deleteData);
};

deleteLah();
