import {Component, OnInit} from "@angular/core";
import {HarvestService} from "./harvest.service";
import {JiraService} from "./jira.service";
import {environment} from "../../environments/environment";
import {TimesheetService} from "./timesheet.service";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers:[TimesheetService, HarvestService, JiraService]
})
export class TimesheetComponent implements OnInit {
  private jiraBaseUrl = environment.jiraBaseUrl;

  constructor(private timesheetService : TimesheetService) { }

  ngOnInit() {
    this.timesheetService.loadTodaysHarvestEntries();
  }

}
