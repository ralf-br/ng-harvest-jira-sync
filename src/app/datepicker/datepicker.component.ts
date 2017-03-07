import { Component, OnInit } from '@angular/core';
import {TimesheetService} from "../timesheet/service/timesheet.service";

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  currentDate : Date;

  constructor(private timesheetService : TimesheetService) { }

  ngOnInit() {
    this.currentDate = this.todayStartOfDay();
    this.updateTimesheet()
  }

  private currentDateIsToday() : boolean{
    return this.currentDate.valueOf() == this.todayStartOfDay().valueOf();
  }

  private pastDay(days : number){
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - days);
    this.updateTimesheet()
  }

  private futureDay(days : number){
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + days);
    this.updateTimesheet()
  }

  private goBackToToday(){
    this.currentDate = this.todayStartOfDay();
    this.updateTimesheet();
  }

  private updateTimesheet(){
    this.timesheetService.initTimesheet(this.currentDate);
  };

  private futureDisabled(days : number) : boolean{
    let futureDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + days);
    return this.todayStartOfDay().valueOf() < futureDay.valueOf();
  }

  private todayStartOfDay() : Date{
    let startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    return startOfToday;
  }
}
