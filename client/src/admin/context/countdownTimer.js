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
    <span className='flex justify-center bg-admin2 text-adminWhite text-sm font-medium px-2.5 py-1 rounded dark:bg-admin2 dark:text-adminWhite'>
      Masa untuk log masuk:{<TimeDisplay value={minutes} />}:
      {<TimeDisplay value={seconds} />}
    </span>
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
