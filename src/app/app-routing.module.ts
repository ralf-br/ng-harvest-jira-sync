import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MainSyncOverviewComponent} from "./main-sync-overview/main-sync-overview.component";
import {OptionsComponent} from "./options/options.component";

const appRoutes: Routes = [
  { path: '', component: MainSyncOverviewComponent },
  { path: '**', component: OptionsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule {}
