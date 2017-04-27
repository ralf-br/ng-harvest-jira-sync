import {Component, OnInit} from "@angular/core";
import {environment} from "../../environments/environment";
import {TimesheetService} from "./service/timesheet.service";
import {TimesheetEntry} from "./model/timesheet-entry";
import {UtilsJira} from "../utils/UtilsJira";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  constructor(private timesheetService : TimesheetService) { }

  ngOnInit() {
  }

  get timesheetEntries(){
    return this.timesheetService.timesheetEntries;
  }

  get jiraBaseUrl(){
    return environment.jiraBaseUrl;
  }

  private copyHarvestToJira(timesheetEntry: TimesheetEntry){
    this.timesheetService.copyHarvestToJira(timesheetEntry);
  }

  private deleteJiraWorklog(timesheetEntry: TimesheetEntry){
    this.timesheetService.deleteJiraWorklog(timesheetEntry)
  }

  private multipleJiraSyncsOffered(){
    return 2 <= this.timesheetEntries
      .filter(t => t.allowSyncToJira())
      .length;
  }

  private anyEntrySyncing(){
    return 1 <= this.timesheetEntries
      .filter(t => t.syncing)
      .length;
  }

  private copyAllFromHarvestToJira(){
    this.timesheetService.copyAllFromHarvestToJira();
  }

  private trashJiraIcon(event){
    event.target.attributes['src'].value = "/assets/icons/jira-trash.png";
  }

  private normalJiraIcon(event){
    event.target.attributes['src'].value = "/assets/icons/jira.png";
  }

  private totalTimeSpentString(): string {
    let totalTimeSpentInSeconds = this.timesheetEntries
      .map(timesheetEntry => timesheetEntry.getTimeSpentInSeconds())
      .reduce((acc, val) => acc + val, 0);

    return UtilsJira.timeInJiraFormat(totalTimeSpentInSeconds);
  }

}
