import {UtilsDate} from "./UtilsDate";

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

  /**
   * Produces a time string in the known "JIRA" format ex. 2h 30m
   * @param timeSpentInSeconds
   * @returns {string}
   */
  export function timeInJiraFormat(timeSpentInSeconds: number) : string {
    let timeSpentResultString = "";

    let hours = Math.floor(timeSpentInSeconds / 60 / 60);
    timeSpentResultString += hours >= 1 ? hours + "h " : "";
    timeSpentInSeconds -= hours * 60 * 60;

    let minutes = Math.floor(timeSpentInSeconds / 60);
    timeSpentResultString += minutes >= 1 ? minutes + "m" : "";

    return timeSpentResultString;
  }
}
