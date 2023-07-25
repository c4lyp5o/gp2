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
        try {
          const response = await axios.get(
            `/api/v1/myvas/callback?code=${code}`,
            {
              headers: {
                Authorization: `Bearer ${kaunterToken}`,
              },
            }
          );
          localStorage.setItem('myVasToken', response.data.myVasToken);
          localStorage.setItem('myVasIdToken', response.data.myVasIdToken);
          setMyVasToken(response.data.myVasToken);
          setMyVasIdToken(response.data.myVasIdToken);
          navigate('/pendaftaran/daftar/kp/myvas');
        } catch (error) {
          console.log(error);
          toast.error('Log masuk ke MyVAS gagal');
          navigate('/pendaftaran/daftar/kp');
        }
      };
      getMyVasToken();
    }
  }, []);

  return (
    <div className='mt-20'>
      <h1 className='animate-pulse text-user1 font-bold text-4xl'>
        Mengesahkan log masuk ke MyVAS....
      </h1>
    </div>
  );
}
