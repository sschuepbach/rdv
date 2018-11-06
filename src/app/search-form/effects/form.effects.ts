import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  FiltersUpdated,
  FormActionTypes,
  RangeBoundariesChanged,
  RangeReset,
  ResetRange,
  SearchFieldUpdated,
  UpdateFacets,
  UpdateFilters,
  UpdateRangeBoundaries,
  UpdateSearchField
} from '../actions/form.actions';
import { flatMap } from 'rxjs/operators';
import { MakeRequest } from '../actions/query.actions';

@Injectable()
export class FormEffects {

  @Effect()
  filtersUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.FiltersUpdated),
      flatMap((x: FiltersUpdated) => [
        new UpdateFilters(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  searchFieldsUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.SearchFieldUpdated),
      flatMap((x: SearchFieldUpdated) => [
        new UpdateSearchField(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  facetsUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.FacetsUpdated),
      flatMap((x: FiltersUpdated) => [
        new UpdateFacets(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  rangesUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.RangeBoundariesChanged),
      flatMap((x: RangeBoundariesChanged) => [
        new UpdateRangeBoundaries(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  rangesReset$ = this.actions$
    .pipe(
      ofType(FormActionTypes.ResetRange),
      flatMap((x: ResetRange) => [
        new RangeReset(x.payload),
        new MakeRequest(),
      ])
    );

  constructor(private actions$: Actions) {
  }
}
