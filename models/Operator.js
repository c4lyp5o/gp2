const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const operatorSchema = new Schema({
  nama: {
    type: String,
  },
  email: {
    type: String,
  },
  mdcNumber: {
    type: String,
  },
  mdtbNumber: {
    type: String,
  },
  gred: {
    type: String,
  },
  image: {
    type: String,
    default:
      'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAB4AHgDASIAAhEBAxEB/8QAHAABAAMBAQEBAQAAAAAAAAAAAAMFBgQBBwII/8QANBAAAQMBBAYIBgMBAAAAAAAAAAECAwQFEZLREhMWIVJTBiIxQUJRYZEycYGhscEjQ+Fy/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwD+hNTFyosDchqYuVFgbkSAqI9TFyosDchqYuVFgbkSACPUxcqLA3IamLlRYG5EgAj1MXKiwNyGpi5UWBuRIAI9TFyosDchqYuVFgbkSACPUxcqLA3IamLlRYG5EgAj1MXKiwNyGpi5UWBuRIAI9TFyosDcgSAAAAAAAAHJaNfDQQo+ZVVzvgYna7/PUDrPbl8l9jF1ds1tS5bpFhZwxbvde1Th1st9+tkv89Ncy4mvoIMXSWzW0ypfKszOCXf9+1DUWbaENfEror2vb8ca9rc09SGuwABQAAAAAAAAAAfiaVkML5ZFuYxqucvohhKypkrKl88vxO7E4U7kQ03SmVWWYjE/tkRq/JN/6QyZUoAAgTUlTJSVLJ4V6ze7iTvRSEAfQKeVk8Ecsa3se1HISFN0VlV9nPjX+qRUT5Kl+ZckaAAAAAAAAAABRdLWqtFTu7my3e7VyMwbi16Vayz5ompe+7SZ/wBJvTL6mHQrNAAAACgaboi1Upal3csiJ7N/0vjisalWjs6KJ6XSL13/ADXu/CHaRoAAAAAAAAAAAzlvWQ5ZH1VI1XaW+SNO2/iT9oaM46i06OnW6WpjRyeFq6S/YIw6bwX1oV1j1Llc+mndIvjjajFX77/qhW32bf8ABXXeWkzIqONVL+wbIcsjKqrZotbvjjd2qvmvp6HlBW2PTORzaedsieORqPVPvu+iF3T2lR1C3RVMauXwuXRX7hY6wARQAAAAAAAAq7UtmGiVY40SadO1qLub81/Ry9ILWdAq0tK66W7+R6eH0T1/BmUQqWuuttGqrFXXyrocDeq327/qciJd2ABAAAAqX9oAHXRWlVUaokMqqzlv6zf8+hprLtiCtVI3fxTr4FXc75L+jHAGvogKPo/aq1F1NVOvmROo9fGnkvr+S8I0AAAc1o1KUdFNPuVWJ1U83LuT7nSV1u0k1bSMip1Yi6aOdpLduRFAxrlc5yuequcq3qq96nhb7PVvFBjXIbPVvFBjXIrKoBb7PVvFBjXIbPVvFBjXICoBb7PVvFBjXIbPVvFBjXICoBb7PVvFBjXIbPVvFBjXICoBb7PVvFBjXIbPVvFBjXICpa5zHtexyte1b0VO5Td0FSlXRwzpu023qnkvenuZrZ6t4oMa5F7YdJNRUboahWKumrm6K3pct37CxYAAigAAAAAAAAAAAAAAAAAAAAD/2Q==',
  },
  createdByNegeri: {
    type: String,
  },
  createdByDaerah: {
    type: String,
  },
  kpSkrg: {
    type: String,
  },
  kodFasiliti: {
    type: String,
  },
  role: {
    type: String,
  },
  rolePromosiKlinik: {
    type: Boolean,
    default: false,
  },
  roleMediaSosialKlinik: {
    type: Boolean,
    default: false,
  },
  statusPegawai: {
    type: String,
  },
  cscspVerified: {
    type: Boolean,
    default: false,
  },
  tempKey: {
    type: String,
  },
  activationStatus: {
    type: Boolean,
    default: false,
  },
  summary: {
    type: Array,
    default: [],
  },
  tempatBertugasSebelumIni: {
    type: Array,
    default: [],
  },
});

const Operator = mongoose.model('Operator', operatorSchema);

module.exports = Operator;
