import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromQueryActions from '../actions/query.actions';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BackendSearchService } from '../../shared/services/backend-search.service';


@Injectable()
export class QueryEffects {

  @Effect()
  makeSearchRequest$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.MakeSearchRequest),
    debounceTime(750),
    distinctUntilChanged(),
    // switchMap((query) => this.backendSearchService.getBackendDataComplex(query) ),
  );

  @Effect()
  makeBasketRequest$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.MakeBasketRequest),
    debounceTime(750),
    distinctUntilChanged(),
    //switchMap((query) => this.backendSearchService.getBackendDataBasket(query))
  );

  constructor(private actions$: Actions,
              private backendSearchService: BackendSearchService) {
  }
}
