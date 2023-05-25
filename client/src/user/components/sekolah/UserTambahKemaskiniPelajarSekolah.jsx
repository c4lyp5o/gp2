import { useState, useEffect } from 'react';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../context/userAppContext';

function UserTambahKemaskiniPelajarSekolah({
  modalTambahKemaskiniPelajar,
  setModalTambahKemaskiniPelajar,
  kemaskiniPelajarId,
  setKemaskiniPelajarId,
  submittingTambahPelajar,
  setSubmittingTambahPelajar,
  reloadState,
  setReloadState,
}) {
  const { userToken, userinfo, reliefUserToken, masterDatePicker, toast } =
    useGlobalUserAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTambahPelajar(true);
    if (!kemaskiniPelajarId) {
      await toast
        .promise(
          axios.post(
            '/api/v1/sekolah',
            {
              // req.body post here
            },
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          ),
          {
            loading: 'Sedang menambah pelajar',
            success: 'Berjaya menambah pelajar',
            error: 'Gagal menambah pelajar',
          }
        )
        .then((res) => {
          setModalTambahKemaskiniPelajar(false);
          setReloadState(!reloadState);
          setSubmittingTambahPelajar(false);
        })
        .catch((err) => {
          console.log(err);
          setModalTambahKemaskiniPelajar(false);
        });
    }
    if (kemaskiniPelajarId) {
      await toast
        .promise(
          axios.patch(
            `/api/v1/sekolah/ubah/${kemaskiniPelajarId}`,
            {
              // req.body patch here
            },
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          ),
          {
            loading: 'Sedang mengemaskini pelajar',
            success: 'Berjaya mengemaskini pelajar',
            error: 'Gagal mengemaskini pelajar',
          }
        )
        .then((res) => {
          setModalTambahKemaskiniPelajar(false);
          setReloadState(!reloadState);
          setSubmittingTambahPelajar(false);
        })
        .catch((err) => {
          console.log(err);
          setModalTambahKemaskiniPelajar(false);
        });
    }
  };

  // fetch singlePersonSekolah to edit if kemaskiniPelajarId === true
  useEffect(() => {
    if (kemaskiniPelajarId) {
      const fetchSinglePersonSekolah = async () => {
        try {
          const { data } = await axios.get(
            `/api/v1/sekolah/${kemaskiniPelajarId}`,
            {
              headers: {
                Authorization: `Bearer ${
                  reliefUserToken ? reliefUserToken : userToken
                }`,
              },
            }
          );
          console.log(data); // TODO map for kemaskini to each state
        } catch (error) {
          console.log(error);
        }
      };
    }
  });

  return (
    <>
      <div>modal tambah kemaskini pelajar</div>
    </>
  );
}

export default UserTambahKemaskiniPelajarSekolah;
