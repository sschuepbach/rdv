import { SolrSearchPage } from './app.po';

describe('solr-search App', () => {
  let page: SolrSearchPage;

  beforeEach(() => {
    page = new SolrSearchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
