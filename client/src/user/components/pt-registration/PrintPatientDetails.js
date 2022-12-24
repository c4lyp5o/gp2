import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useGlobalUserAppContext } from '../../context/userAppContext';

import DataToPrint from './DataToPrint';

const PrintPatientDetails = ({ data }) => {
  const componentRef = useRef();
  const { noPendaftaranSplitter, statusPesakit } = useGlobalUserAppContext();

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <button className='w-24 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all hidden lg:block'>
            Cetak
          </button>
        )}
        content={() => componentRef.current}
      />
      <div className='hidden'>
        <DataToPrint
          data={data}
          ref={componentRef}
          noPendaftaranSplitter={noPendaftaranSplitter}
          statusPesakit={statusPesakit}
        />
      </div>
    </div>
  );
};

export default PrintPatientDetails;
