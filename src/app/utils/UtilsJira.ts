import {UtilsDate} from "./UtilsDate";
declare let jQuery:any;

export module UtilsJira {

  /**
   * true if jira worklogstarted day matches the given date
   * @param jiraWorklogStarted
   * @param date
   * @returns {boolean}
   */
  export function hasStartedOnDate (jiraWorklogStarted:string, date: Date) : boolean{
    return UtilsJira.getJiraDatePart(jiraWorklogStarted) == UtilsDate.getDateInFormatYYYYMMDD(date);
  }

  /**
   * cuts down a jira date like 2017-02-16T15:05:00.000+0000 to 2017-02-16
   * @param dateString
   * @returns {string}
   */
  export function getJiraDatePart(dateString : string) : string{
    return dateString.substring(0, 10);
  }
}
