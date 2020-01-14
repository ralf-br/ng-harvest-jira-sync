
export module UtilsDate {

  /**
   * Date in Format YYYYYMMDD with optional separator string
   * default is "-" for example YYYY-MM-DD
   * @param date
   * @param separator
   * @returns {string}
   */
  export function getDateInFormatYYYYMMDD(date : Date, separator?:string){
    let mm = date.getMonth() + 1; // getMonth() is zero-based
    let dd = date.getDate();
    let sep = separator != null ? separator : "-";

    return [date.getFullYear(),
      (mm>9 ? '' : '0') + mm,
      (dd>9 ? '' : '0') + dd
    ].join(sep);
  }

  /**
   * the day within the year from 1 to 365
   * @param date
   * @returns {number}
   */
  export function getDayOfYear(date : Date) : number {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = date.getMonth();
    var dn = date.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && UtilsDate.isLeapYear(date)){
      dayOfYear++;
    }
    return dayOfYear;
  }

  export function isLeapYear(date : Date) : boolean {
    let year = date.getFullYear();
    if((year % 4) != 0) {
      return false;
    }
    return ((year % 100) != 0 || (year % 400) == 0);
  }

  export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
