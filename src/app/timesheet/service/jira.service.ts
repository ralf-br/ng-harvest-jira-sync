import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {AlertService} from "../../alert/alert.service";

import {TimesheetEntry} from "../model/timesheet-entry";
import {JiraWorklog} from "../model/jira-worklog";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {JiraAccount} from "../model/jira-account";
import {JiraIssue} from "../model/jira-issue";

@Injectable()
export class JiraService {

  private jiraRestBaseUrl = environment.jiraBaseUrl + "rest/api/2/";
  private jiraIssueUrl = this.jiraRestBaseUrl + "issue/";
  private jiraMyselfUrl = this.jiraRestBaseUrl + "myself";
  private jiraSearchWorklog = this.jiraRestBaseUrl + "search?fields=summary&jql=worklogAuthor=currentUser() and worklogDate='2017-03-01'"; //TODO DATE!!!!!!
  private jiraWorklog = "/worklog";

  constructor(private http:Http,
              private alertService:AlertService) { }

  loadTodaysJiraIssues() : Observable<JiraIssue[]> {
    return this.http.get(this.jiraSearchWorklog, { withCredentials: true })
      .map(response => response.json().issues);
  }

  loadMyJiraAccount() : Observable<JiraAccount> {
    return this.http.get(this.jiraMyselfUrl, { withCredentials: true })
      .map(response => response.json())
      .map(json => new JiraAccount(json));
  }

  copyHarvestToJira(timesheetEntry: TimesheetEntry) : Observable<JiraWorklog> {
    let postWorklogUrl = this.jiraIssueUrl + timesheetEntry.harvestEntry.getJiraTicket() + this.jiraWorklog;

    let jiraWorklog : JiraWorklog = new JiraWorklog();
    jiraWorklog.comment = timesheetEntry.harvestEntry.getCommentWithoutJiraTicket();
    jiraWorklog.started = timesheetEntry.harvestEntry.getISOStartDate();
    jiraWorklog.timeSpentSeconds = timesheetEntry.harvestEntry.hours * 60 * 60;

    return this.http.post(postWorklogUrl, jiraWorklog, { withCredentials: true })
      .map(response => response.json())
      .map(json => new JiraWorklog(json));
  }
}
