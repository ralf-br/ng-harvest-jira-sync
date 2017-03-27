import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {UtilsDate} from "../../utils/UtilsDate";
import {environment} from "../../../environments/environment";
import {HarvestEntry} from "../model/harvest-entry";
import {HarvestAccount} from "../model/harvest-account";

@Injectable()
export class HarvestService {

  constructor(private http:Http) {
  }

  loadMyHarvestAccount(): Observable<HarvestAccount> {
    let harvestAccountUrl = environment.harvestBaseUrl + "account/who_am_i";
    console.debug("load Harvest account with harvestAccountUrl: " + harvestAccountUrl);

    return this.http.get(harvestAccountUrl, { withCredentials: true })
      .map(response => response.json())
      .map(json => json.user)
      .map(user => new HarvestAccount(user));
  }

  loadHarvestEntries(date : Date): Observable<HarvestEntry[]> {
    let harvestDailyUrl = environment.harvestBaseUrl + "daily/";
    console.debug("load Harvest Entries with harvestDailyUrl: " + harvestDailyUrl);

    let dayOfYearAndYearUrlPart = UtilsDate.getDayOfYear(date)+ "/" + date.getFullYear();
    return this.http.get(harvestDailyUrl + dayOfYearAndYearUrlPart, { withCredentials: true })
      .map(response => response.json())
      .map(json => json.day_entries)
      .map(day_entries => day_entries
        .map(day_entry => new HarvestEntry(day_entry)));
  }

}
