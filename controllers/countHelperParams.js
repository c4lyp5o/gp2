const moment = require('moment');
const sesiTakwimSekolah = require('../controllers/helpers/sesiTakwimSekolah');

//BISMILLAH ALLAH BAGI ILHAM
const ultimateCutoff = (payload) => {
  const { tarikhMula, tarikhAkhir } = payload;

  const mula = moment(tarikhMula).format('MM-DD');
  const akhir = moment(tarikhAkhir).format('MM-DD');

  if (mula === '01-01' && akhir === '06-30') {
    return {
      $expr: {
        $and: [
          {
            $not: {
              $gt: [
                '$updatedAt',
                {
                  $dateFromParts: {
                    year: {
                      $year: '$createdAt',
                    },
                    month: 7,
                    day: 6,
                    hour: 16,
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  if (mula === '01-01' && akhir === '12-31') {
    return {
      $expr: {
        $not: {
          $gt: [
            '$updatedAt',
            {
              $dateFromParts: {
                year: {
                  $year: '$createdAt',
                },
                month: 12,
                day: 31,
                hour: 23,
                minute: 59,
              },
            },
          ],
        },
      },
    };
  }

  return {
    $expr: {
      $and: [
        {
          $not: {
            $gt: [
              '$createdAt',
              {
                $dateFromParts: {
                  year: {
                    $year: {
                      $toDate: '$tarikhKedatangan',
                    },
                  },
                  month: {
                    $add: [
                      {
                        $month: {
                          $toDate: '$tarikhKedatangan',
                        },
                      },
                      1,
                    ],
                  },
                  day: 6,
                  hour: 16,
                },
              },
            ],
          },
        },
        {
          $not: {
            $gt: [
              '$updatedAt',
              {
                $dateFromParts: {
                  year: {
                    $year: '$createdAt',
                  },
                  month: {
                    $add: [
                      {
                        $month: '$createdAt',
                      },
                      1,
                    ],
                  },
                  day: 6,
                  hour: 16,
                },
              },
            ],
          },
        },
      ],
    },
  };
};

const ultimateCutoffPromosiEdition = (payload) => {
  const { tarikhMula, tarikhAkhir } = payload;

  const mula = moment(tarikhMula).format('MM-DD');
  const akhir = moment(tarikhAkhir).format('MM-DD');

  if (mula === '01-01' && akhir === '06-30') {
    return {
      $expr: {
        $and: [
          {
            $not: {
              $gt: [
                '$updatedAt',
                {
                  $dateFromParts: {
                    year: {
                      $year: '$updatedAt',
                    },
                    month: 7,
                    day: 6,
                    hour: 16,
                  },
                },
              ],
            },
          },
        ],
      },
    };
  }

  if (mula === '01-01' && akhir === '12-31') {
    return {
      $expr: {
        $not: {
          $gt: [
            '$updatedAt',
            {
              $dateFromParts: {
                year: {
                  $year: '$updatedAt',
                },
                month: 12,
                day: 31,
                hour: 23,
                minute: 59,
              },
            },
          ],
        },
      },
    };
  }

  return {
    $expr: {
      $and: [
        {
          $not: {
            $gt: [
              '$updatedAt',
              {
                $dateFromParts: {
                  year: {
                    $year: {
                      $toDate: '$tarikhAkhir',
                    },
                  },
                  month: {
                    $add: [
                      {
                        $month: {
                          $toDate: '$tarikhAkhir',
                        },
                      },
                      1,
                    ],
                  },
                  day: 6,
                  hour: 16,
                },
              },
            ],
          },
        },
      ],
    },
  };
};

// PARAMS LIVES HERE
// countHelperRegular params
const getParams101 = (payload, reten) => {
  const {
    negeri,
    daerah,
    klinik,
    pilihanFasiliti,
    pilihanKkia,
    pilihanProgram,
    pilihanKpbMpb,
  } = payload;

  const AorC = (reten) => {
    if (reten === 'A' || reten === undefined) {
      return { $eq: 'kp' };
    }
    if (reten === 'C') {
      return { $nin: ['kp', 'kk-kd', 'taska-tadika'] };
    }
  };

  const byKp = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      oncall: { $in: [false, null] },
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      kodFasilitiKkKd: { $eq: pilihanKkia },
      createdByKodFasiliti: { $eq: klinik },
      jenisFasiliti: { $eq: 'kk-kd' },
      oncall: { $in: [false, null] },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
      oncall: { $in: [false, null] },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByKodFasiliti: { $eq: klinik },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
      oncall: { $in: [false, null] },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const byDaerah = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      oncall: { $in: [false, null] },
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
      oncall: { $in: [false, null] },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
      oncall: { $in: [false, null] },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByDaerah: { $eq: daerah },
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
      oncall: { $in: [false, null] },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const byNegeri = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      // deleted: false,
      oncall: { $in: [false, null] },
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
      // deleted: false,
      oncall: { $in: [false, null] },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
      oncall: { $in: [false, null] },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
      oncall: { $in: [false, null] },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  const satuMalaysia = () => {
    const forKp = {
      tarikhKedatangan: dateModifier(payload),
      jenisProgram: { $ne: 'incremental' }, // ONLY FOR yg idc skrg ni
      jenisFasiliti: AorC(reten),
      oncall: { $in: [false, null] },
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kk-kd' },
      oncall: { $in: [false, null] },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
      oncall: { $in: [false, null] },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
      oncall: { $in: [false, null] },
    };
    if (pilihanFasiliti === 'kkiakd' && pilihanKkia !== '') {
      return forKkia;
    }
    if (pilihanFasiliti === 'program' && pilihanProgram !== '') {
      return forProgram;
    }
    if (pilihanFasiliti === 'kpbmpb' && pilihanKpbMpb !== '') {
      return forKpbmpb;
    }
    return forKp;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return byKp(payload);
  }
  if (daerah !== 'all' && klinik === 'all') {
    return byDaerah(payload);
  }
  if (daerah === 'all') {
    return byNegeri(payload);
  }
};
const getParams211 = (payload, reten) => {
  const { negeri, daerah, klinik, pilihanFasiliti, pilihanKpbMpb } = payload;

  const AorC = (reten) => {
    const jenisFasiliti =
      reten === 'C'
        ? { $nin: ['kp', 'kk-kd', 'taska-tadika'] }
        : { $in: ['kp', 'kk-kd'] };
    return { jenisFasiliti };
  };

  const byKpb = () => ({
    tarikhKedatangan: dateModifier(payload),
    penggunaanKPBMPB: pilihanKpbMpb,
    menggunakanKPBMPB: { $nin: ['', null] },
    deleted: false,
    oncall: { $in: [false, null] },
  });

  const byKp = () => ({
    tarikhKedatangan: dateModifier(payload),
    createdByKodFasiliti: { $eq: klinik },
    ...AorC(reten),
    jenisProgram: { $ne: 'incremental' },
    deleted: false,
    oncall: { $in: [false, null] },
  });

  const byDaerah = () => ({
    tarikhKedatangan: dateModifier(payload),
    createdByNegeri: { $eq: negeri },
    createdByDaerah: { $eq: daerah },
    ...AorC(reten),
    jenisProgram: { $ne: 'incremental' },
    deleted: false,
    oncall: { $in: [false, null] },
  });

  const byNegeri = () => ({
    tarikhKedatangan: dateModifier(payload),
    createdByNegeri: { $eq: negeri },
    ...AorC(reten),
    jenisProgram: { $ne: 'incremental' },
    deleted: false,
    oncall: { $in: [false, null] },
  });

  const satuMalaysia = () => ({
    tarikhKedatangan: dateModifier(payload),
    ...AorC(reten),
    jenisProgram: { $ne: 'incremental' },
    deleted: false,
    oncall: { $in: [false, null] },
  });

  switch (true) {
    case negeri === 'all':
      return satuMalaysia(payload);
    case pilihanFasiliti === 'kpbmpb':
      return byKpb(payload);
    case daerah !== 'all' && klinik !== 'all':
      return byKp(payload);
    case daerah !== 'all' && klinik === 'all':
      return byDaerah(payload);
    case daerah === 'all':
      return byNegeri(payload);
    default:
      return null;
  }
};
const getParams214 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    umur: { $gte: 59 },
    deleted: false,
    statusKehadiran: false,
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau include dah slps jun.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParams206 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: { $regex: /^mdtb/i },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    tahunDaftar: new Date().getFullYear(),
  };

  // ! spesial. kena buang tahun depan. program ni xmau include dah slps jun.
  if (
    payload.tarikhMula === '2023-01-01' &&
    payload.tarikhAkhir === '2023-06-30'
  ) {
    params.namaProgram = { $exists: true };
  } else {
    params.namaProgram = { $ne: 'Program Sekolah Menengah SMK Benut' };
  }

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    delete params.oncall;
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParams207 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    tahunDaftar: new Date().getFullYear(),
  };

  // ! spesial. kena buang tahun depan. program ni xmau include dah slps jun.
  if (
    payload.tarikhMula === '2023-01-01' &&
    payload.tarikhAkhir === '2023-06-30'
  ) {
    params.namaProgram = { $exists: true };
  } else {
    params.namaProgram = { $ne: 'Program Sekolah Menengah SMK Benut' };
  }

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    delete params.oncall;
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParams206207sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const sesiTakwim = sesiTakwimSekolah();

  const params = {
    jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
    sesiTakwimSekolah: sesiTakwim,
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.kodFasilitiHandler = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.kodFasilitiHandler;
  }

  return params;
};
const getParamsPgpr201 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsPGS201 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu, pilihanTadika } = payload;

  const params = {
    createdByMdcMdtb: pilihanIndividu,
    createdByKodFasiliti: klinik,
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    kodFasilitiTaskaTadika: !pilihanTadika ? { $regex: /tad/i } : pilihanTadika,
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    tahunDaftar: new Date().getFullYear(),
  };

  if (!pilihanIndividu) {
    delete params.createdByMdcMdtb;
  }

  if (negeri === 'all' || negeri === '-') {
    delete params.createdByNegeri;
  }

  if (daerah === 'all' || daerah === '-') {
    delete params.createdByDaerah;
  }

  if (klinik === 'all') {
    delete params.createdByKodFasiliti;
  }

  return params;
};
const getParamsPGS203 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const params = {
    jenisFasiliti: { $eq: 'taska-tadika' },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    tahunDaftar: new Date().getFullYear(),
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsPgPro = (payload) => {
  const { pilihanIndividu, klinik, daerah, negeri } = payload;

  const params = {
    tarikhMula: dateModifier(payload),
    promosiKlinik: true,
    deleted: false,
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    delete params.promosiKlinik;
    params.promosiIndividu = true;
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParamsGender = (payload) => {
  const { klinik, daerah, negeri } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsPiagamMasa = (payload) => {
  const { klinik, daerah, negeri } = payload;

  const params = {
    jenisFasiliti: { $eq: 'kp' },
    waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
    waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsBp = (payload, kaum, jantina) => {
  const { klinik, daerah, negeri } = payload;
  const theSex = jantina === 'l' ? 'lelaki' : 'perempuan';

  let pilihanKaum;
  switch (kaum) {
    case 'melayu':
    case 'cina':
    case 'india':
    case 'lain-lain':
      pilihanKaum = { $eq: kaum };
      break;
    case 'bumiputeraSabah':
      pilihanKaum = {
        $in: ['bajau', 'dusun', 'kadazan', 'murut', 'bumiputera sabah lain'],
      };
      break;
    case 'bumiputeraSarawak':
      pilihanKaum = {
        $in: [
          'melanau',
          'kedayan',
          'iban',
          'bidayuh',
          'penan',
          'bumiputera sarawak lain',
        ],
      };
      break;
    case 'oas':
      pilihanKaum = { $eq: 'orang asli semenanjung' };
      break;
    default:
      break;
  }

  const params = {
    kumpulanEtnik: pilihanKaum,
    jantina: theSex,
    jenisFasiliti: { $eq: 'kp' },
    deleted: false,
    kedatangan: { $eq: 'baru-kedatangan' },
    statusKehadiran: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    tarikhKedatangan: dateModifier(payload),
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsBPE = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
    skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    delete params.oncall;
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParamsTOD = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};

// countHelperKomuniti params
const getParamsKOM = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const params = {
    jenisFasiliti: 'projek-komuniti-lain',
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    jenisProgram: { $ne: 'incremental' },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanProgram !== 'all' && pilihanProgram) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    params.namaProgram = pilihanProgram;
  }

  return params;
};
const getParamsOAP = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    jenisProgram: { $ne: 'incremental' },
    oncall: { $in: [false, null] },
    // ! spesial. kena buang tahun depan. program ni xmau.
    namaProgram: { $ne: 'Program Sekolah Menengah SMK Benut' },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanProgram !== 'all' && pilihanProgram) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    params.namaProgram = pilihanProgram;
  }

  return params;
};
const getParamsUTCRTC = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    jenisProgram: { $ne: 'incremental' },
    oncall: { $in: [false, null] },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik === 'rtc-tunjung') {
    params.createdByKodFasiliti = 'D04-014-02';
    params.jenisProgram = 'rtc';
  } else if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  return params;
};
const getParamsPKAP = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    jenisProgram: { $ne: 'incremental' },
    oncall: { $in: [false, null] },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanProgram !== 'all' && pilihanProgram) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
    params.namaProgram = pilihanProgram;
  }

  return params;
};

// operator lain punya hal kegunaan 206 207
const getParamsOplainP1 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    deleted: false,
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    oncall: { $in: [false, null] },
  };

  if (negeri !== 'all') {
    params.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    params.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    delete params.createdByNegeri;
    delete params.createdByDaerah;
    delete params.createdByKodFasiliti;
  }

  return params;
};
const getParamsOplainP2 = [
  {
    $match: {
      rawatanDibuatOperatorLain: true,
    },
  },
  {
    $unwind: {
      path: '$rawatanOperatorLain',
      includeArrayIndex: 'operatorLain',
    },
  },
  {
    $project: {
      _id: 0,
      tarikhKedatangan: 1,
      umur: 1,
      ibuMengandung: 1,
      orangKurangUpaya: 1,
      kumpulanEtnik: 1,
      jenisProgram: 1,
      menggunakanKPBMPB: 1,
      rawatanOperatorLain: 1,
      kategoriInstitusi: 1,
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: ['$$ROOT', '$rawatanOperatorLain'],
      },
    },
  },
  {
    $project: {
      rawatanOperatorLain: 0,
    },
  },
];

// place
const placeModifier = (payload) => {
  const { klinik, daerah, negeri, pilihanIndividu } = payload;

  if (negeri === 'all') {
    return null;
  }

  if (pilihanIndividu) {
    return '$createdByUsername';
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return '$createdByKodFasiliti';
  }
  if (daerah !== 'all' && klinik === 'all') {
    return '$createdByDaerah';
  }
  if (daerah === 'all') {
    return '$createdByNegeri';
  }
};

// date
const dateModifier = (payload) => {
  const { tarikhMula, tarikhAkhir, bulan } = payload;

  if (tarikhMula && tarikhAkhir) {
    return {
      $gte: moment(tarikhMula).format('YYYY-MM-DD'),
      $lte: moment(tarikhAkhir).format('YYYY-MM-DD'),
    };
  }
  if (bulan) {
    return {
      $gte: moment(bulan).startOf('month').format('YYYY-MM-DD'),
      $lte: moment(bulan).endOf('month').format('YYYY-MM-DD'),
    };
  }
};

module.exports = {
  // bismillah
  ultimateCutoff,
  ultimateCutoffPromosiEdition,
  // countHelper regular
  getParams101,
  getParams211,
  getParams214,
  getParams206,
  getParams207,
  getParams206207sekolah,
  getParamsPgpr201,
  getParamsPGS201,
  getParamsPGS203,
  getParamsPgPro,
  getParamsGender,
  getParamsPiagamMasa,
  getParamsBp,
  getParamsBPE,
  getParamsTOD,
  // countHelper KOM
  // begin
  getParamsKOM,
  getParamsOAP,
  getParamsUTCRTC,
  getParamsPKAP,
  // misc
  getParamsOplainP1,
  getParamsOplainP2,
  placeModifier,
  dateModifier,
};
