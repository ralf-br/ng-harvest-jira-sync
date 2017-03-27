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
import {SpinnerComponent} from "./spinner/spinner.component";
import {Router} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MainSyncOverviewComponent} from "./main-sync-overview/main-sync-overview.component";
import {OptionsComponent} from "./options/options.component";
import {OptionsService} from "./options/options.service";


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
  providers: [myRequestOptionsProvider, AlertService, OptionsService],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    console.debug('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
