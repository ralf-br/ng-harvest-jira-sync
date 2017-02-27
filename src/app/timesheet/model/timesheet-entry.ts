import {HarvestEntry} from "./harvest-entry";
import {JiraWorklog} from "./jira-worklog";
export class TimesheetEntry {

  harvestEntry : HarvestEntry;
  jiraWorklog : JiraWorklog;
  syncing : boolean;

  constructor(harvest : any) {
    this.harvestEntry = harvest;
  }

  public allowSyncToJira() : boolean{
    return this.harvestEntry.hasJiraTicket()
      && !this.harvestEntry.timer_started_at
      && !this.jiraWorklog;
  }
}
