import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  alertStatus;
  alertText;
  alertTextDetail;

  constructor() { }

  public error(errorText : string, concreteErrorToLog? : Response){
    this.alertText = errorText;
    this.alertStatus = "alert-danger";

    this.setAlertTextDetailFromRequestError(concreteErrorToLog);

    console.error(this.alertStatus + ": " + this.alertText + this.alertTextDetail, concreteErrorToLog);
  }

  public info(infoText: string, concreteErrorToLog? : any){
    this.alertText = infoText;
    this.alertStatus = "alert-info";

    this.setAlertTextDetailFromRequestError(concreteErrorToLog);

    console.info(this.alertStatus + ": " + this.alertText + this.alertTextDetail, concreteErrorToLog);
  }

  public success(successText:string){
    this.alertTextDetail = null;
    this.alertText = successText;
    this.alertStatus = "alert-success";
    console.debug(this.alertStatus + ": " + this.alertText);
  }

  public clear(){
    this.alertStatus = null;
    this.alertText = null;
    this.alertTextDetail = null;
    console.debug("cleared alert message");
  }

  private setAlertTextDetailFromRequestError(concreteErrorToLog: any) {
    this.alertTextDetail = "";

    if (concreteErrorToLog) {
      if (concreteErrorToLog.headers.get("content-type") == "text/html; charset=utf-8"
        && concreteErrorToLog.text()) {
        //Harvest returns the message as plain Text in body
        this.alertTextDetail += "Error Message: " + concreteErrorToLog.text() + "\n";

      } else if (concreteErrorToLog.headers.get("content-type") == "application/json;charset=UTF-8"
        && concreteErrorToLog.json().errorMessages) {
        //Jira wraps the message in the errorMessages property of a json object
        this.alertTextDetail += "Error Message: " + concreteErrorToLog.json().errorMessages + "\n";
      }

      if (concreteErrorToLog.status == 0) {
        this.alertTextDetail += "Could not resolve host. Does the url exist? Are you online?";
      } else if (concreteErrorToLog.status == 400) {
        this.alertTextDetail += "The Http Status was 400 Bad Request for the url '" + concreteErrorToLog.url + "'";
      } else if (concreteErrorToLog.status == 404) {
        this.alertTextDetail += "The Http Status was 404 Not Found. Is this url correct? '" + concreteErrorToLog.url + "' ?";
      } else if (concreteErrorToLog.status == 401) {
        this.alertTextDetail += "The Http Status was 401 Unauthorized. Are you logged in to query '" + concreteErrorToLog.url + "' ?";
      }
    }
  }
}
