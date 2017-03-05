import {Component, OnInit} from "@angular/core";
import {HarvestService} from "./service/harvest.service";
import {JiraService} from "./service/jira.service";
import {environment} from "../../environments/environment";
import {TimesheetService} from "./service/timesheet.service";
import {TimesheetEntry} from "./model/timesheet-entry";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  //Used for the html link to JIRA - ignore "unused" warning
  private jiraBaseUrl = environment.jiraBaseUrl;

  constructor(private timesheetService : TimesheetService) { }

  ngOnInit() {
  }

  get timesheetEntries(){
    return this.timesheetService.timesheetEntries;
  }

  get myJiraAccount(){
    return this.timesheetService.myJiraAccount;
  }

  get myJiraIssues(){
    return this.timesheetService.myJiraIssues;
  }

  private copyHarvestToJira(timesheetEntry: TimesheetEntry){
    this.timesheetService.copyHarvestToJira(timesheetEntry);
  }

  private deleteJiraWorklog(timesheetEntry: TimesheetEntry){
    this.timesheetService.deleteJiraWorklog(timesheetEntry)
  }

  private trashJiraIcon(event){
    event.target.attributes['src'].value = "/assets/icons/jira-trash.png";
  }

  private normalJiraIcon(event){
    event.target.attributes['src'].value = "/assets/icons/jira.png";
  }

}
