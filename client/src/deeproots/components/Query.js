import { useState, useEffect } from 'react';
import { useGlobalDeeprootsContext } from '../context/deeprootsAppContext';

export default function Query() {
  const { readUmumData, readSpecificUmumData, readFasilitiData } =
    useGlobalDeeprootsContext();

  const [query, setQuery] = useState('');
  const [queryKlinik, setQueryKlinik] = useState('');
  const [response, setResponse] = useState(null);
  const [klinik, setKlinik] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(query);
    const klinikName = klinik.find((item) => item.kodFasiliti === queryKlinik);
    console.log(klinikName);
    readSpecificUmumData(klinikName.kodFasiliti).then((res) => {
      console.log(res.data);
      setResponse(res.data);
    });
  };

  const handleGetAllData = async () => {
    const res = await readUmumData();
    console.log(res.data);
    setResponse(res.data);
  };

  useEffect(() => {
    readFasilitiData().then((res) => {
      setKlinik(res.data);
    });
  }, []);

  return (
    <>
      <div className='h-full overflow-y-auto'>
        <div className='justify-center items-center space-y-5 font-mono text-xs'>
          <p>you are in the deeproots system</p>
          <div>
            <button
              type='button'
              className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
              onClick={handleGetAllData}
            >
              GET ALL DATA
            </button>
          </div>
          <div>
            <label htmlFor='query'>Query: </label>
            {klinik.map((item) => (
              <>
                <input
                  key={item.id}
                  type='radio'
                  id='klinik'
                  name='klinik'
                  value={item.kodFasiliti}
                  label={item.nama}
                  onChange={(e) => {
                    setQueryKlinik(e.target.value);
                    console.log(e.target.value);
                  }}
                  className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
                />
                <label htmlFor='klinik'>{item.nama}</label>
              </>
            ))}
            <input name='query' onChange={(e) => setQuery(e.target.value)} />
            <button
              type='button'
              className='p-1 text-adminWhite bg-admin3 hover:bg-opacity-80 rounded-sm shadow-xl outline outline-1 outline-admin4 transition-all'
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          {response && (
            <div className='flex flex-col items-center justify-center font-mono text-xs'>
              <p>Response:</p>
              <pre>{JSON.stringify(response, null, 2)}</pre>
              {/* {response.data.map((item) => (
                <div key={item.id}>
                  <p>{item.nama}</p>
                </div>
              ))} */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
