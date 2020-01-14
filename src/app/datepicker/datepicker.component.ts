import { Component, OnInit } from '@angular/core';
import {TimesheetService} from "../timesheet/service/timesheet.service";
import {OptionsService} from "../options/options.service";

@Component({
  selector: 'app-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  currentDate : Date;

  constructor(private timesheetService : TimesheetService,
              private optionsService : OptionsService) { }

  ngOnInit() {
    this.currentDate = this.todayStartOfDay();

    //this is the central point to start loading the timesheet for today
    //load the stored options (urls) and only then continue with updating the timesheet.
    this.optionsService.loadOptionsToEnvironment(this.updateTimesheet);
  }

  currentDateIsToday() : boolean{
    return this.currentDate.valueOf() == this.todayStartOfDay().valueOf();
  }

  pastDay(days : number){
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - days);
    this.updateTimesheet()
  }

  futureDay(days : number){
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + days);
    this.updateTimesheet()
  }

  goBackToToday(){
    this.currentDate = this.todayStartOfDay();
    this.updateTimesheet();
  }

  futureDisabled(days : number) : boolean{
    let futureDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + days);
    return this.todayStartOfDay().valueOf() < futureDay.valueOf();
  }

  private updateTimesheet = () => {
    this.timesheetService.clearAlertAndInitTimesheet(this.currentDate);
  };

  private todayStartOfDay() : Date{
    let startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    return startOfToday;
  }
}
