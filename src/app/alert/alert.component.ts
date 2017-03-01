import { Component, OnInit } from '@angular/core';
import {AlertService} from "./alert.service";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(private alertService : AlertService) { }

  ngOnInit() {
  }

  get alertStatus(){
    return this.alertService.alertStatus;
  }

  get alertText(){
    return this.alertService.alertText;
  }

  get alertTextDetail(){
    return this.alertService.alertTextDetail;
  }
}
