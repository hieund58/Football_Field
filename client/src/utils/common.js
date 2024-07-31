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
  return date?.setLocale('vi-VI')?.toLocaleString();
};


export const formatQueryDate = date => {
  const luxonDate = typeof date === 'string' ? DateTime.fromISO(date) : date;
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
