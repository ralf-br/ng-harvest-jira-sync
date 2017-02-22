import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";
import {HarvestService} from "./harvest.service";
import {AlertService} from "../alert/alert.service";
import {Stream} from "ts-stream";
import {HarvestEntry} from "./model/harvest-entry";
import {TimesheetEntry} from "./timesheet-entry";
import {JiraService} from "./jira.service";


@Injectable()
export class TimesheetService {

  private _timesheetEntries: BehaviorSubject<TimesheetEntry[]> = new BehaviorSubject([]);
  public timesheetEntries: Observable<TimesheetEntry[]> = this._timesheetEntries.asObservable();

  constructor(private harvestService : HarvestService,
              private jiraService : JiraService,
              private alertService : AlertService) { }

  public loadTodaysHarvestEntries() {
    this.harvestService.loadTodaysHarvestEntries()
      .subscribe(
       response => Stream.from(response.json().day_entries)
          .map(json => new HarvestEntry(json))
          .toArray()
          .then(this.processHarvestEntries),
        error => this.handleHarvestError,
      )
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


  private handleHarvestError = (error: any): Promise<any> => {
    console.error('An error occurred getting the timesheet from harvest', error);
    this.alertService.error("Cannot get Harvest Timesheet - are you logged in?");
    return Promise.reject(error.message || error);
  }

  private processHarvestEntries = (harvestEntries:HarvestEntry[]) => {
    if(!harvestEntries || harvestEntries.length == 0){
      this.alertService.info("No entries found in Harvest today");
    } else {
      console.log(harvestEntries.length + " entries found in Harvest today");
      this.alertService.clear();
    }

    Stream.from(harvestEntries)
      .map(harvestEntry => new TimesheetEntry(harvestEntry))
      .toArray()
      .then(timesheetEntries => this._timesheetEntries.next(timesheetEntries));
  }

}
