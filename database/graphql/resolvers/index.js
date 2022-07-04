const Umum = require('../../../models/Umum');

module.exports = {
  patients: async () => {
    try {
      const patients = await Umum.find();
      return patients.map((pt) => {
        return {
          ...pt._doc,
          _id: pt.id,
          nama: pt.nama,
          ic: pt.ic,
          tarikhLahir: pt.tarikhLahir,
          umur: pt.umur,
          jantina: pt.jantina,
          tarikhKedatangan: pt.tarikhKedatangan,
          createdAt: new Date(pt._doc.createdAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  patient: async (_id) => {
    try {
      const patient = await Umum.findById(_id);
      return {
        ...patient._doc,
        nama: patient.nama,
        ic: patient.ic,
        tarikhLahir: patient.tarikhLahir,
        umur: patient.umur,
        jantina: patient.jantina,
        tarikhKedatangan: patient.tarikhKedatangan,
        createdAt: new Date(patient._doc.createdAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },

  createPatient: async (args) => {
    try {
      const { nama, ic, tarikhLahir, umur, jantina, tarikhKedatangan } =
        args.patient;
      const ptdata = new Umum({
        nama,
        ic,
        tarikhLahir,
        umur,
        jantina,
        tarikhKedatangan,
      });
      const newPt = await ptdata.save();
      return { ...newPt._doc, _id: newPt.id };
    } catch (error) {
      throw error;
    }
  },

  deletePatient: async (id) => {
    try {
      const deletedPt = await Umum.findByIdAndDelete(id);
      return {
        ...deletedPt._doc,
        _id: deletedPt.id,
        createdAt: new Date(deletedPt._doc.createdAt).toISOString(),
      };
    } catch (error) {
      throw error;
    }
  },

  updatePatient: async (args) => {
    try {
      const { _id, nama, ic, tarikhLahir, umur, jantina } = args;
      const updatedPt = await Umum.findByIdAndUpdate(_id, {
        nama: nama,
        ic: ic,
        tarikhLahir: tarikhLahir,
        umur: umur,
        jantina: jantina,
      });
      return `Patient ${updatedPt.id} updated Successfully!!!`;
    } catch (error) {
      throw error;
    }
  },
};
