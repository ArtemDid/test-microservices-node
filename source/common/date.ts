import moment from 'moment';

export function mysqlDateFormat(date: Date) {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
