const Umum = require('../models/Umum');
const Fasiliti = require('../models/Fasiliti');
const Event = require('../models/Event');

// GET /
const getAllKPBMPBForNegeri = async (req, res) => {
  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const singlePersonUmum = await Umum.findOne({
    _id: req.query.personUmumId,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
  });

  console.log(singlePersonUmum.jenisFasiliti);

  let penggunaanKPBMPBForPt = [];

  // KPB MPB usage for this pt's KP, KKIA/KD, Tastad -----------------------------------------
  if (
    singlePersonUmum.jenisFasiliti === 'kp' ||
    singlePersonUmum.jenisFasiliti === 'kk-kd' ||
    singlePersonUmum.jenisFasiliti === 'taska-tadika'
  ) {
    const allKPBMPBNegeri = await Fasiliti.find({
      createdByNegeri: req.user.negeri,
      jenisFasiliti: { $in: ['kp-bergerak', 'makmal-pergigian'] },
    });

    // set new properties dalam object penggunaanKPBMPB
    allKPBMPBNegeri.forEach((singleKPBMPB) => {
      singleKPBMPB.penggunaanKPBMPB.forEach((penggunaan) => {
        penggunaan.nama = singleKPBMPB.nama;
        penggunaan.jenisFasiliti = singleKPBMPB.jenisFasiliti;
      });
    });

    let penggunaanKPBMPB = [];

    // push penggunaanKPBMPB sahaja dalam new array
    allKPBMPBNegeri.forEach((km) => {
      if (km.penggunaanKPBMPB.length > 0) {
        penggunaanKPBMPB.push(...km.penggunaanKPBMPB);
      }
    });

    // filter penggunaanKPBMPB mengikut jenisFasiliti pt & kodFasiliti pt
    penggunaanKPBMPBForPt = penggunaanKPBMPB.filter((pkm) => {
      if (singlePersonUmum.jenisFasiliti === 'kp') {
        return (
          pkm.tempatPenggunaan === 'kp' &&
          pkm.kodKlinikBertanggungjawab ===
            singlePersonUmum.createdByKodFasiliti
        );
      }
      if (singlePersonUmum.jenisFasiliti === 'kk-kd') {
        return (
          pkm.tempatPenggunaan === 'kkiakd' &&
          pkm.kodKkiaKdBertanggungjawab === singlePersonUmum.kodFasilitiKkKd
        );
      }
      if (singlePersonUmum.jenisFasiliti === 'taska-tadika') {
        return (
          pkm.tempatPenggunaan === 'tastad' &&
          pkm.kodTastadBertanggungjawab ===
            singlePersonUmum.kodFasilitiTaskaTadika
        );
      }
    });

    console.log(penggunaanKPBMPBForPt);
  }
  // -----------------------------------------------------------------------------

  // KPB MPB usage for this KP's program komuniti --------------------------------
  if (singlePersonUmum.jenisFasiliti === 'projek-komuniti-lain') {
    const allThisKPProjekKomuniti = await Event.find({
      createdByNegeri: req.user.negeri,
      createdByDaerah: req.user.daerah,
      createdByKp: req.user.kp,
      createdByKodFasiliti: req.user.kodFasiliti,
      tarikhStart: { $nin: [null, ''] },
      tarikhEnd: { $nin: [null, ''] },
      tahunDibuat: new Date().getFullYear(),
    });

    let projekKomunitiWithKPBMPB = [];

    // push program komuniti yang guna kpb atau mpb sahaja dalam new array
    allThisKPProjekKomuniti.forEach((singleProgram) => {
      if (
        singleProgram.modPenyampaianPerkhidmatan.includes('kpb') ||
        singleProgram.modPenyampaianPerkhidmatan.includes('mpb')
      ) {
        projekKomunitiWithKPBMPB.push(singleProgram);
      }
    });

    // filter penggunaanKPBMPB mengikut jenisProgram pt & namaProgram pt
    penggunaanKPBMPBForPt = projekKomunitiWithKPBMPB.filter((pkm) => {
      if (singlePersonUmum.jenisFasiliti === 'projek-komuniti-lain') {
        return (
          pkm.jenisEvent === singlePersonUmum.jenisProgram &&
          pkm.nama === singlePersonUmum.namaProgram
        );
      }
    });

    console.log(penggunaanKPBMPBForPt);
  }
  // -----------------------------------------------------------------------------

  res.status(200).json({ penggunaanKPBMPBForPt });
};

module.exports = { getAllKPBMPBForNegeri };
