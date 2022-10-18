import React from 'react';
import TimeDisplay from './timeDisplay';
import { useCountdown } from './useCountdown';

const ExpiredNotice = () => {
  return (
    <div className='flex text-center text-admin2 justify-center text-xs'>
      <span>Masa untuk login telah tamat</span>
    </div>
  );
};

const ShowCounter = ({ minutes, seconds }) => {
  return (
    <div className='flex text-center text-admin2 justify-center text-xs'>
      <div className='flex gap-5'>
        {/* <span className='flex justify-center bg-admin2 text-adminWhite text-sm font-medium px-2.5 py-1 rounded dark:bg-admin2 dark:text-adminWhite'>
        Masa untuk log masuk:{<TimeDisplay value={minutes} />}:
        {<TimeDisplay value={seconds} />}
      </span> */}
        <span className='flex items-center text-base font-mono'>
          {' '}
          Masa untuk log masuk:
        </span>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-mono text-xl'>
            {<TimeDisplay value={minutes} />}
          </span>
          minit
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-mono text-xl'>
            {' '}
            {<TimeDisplay value={seconds} />}
          </span>
          saat
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = ({ deadline }) => {
  const [days, hours, minutes, seconds] = useCountdown(deadline);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
