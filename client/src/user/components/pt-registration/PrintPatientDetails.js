import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import DataToPrint from './DataToPrint';

const PrintPatientDetails = ({ data }) => {
  const detailsPage = useRef(null);

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <button className='w-24 py-2.5 my-1 bg-kaunter2 hover:bg-kaunter1 font-medium text-xs uppercase rounded-md shadow-md transition-all hidden lg:block'>
            Cetak
          </button>
        )}
        content={() => detailsPage.current}
      />
      <div className='hidden'>
        <DataToPrint data={data} ref={detailsPage} />
      </div>
    </div>
  );
};

export default PrintPatientDetails;
