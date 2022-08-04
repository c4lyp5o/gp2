import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useToken, getTokenized } from './Tokenizer';
import axios from 'axios';

const AdminAppContext = React.createContext();

function AdminAppProvider({ children }) {
  const { token, setToken } = useToken();

  const navigate = useNavigate();

  async function getCurrentUser() {
    let response = await axios.post(`/api/v1/superadmin/getuser`, {
      token: getTokenized(),
    });
    return response;
  }

  const catchAxiosErrorAndLogout = () => {
    localStorage.removeItem('adminToken');
  };

  const Dictionary = {
    taska: 'Taska',
    tadika: 'Tadika',
    'sekolah-rendah': 'Sekolah Rendah',
    'sekolah-menengah': 'Sekolah Menengah',
    institusi: 'Institusi',
    'kp-bergerak': 'KP Bergerak',
  };

  // GQL queries
  const GET_FACILITIES = gql`
    query GetAllFacilities($jenisFasiliti: String!, $daerah: String!) {
      fasilitisByType(jenisFasiliti: $jenisFasiliti, createdByDaerah: $daerah) {
        _id
        nama
        kodSekolah
        createdByNegeri
        createdByDaerah
        handler
        jenisFasiliti
        keppStatus
        risikoSekolahPersis
      }
    }
  `;

  const GET_ONE_FACILITY = gql`
    query GetOneFacility($_id: String!) {
      fasiliti(_id: $_id) {
        _id
        nama
        kodSekolah
        createdByNegeri
        createdByDaerah
        handler
        jenisFasiliti
        keppStatus
        risikoSekolahPersis
      }
    }
  `;

  const GET_ALL_OPERATORS = gql`
    query listOperatorByDaerah($daerah: String!) {
      listOperatorByDaerah(createdByDaerah: $daerah) {
        _id
        nama
        gred
        createdByDaerah
        kpSkrg
        role
      }
    }
  `;

  const GET_ONE_OPERATOR = gql`
    query GetOneOperator($_id: String!) {
      operator(_id: $_id) {
        _id
        nama
        gred
        createdByDaerah
        kpSkrg
        role
      }
    }
  `;

  const GET_KLINIK_FOR_DAERAH = gql`
    query GetKlinikForDaerah($daerah: String!) {
      klinik(daerah: $daerah) {
        _id
        nama
        createdByNegeri
        createdByDaerah
      }
    }
  `;

  const GET_OPERATORS_BY_DAERAH = gql`
    query GetOperatorByDaerah($daerah: String!) {
      listOperatorByDaerah(daerah: $daerah) {
        _id
        nama
        gred
        createdByDaerah
        kpSkrg
        role
      }
    }
  `;

  const CREATE_FACILITY = gql`
    mutation CreateFacility(
      $nama: String
      $kodSekolah: String
      $negeri: String
      $daerah: String
      $handler: String
      $jenisFasiliti: String
      $keppStatus: Boolean
      $risikoSekolahPersis: String
    ) {
      createFasiliti(
        fasiliti: {
          nama: $nama
          kodSekolah: $kodSekolah
          createdByNegeri: $negeri
          createdByDaerah: $daerah
          handler: $handler
          jenisFasiliti: $jenisFasiliti
          keppStatus: $keppStatus
          risikoSekolahPersis: $risikoSekolahPersis
        }
      ) {
        _id
        nama
        kodSekolah
        createdByNegeri
        createdByDaerah
        handler
        jenisFasiliti
        keppStatus
        risikoSekolahPersis
      }
    }
  `;

  const CREATE_OPERATOR = gql`
    mutation CreateOperator(
      $nama: String
      $gred: String
      $negeri: String
      $daerah: String
      $kpSkrg: String
      $role: String
    ) {
      createOperator(
        operator: {
          nama: $nama
          gred: $gred
          createdByNegeri: $negeri
          createdByDaerah: $daerah
          kpSkrg: $kpSkrg
          role: $role
        }
      ) {
        _id
        nama
        gred
        createdByNegeri
        createdByDaerah
        kpSkrg
        role
      }
    }
  `;

  const UPDATE_FACILITY = gql`
    mutation UpdateFacility(
      $_id: String
      $nama: String
      $kodSekolah: String
      $negeri: String
      $daerah: String
      $handler: String
      $jenisFasiliti: String
      $keppStatus: Boolean
      $risikoSekolahPersis: String
    ) {
      updateFasiliti(
        fasiliti: {
          _id: $_id
          nama: $nama
          kodSekolah: $kodSekolah
          createdByNegeri: $negeri
          createdByDaerah: $daerah
          handler: $handler
          jenisFasiliti: $jenisFasiliti
          keppStatus: $keppStatus
          risikoSekolahPersis: $risikoSekolahPersis
        }
      ) {
        _id
        nama
        kodSekolah
        createdByNegeri
        createdByDaerah
        handler
        jenisFasiliti
        keppStatus
        risikoSekolahPersis
      }
    }
  `;

  const UPDATE_OPERATOR = gql`
    mutation UpdateOperator(
      $_id: String
      $nama: String
      $gred: String
      $negeri: String
      $daerah: String
      $kpSkrg: String
      $role: String
    ) {
      updateOperator(
        operator: {
          _id: $_id
          nama: $nama
          gred: $gred
          createdByNegeri: $negeri
          createdByDaerah: $daerah
          kpSkrg: $kpSkrg
          role: $role
        }
      ) {
        _id
        nama
        gred
        createdByNegeri
        createdByDaerah
        kpSkrg
        role
      }
    }
  `;

  const GETFACORPEG = gql`
    query GetFacorPeg($id: String!) {
      facOrPeg(_id: $id) {
        _id
        nama
        kodSekolah
        createdByNegeri
        createdByDaerah
        handler
        kpSkrg
        gred
        role
        keppStatus
        risikoSekolahPersis
      }
    }
  `;

  const KILLITWITHFIRE = gql`
    mutation KillItWithFire($_id: String!, $jenisFasiliti: String!) {
      killItWithFire(_id: $_id, jenisFasiliti: $jenisFasiliti) {
        _id
      }
    }
  `;
  // GQL queries

  return (
    <AdminAppContext.Provider
      value={{
        token,
        setToken,
        navigate,
        getCurrentUser,
        catchAxiosErrorAndLogout,
        Dictionary,
        GET_FACILITIES,
        GET_ONE_FACILITY,
        GET_ALL_OPERATORS,
        GET_ONE_OPERATOR,
        GET_KLINIK_FOR_DAERAH,
        GET_OPERATORS_BY_DAERAH,
        CREATE_FACILITY,
        CREATE_OPERATOR,
        UPDATE_FACILITY,
        UPDATE_OPERATOR,
        GETFACORPEG,
        KILLITWITHFIRE,
      }}
    >
      {children}
    </AdminAppContext.Provider>
  );
}

const useGlobalAdminAppContext = () => {
  return useContext(AdminAppContext);
};

export { AdminAppProvider, useGlobalAdminAppContext };
