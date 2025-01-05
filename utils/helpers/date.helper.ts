export class DateHelpers {
  static hebrewDays = ["יום ראשון", "יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "יום שבת"];
  static hebrewMonths = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

  static textFormatOfDate(strDate?: string) {
    if (strDate) {

      const date = new Date(strDate)
      const dayOfWeek = DateHelpers.hebrewDays[date.getDay()];
      const month = DateHelpers.hebrewMonths[date.getMonth()];
      const dayOfMonth = date.getDate();
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const formattedDate = `${dayOfWeek}, ${dayOfMonth} ב${month} ${year}, ${hour}:${minutes < 10 ? '0' : ''}${minutes}.${seconds < 10 ? '0' : ''}${seconds}`;
      return formattedDate
    } else {
      return " - - - "
    }
  }
  // Get day of the week, month, day of the month, year, hour, and minutes

}