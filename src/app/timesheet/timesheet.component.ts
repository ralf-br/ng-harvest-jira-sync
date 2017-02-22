import { Component, OnInit } from '@angular/core';
import {HarvestService} from "./harvest.service";
import {HarvestEntry} from "./model/harvest-entry";
import {AlertService} from "../alert/alert.service";
import {TimesheetEntry} from "./timesheet-entry";
import {JiraService} from "./jira.service";
import {JiraWorklog} from "./model/jira-worklog";
import {Stream} from "ts-stream";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css'],
  providers:[HarvestService, JiraService]
})
export class TimesheetComponent implements OnInit {
  private timesheetEntries:TimesheetEntry[] = [];

  constructor(private harvestService : HarvestService,
              private jiraService : JiraService,
              private alertService : AlertService) { }

  ngOnInit() {
    this.harvestService.loadTodaysHarvestEntries()
      .then(this.processHarvestEntries);
  }

  public syncToJira(timesheetEntry : TimesheetEntry) {
    timesheetEntry.syncing = true;
    this.jiraService.syncToJira(timesheetEntry)
      .then(this.processJiraSync);
  }

  private processJiraSync = (timesheetEntry : TimesheetEntry) => {
    this.alertService.success("Created JIRA worklog for " + timesheetEntry.harvestEntry.getJiraTicket());
    timesheetEntry.syncing = false;
  }

  private processHarvestEntries = (harvestEntries:HarvestEntry[]) => {
    if(!harvestEntries || harvestEntries.length == 0){
      this.alertService.info("No entries found in Harvest today");
    } else {
      console.log(harvestEntries.length + " entries found in Harvest today");
      this.alertService.clear();
    }

    Stream.from(harvestEntries)
      .map(this.createTimesheetEntry)
      .toArray()
      .then((newEntries) => this.timesheetEntries = newEntries);
  }

  private createTimesheetEntry = (harvestEntries: HarvestEntry) : TimesheetEntry => {
      let newTimesheetEntry : TimesheetEntry = new TimesheetEntry();
      newTimesheetEntry.harvestEntry = harvestEntries;
      return newTimesheetEntry;
  }

}
