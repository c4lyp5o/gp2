const axios = require('axios');
const Sekolah = require('../models/Sekolah');

// GET /sr
const getSrAndSaveErkm = async (req, res) => {
  const { data } = await axios.get('https://erkm.calypsocloud.one/sr');

  const arrSekolahRendah = {
    idConcat: '',
    nama: '',
    jantina: '',
    umur: '', // refer getAge()
    namaSekolah: '',
    kodSekolah: '',
    kelas: '',
    ic: '',
    tarikhLahir: '',
    kumpulanEtnik: '',
    darjah: '',
  };

  let allSekolahRendah = [];

  data.forEach((sekolahRendah) => {
    arrSekolahRendah.namaSekolah = sekolahRendah.nama;
    arrSekolahRendah.kodSekolah = sekolahRendah.kodSekolah;

    sekolahRendah.kelas.forEach((kelas) => {
      arrSekolahRendah.kelas = kelas.nama;
      arrSekolahRendah.darjah = kelas.nama.slice(0, 1);

      kelas.pelajar.forEach((pelajar) => {
        arrSekolahRendah.idConcat =
          sekolahRendah.id.toString() +
          kelas.id.toString() +
          pelajar.id.toString();
        arrSekolahRendah.nama = pelajar.nama;
        arrSekolahRendah.jantina = pelajar.jantina;

        const getAge = (birthDate) =>
          Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
        arrSekolahRendah.umur = getAge(pelajar.tarikhLahir);

        arrSekolahRendah.ic = pelajar.ic;
        arrSekolahRendah.tarikhLahir = pelajar.tarikhLahir;
        arrSekolahRendah.kumpulanEtnik = pelajar.kumpulanEtnik;

        allSekolahRendah.push({ ...arrSekolahRendah });
      });
    });
  });

  const idConcat = allSekolahRendah.map((person) => {
    return person.idConcat;
  });

  const kodSekolah = allSekolahRendah.map((person) => {
    return person.kodSekolah;
  });

  for (let i = 0; i < idConcat.length; i++) {
    const foundPersonSekolah = await Sekolah.findOne({
      idConcat: idConcat[i],
      kodSekolah: kodSekolah[i],
    });
    if (!foundPersonSekolah) {
      await Sekolah.create(allSekolahRendah[i]);
    }
  }

  res.status(200).json({ msg: 'good, checked SR' });
};

// GET sm
const getSmAndSaveErkm = async (req, res) => {
  const { data } = await axios.get('https://erkm.calypsocloud.one/sm');

  const arrSekolahMenengah = {
    idConcat: '',
    nama: '',
    jantina: '',
    umur: '', // refer getAge()
    namaSekolah: '',
    kodSekolah: '',
    kelas: '',
    ic: '',
    tarikhLahir: '',
    kumpulanEtnik: '',
    tingkatan: '',
  };

  let allSekolahMenengah = [];

  data.forEach((sekolahMenengah) => {
    arrSekolahMenengah.namaSekolah = sekolahMenengah.nama;
    arrSekolahMenengah.kodSekolah = sekolahMenengah.kodSekolah;

    sekolahMenengah.kelas.forEach((kelas) => {
      arrSekolahMenengah.kelas = kelas.nama;
      arrSekolahMenengah.tingkatan = kelas.nama.slice(0, 1);

      kelas.pelajar.forEach((pelajar) => {
        arrSekolahMenengah.idConcat =
          sekolahMenengah.id.toString() +
          kelas.id.toString() +
          pelajar.id.toString();
        arrSekolahMenengah.nama = pelajar.nama;
        arrSekolahMenengah.jantina = pelajar.jantina;

        const getAge = (birthDate) =>
          Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
        arrSekolahMenengah.umur = getAge(pelajar.tarikhLahir);

        arrSekolahMenengah.ic = pelajar.ic;
        arrSekolahMenengah.tarikhLahir = pelajar.tarikhLahir;
        arrSekolahMenengah.kumpulanEtnik = pelajar.kumpulanEtnik;

        allSekolahMenengah.push({ ...arrSekolahMenengah });
      });
    });
  });

  const idConcat = allSekolahMenengah.map((person) => {
    return person.idConcat;
  });

  const kodSekolah = allSekolahMenengah.map((person) => {
    return person.kodSekolah;
  });

  for (let i = 0; i < idConcat.length; i++) {
    const foundPersonSekolah = await Sekolah.findOne({
      idConcat: idConcat[i],
      kodSekolah: kodSekolah[i],
    });
    if (!foundPersonSekolah) {
      await Sekolah.create(allSekolahMenengah[i]);
    }
  }

  res.status(200).json({ msg: 'good, checked SM' });
};

module.exports = { getSrAndSaveErkm, getSmAndSaveErkm };
