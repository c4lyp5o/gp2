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

const ShowCounter = ({ minutes, seconds, place }) => {
  if (place === 'header') {
    return (
      <div className='text-adminWhite bg-user1 rounded-lg justify-center whitespace-nowrap relative'>
        <span className='flex items-center font-mono text-xs capitalize animate-pulse'>
          {<TimeDisplay value={minutes} />}:{<TimeDisplay value={seconds} />}
        </span>
      </div>
    );
  }

  return (
    <div className='flex text-center text-admin2 justify-center text-xs'>
      <div className='flex gap-5'>
        <span className='flex items-center text-base font-mono'>
          {' '}
          Masa untuk log masuk:
        </span>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-mono text-base'>
            {<TimeDisplay value={minutes} />}
          </span>
          minit
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='font-mono text-base'>
            {' '}
            {<TimeDisplay value={seconds} />}
          </span>
          saat
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = ({ deadline, place }) => {
  const [days, hours, minutes, seconds] = useCountdown(deadline);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return <ShowCounter place={place} minutes={minutes} seconds={seconds} />;
  }
};

export default CountdownTimer;
