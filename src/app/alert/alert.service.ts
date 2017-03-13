import { Injectable } from '@angular/core';
import {Response} from "@angular/http";

@Injectable()
export class AlertService {
  alertStatus;
  alertText;
  alertTextDetail;

  constructor() { }

  public error(errorText : string, concreteErrorToLog? : Response){
    this.alertText = errorText;
    this.alertStatus = "alert-danger";

    if(concreteErrorToLog){
      this.alertTextDetail = "";

      if(concreteErrorToLog.headers.get("content-type") == "text/html; charset=utf-8"){
        //Harvest returns the message as plain Text in body
        this.alertTextDetail += "Error Message: " + concreteErrorToLog.text() + "\n";
      } else if (concreteErrorToLog.headers.get("content-type") == "application/json;charset=UTF-8") {
        //Jira wraps the message in the errorMessages property of a json object
        this.alertTextDetail += "Error Message: " +  concreteErrorToLog.json().errorMessages + "\n";
      }

      if(concreteErrorToLog.status == 0){
        this.alertTextDetail += "Could not resolve host or chrome permission is missing. Are you online?";
      } else if(concreteErrorToLog.status == 400){
        this.alertTextDetail += "The Http Status was 400 Bad Request for the url '" + concreteErrorToLog.url + "'";
      } else if(concreteErrorToLog.status == 404){
        this.alertTextDetail += "The Http Status was 404 Not Found. Is this url correct? '" + concreteErrorToLog.url + "' ?";
      } else if(concreteErrorToLog.status == 401){
        this.alertTextDetail += "The Http Status was 401 Unauthorized. Are you logged in to query '" + concreteErrorToLog.url + "' ?";
      }
    }

    console.error(this.alertStatus + ": " + this.alertText + this.alertTextDetail, concreteErrorToLog);
  }

  public info(infoText: string){
    this.alertTextDetail = null;
    this.alertText = infoText;
    this.alertStatus = "alert-info";
    console.info(this.alertStatus + ": " + this.alertText);
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
}
