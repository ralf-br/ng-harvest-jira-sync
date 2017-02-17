import { NgHarvestJiraSyncPage } from './app.po';

describe('ng-harvest-jira-sync App', () => {
  let page: NgHarvestJiraSyncPage;

  beforeEach(() => {
    page = new NgHarvestJiraSyncPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
