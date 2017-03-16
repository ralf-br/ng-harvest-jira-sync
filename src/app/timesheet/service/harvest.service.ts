import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {UtilsDate} from "../../utils/UtilsDate";
import {environment} from "../../../environments/environment";
import {HarvestEntry} from "../model/harvest-entry";

@Injectable()
export class HarvestService {
  private harvestDailyUrl = environment.harvestBaseUrl + "daily/";

  constructor(private http:Http) { }

  loadHarvestEntries(date : Date): Observable<HarvestEntry[]> {
    let dayOfYearAndYearUrlPart = UtilsDate.getDayOfYear(date)+ "/" + date.getFullYear();
    return this.http.get(this.harvestDailyUrl + dayOfYearAndYearUrlPart, { withCredentials: true })
      .map(response => response.json())
      .map(json => json.day_entries)
      .map(day_entries => day_entries
        .map(day_entry => new HarvestEntry(day_entry)));
  }

}
