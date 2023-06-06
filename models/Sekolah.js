const mongoose = require('mongoose');

const SekolahSchema = new mongoose.Schema(
  {
    // save status rawatan when user fill rawatanSekolah -----------------
    statusRawatan: {
      type: String,
      required: true,
      enum: {
        values: [
          'belum mula',
          'enggan',
          'tidak hadir',
          'belum selesai',
          'enggan rawatan',
          'tidak hadir rawatan',
          'selesai',
        ],
        message:
          '{VALUE} is not supported. Provide only "belum mula", "enggan", "tidak hadir", "belum selesai", "enggan rawatan", "tidak hadir rawatan", "selesai"',
      },
      default: 'belum mula',
    },
    // soft delete ----------------------------------------------
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteReason: {
      type: String,
      default: '',
    },
    deletedForOfficer: {
      type: String,
      default: '',
    },
    // supplied by MOEIS --------------------------------------------------
    idInstitusi: {
      type: String,
      default: 'MISSING ID_INSTITUSI',
    },
    kodSekolah: {
      type: String,
      default: 'MISSING KOD_INSTITUSI',
    },
    namaSekolah: {
      type: String,
      default: 'MISSING NAMA_INSTITUSI',
    },
    idIndividu: {
      type: String,
      default: 'MISSING ID_INDIVIDU',
    },
    // previously noKp
    nomborId: {
      type: String,
      default: 'MISSING NOMBOR_ID', // pengenalan diri
    },
    nama: {
      type: String,
      default: 'MISSING NAMA',
    },
    sesiTakwimPelajar: {
      type: String,
      default: 'MISSING SESI_TAKWIM',
    },
    // previously tahun
    tahunTingkatan: {
      type: String,
      default: 'MISSING TAHUN_TINGKATAN',
    },
    // previously namaKelas
    kelasPelajar: {
      type: String,
      default: 'MISSING NAMA KELAS',
    },
    //previously kodJantina
    jantina: {
      type: String,
      default: 'MISSING JANTINA',
    },
    statusOku: {
      type: String,
      default: 'MISSING STATUS_OKU',
    },
    tarikhLahir: {
      type: String,
      default: 'MISSING tarikh_lahir',
    },
    umur: {
      type: Number,
      default: 7777777, // lucky seven lol
    },
    // previously kaum
    keturunan: {
      type: String,
      default: 'MISSING keturunan',
    },
    warganegara: {
      type: String,
      default: 'MISSING warganegara',
    },
    // pindah marker -----------------------------------------------------
    berpindah: {
      type: Boolean,
      default: false,
    },
    // our own field -----------------------------------------------------
    tarikhMelaksanakanBegin: {
      type: String,
      default: '',
    },
    namaPelaksanaBegin: {
      type: String,
      default: '',
    },
    kesSelesaiMmi: {
      type: Boolean,
      default: false,
    },
    tarikhKumuranKohortFMR: {
      type: Array,
      default: [],
    },
    telahDaftarKohortFMR: {
      type: Boolean,
      default: false,
    },
    // kpmbpb ------------------------------------------------------------
    kedatanganKPBMPB: {
      type: String,
      default: '',
    },
    noPendaftaranBaruKPBMPB: {
      type: String,
      default: '',
    },
    noPendaftaranUlanganKPBMPB: {
      type: String,
      default: '',
    },
    // pemeriksaan -------------------------------------------------------
    pemeriksaanSekolah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pemeriksaansekolah',
    },
    // rawatan -----------------------------------------------------------
    rawatanSekolah: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rawatansekolah',
      },
    ],
    // kotak -------------------------------------------------------------
    kotakSekolah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kotaksekolah',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sekolah', SekolahSchema);

// several field that got deleted
// daerah
// ppd
