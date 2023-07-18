const moment = require('moment');

//BISMILLAH ALLAH BAGI ILHAM
const ultimateCutoff = (payload) => {
  const { tarikhMula, tarikhAkhir } = payload;

  const mula = moment(tarikhMula).format('MM-DD');
  const akhir = moment(tarikhAkhir).format('MM-DD');

  console.log(mula, akhir);

  if (mula === '01-01' && akhir === '06-30') {
    console.log('janjun');
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
    console.log('jandis');
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

  console.log('normal date');
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
  };

  if (negeri !== 'all') {
    params.createdByNegeri = { $eq: negeri };
  }

  if (daerah !== 'all') {
    params.createdByDaerah = { $eq: daerah };
  }

  if (klinik !== 'all') {
    params.createdByKodFasiliti = { $eq: klinik };
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
const getParams207 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
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
const getParams206207sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    jenisFasiliti: { $in: ['sekolah-rendah', 'sekolah-menengah'] },
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
  }

  return params;
};
const getParamsPgpr201 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const byKp = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      createdByDaerah: { $eq: daerah },
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const satuMalaysia = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
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
const getParamsPGS201 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: pilihanIndividu,
    createdByKodFasiliti: klinik,
    createdByNegeri: negeri,
    createdByDaerah: daerah,
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
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
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let params = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const byKp = () => {
    let params = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
    };
    return params;
  };

  if (pilihanIndividu) {
    return byPegawai(payload);
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
const getParamsPgPro = (payload) => {
  const { pilihanIndividu, klinik, daerah, negeri } = payload;

  const byIndividu = () => {
    let params = {
      tarikhMula: dateModifier(payload),
      promosiIndividu: true,
      createdByMdcMdtb: pilihanIndividu,
      deleted: false,
    };
    return params;
  };

  const byKp = () => {
    let params = {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByKodFasiliti: klinik,
      deleted: false,
    };
    return params;
  };

  const byDaerah = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      deleted: false,
    };
  };

  const byNegeri = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByNegeri: negeri,
      deleted: false,
    };
  };

  const satuMalaysia = () => {
    return {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      deleted: false,
    };
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }
  if (pilihanIndividu) {
    return byIndividu();
  }
  if (daerah !== 'all' && klinik !== 'all') {
    return byKp();
  }
  if (daerah !== 'all' && klinik === 'all') {
    return byDaerah();
  }
  if (daerah === 'all' && klinik === 'all') {
    return byNegeri();
  }
};
const getParamsGender = (payload) => {
  const { klinik, daerah, negeri } = payload;

  const byKp = () => {
    let params = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const satuMalaysia = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsPiagamMasa = (payload, jenis) => {
  const { klinik, daerah, negeri } = payload;
  //
  const byKp = () => {
    let params = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const satuMalaysia = () => {
    let params = {
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsBp = (payload, kaum, jantina) => {
  const { klinik, daerah, negeri } = payload;
  //
  let theSex = jantina === 'l' ? 'lelaki' : 'perempuan';
  let pilihanKaum;

  switch (kaum) {
    case 'melayu':
      pilihanKaum = { $eq: 'melayu' };
      break;
    case 'cina':
      pilihanKaum = { $eq: 'cina' };
      break;
    case 'india':
      pilihanKaum = { $eq: 'india' };
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
    case 'lain-lain':
      pilihanKaum = { $eq: 'lain-lain' };
      break;
    default:
      console.log(`bp nope ${kaum}`);
      break;
  }

  const byKp = () => {
    let params = {
      createdByKodFasiliti: klinik,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      createdByNegeri: negeri,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const satuMalaysia = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (klinik !== 'all') {
    return byKp();
  } else if (daerah !== 'all') {
    return byDaerah();
  } else {
    return byNegeri();
  }
};
const getParamsBPE = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let params = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byKp = () => {
    let params = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byDaerah = () => {
    let params = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const byNegeri = () => {
    let params = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  const satuMalaysia = () => {
    let params = {
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: { $in: ['telah diisi', 'reten salah'] },
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return params;
  };

  if (negeri === 'all') {
    return satuMalaysia();
  }

  if (pilihanIndividu) {
    return byPegawai(payload);
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
// kepp
const getParamsTOD = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    tahunDaftar: new Date().getFullYear(),
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
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
// begin
const getParamsKOM = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const params = {
    jenisFasiliti: 'projek-komuniti-lain',
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: { $in: ['telah diisi', 'reten salah'] },
    jenisProgram: { $ne: 'incremental' },
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

// operator lain punya hal
const getParamsOperatorLain = [
  {
    $unwind: {
      path: '$rawatanOperatorLain',
      includeArrayIndex: 'operatorLain',
    },
  },
  {
    $project: {
      _id: 0,
      rawatanOperatorLain: 1,
    },
  },
  {
    $replaceRoot: {
      newRoot: '$rawatanOperatorLain',
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
  getParamsOperatorLain,
  placeModifier,
  dateModifier,
};
