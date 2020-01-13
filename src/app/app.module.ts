import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppComponent} from "./app.component";
import {AlertComponent} from "./alert/alert.component";
import {AlertService} from "./alert/alert.service";
import {TimesheetComponent} from "./timesheet/timesheet.component";
import {DatepickerComponent} from "./datepicker/datepicker.component";
import {SpinnerComponent} from "./spinner/spinner.component";
import {Router} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {MainSyncOverviewComponent} from "./main-sync-overview/main-sync-overview.component";
import {OptionsComponent} from "./options/options.component";
import {OptionsService} from "./options/options.service";
import {HarvestService} from "./timesheet/service/harvest.service";
import {JiraService} from "./timesheet/service/jira.service";
import {DefaultRequestHeadersInterceptor} from "./default-request-headers-interceptor";


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
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultRequestHeadersInterceptor,
      multi: true
    },
    AlertService,
    OptionsService,
    HarvestService,
    JiraService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    console.debug('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
