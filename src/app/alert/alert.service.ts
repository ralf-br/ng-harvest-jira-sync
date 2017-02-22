import { Injectable } from '@angular/core';

@Injectable()
export class AlertService {
  alertText;
  alertStatus;

  constructor() { }

  public error(errorText : string){
    this.alertText = errorText;
    this.alertStatus = "alert-danger";
    console.error(this.alertStatus + ": " + errorText);
  }

  public info(infoText: string){
    this.alertText = infoText;
    this.alertStatus = "alert-info";
    console.info(this.alertStatus + ": " + infoText);
  }

  public success(successText:string){
    this.alertText = successText;
    this.alertStatus = "alert-success";
    console.debug(this.alertStatus + ": " + successText);
  }

  public clear(){
    this.alertStatus = null;
    this.alertText = null;
    console.debug("cleared alert message");
  }
}
