import { Injectable } from '@angular/core';
import { QueryFormat } from '../../models/query-format';
import { Observable, Subject } from 'rxjs/Rx';
import { BackendSearchService } from '../../services/backend-search.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateQueryService {

  private requestSource = new Subject<QueryFormat>();
  request$: Observable<any> = this.requestSource
    .asObservable()
    .switchMap((q: QueryFormat) => this.backendSearchService.getBackendDataComplex(q));
  queryFormat: QueryFormat;

  constructor(private backendSearchService: BackendSearchService) {
  }

  sendRequest() {
    this.requestSource.next(this.queryFormat);
  }

}
