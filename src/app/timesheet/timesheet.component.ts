import {Component, OnInit} from "@angular/core";
import {HarvestService} from "./service/harvest.service";
import {JiraService} from "./service/jira.service";
import {environment} from "../../environments/environment";
import {TimesheetService} from "./service/timesheet.service";
import {TimesheetEntry} from "./model/timesheet-entry";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers:[TimesheetService, HarvestService, JiraService]
})
export class TimesheetComponent implements OnInit {

  //Used for the html link to JIRA - ignore "unused" warning
  private jiraBaseUrl = environment.jiraBaseUrl;

  constructor(private timesheetService : TimesheetService) { }

  ngOnInit() {
    this.timesheetService.initTimesheet();
  }

  get timesheetEntries(){
    return this.timesheetService.timesheetEntries;
  }

  get myJiraAccount(){
    return this.timesheetService.myJiraAccount;
  }

  private copyHarvestToJira(timesheetEntry : TimesheetEntry){
    this.timesheetService.copyHarvestToJira(timesheetEntry);
  }

}
