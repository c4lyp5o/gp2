const Umum = require('../models/Umum');
const Operator = require('../models/Operator');
const { logger } = require('../logs/logger');

// not used
// GET
const getSinglePersonOperator = async (req, res) => {
  logger.info(`[summaryController] getSinglePersonOperator called`);

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { id } = req.query;

  const singlePersonOperator = await Operator.findById(id).select('nama');

  if (!singlePersonOperator) {
    return res.status(404).json({ msg: `No person with id ${id}` });
  }

  res.status(201).json(singlePersonOperator);
};

// GET /
const getSinglePersonOperatorSummary = async (req, res) => {
  logger.info(`[summaryController] getSinglePersonOperatorSummarycalled`);

  if (req.user.accountType !== 'kpUser') {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const { id, bulan, tahun } = req.query;

  const singlePersonOperator = await Operator.findById(id).select(
    'nama mdcNumber mdtbNumber createdByNegeri'
  );

  if (!singlePersonOperator) {
    return res.status(404).json({ msg: `No person with id ${id}` });
  }

  logger.info(
    `[summaryController] getting summary for ${singlePersonOperator.nama}`
  );

  const tarikhMula = `${tahun}-${bulan}-01`;
  const tarikhTamat = `${tahun}-${bulan}-31`;

  const filteredSummary = await Umum.aggregate([
    {
      $match: {
        createdByMdcMdtb:
          singlePersonOperator.mdcNumber ?? singlePersonOperator.mdtbNumber,
        tarikhKedatangan: {
          $gte: tarikhMula,
          $lte: tarikhTamat,
        },
      },
    },
    {
      $project: {
        _id: 0,
        nama: 1,
        ic: 1,
        tarikhKedatangan: 1,
        tarikhLahir: 1,
        kedatangan: 1,
        kumpulanEtnik: 1,
        bersekolah: 1,
        ibuMengandung: 1,
        orangKurangUpaya: 1,
        statusPesara: 1,
        rawatanDibuatOperatorLain: 1,
        deleted: 1,
      },
    },
  ]);

  // kena bincang lg sbb kena cari dalam 1 negeri pt nya
  const filteredSummaryOperatorLain = await Umum.aggregate([
    {
      $match: {
        tarikhKedatangan: {
          $gte: tarikhMula,
          $lte: tarikhTamat,
        },
        createdByNegeri: singlePersonOperator.createdByNegeri,
        rawatanDibuatOperatorLain: true,
        rawatanOperatorLain: {
          $elemMatch: {
            createdByMdcMdtb:
              singlePersonOperator.mdcNumber ?? singlePersonOperator.mdtbNumber,
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        nama: 1,
        ic: 1,
        tarikhKedatangan: 1,
        tarikhLahir: 1,
        kedatangan: 1,
        kumpulanEtnik: 1,
        bersekolah: 1,
        ibuMengandung: 1,
        orangKurangUpaya: 1,
        statusPesara: 1,
        rawatanDibuatOperatorLain: 1,
        deleted: 1,
      },
    },
  ]);

  const customSummary = await Umum.aggregate([
    {
      $match: {
        createdByMdcMdtb:
          singlePersonOperator.mdcNumber ?? singlePersonOperator.mdtbNumber,
        tarikhKedatangan: {
          $gte: tarikhMula,
          $lte: tarikhTamat,
        },
      },
    },
    {
      $group: {
        _id: null,
        jumlahTampalanGigiDesidus: {
          $sum: {
            $add: [
              '$gdBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gdBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
              '$gdSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            ],
          },
        },
        jumlahTampalanGigiKekal: {
          $sum: {
            $add: [
              '$gkBaruAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gkSemulaAnteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gkBaruPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gkSemulaPosteriorSewarnaJumlahTampalanDibuatRawatanUmum',
              '$gkBaruPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
              '$gkSemulaPosteriorAmalgamJumlahTampalanDibuatRawatanUmum',
            ],
          },
        },
        jumlahKesSelesai: {
          $sum: {
            $cond: [
              {
                $and: [{ $eq: ['$kesSelesaiRawatanUmum', true] }],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  if (filteredSummary.length === 0) {
    return res.status(404).json({ msg: `No summary for ${id}` });
  }

  filteredSummary.push(...filteredSummaryOperatorLain);

  filteredSummary.sort((a, b) => {
    return new Date(a.tarikhKedatangan) - new Date(b.tarikhKedatangan);
  });

  res.status(200).json({ filteredSummary, customSummary });
};

module.exports = { getSinglePersonOperator, getSinglePersonOperatorSummary };
