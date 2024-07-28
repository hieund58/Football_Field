export function getImgUrl (imgPath) {
    return `http://localhost:5000/${imgPath}`
}

export const formatMoney = (moneyNum, separator = ',', suffix = ' VNĐ') => {
    if (moneyNum === 0) return '0';
    if (!moneyNum) return '';
  
    return moneyNum.toString().replace(/^[+-]?\d+/, int => int.replace(/(\d)(?=(\d{3})+$)/g, `$1${separator}`)) + suffix;
  };