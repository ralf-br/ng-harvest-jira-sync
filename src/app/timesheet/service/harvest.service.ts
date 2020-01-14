import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UtilsDate} from "../../utils/UtilsDate";
import {environment} from "../../../environments/environment";
import {HarvestEntry} from "../model/harvest-entry";
import {HarvestAccount} from "../model/harvest-account";
import {map} from "rxjs/operators";

@Injectable()
export class HarvestService {

  constructor(private httpClient:HttpClient) {
  }

  loadMyHarvestAccount(): Observable<HarvestAccount> {
    let harvestAccountUrl = environment.harvestBaseUrl + "users/me";
    console.debug("load Harvest account with harvestAccountUrl: " + harvestAccountUrl);

    return this.httpClient.get(harvestAccountUrl, { withCredentials: true })
      .pipe(
        map(user => new HarvestAccount(user))
      )
  }

  loadHarvestEntries(date : Date): Observable<HarvestEntry[]> {
    let isoDate = UtilsDate.getDateInFormatYYYYMMDD(date);
    let harvestDailyUrl = environment.harvestBaseUrl + `time_entries?from=${isoDate}&to=${isoDate}`;
    //let dayOfYearAndYearUrlPart = UtilsDate.getDayOfYear(date)+ "/" + date.getFullYear();
    //let harvestDailyUrl =  harvestDailyBaseUrl + dayOfYearAndYearUrlPart;

    console.debug("load Harvest Entries with harvestDailyUrl: " + harvestDailyUrl);
    return this.httpClient.get(harvestDailyUrl, { withCredentials: true })
      .pipe(
        map(json => json['time_entries']),
        map(time_entries => time_entries.map(entry => new HarvestEntry(entry)))
      )
  }

}
