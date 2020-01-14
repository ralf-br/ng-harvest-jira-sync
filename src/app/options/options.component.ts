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

  harvestBaseUrl : string;
  harvestBaseUrl_example : string;
  jiraBaseUrl : string;
  jiraBaseUrl_example : string;

  //https://regex101.com/r/8aYBuz/3
  url_pattern = /^((http[s]?):\/\/)([^:\/\s]+)((\/\w+)*\/)\/*$/;

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

  saveSettings(){
    this.optionsService.saveSettings(this.harvestBaseUrl, this.jiraBaseUrl);
  }

  openUrlInNewTab(openUrl :string){
    chrome.tabs.create({url: openUrl});
  }
}
