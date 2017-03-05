import {HarvestEntry} from "./harvest-entry";
import {JiraWorklog} from "./jira-worklog";
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

  public getHours = () : number => {
    if(this.harvestEntry != null){
      return this.harvestEntry.hours;
    } else {
      return this.jiraWorklog.timeSpentSeconds / 60 / 60;
    }
  }

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
