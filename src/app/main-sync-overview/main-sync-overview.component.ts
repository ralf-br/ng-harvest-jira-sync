import { Component, OnInit } from '@angular/core';
import {JiraService} from "../timesheet/service/jira.service";
import {SpinnerService} from "../spinner/spinner.service";
import {TimesheetService} from "../timesheet/service/timesheet.service";
import {HarvestService} from "../timesheet/service/harvest.service";

@Component({
  selector: 'app-main-sync-overview',
  templateUrl: './main-sync-overview.component.html',
  styleUrls: ['./main-sync-overview.component.css'],
  providers: [SpinnerService, TimesheetService]
})
export class MainSyncOverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private gotToSettings(){
    chrome.runtime.openOptionsPage();
  }
}
