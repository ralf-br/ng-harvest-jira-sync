
import {JsonSerializable} from "./json-serializable";

export class JiraWorklog extends JsonSerializable{
  timeSpentSeconds: number;
  started: string;
  comment: string;

}
