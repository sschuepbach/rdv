import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  FacetOperatorChanged,
  FilterValueChanged,
  FormActionTypes,
  RangeBoundariesChanged,
  RangeReset,
  ResetRange,
  SearchFieldTypeUpdated,
  SearchFieldValueUpdated,
  SerializedFormDataLoaded,
  ToggleFilterValue,
  UpdateEntireForm,
  UpdateFacetOperator,
  UpdateRangeBoundaries,
  UpdateSearchFieldType,
  UpdateSearchFieldValue
} from '../actions/form.actions';
import { flatMap } from 'rxjs/operators';
import { MakeRequest } from '../actions/query.actions';

@Injectable()
export class FormEffects {

  @Effect()
  serializedFormDataLoaded$ = this.actions$
    .pipe(
      ofType(FormActionTypes.SerializedFormDataLoaded),
      flatMap((x: SerializedFormDataLoaded) => [
        new UpdateEntireForm(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  filterValueChanged$ = this.actions$
    .pipe(
      ofType(FormActionTypes.FilterValueChanged),
      flatMap((x: FilterValueChanged) => [
        new ToggleFilterValue(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  searchFieldTypeUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.SearchFieldTypeUpdated),
      flatMap((x: SearchFieldTypeUpdated) => [
        new UpdateSearchFieldType(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  searchFieldValueUpdated$ = this.actions$
    .pipe(
      ofType(FormActionTypes.SearchFieldValueUpdated),
      flatMap((x: SearchFieldValueUpdated) => [
        new UpdateSearchFieldValue(x.payload),
        new MakeRequest(),
      ])
    );

  @Effect()
  facetOperatorChanged$ = this.actions$
    .pipe(
      ofType(FormActionTypes.FacetOperatorChanged),
      flatMap((x: FacetOperatorChanged) => [
        new UpdateFacetOperator(x.payload),
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
