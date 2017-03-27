import {ApplicationRef, Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable()
export class OptionsService {

  constructor(private zone:NgZone) { }

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
      }
      this.zone.run(() => {
        callback();
      });
    });
  }

}
