import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {AlertService} from "../alert/alert.service";

import {TimesheetEntry} from "./timesheet-entry";
import {JiraWorklog} from "./model/jira-worklog";
import 'rxjs/add/operator/toPromise';
import {environment} from "../../environments/environment";

@Injectable()
export class JiraService {

  private jiraRestBaseUrl = environment.jiraBaseUrl + "rest/api/2/";
  private jiraIssueUrl = this.jiraRestBaseUrl + "issue/";
  private jiraWorklog = "/worklog";

  constructor(private http:Http,
              private alertService:AlertService) { }

  syncToJira(timesheetEntry: TimesheetEntry) : Promise<TimesheetEntry> {
    let postWorklogUrl = this.jiraIssueUrl + timesheetEntry.harvestEntry.getJiraTicket() + this.jiraWorklog;

    let jiraWorklog : JiraWorklog = new JiraWorklog();
    jiraWorklog.comment = timesheetEntry.harvestEntry.notes;
    jiraWorklog.started = timesheetEntry.harvestEntry.getISOStartDate();
    jiraWorklog.timeSpentSeconds = timesheetEntry.harvestEntry.hours * 60 * 60;

    return this.http.post(postWorklogUrl, jiraWorklog, { withCredentials: true })
      .toPromise()
      .then(response => {
        timesheetEntry.jiraWorklog = response.json() as JiraWorklog;
        return Promise.resolve(timesheetEntry);
      })
      .catch((error:any) => {
        console.error('An error occurred posting to Jira', error);
        this.alertService.error("Cannot save to Jira - does the ticket nr exist? are you logged in?");
        timesheetEntry.syncing = false;
        return Promise.reject(error.message || error);
    });
  }
}
