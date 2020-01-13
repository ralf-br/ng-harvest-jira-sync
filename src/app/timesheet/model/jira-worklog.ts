
import {JsonSerializable} from "./json-serializable";
import {JiraAccount} from "./jira-account";

export class JiraWorklog extends JsonSerializable{
  //only those 3 are needed for posting new worklogs
  timeSpentSeconds: number;
  started: string;
  comment?: string;

  //additional info when getting from jira
  author: JiraAccount;
  id: number;
  issueId: number;

  //needs to be enriched as not returned by jira
  issueKey: string;

  public getComment = () : string => {
    return (this.comment != null) ? this.comment : "";
  };
}
