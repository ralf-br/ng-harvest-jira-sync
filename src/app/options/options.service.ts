/// <reference types="chrome"/>

import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {AlertService} from "../alert/alert.service";
import {HarvestService} from "../timesheet/service/harvest.service";
import {JiraService} from "../timesheet/service/jira.service";

@Injectable()
export class OptionsService {

  constructor(private zone: NgZone,
              private alertService: AlertService,
              private harvestService: HarvestService,
              private jiraService: JiraService) { }

  public loadOptionsToEnvironment(callback : () => void){
    chrome.storage.sync.get({
      harvestBaseUrl : null,
      jiraBaseUrl : null
    }, (items) => {
      if(items['harvestBaseUrl'] == null || items['jiraBaseUrl'] == null){
        console.debug("harvestBaseUrl and/or jiraBaseUrl was not defined in storage -> redirect to options page");
        chrome.runtime.openOptionsPage();
      } else {
        environment.harvestBaseUrl = items['harvestBaseUrl'];
        environment.jiraBaseUrl = items['jiraBaseUrl'];
        console.debug("harvestBaseUrl " +  + environment.harvestBaseUrl + " and jiraBaseUrl " + environment.jiraBaseUrl + " were found in storage or environment.");

        this.zone.run(() => {
          callback();
        });
      }
    });
  }

  public saveSettings(harvestBaseUrl: string, jiraBaseUrl: string) : void{
    console.debug("Trying to save " + harvestBaseUrl + " and " + jiraBaseUrl);
    chrome.permissions.request({
      origins: [
        harvestBaseUrl,
        jiraBaseUrl
      ]
    }, (granted) => {
      if (granted) {
        console.debug("Did get permission to save " + harvestBaseUrl + " and " + jiraBaseUrl);
        chrome.storage.sync.set({
          harvestBaseUrl: harvestBaseUrl,
          jiraBaseUrl: jiraBaseUrl
        }, () => {
          this.zone.run(() => {
            this.testHarvestAndJiraUrls(harvestBaseUrl, jiraBaseUrl);
          });
        });
      } else {
        console.debug("Did not get permission to save " + harvestBaseUrl + " and " + jiraBaseUrl);
        this.zone.run(() => {
          this.alertService.error("The permission for " + harvestBaseUrl + " and " + jiraBaseUrl + " was" +
            " declined. Your settings were not saved. " +
            " Without this permission this plugin will not be able to sync your timesheet.");
        });
      }
    });
  }

  private testHarvestAndJiraUrls(harvestBaseUrl: string, jiraBaseUrl: string){
    console.debug("Testing connection to " + harvestBaseUrl + " and " + jiraBaseUrl);

    environment.harvestBaseUrl = harvestBaseUrl;
    environment.jiraBaseUrl = jiraBaseUrl;

    this.jiraService.loadMyJiraAccount()
    .subscribe(
        jiraAccount => {
          this.harvestService.loadMyHarvestAccount()
            .subscribe(
              harvestAccount => this.alertService.success("Saved urls & tested connection successfully. You can now" +
                " start syncing :-)\n" +
                "Jira Account email: '" + jiraAccount.emailAddress + "'\n" +
                "Harvest Account email: '" + harvestAccount.email + "'"),
              error => this.alertService.info("Saved urls successfully but testing the Harvest connection failed.", error)
            )
        },
        error => this.alertService.info("Saved urls successfully but testing the JIRA connection failed.", error)
    );
  }
}
