import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import { useGlobalUserAppContext } from '../../context/userAppContext';

export default function UserCarianSekolah() {
  const { userToken, userinfo, dateToday, masterDatePicker } =
    useGlobalUserAppContext();

  return (
    <>
      <div>for user carian sekolah</div>
    </>
  );
}
