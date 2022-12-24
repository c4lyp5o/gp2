import React from 'react';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

const DataToPrint = React.forwardRef(({ data }, ref) => {
  const { noPendaftaranSplitter, statusPesakit } = useGlobalUserAppContext();

  return (
    <div ref={ref} className='w-[30rem] p-2'>
      <div className='grid grid-cols-2'>
        <h1 className='flex justify-start text-left font-bold text-2xl '>
          {data.ic}
        </h1>
        <div className='flex flex-col justify-end text-right text-sm'>
          <p className='text-xs'>{data.createdByKp}</p>
          <p>
            {data.noPendaftaranBaru
              ? noPendaftaranSplitter(data.noPendaftaranBaru)
              : noPendaftaranSplitter(data.noPendaftaranUlangan)}
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2'>
        <p className='col-span-2 flex justify-start text-lg font-semibold uppercase'>
          {data.nama}
        </p>
        <p className='text-sm'>
          {data.umur} TH {data.umurBulan} BL {data.umurHari} HR -TL:{' '}
          {moment(data.tarikhLahir).format('DD/MM/YYYY')}
        </p>
        <p className='text-sm uppercase flex justify-end text-right'>
          {data.jantina}
        </p>
        <p className='text-sm uppercase'>
          {data.kumpulanEtnik !== 'bukan warganegara' ? (
            <span>{data.kumpulanEtnik}/warganegara</span>
          ) : (
            <span>bukan warganegara</span>
          )}
        </p>
        <p className='text-sm uppercase flex justify-end text-right'>
          {statusPesakit(data)}
        </p>
        <p className='col-span-2 text-sm uppercase'>
          {data.alamat}, {data.daerahAlamat},
        </p>
        <p className='col-span-2 text-sm uppercase'>
          {data.poskodAlamat},{data.negeriAlamat}
        </p>
        {data.nomborTelefon ? (
          <p className='text-sm'>{data.nomborTelefon}</p>
        ) : null}
        {data.emel ? <p className='text-sm'>{data.emel}</p> : null}
      </div>
    </div>
  );
});

export default DataToPrint;
