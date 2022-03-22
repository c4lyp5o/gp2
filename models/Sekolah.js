const mongoose = require('mongoose');

const sekolahSchema = mongoose.Schema({
    namaPendaftaranSekolah: {
        type: String,
        required: true,
        trim: true
    },
    umurPendaftaranSekolah: {
        type: Number,
        required: true
    },
    kelasPendaftaranSekolah: {
        type: String,
        required: true,
        trim: true
    },					
	ennrolmen: {
        type: String,
        required: true,
        trim: true
    },					
	// Kedatangan Baru: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kedatangan Ulangan: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kedatangan Enggan: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kedatangan Tidak Hadir: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Cleft Ada: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Cleft Rujuk: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Trauma Tooth Surface Loss (TSL): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Trauma Tisu Lembut: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Trauma Tisu Keras: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Trauma Kecederaan Gigi Anterior: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Dentur Ada B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Dentur Ada S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Dentur Perlu B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Dentur Perlu S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kebersihan Mulut A: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kebersihan Mulut C: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kebersihan Mulut E: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// GIS Skor 0: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// GIS Skor 1: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// GIS Skor 2: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// GIS Skor 3: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus d: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus m: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus f: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus x: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus Jumlah dfx: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Desidus dfx = 0: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal E: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal D: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal M: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal F: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal X: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal Jumlah DMFX: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// D+F Bil Gigi 'Caries Experience": {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// D+F Class I dan II: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// D+F Class I Sahaja: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal DMFX <= 3: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal X+M = 0: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal Bebas Karies (BK) DMFX = 0: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Status Gigi Kekal Bebas Karies (BK) tetapi E ≥ 1: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Mulut Bebas Karies (MBK): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// E ≥ 1 (ada karies awal): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Mulut Bebas Gingivitis (MBG): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Tidak Perlu Rawatan (SMKP): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Tidak Perlu Rawatan (ICDAS): {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// CRA Jumlah Faktor Risiko Karies: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// CRA Rendah: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// CRA Sederhana: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// CRA Tinggi: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Dibuat Pada Tahun Lepas: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Intact Bagi Tahun Semasa Resin: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Intact Bagi Tahun Semasa GIC: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FS Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FS Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FS Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FS Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FS Bil. Gigi `failed': {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FV Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FV Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FV Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu FV Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu PRR1 Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu PRR1 Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu PRR1 Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu PRR1 Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu MURID:  Perlu dibuat Fisur Sealan/PRR Type 1 sahaja atau kedua-duanya: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Anterior Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Anterior Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Anterior Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Anterior Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Posterior Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Posterior Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Posterior Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Posterior Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Amalgam Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Amalgam Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Amalgam Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Perlu Tampalan Amalgam Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FS Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FS Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FS Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FS Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FV Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FV Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FV Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah FV Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah PRR1 Murid B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah PRR1 Murid S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah PRR1 Gigi B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah PRR1 Gigi S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah MURID:  Telah dibuat Fisur Sealan/PRR Type 1 sahaja atau kedua-duanya: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }, 					
	// Telah Tampalan Anterior Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Anterior Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Anterior Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Anterior Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Posterior Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Posterior Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Posterior Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Posterior Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Amalgam Sewarna GD B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Amalgam Sewarna GD S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Amalgam Sewarna GK B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Telah Tampalan Amalgam Sewarna GK S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Jumlah Tampalan B: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Jumlah Tampalan S: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Tampalan Sementara: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Cabutan GD: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Cabutan GK: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Penskaleran: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Abses: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Pulpotomi: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kes Selesai ICDAS: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Kes Selesai: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Rujuk: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Catatan: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// umur: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Klinik Pergigian: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Nama Tadika: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Jenis tadika: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Operator: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Pasukan pergigian: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// MENJALANKAN BEGIN: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Taska: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Tadika: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Gigi Kekal: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// D class I: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// D class II: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// F class I: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// F class II: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Tahun Lepas GIC: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Tahun Lepas Resin: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Tahun Lepas Lain-lain: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// FS Tahun Lepas Intact Lain-lain: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Ceramah Toddler: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Ceramah Penjaga: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },					
	// Gigi Desidus: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },
});

module.exports = mongoose.model('Sekolah', sekolahSchema);