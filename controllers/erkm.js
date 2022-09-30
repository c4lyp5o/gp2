const axios = require('axios');
const Sekolah = require('../models/Sekolah');

// GET /sr
const getSrAndSaveErkm = async (req, res) => {
  if (req.user.accountType !== 'erkmUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

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
  if (req.user.accountType !== 'erkmUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

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

// GET perlis
const getAllAndSaveErkmPerlis = async (req, res) => {
  if (req.user.accountType !== 'erkmUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { data } = await axios.get(
    'https://erkm.calypsocloud.one/alldatasorted'
  );

  const objSekolahPerlis = {
    idConcat: '',
    daerah: '',
    ppd: '',
    namaSekolah: '',
    kodSekolah: '',
    tahun: '',
    namaKelas: '',
    nama: '',
    kodJantina: '',
    umur: '',
    noKp: '',
    tarikhLahir: '',
    kaum: '',
  };

  let allSekolahPerlis = [];

  data.forEach((sekolahPerlis) => {
    objSekolahPerlis.daerah = sekolahPerlis.DAERAH;
    objSekolahPerlis.ppd = sekolahPerlis.PPD;

    sekolahPerlis.SEKOLAH.forEach((SEKOLAH) => {
      objSekolahPerlis.namaSekolah = SEKOLAH.namaSekolah;
      objSekolahPerlis.kodSekolah = SEKOLAH.kodSekolah;

      SEKOLAH.semuaTahun.forEach((semuaTahun) => {
        objSekolahPerlis.tahun = semuaTahun.tahun;

        semuaTahun.kelas.forEach((kelas) => {
          objSekolahPerlis.namaKelas = kelas.namaKelas;

          kelas.pelajar.forEach((pelajar) => {
            objSekolahPerlis.nama = pelajar.NAMA;
            objSekolahPerlis.kodJantina = pelajar.KODJANTINA;
            objSekolahPerlis.umur = pelajar.UMUR;
            objSekolahPerlis.noKp = pelajar.NOKP;
            objSekolahPerlis.tarikhLahir = pelajar.TKHLAHIR;
            objSekolahPerlis.kaum = pelajar.KAUM;

            allSekolahPerlis.push({ ...objSekolahPerlis });
          });
        });
      });
    });
  });

  const createdAllSekolahPerlis = await Sekolah.insertMany(allSekolahPerlis);

  res.status(200).json({ createdAllSekolahPerlis });
};

module.exports = {
  getSrAndSaveErkm,
  getSmAndSaveErkm,
  getAllAndSaveErkmPerlis,
};
