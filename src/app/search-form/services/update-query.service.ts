import {Injectable} from '@angular/core';
import {QueryFormat} from '../../shared/models/query-format';
import {Subject} from 'rxjs/Rx';
import {BackendSearchService} from '../../shared/services/backend-search.service';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UpdateQueryService {

  private requestSource = new Subject<QueryFormat>();
  private querySource = new BehaviorSubject<QueryFormat>(new QueryFormat());

  request$ = this.requestSource.asObservable();

  response$;
  query$ = this.querySource.asObservable();

  constructor(private backendSearchService: BackendSearchService) {
    this.query$.subscribe(
      q => this.request(q)
    );
    this.response$ = this.request$
      .switchMap((q: QueryFormat) => this.backendSearchService.getBackendDataComplex(q))
  }

  private request(q: QueryFormat) {
    this.requestSource.next(q);
  }

  updateQuery(q: QueryFormat) {
    this.querySource.next(q);
  }

}
