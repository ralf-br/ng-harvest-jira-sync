import { Injectable } from '@angular/core';
import {HarvestEntry} from "./model/harvest-entry";
import {AlertService} from "../alert/alert.service";
import {Http} from "@angular/http";
import {Stream} from "ts-stream";

@Injectable()
export class HarvestService {
  private harvestBaseUrl = "https://deviceinsight.harvestapp.com/";
  private harvestDailyUrl = this.harvestBaseUrl + "daily";

  constructor(private http:Http,
              private alertService:AlertService) { }

  loadTodaysHarvestEntries(): Promise<HarvestEntry[]> {
    return this.http.get(this.harvestDailyUrl, { withCredentials: true })
      .toPromise()
      .then(response =>
        Stream.from(response.json().day_entries)
          .map(this.buildNewHarvestEntry)
          .toArray())
      .catch(this.handleHarvestError);
  }

  private buildNewHarvestEntry = (json:any) : HarvestEntry => {
    return new HarvestEntry(json);
  }

  private handleHarvestError = (error: any): Promise<any> => {
    console.error('An error occurred getting the timesheet from harvest', error);
    this.alertService.error("Cannot get Harvest Timesheet - are you logged in?");
    return Promise.reject(error.message || error);
  }
}
