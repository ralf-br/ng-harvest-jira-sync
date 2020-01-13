import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {TimesheetEntry} from "../model/timesheet-entry";
import {JiraWorklog} from "../model/jira-worklog";
import {environment} from "../../../environments/environment";
import {JiraAccount} from "../model/jira-account";
import {JiraIssue} from "../model/jira-issue";
import {UtilsDate} from "../../utils/UtilsDate";
import {UtilsString} from "../../utils/UtilsString";
import {flatMap, map} from "rxjs/operators";
import {forkJoin, Observable, of} from "rxjs";
import {HarvestEntry} from "../model/harvest-entry";

@Injectable()
export class JiraService {

  private jiraRestBaseUrl : string;
  private jiraIssueUrl : string;
  private jiraMyselfUrl : string;
  private jiraSearchWorklog : string;
  private jiraWorklog : string;

  constructor(private httpClient:HttpClient) { }

  public loadMyJiraAccount() : Observable<JiraAccount> {
    this.setUrls();

    return this.httpClient.get(this.jiraMyselfUrl, { withCredentials: true })
      .pipe(
        map(json => new JiraAccount(json))
      );
  }

  public loadMyJiraWorklogs(date: Date) : Observable<JiraWorklog[][]> {
    this.setUrls();

    return this.loadMyIssuesWithWorklog(date)
      .pipe(
        flatMap(issues => this.loadMyJiraWorklogsForIssues(date, issues))
      )
  }

  public deleteWorklog(worklog : JiraWorklog) : Observable<Object> {
    this.setUrls();

    let deleteWorklogUrl = this.jiraIssueUrl + worklog.issueId + this.jiraWorklog + worklog.id;

    return this.httpClient.delete(deleteWorklogUrl, { withCredentials: true });
  }

  public copyHarvestToJira(timesheetEntry: TimesheetEntry) : Observable<JiraWorklog> {
    this.setUrls();

    let postWorklogUrl = this.jiraIssueUrl + timesheetEntry.harvestEntry.getJiraTicket() + this.jiraWorklog;

    let jiraWorklog : JiraWorklog = new JiraWorklog();
    jiraWorklog.comment = timesheetEntry.harvestEntry.getCommentWithoutJiraTicket();
    jiraWorklog.started = timesheetEntry.harvestEntry.getISOStartDate();
    jiraWorklog.timeSpentSeconds = timesheetEntry.harvestEntry.getTimeInSeconds();

    return this.httpClient.post(postWorklogUrl, jiraWorklog, { withCredentials: true })
      .pipe(
        map(json => new JiraWorklog(json)),
        map(worklog => {
            worklog.issueKey = timesheetEntry.getJiraTicket();
            return worklog;
          })
      )
  }

  private loadMyIssuesWithWorklog(date : Date) : Observable<JiraIssue[]> {
    let jiraSearchUrl = UtilsString.formatString(this.jiraSearchWorklog, [UtilsDate.getDateInFormatYYYYMMDD(date)]);
    return this.httpClient.get(jiraSearchUrl, { withCredentials: true })
      .pipe(
        map(json => json['issues'])
      )
  }

  private loadMyJiraWorklogsForIssues = (date: Date, myJiraIssues: JiraIssue[]) : Observable<JiraWorklog[][]> => {
    let loadWorklogsForIssueObservables = myJiraIssues
      .map(issue => this.loadWorklogsForIssue(issue));

    if(loadWorklogsForIssueObservables.length > 0){
      return forkJoin(loadWorklogsForIssueObservables);
    } else {
      return of([]);
    }
  };

  private loadWorklogsForIssue(issue : JiraIssue) : Observable<JiraWorklog[]> {
    let getWorklogUrl = this.jiraIssueUrl + issue.id + this.jiraWorklog;

    return this.httpClient.get<JiraWorklog[]>(getWorklogUrl, { withCredentials: true })
      .pipe(
        map(json => json['worklogs']),
        map(worklogs => worklogs.map(worklog => new JiraWorklog(worklog))),
        map(worklogs => {
          worklogs.forEach(worklog => worklog.issueKey = issue.key);
          return worklogs;
        })
      )
  }

  private setUrls(){
    this.jiraRestBaseUrl = environment.jiraBaseUrl + "rest/api/2/";
    this.jiraIssueUrl = this.jiraRestBaseUrl + "issue/";
    this.jiraMyselfUrl = this.jiraRestBaseUrl + "myself";
    this.jiraSearchWorklog = this.jiraRestBaseUrl + "search?fields=summary&jql=worklogAuthor=currentUser() and worklogDate='{0}'";
    this.jiraWorklog = "/worklog/";
  }
}
