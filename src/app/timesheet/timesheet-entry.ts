import {HarvestEntry} from "./model/harvest-entry";
import {JiraWorklog} from "./model/jira-worklog";
export class TimesheetEntry {

  harvestEntry : HarvestEntry;
  jiraWorklog : JiraWorklog;
  syncing : boolean;
}
