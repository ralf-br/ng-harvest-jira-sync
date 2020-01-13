import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertService} from "../alert/alert.service";
import {environment} from "../../environments/environment";
import {OptionsService} from "./options.service";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  private harvestBaseUrl : string;
  private harvestBaseUrl_example : string;
  private jiraBaseUrl : string;
  private jiraBaseUrl_example : string;

  //https://regex101.com/r/8aYBuz/3
  private url_pattern = /^((http[s]?):\/\/)([^:\/\s]+)((\/\w+)*\/)\/*$/;

  constructor(private alertService : AlertService,
              private optionsService : OptionsService,
              private zone: NgZone) { }

  ngOnInit() {
    this.alertService.clear();
    this.harvestBaseUrl_example = environment.harvestBaseUrl_example;
    this.jiraBaseUrl_example = environment.jiraBaseUrl_example;

    chrome.storage.sync.get({
      harvestBaseUrl: environment.harvestBaseUrl,
      jiraBaseUrl: environment.jiraBaseUrl
    }, (items) => {
      this.zone.run(() => {
        this.harvestBaseUrl = items['harvestBaseUrl'];
        this.jiraBaseUrl = items['jiraBaseUrl'];
        console.info("Loaded from storage/environment for harvestBaseUrl: " + this.harvestBaseUrl
          + " and jiraBaseUrl: " + this.jiraBaseUrl);
      });
    });
  }

  private saveSettings(){
    this.optionsService.saveSettings(this.harvestBaseUrl, this.jiraBaseUrl);
  }

  private openUrlInNewTab(openUrl :string){
    chrome.tabs.create({url: openUrl});
  }
}
