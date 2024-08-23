import { DateTime } from 'luxon';

export function getImgUrl(imgPath) {
  return `http://localhost:5000/${imgPath}`;
}

export const formatMoney = (moneyNum, separator = ',', suffix = ' VNĐ') => {
  if (moneyNum === 0) return '0';
  if (!moneyNum) return '';

  return moneyNum.toString().replace(/^[+-]?\d+/, int => int.replace(/(\d)(?=(\d{3})+$)/g, `$1${separator}`)) + suffix;
};

export const formatDateVn = date => {
  const luxonDate = typeof date === 'string' ? DateTime.fromFormat(date, 'yyyy-MM-dd') : date;
  return luxonDate?.setLocale('vi-VI')?.toLocaleString();
};

export const formatQueryDate = date => {
  let luxonDate;
  switch (typeof date) {
    case 'string':
      luxonDate = DateTime.fromISO(date);
      break;
    case 'object':
      luxonDate = DateTime.isDateTime(date) ? date : DateTime.fromJSDate(date);
      break;
    case 'number':
      luxonDate = DateTime.fromMillis(date);
      break;
    default:
      luxonDate = date;
      break;
  }
  return luxonDate?.toFormat('yyyy-MM-dd');
};

export const getWeekDay = date => {
  const luxonDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
  return luxonDate.setLocale('vi-VI')?.toLocaleString({ weekday: 'short' });
};

export const getMonthDay = date => {
  const luxonDate = DateTime.fromFormat(date, 'yyyy-MM-dd');
  return luxonDate.setLocale('vi-VI')?.toLocaleString({ month: '2-digit', day: '2-digit' });
};

export const isToday = date => {
  const dateToCompare = typeof date === 'string' ? DateTime.fromFormat(date, 'yyyy-MM-dd') : date;
  return dateToCompare.hasSame(DateTime.now(), 'days');
};

export const getUserData = () => {
  const userDataString = sessionStorage.getItem('userData');
  return userDataString ? JSON.parse(userDataString) : null;
};

export const VND_TO_USD_RATE = 25217.5;

export const vndToUsd = vnd => {
  if (isNaN(parseFloat(vnd))) return null;
  return String((Number(vnd) / VND_TO_USD_RATE).toFixed(2));
};
