import {Injectable} from "@angular/core";
import {Stream} from "ts-stream";
import {HarvestService} from "./harvest.service";
import {AlertService} from "../../alert/alert.service";
import {HarvestEntry} from "../model/harvest-entry";
import {TimesheetEntry} from "../model/timesheet-entry";
import {JiraService} from "./jira.service";
import {JiraWorklog} from "../model/jira-worklog";
import {JiraAccount} from "../model/jira-account";
import {Observable} from "rxjs";


@Injectable()
export class TimesheetService {

  public timesheetEntries: TimesheetEntry[] = [];
  public myJiraAccount: JiraAccount = new JiraAccount();

  constructor(private harvestService : HarvestService,
              private jiraService : JiraService,
              private alertService : AlertService) { }

  public initTimesheet() {
    Observable.forkJoin(
      this.jiraService.loadMyJiraAccount(),
      this.harvestService.loadTodaysHarvestEntries()
    ).subscribe(
      resultArray => {
        this.myJiraAccount = resultArray[0];
        console.log("Got Jira Account with key " + this.myJiraAccount.key);

        Stream.from(resultArray[1].day_entries)
          .map(json => new HarvestEntry(json))
          .toArray()
          .then(this.processHarvestEntries)
      },
      error => this.alertService.error("I'm not able to connect to Jira or Harvest.", error)
    )
  }

  public copyHarvestToJira(timesheetEntry : TimesheetEntry) {
    timesheetEntry.syncing = true;
    this.jiraService.copyHarvestToJira(timesheetEntry)
      .finally(() => timesheetEntry.syncing = false)
      .subscribe(
        jiraWorklog => {
          timesheetEntry.jiraWorklog = jiraWorklog;
          this.alertService.success("Created JIRA worklog for " + timesheetEntry.harvestEntry.getJiraTicket());
        },
        error => this.alertService.error("Cannot save to Jira - does the ticket nr exist?", error)
      );
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
      .then(timesheetEntries => this.timesheetEntries = timesheetEntries);
  }

}
