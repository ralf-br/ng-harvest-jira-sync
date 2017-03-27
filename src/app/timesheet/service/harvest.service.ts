import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {UtilsDate} from "../../utils/UtilsDate";
import {environment} from "../../../environments/environment";
import {HarvestEntry} from "../model/harvest-entry";

@Injectable()
export class HarvestService {
  private urlsAreSet : boolean = false;
  private harvestDailyUrl : string;

  constructor(private http:Http) {
  }

  loadHarvestEntries(date : Date): Observable<HarvestEntry[]> {
    this.ensureUrlsAreSet();
    console.debug("load Harvest Entries with harvestDailyUrl: " + this.harvestDailyUrl);

    let dayOfYearAndYearUrlPart = UtilsDate.getDayOfYear(date)+ "/" + date.getFullYear();
    return this.http.get(this.harvestDailyUrl + dayOfYearAndYearUrlPart, { withCredentials: true })
      .map(response => response.json())
      .map(json => json.day_entries)
      .map(day_entries => day_entries
        .map(day_entry => new HarvestEntry(day_entry)));
  }

  private ensureUrlsAreSet(){
    if(!this.urlsAreSet){
      this.harvestDailyUrl = environment.harvestBaseUrl + "daily/";
      this.urlsAreSet = true;
    }
  }

}
