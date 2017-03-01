
import {JsonSerializable} from "./json-serializable";

export class JiraAccount extends JsonSerializable{
  key: string;
  emailAddress: string;
  displayName: string;
  timeZone: string;
  locale: string;

}
