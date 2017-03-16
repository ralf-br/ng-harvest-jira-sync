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
import {JiraIssue} from "../model/jira-issue";
import {UtilsDate} from "../../utils/UtilsDate";
import {UtilsJira} from "../../utils/UtilsJira";
import {SpinnerService} from "../../spinner/spinner.service";


@Injectable()
export class TimesheetService {

  public timesheetEntries: TimesheetEntry[] = [];
  public myJiraAccount: JiraAccount = new JiraAccount();
  public myJiraIssues: JiraIssue[] = [];

  private currentDate: Date;

  constructor(private harvestService : HarvestService,
              private jiraService : JiraService,
              private alertService : AlertService,
              private spinnerService : SpinnerService) { }



  public clearAlertAndInitTimesheet(date : Date) {
    this.alertService.clear();
    this.initTimesheet(date)
  }

  private loadTimesheetForCurrentDateAndPreserveLastError = () => {
    this.initTimesheet(this.currentDate)
  };

  private initTimesheet(date : Date) {
    this.currentDate = date;

    this.spinnerService.startSpinning();

    console.info("Try loading from JIRA and Harvest for: " + UtilsDate.getDateInFormatYYYYMMDD(date));
    Observable.forkJoin(
      this.jiraService.loadMyJiraAccount(),
      this.harvestService.loadHarvestEntries(date),
      this.jiraService.loadMyIssuesWithWorklog(date)
    ).subscribe(
      resultArray => {
        this.myJiraAccount = resultArray[0];
        console.debug("Got JIRA Account with key " + this.myJiraAccount.key);

        Stream.from(resultArray[1].day_entries)
          .map(json => new HarvestEntry(json))
          .toArray()
          .then(this.processHarvestEntries);

        this.myJiraIssues = resultArray[2];
      },
      error => {
        this.alertService.error("I'm not able to connect to JIRA or Harvest.", error);
        this.spinnerService.stopSpinning();
      },
      () => this.loadMyJiraWorklogsForIssues(date)
    )
  }

  public deleteJiraWorklog(timesheetEntry: TimesheetEntry){
    this.jiraService.deleteWorklog(timesheetEntry.jiraWorklog)
      .subscribe(
        response => {
          this.alertService.success("Deleted Jira worklog for " + timesheetEntry.jiraWorklog.issueKey);

          //if there is also no harvest entry we must find and delete the whole timesheetEntry from the list
          if(timesheetEntry.harvestEntry != null){
            timesheetEntry.jiraWorklog = null;
          } else {
            let index = this.timesheetEntries.indexOf(timesheetEntry);
            if (index > -1) {
              this.timesheetEntries.splice(index, 1);
            }
          }
        },
        error => this.alertService.error("Some error occurred deleting the JIRA worklog", error)
      );
  }

  public copyHarvestToJira(timesheetEntry: TimesheetEntry) {
    timesheetEntry.syncing = true;
    this.jiraService.copyHarvestToJira(timesheetEntry)
      .finally(() => timesheetEntry.syncing = false)
      .subscribe(
        jiraWorklog => {
          timesheetEntry.jiraWorklog = jiraWorklog;
          this.alertService.success("Created JIRA worklog for " + timesheetEntry.harvestEntry.getJiraTicket());
        },
        error => this.alertService.error("Cannot save to JIRA", error)
      );
  }

  public copyAllFromHarvestToJira(){
    let entriesToSync = this.timesheetEntries.filter(t => t.allowSyncToJira());
    entriesToSync.forEach(t => t.syncing = true);
    this.spinnerService.startSpinning();

    //We use Observable.concat to sync to JIRA all entries sequentially!
    //Observable.forkJoin also worked fine for fast parallel access BUT
    //JIRA had transaction problems with multiple parallel entries to the same ticket
    //not summing up correctly the total time spend!!
    Observable.concat(
      ...entriesToSync.map(t => this.jiraService.copyHarvestToJira(t))
    )
      .finally(() => {
        entriesToSync.forEach(t => t.syncing = false);
        this.spinnerService.stopSpinning();
      })
      .subscribe(
        newJiraWorklog => this.mergeMyJiraWorklogIntoTimesheet(newJiraWorklog),
        error => {
          this.alertService.error("Cannot save to JIRA", error);
          UtilsDate.delay(200).then(this.loadTimesheetForCurrentDateAndPreserveLastError);
        },
        () => this.alertService.success("Created JIRA worklogs for: " + entriesToSync.map(t => t.getJiraTicket()).join(", "))
      );
  }

  private loadMyJiraWorklogsForIssues = (date: Date) => {
    Stream.from(this.myJiraIssues)
      .map(issue => this.jiraService.loadWorklogsForTicket(issue))
      .toArray()
      .then(loadWorklogsForTicketObservables =>
        Observable.forkJoin(loadWorklogsForTicketObservables)
          .finally(this.spinnerService.stopSpinning)
          .subscribe(
            resultArray => Stream.from(resultArray)
              .forEach(jiraWorklogs => this.processJiraWorklogs(jiraWorklogs, date)),
            error => this.alertService.error("Could not get your worklogs from JIRA", error)
          ))
  };

  private processJiraWorklogs = (jiraWorklogs: JiraWorklog[], date : Date) => {
    Stream.from(jiraWorklogs)
      .filter(jiraWorklog => jiraWorklog.author.key == this.myJiraAccount.key)
      .filter(jiraWorklog => UtilsJira.hasStartedOnDate(jiraWorklog.started, date))
      .forEach(this.mergeMyJiraWorklogIntoTimesheet);
  };

  private mergeMyJiraWorklogIntoTimesheet = (jiraWorklog: JiraWorklog) => {
    console.debug("Search match for JIRA worklog '" + jiraWorklog.issueKey + ": " + jiraWorklog.comment + "'");
    Stream.from(this.timesheetEntries)
      .filter(timesheetEntry => timesheetEntry.harvestEntry != null)
      .filter(timesheetEntry => timesheetEntry.harvestEntry.hasJiraTicket())
      .filter(timesheetEntry => timesheetEntry.harvestEntry.getJiraTicket() == jiraWorklog.issueKey)
      .filter(timesheetEntry => timesheetEntry.harvestEntry.getTimeInSeconds() == jiraWorklog.timeSpentSeconds)
      .filter(timesheetEntry => timesheetEntry.harvestEntry.getCommentWithoutJiraTicket() == jiraWorklog.comment)
      .toArray()
      .then(matchingTimesheetArray => {
        if(matchingTimesheetArray.length >= 1){
          console.debug("Match found - adding to existing TimesheetEntry with JIRA Worklog '" + jiraWorklog.issueKey + ": " + jiraWorklog.comment + "'");
          matchingTimesheetArray[0].jiraWorklog = jiraWorklog;
        } else {
          console.debug("No matches found - adding new TimesheetEntry with JIRA Worklog '" + jiraWorklog.issueKey + ": " + jiraWorklog.comment + "'");
          this.timesheetEntries.push(new TimesheetEntry(null, jiraWorklog));
        }
      });
  };

  private processHarvestEntries = (harvestEntries: HarvestEntry[]) => {
    if(!harvestEntries || harvestEntries.length == 0){
      this.alertService.info("No entries found in Harvest today");
    } else {
      console.info(harvestEntries.length + " entries found in Harvest");
    }

    Stream.from(harvestEntries)
      .map(harvestEntry => new TimesheetEntry(harvestEntry))
      .toArray()
      .then(timesheetEntries => this.timesheetEntries = timesheetEntries);
  };

}
