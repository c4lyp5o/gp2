const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deeprootsSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Deeproots = mongoose.model('Deeproots', deeprootsSchema);

module.exports = Deeproots;
