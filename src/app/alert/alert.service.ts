import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  alertStatus;
  alertText;
  alertTextDetail;

  constructor() { }

  public error(errorText : string, concreteErrorToLog? : any){
    this.alertTextDetail = null;
    if(concreteErrorToLog.status == 401){
      this.alertTextDetail = "The http error code is 401. Are you logged in and authorized to query '" + concreteErrorToLog.url + "' ?";
    }

    this.alertText = errorText;
    this.alertStatus = "alert-danger";
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
