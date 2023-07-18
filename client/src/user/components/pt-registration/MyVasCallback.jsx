import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function MyVasCallback() {
  const { kaunterToken, setMyVasToken, setMyVasIdToken, navigate, toast } =
    useGlobalUserAppContext();

  // state untuk myvas code
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  // dapatkan token MyVas kalau ada query code
  useEffect(() => {
    if (code) {
      const getMyVasToken = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${kaunterToken}`,
          },
        };
        await axios
          .get(`/api/v1/myvas/callback?code=${code}`, config)
          .then((res) => {
            localStorage.setItem('myVasToken', res.data.myVasToken);
            localStorage.setItem('myVasIdToken', res.data.myVasIdToken);
            setMyVasToken(res.data.myVasToken);
            setMyVasIdToken(res.data.myVasIdToken);
            navigate('/pendaftaran/daftar/kp/myvas');
          })
          .catch((err) => {
            navigate('/pendaftaran/daftar/kp');
            toast.error('Log masuk ke MyVas gagal');
            console.log(err);
          });
      };
      getMyVasToken();
    }
  }, []);

  return (
    <>
      <div></div>
    </>
  );
}
