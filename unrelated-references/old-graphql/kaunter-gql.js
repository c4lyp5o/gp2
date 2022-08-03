// GQL queries
const GET_ALL_PATIENTS = gql`
  query GetAllPatients($nothing: String) {
    patients {
      _id
      nama
      jenisIc
      ic
      tarikhLahir
      umur
      jantina
      tarikhKedatangan
      alamat
      waktuSampai
      kategoriPesakit
      kumpulanEtnik
      rujukDaripada
      createdAt
    }
  }
`;

const ADD_PATIENT = gql`
  mutation CreatePatient(
    $createdByNegeri: String
    $createdByDaerah: String
    $createdByKp: String
    $createdByUsername: String
    $nama: String
    $jenisIc: String
    $ic: String
    $tarikhLahir: String
    $jantina: String
    $tarikhKedatangan: String
    $umur: Int
    $rujukDaripada: String
    $jenisFasiliti: String
    $alamat: String
    $waktuSampai: String
    $kategoriPesakit: String
    $statusPesara: String
    $kumpulanEtnik: String
  ) {
    createPatient(
      patient: {
        createdByNegeri: $createdByNegeri
        createdByDaerah: $createdByDaerah
        createdByKp: $createdByKp
        createdByUsername: $createdByUsername
        nama: $nama
        jenisIc: $jenisIc
        ic: $ic
        tarikhLahir: $tarikhLahir
        tarikhKedatangan: $tarikhKedatangan
        jantina: $jantina
        umur: $umur
        alamat: $alamat
        waktuSampai: $waktuSampai
        kategoriPesakit: $kategoriPesakit
        statusPesara: $statusPesara
        kumpulanEtnik: $kumpulanEtnik
        rujukDaripada: $rujukDaripada
        jenisFasiliti: $jenisFasiliti
      }
    ) {
      createdByKp
      createdByDaerah
      createdByNegeri
      createdByUsername
      nama
      jenisIc
      ic
      tarikhLahir
      tarikhKedatangan
      jantina
      umur
      alamat
      waktuSampai
      kategoriPesakit
      kumpulanEtnik
      rujukDaripada
      jenisFasiliti
    }
  }
`;

const GET_PATIENT_BY_TARIKH_KEDATANGAN = gql`
  query getPatientByTarikhKedatangan(
    $tarikhKedatangan: String!
    $jenisFasiliti: String!
  ) {
    listPatientByTarikhKedatangan(
      tarikhKedatangan: $tarikhKedatangan
      jenisFasiliti: $jenisFasiliti
    ) {
      _id
      nama
      jenisIc
      ic
      tarikhLahir
      umur
      jantina
      tarikhKedatangan
      alamat
      waktuSampai
      kategoriPesakit
      kumpulanEtnik
      rujukDaripada
      jenisFasiliti
      createdAt
    }
  }
`;

const GET_PATIENT = gql`
  query getPatient($id: String!) {
    patient(_id: $id) {
      nama
      jenisIc
      ic
      tarikhLahir
      tarikhKedatangan
      jantina
      umur
      alamat
      waktuSampai
      kategoriPesakit
      kumpulanEtnik
      rujukDaripada
    }
  }
`;

const UPDATE_PATIENT = gql`
  mutation UpdatePatient(
    $_id: String
    $nama: String
    $jenisIc: String
    $ic: String
    $tarikhLahir: String
    # $tarikhKedatangan: String
    $jantina: String
    $umur: Int
    $alamat: String
    $waktuSampai: String
    $kategoriPesakit: String
    $kumpulanEtnik: String
    $rujukDaripada: String
  ) {
    updatePatient(
      patient: {
        _id: $_id
        nama: $nama
        jenisIc: $jenisIc
        ic: $ic
        tarikhLahir: $tarikhLahir
        # tarikhKedatangan: $tarikhKedatangan
        jantina: $jantina
        umur: $umur
        alamat: $alamat
        waktuSampai: $waktuSampai
        kategoriPesakit: $kategoriPesakit
        kumpulanEtnik: $kumpulanEtnik
        rujukDaripada: $rujukDaripada
      }
    ) {
      nama
      jenisIc
      ic
      tarikhLahir
      # tarikhKedatangan
      jantina
      umur
      alamat
      waktuSampai
      kategoriPesakit
      kumpulanEtnik
      rujukDaripada
    }
  }
`;
// GQL QUERIES
