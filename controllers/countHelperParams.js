const moment = require('moment');
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
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByDaerah: { $eq: daerah },
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByDaerah: { $eq: daerah },
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
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
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'kk-kd' },
      // deleted: false,
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      // createdByNegeri: { $eq: negeri },
      // jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
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
    };
    const forKkia = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'kk-kd' },
    };
    const forProgram = {
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'projek-komuniti-lain' },
      namaProgram: { $eq: pilihanProgram },
    };
    const forKpbmpb = {
      tarikhKedatangan: dateModifier(payload),
      penggunaanKPBMPB: { $eq: pilihanKpbMpb },
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

  const byKp = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      // jenisFasiliti: 'kp',
      kedatangan: 'baru-kedatangan',
      deleted: false,
      statusKehadiran: false,
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      createdByDaerah: { $eq: daerah },
      // jenisFasiliti: 'kp',
      kedatangan: 'baru-kedatangan',
      deleted: false,
      statusKehadiran: false,
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      // jenisFasiliti: 'kp',
      kedatangan: 'baru-kedatangan',
      deleted: false,
      statusKehadiran: false,
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      // jenisFasiliti: 'kp',
      kedatangan: 'baru-kedatangan',
      deleted: false,
      statusKehadiran: false,
      oncall: { $in: [false, null] },
    };
    return param;
  };

  switch (true) {
    case negeri === 'all':
      return satuMalaysia(payload);
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
const getParams206 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: { $regex: /^mdtb/i },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
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
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParams206sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^mdtb/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
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
const getParams207 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const params = {
    createdByMdcMdtb: { $regex: /^(?!mdtb).*$/i },
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
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
    params.createdByMdcMdtb = pilihanIndividu;
  }

  return params;
};
const getParams207sekolah = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };
  const satuMalaysia = () => {
    let param = {
      createdByMdcMdtb: { $regex: /^(?!mdtb).*$/, $options: 'i' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  if (negeri === 'all') {
    return satuMalaysia(payload);
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
const getParamsPgpr201 = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const byKp = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByKodFasiliti: { $eq: klinik },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      createdByDaerah: { $eq: daerah },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      createdByNegeri: { $eq: negeri },
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
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

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      // createdByMdcMdtb: { $regex: /mdtb/i },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
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
const getParamsPGS203 = (payload) => {
  const { negeri, daerah, klinik, pilihanIndividu } = payload;

  const byPegawai = () => {
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      jenisFasiliti: { $eq: 'taska-tadika' },
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      jenisFasiliti: { $eq: 'taska-tadika' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
    };
    return param;
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
    let param = {
      tarikhMula: dateModifier(payload),
      promosiIndividu: true,
      createdByMdcMdtb: pilihanIndividu,
      deleted: false,
    };
    return param;
  };

  const byKp = () => {
    let param = {
      tarikhMula: dateModifier(payload),
      promosiKlinik: true,
      createdByKodFasiliti: klinik,
      deleted: false,
    };
    return param;
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
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
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
    let param = {
      createdByKodFasiliti: klinik,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByDaerah: daerah,
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      jenisFasiliti: { $eq: 'kp' },
      waktuSampai: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      waktuDipanggil: { $regex: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
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
    let param = {
      createdByKodFasiliti: klinik,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      tarikhKedatangan: dateModifier(payload),
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
  };
  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      kumpulanEtnik: pilihanKaum,
      jantina: theSex,
      jenisFasiliti: { $eq: 'kp' },
      deleted: false,
      kedatangan: { $eq: 'baru-kedatangan' },
      statusKehadiran: false,
      statusReten: 'telah diisi',
      oncall: { $in: [false, null] },
    };
    return param;
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
    let param = {
      createdByMdcMdtb: pilihanIndividu,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byKp = () => {
    let param = {
      createdByKodFasiliti: klinik,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byDaerah = () => {
    let param = {
      createdByNegeri: negeri,
      createdByDaerah: daerah,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const byNegeri = () => {
    let param = {
      createdByNegeri: negeri,
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return param;
  };

  const satuMalaysia = () => {
    let param = {
      tarikhKedatangan: dateModifier(payload),
      //   jenisFasiliti: { $eq: 'kp' },
      statusKehadiran: false,
      deleted: false,
      statusReten: 'telah diisi',
      yaTidakPesakitMempunyaiGigi: 'ya-pesakit-mempunyai-gigi',
      skorBpeOralHygienePemeriksaanUmum: { $nin: ['tiada', '', null] },
      oncall: { $in: [false, null] },
    };
    return param;
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

  const param = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
  };

  if (negeri !== 'all') {
    param.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    param.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    param.createdByKodFasiliti = klinik;
  }

  if (pilihanIndividu) {
    param.createdByMdcMdtb = pilihanIndividu;
  }

  return param;
};
// countHelperKomuniti params
// ppim03
const getParamsPPIM04 = (payload, reten) => {
  const { negeri, daerah, klinik, sekolah, pilihanIndividu } = payload;

  const bySekolah = () => {
    const forSekolah = {
      createdByKodFasiliti: { $eq: klinik },
    };
  };

  const byPegawai = () => {
    const forPegawai = {
      createdByKodFasiliti: { $eq: klinik },
      createdByNameMdcMdtb: { $eq: pilihanIndividu },
    };
  };

  if (pilihanIndividu === 'all') {
    return bySekolah(payload);
  } else {
    return byPegawai(payload);
  }
};
// ppim05
// begin
// kpbmpb hari
// kpbmbp bulan
const getParamsKOM = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const param = {
    jenisFasiliti: 'projek-komuniti-lain',
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
    jenisProgram: { $ne: 'incremental' },
  };

  if (negeri !== 'all') {
    param.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    param.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    param.createdByKodFasiliti = klinik;
  }

  if (pilihanProgram !== 'all' && pilihanProgram) {
    param.namaProgram = pilihanProgram;
  }

  return param;
};
const getParamsOAP = (payload) => {
  const { negeri, daerah, klinik, pilihanProgram } = payload;

  const param = {
    tarikhKedatangan: dateModifier(payload),
    kumpulanEtnik: { $in: ['orang asli semenanjung', 'penan'] },
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
    jenisProgram: { $ne: 'incremental' },
  };

  if (negeri !== 'all') {
    param.createdByNegeri = negeri;
  }

  if (daerah !== 'all') {
    param.createdByDaerah = daerah;
  }

  if (klinik !== 'all') {
    param.createdByKodFasiliti = klinik;
  }

  if (pilihanProgram !== 'all' && pilihanProgram) {
    param.namaProgram = pilihanProgram;
  }

  return param;
};
const getParamsUTCRTC = (payload) => {
  const { negeri, daerah, klinik } = payload;

  const params = {
    tarikhKedatangan: dateModifier(payload),
    statusKehadiran: false,
    deleted: false,
    statusReten: 'telah diisi',
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
    statusReten: 'telah diisi',
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

  if (pilihanProgram) {
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
  // countHelper regular
  getParams101,
  getParams211,
  getParams214,
  getParams206,
  getParams206sekolah,
  getParams207,
  getParams207sekolah,
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
  // ppim03,
  getParamsPPIM04,
  // ppim05,
  // begin
  // kpbmpb hari
  // kpbmpb bulan
  getParamsKOM,
  getParamsOAP,
  getParamsUTCRTC,
  getParamsPKAP,
  // misc
  getParamsOperatorLain,
  placeModifier,
  dateModifier,
};
