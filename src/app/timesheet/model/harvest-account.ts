
import {JsonSerializable} from "./json-serializable";

export class HarvestAccount extends JsonSerializable {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
