import {ApplicationRef, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {AlertService} from "../alert/alert.service";
import {environment} from "../../environments/environment";
import {NgForm} from "@angular/forms";

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

  @ViewChild('myForm') myForm;

  constructor(private alertService : AlertService,
              private changeLocal: ChangeDetectorRef,
              private changeGlobal: ApplicationRef,
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

  private saveSettings() : void{
    chrome.permissions.request({
      origins: [
        this.harvestBaseUrl,
        this.jiraBaseUrl
      ]
    }, (granted) => {
      if (granted) {
        chrome.storage.sync.set({
            harvestBaseUrl: this.harvestBaseUrl,
            jiraBaseUrl: this.jiraBaseUrl
        }, () => {
          this.alertService.success("Your settings were saved. You can now close the configuration and start syncing" +
            " your timesheet entries!");
          this.changeGlobal.tick();
          }
        );
      } else {
        this.alertService.error("The permission for " + this.harvestBaseUrl + " and " + this.jiraBaseUrl + " was" +
          " declined. Your settings were not saved. " +
          " Without this permission this plugin will not be able to sync your timesheet.");
        this.changeGlobal.tick();
      }
    });
  }

}
