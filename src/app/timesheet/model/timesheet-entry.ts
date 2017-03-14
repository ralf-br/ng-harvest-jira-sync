import {HarvestEntry} from "./harvest-entry";
import {JiraWorklog} from "./jira-worklog";
import {UtilsJira} from "../../utils/UtilsJira";
export class TimesheetEntry {

  harvestEntry : HarvestEntry;
  jiraWorklog : JiraWorklog;
  syncing : boolean;

  constructor(harvest: any, jira?: any) {
    this.harvestEntry = harvest;

    if(jira != null){
      this.jiraWorklog = jira;
    }
  }

  public getTimeSpentInSeconds = () : number => {
    return this.harvestEntry ?
      this.harvestEntry.getTimeInSeconds() :
      this.jiraWorklog.timeSpentSeconds;
  };

  public getTimeSpentString = () : string => {
    return UtilsJira.timeInJiraFormat(this.getTimeSpentInSeconds());
  };

  public hasJiraTicket = () : boolean => {
    return (this.harvestEntry != null && this.harvestEntry.hasJiraTicket()) || this.jiraWorklog != null;
  };

  public getJiraTicket = () : string => {
    if(this.hasJiraTicket){
      if(this.harvestEntry != null){
        return this.harvestEntry.getJiraTicket();
      } else {
        return this.jiraWorklog.issueKey;
      }
    }
    return "";
  };

  public getCommentWithoutJiraTicket = () : string => {
    if(this.harvestEntry != null){
      return this.harvestEntry.getCommentWithoutJiraTicket();
    } else {
      return this.jiraWorklog.comment;
    }
  };

  public allowSyncToJira() : boolean{
    return this.harvestEntry != null
      && this.harvestEntry.hasJiraTicket()
      && !this.harvestEntry.timer_started_at
      && !this.jiraWorklog;
  }
}
