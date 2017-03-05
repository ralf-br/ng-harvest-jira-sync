
import {JsonSerializable} from "./json-serializable";
import {UtilsString} from "../../utils/UtilsString";

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
  timer_started_at: string;

  //https://regex101.com/r/cqsnSc/1
  readonly jiraTicketRegexp = /^[A-Z]+-[0-9]+(?=\s|:|$)/i;

  //https://regex101.com/r/vKeuu1/2
  readonly jiraTicketPrefixToRemoveRegexp = /^[A-Z]+-[0-9]+(?:\s+|:\s*|\s*$)/i;

  public hasJiraTicket = () : boolean => {
    return this.jiraTicketRegexp.test(this.notes);
  };

  public getJiraTicket = () : string => {
    if(this.hasJiraTicket){
      return this.jiraTicketRegexp.exec(this.notes)[0].toUpperCase();
    }
    return "";
  };

  public getCommentWithoutJiraTicket = () : string => {
    if(!this.hasJiraTicket()){
      return this.getDecodedNotes();
    } else {
      return this.getDecodedNotes().replace(this.jiraTicketPrefixToRemoveRegexp,"")
    }
  };

  public getDecodedNotes = () : string => {
    return UtilsString.decodeHtmlEntities(this.notes);
  };

  public getTimeInSeconds = () : number => {
    return this.hours * 60 * 60;
  };

  //returns ex. "2017-02-19T09:00:00.000+0100"
  public getISOStartDate() : string {
    //input is only date as "2017-02-19"
    let isoDateSpentAt = new Date(this.spent_at);

    // = 9am with timezone +0100
    isoDateSpentAt.setHours(10);

    //Jira cannot handle Z syntax -> replace it with +0100 timezone
    return isoDateSpentAt.toISOString().replace("Z", "+0100");
  };

  /**
   * This fuzzy comparison is needed as Harvest provides only time in hours with two decimal digits
   * For example 1 minute will be returned by Harvest as 0.02 hours
   * We sync it to Jira as 0.02*60*60 = 72 seconds
   * Jira rounds it down to 1 minute and returns 60 seconds if we query it.
   * So our comparison must return true in this case comparing 60 to 72 seconds.
   *
   * Our tolerance is +- 1 minute to hopefully be fuzzy enough...
   *
   * @param jiraTimeInSeconds
   * @returns {boolean}
   */
  public isApproxSameJiraTime = (jiraTimeInSeconds: number) : boolean => {
    let difference = this.getTimeInSeconds() - jiraTimeInSeconds;
    return difference < 60 && difference > -60;
  };
}
