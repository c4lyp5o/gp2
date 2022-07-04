const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  """
  A Patient refers to available attributes for a Patient
  """
  type Patient {
    _id: ID!
    nama: String!,
    ic: String!,
    tarikhLahir: String!,
    umur: Int,
    jantina: String,
    tarikhKedatangan: String!,
    createdAt: String!
  }
  input PatientType {
    nama: String!,
    ic: String!,
    tarikhLahir: String!,
    umur: Int,
    jantina: String,
    tarikhKedatangan: String!,
  }
  type RootQuery {
    patients: [Patient!]
    patient(_id: String!): Patient!
  }
  type Mutation {
    createPatient(patient: PatientType): Patient,
    deletePatient(_id: String): Patient,
    updatePatient(_id: String, body: String): String
  }
  schema {
    query: RootQuery
    mutation: Mutation
  }
`);
