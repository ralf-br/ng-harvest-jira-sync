
import {JsonSerializable} from "./json-serializable";

export class HarvestEntry extends JsonSerializable{
  id: number;
  user_id: number;
  spent_at: string;
  created_at: string;
  updated_at: string;
  project_id: number;
  task_id: number;
  project: string;
  task: string;
  client: string;
  notes: string;
  hours_without_timer: number;
  hours: number;

  //needs to start from very beginning of comment
  //1-n alphabetic characters. (ignoring case)
  //a dash -
  //1-n digits
  //check that the ticket number is ended with : or whitespace or endOfString
  readonly jiraTicketRegexp = /^([A-Z]+-[0-9]+)(?=\s|:|$)/i;

  public hasJiraTicket = () : boolean => {
    return this.jiraTicketRegexp.test(this.notes);
  }

  public getJiraTicket = () : string => {
    if(this.hasJiraTicket){
      return this.jiraTicketRegexp.exec(this.notes)[0].toUpperCase();
    }
    return "";
  }

  //returns ex. "2017-02-19T09:00:00.000+0100"
  public getISOStartDate() : string {
    //input is only date as "2017-02-19"
    let isoDateSpentAt = new Date(this.spent_at);

    // = 9am with timezone +0100
    isoDateSpentAt.setHours(10);

    //Jira cannot handle Z syntax -> replace it with +0100 timezone
    return isoDateSpentAt.toISOString().replace("Z", "+0100");
  }

}
