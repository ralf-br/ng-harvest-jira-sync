
export class JsonSerializable {

  fillFromJSON(jsonObj: any) {
    for (let propName in jsonObj) {
      this[propName] = jsonObj[propName];
    }
  }

  constructor(jsonObj? : any) {
    if (jsonObj) {
      this.fillFromJSON(jsonObj);
    }
  }
}
