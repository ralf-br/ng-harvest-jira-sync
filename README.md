# NgHarvestJiraSync

This project was initially generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-beta.32.3.
- Angular-cli must be installed locally to build the project. See also above link.
  - Install npm with `sudo dnf install npm`
  - Install angular-cli with `npm install -g @angular/cli`
  - Build this project with `ng build` - see also below
- all bullet pointed entries here were added to the generated angular README

## Build and Load as Chrome Plugin
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

- the -prod flag is not used so far as there are no environment variables set.
- You can import the content of the `dist/` directory to chrome
  - goto `chrome://extensions/`
  - change to Developer mode
  - Load unpacked extension...
  - select the /dist folder (after calling `ng build`)
  - for reloading the plugin after code changes call `ng build` again and use the reload link in Chrome or `Ctrl+R`

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- This will not allow the app to communicate to JIRA and Harvest for CSRF reasons.
- Instead the app needs to be build and imported as chrome plugin

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.


## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

- no unit tests implemented so far

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

- no e2e tests implemented so far

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
