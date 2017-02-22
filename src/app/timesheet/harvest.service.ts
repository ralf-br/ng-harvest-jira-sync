import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class HarvestService {
  private harvestBaseUrl = "https://deviceinsight.harvestapp.com/";
  private harvestDailyUrl = this.harvestBaseUrl + "daily";

  constructor(private http:Http) { }

  loadTodaysHarvestEntries(): Observable<Response> {
    return this.http.get(this.harvestDailyUrl, { withCredentials: true });
  }




}
