import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import DataToPrint from './DataToPrint';

const PrintPatientDetails = ({ data }) => {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <button className='px-6 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all'>
            Cetak
          </button>
        )}
        content={() => componentRef.current}
      />
      <div className='hidden'>
        <DataToPrint data={data} ref={componentRef} />
      </div>
    </div>
  );
};

export default PrintPatientDetails;
