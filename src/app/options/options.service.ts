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

  public loadOptionsToEnvironmentAndCheckPermissions(callback : () => void){
    chrome.storage.sync.get({
      jiraBaseUrl : null
    }, (items) => {
      if(items['jiraBaseUrl'] == null){
        console.debug("jiraBaseUrl was not defined in storage -> redirect to options page");
        chrome.runtime.openOptionsPage();
      } else {
        environment.jiraBaseUrl = items['jiraBaseUrl'];
        console.debug("jiraBaseUrl " + environment.jiraBaseUrl + " was found in chrome storage.");

        chrome.permissions.contains({
          origins: [
            environment.harvestBaseUrl,
            environment.jiraBaseUrl]
        }, (granted) => {
          if (granted) {
            this.zone.run(() => {
              callback();
            });
          } else {
            chrome.runtime.openOptionsPage();
          }
        });
      }
    });
  }

  public saveSettingsAndRequestPermissions(jiraBaseUrl: string) : void{
    console.debug("Trying to save " + environment.harvestBaseUrl + " and " + jiraBaseUrl);
    chrome.permissions.request({
      origins: [
        environment.harvestBaseUrl,
        jiraBaseUrl
      ]
    }, (granted) => {
      if (granted) {
        console.debug("Did get permission to save " + environment.harvestBaseUrl + " and " + jiraBaseUrl);
        chrome.storage.sync.set({
          jiraBaseUrl: jiraBaseUrl
        }, () => {
          this.zone.run(() => {
            this.testHarvestAndJiraUrls(jiraBaseUrl);
          });
        });
      } else {
        console.debug("Did not get permission to save " + environment.harvestBaseUrl + " and " + jiraBaseUrl);
        this.zone.run(() => {
          this.alertService.error("The permission for " + environment.harvestBaseUrl + " and " + jiraBaseUrl + " was" +
            " declined. Your settings were not saved. " +
            " Without this permission this plugin will not be able to sync your timesheet.");
        });
      }
    });
  }

  private testHarvestAndJiraUrls(jiraBaseUrl: string){
    console.debug("Testing connection to " + environment.harvestBaseUrl + " and " + jiraBaseUrl);

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
