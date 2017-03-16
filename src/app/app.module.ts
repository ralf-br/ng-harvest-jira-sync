import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { myRequestOptionsProvider } from "./default-request-options.service";
import { AlertComponent } from './alert/alert.component';
import { AlertService } from "./alert/alert.service";
import { TimesheetComponent } from './timesheet/timesheet.component';
import "rxjs/add/operator/finally";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";
import { DatepickerComponent } from './datepicker/datepicker.component';
import {TimesheetService} from "./timesheet/service/timesheet.service";
import {HarvestService} from "./timesheet/service/harvest.service";
import {JiraService} from "./timesheet/service/jira.service";
import { SpinnerComponent } from './spinner/spinner.component';
import {SpinnerService} from "./spinner/spinner.service";


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    TimesheetComponent,
    DatepickerComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [myRequestOptionsProvider, AlertService, SpinnerService, TimesheetService, HarvestService, JiraService],
  bootstrap: [AppComponent]
})
export class AppModule { }
