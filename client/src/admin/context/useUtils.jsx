import DatePicker from 'react-datepicker';

export function useUtils() {
  const percentageCalc = (numerator, denominator) => {
    if (numerator === 0 && denominator === 0) {
      return 0;
    }
    // one decimal place and if numerator is bigger become negative % value and become positive % value if denominator is bigger
    return Math.round(((numerator - denominator) / denominator) * 100);
  };
  const encryptEmail = (email) => {
    if (!email) return 'No email provided';
    const letterToEncrypt = Math.round(email.split('@')[0].length / 1.5);
    const encrypted =
      email
        .split('@')[0]
        .replace(
          email.split('@')[0].substring(0, letterToEncrypt),
          '*'.repeat(letterToEncrypt)
        ) +
      '@' +
      email.split('@')[1];
    return encrypted;
  };
  const encryptPassword = (password) => {
    if (!password) return 'No password provided';
    const letterToEncrypt = password.length;
    const encrypted = password.replace(
      password.substring(0, letterToEncrypt),
      '*'.repeat(letterToEncrypt)
    );
    return encrypted;
  };
  const formatTime = (timeString) => {
    const [hourString, minute] = timeString.split(':');
    const hour = +hourString % 24;
    return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
  };
  // const resizeImage = async (data) => {
  //   const response = await axios.post('/api/v1/superadmin/newroute', {
  //     image: data.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
  //     type: data.type,
  //     main: 'ImageResizer',
  //     Fn: 'resize',
  //     token: adminToken,
  //   });
  //   return response;
  // }
  const masterDatePicker = ({
    value,
    selected,
    onChange,
    required,
    filterDate,
    selectsStart,
    selectsEnd,
    startDate,
    endDate,
    minDate,
    disabled,
    className,
  }) => {
    return (
      <DatePicker
        showPopperArrow={false}
        dateFormat='dd/MM/yyyy'
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        value={value}
        selected={selected}
        onChange={onChange}
        required={required}
        filterDate={filterDate}
        selectsStart={selectsStart}
        selectsEnd={selectsEnd}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        withPortal={window.matchMedia('(max-width: 400px)').matches}
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        onFocus={(e) => e.target.blur()} // disable keyboad input
        disabled={disabled}
        className={className}
        portalId='root-portal'
      />
    );
  };
  const EmailValidator = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  return {
    percentageCalc,
    encryptEmail,
    encryptPassword,
    formatTime,
    // resizeImage,
    masterDatePicker,
    EmailValidator,
  };
}
