import { Injectable } from '@angular/core';
import { QueryFormat } from '../../models/query-format';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { BackendSearchService } from '../../services/backend-search.service';
import { UserConfigService } from '../../services/user-config.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateQueryService {

  private complexSearchTermsSource: BehaviorSubject<QueryFormat>;
  complexSearchTerms$: Observable<any>;
  queryFormat: QueryFormat;

  constructor(private backendSearchService: BackendSearchService,
              private userConfigService: UserConfigService) {
    this.queryFormat = userConfigService.getQueryFormat();
  }

  getData() {
    if (this.complexSearchTermsSource) {
      this.complexSearchTermsSource.next(this.queryFormat);
    } else {
      this.complexSearchTermsSource = new BehaviorSubject<QueryFormat>(this.queryFormat);
      this.complexSearchTerms$ = this.complexSearchTermsSource
        .switchMap((query: QueryFormat) => this.backendSearchService.getBackendDataComplex(query));
    }
  }
}
