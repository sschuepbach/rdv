import { TestBed, inject } from '@angular/core/testing';

import { SolrSearchProxyService } from './solr-search-proxy.service';

describe('SolrSearchProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolrSearchProxyService]
    });
  });

  it('should be created', inject([SolrSearchProxyService], (service: SolrSearchProxyService) => {
    expect(service).toBeTruthy();
  }));
});
