import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {myRequestOptionsProvider} from "./default-request-options.service";
import { AlertComponent } from './alert/alert.component';
import {AlertService} from "./alert/alert.service";
import { TimesheetComponent } from './timesheet/timesheet.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    TimesheetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [myRequestOptionsProvider, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
