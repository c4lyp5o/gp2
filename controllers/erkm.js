const axios = require('axios');
const Sekolah = require('../models/Sekolah');

const getAndSaveErkm = async (req, res) => {
  const { data } = await axios.get('https://erkm.calypsocloud.one/data');

  const arr = { id: '', nama: '', namaSekolah: '', kelas: '' };

  data.sekolahRendah.map((sekolahRendah) => {
    arr.namaSekolah = sekolahRendah.nama;

    sekolahRendah.kelas.map((kelas) => {
      arr.kelas = kelas.nama;

      kelas.pelajar.map((pelajar) => {
        arr.id =
          sekolahRendah.id.toString() +
          kelas.id.toString() +
          pelajar.id.toString();
        arr.nama = pelajar.nama;
        console.log(arr);
      });
    });
  });

  res.status(200).json({ msg: 'good' });
};

module.exports = { getAndSaveErkm };
