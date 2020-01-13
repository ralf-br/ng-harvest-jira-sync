# NgHarvestJiraSync

## Chrome Webstore
The latest release version can be found in the chrome webstore.
https://chrome.google.com/webstore/detail/harvest-%3E-jira-sync/imogkeoglmoaghpegcmghjicbdgbahio

## Preparation for local build
This project was initially generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.2.
- Angular-cli must be installed locally to build the project. See also above link.
  - Install node/npm
  - Install angular-cli globally with `npm install -g @angular/cli`
  - Install node dependencies `npm install`
  - Build this project with `ng build` - see also below

## Build locally and load as Chrome Plugin
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

- You can import the content of the `dist/` directory to chrome
  - goto `chrome://extensions/`
  - change to Developer mode
  - Load unpacked extension...
  - select the `/dist` folder (after calling `ng build`)
  - for reloading the plugin after code changes just call `ng build` - chrome automatically detects changes

## Build release package
Building the actual release zip file is automated with GithubActions - see .github/workflows/build.yml for details

Example release of version 0.6.0:
- create release branch: git checkout -b "release/0.6.0"
- set release version in manifest.json
  - first digit - x: major release
  - second digit - y: feature release
  - third digit - z: bug fix release
  - firth digit: NOT used. Only set while development to "999" meaning "-SNAPSHOPT"
- make relevant updates of description and screenshots for the chrome webstore in src/assets_notInDist
  - screenshot needs to be 1280x800px .png
  - scale smaller screenshot via gimp to 1280px width
- commit changes: git commit -am "release 0.6.0"
- tag release: git tag 0.6.0
- push remote: git push --set-upstream origin release/0.6.0 --tags
- pull request to master branch on github
- wait for GitHub Actions pipeline and accept pull request
- goto https://github.com/mineralf/ng-harvest-jira-sync/tags and manually create a Release with release notes
- download zip file from the artifact in the pipeline
- upload zip file via https://chrome.google.com/webstore/developer/dashboard
  - update description and screenshot if relevant
- change manifest.json in release/0.6.0 to next feature release version plus .999 (SNAPSHOT) -> 0.7.0.999
- commit changes: git commit -ad "snapshot 0.7.0.999"
- push: git push
- pull request to develop branch on github - accept it

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## The Following Local Server & Tests are not used

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- This will not allow the app to communicate to JIRA and Harvest for CSRF reasons.
- (!) Instead the app needs to be build using `ng build` and imported as chrome plugin

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

- (!) no unit tests implemented so far

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

- (!) no e2e tests implemented so far
