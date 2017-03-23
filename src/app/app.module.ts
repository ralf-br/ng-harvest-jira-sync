import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {myRequestOptionsProvider} from "./default-request-options.service";
import {AlertComponent} from "./alert/alert.component";
import {AlertService} from "./alert/alert.service";
import {TimesheetComponent} from "./timesheet/timesheet.component";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";
import {DatepickerComponent} from "./datepicker/datepicker.component";
import {TimesheetService} from "./timesheet/service/timesheet.service";
import {HarvestService} from "./timesheet/service/harvest.service";
import {JiraService} from "./timesheet/service/jira.service";
import {SpinnerComponent} from "./spinner/spinner.component";
import {SpinnerService} from "./spinner/spinner.service";
import {Router} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MainSyncOverviewComponent} from "./main-sync-overview/main-sync-overview.component";
import {OptionsComponent} from "./options/options.component";


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    TimesheetComponent,
    DatepickerComponent,
    SpinnerComponent,
    MainSyncOverviewComponent,
    OptionsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [myRequestOptionsProvider, AlertService, SpinnerService, TimesheetService, HarvestService, JiraService],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    console.debug('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
