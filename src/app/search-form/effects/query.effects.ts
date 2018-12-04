import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as fromQueryActions from '../actions/query.actions';
import * as fromResultActions from '../actions/result.actions';
import * as fromFacetActions from '../actions/facet.actions';
import { catchError, debounceTime, distinctUntilChanged, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { BackendSearchService } from '../../shared/services/backend-search.service';
import { of } from "rxjs";


@Injectable()
export class QueryEffects {

  @Effect()
  makeSearchRequest$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.MakeSearchRequest),
    debounceTime(750),
    distinctUntilChanged(),
    map((action: fromQueryActions.MakeSearchRequest) => action.payload),
    switchMap(query =>
      this.backendSearchService.getBackendDataComplex(query).pipe(
        map(result => new fromQueryActions.SearchSuccess(result)
        ),
        catchError(err => of(new fromQueryActions.SearchFailure(err)))
      )),
  );

  @Effect()
  searchSuccess$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.SearchSuccess),
    map((action: fromQueryActions.SearchSuccess) => action.payload.response),
    flatMap(res => [
      new fromResultActions.AddResults({results: res.docs}),
      new fromFacetActions.UpdateTotal(res.numFound),
      new fromFacetActions.UpdateFacetFields(res.facet_counts ? res.facet_counts.facet_fields : {}),
      new fromFacetActions.UpdateFacetRanges(res.facet_counts ? res.facet_counts.facet_ranges : {}),
      new fromFacetActions.UpdateFacetQueries(res.facet_counts ? res.facet_counts.facet_queries : {})
      ]
    ));

  @Effect()
  searchFailure$ = this.actions$.pipe(
    ofType(fromQueryActions.QueryActionTypes.SearchFailure),
    map((action: fromQueryActions.SearchFailure) => action.payload),
    tap(err => console.log(err)),
    flatMap(() => [
      new fromResultActions.ClearResults(),
      new fromFacetActions.ResetAll(),
    ]),
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
