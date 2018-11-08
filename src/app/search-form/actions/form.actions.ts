import { Action } from '@ngrx/store';

export enum FormActionTypes {
  FiltersUpdated = '[Form] Filter in Form Updated',
  UpdateFilters = '[Form] Update Filter Form Model',
  SearchFieldUpdated = '[Form] Search Field in Form Updated',
  UpdateSearchFields = '[Form] Update Search Field Form Model',
  FacetOperatorChanged = '[Form] Facets Field in Form Updated',
  UpdateFacetOperator = '[Form] Update Facets in Form Model',
  RangeBoundariesChanged = '[Form] Boundaries for range in form changed',
  UpdateRangeBoundaries = '[Form] Set new boundaries for range in form model',
  ResetRange = '[Form] Propagate Reset Ranges',
  RangeReset = '[Form] Reset Ranges in Form Model',
  ShowMissingValuesInRange = '[Form] Toggle Show Missing Values',
}

export class FiltersUpdated implements Action {
  readonly type = FormActionTypes.FiltersUpdated;

  constructor(public payload: any) {
  }
}

export class UpdateFilters implements Action {
  readonly type = FormActionTypes.UpdateFilters;

  constructor(public payload: any) {
  }
}

export class SearchFieldUpdated implements Action {
  readonly type = FormActionTypes.SearchFieldUpdated;

  constructor(public payload: any) {
  }
}

export class UpdateSearchField implements Action {
  readonly type = FormActionTypes.UpdateSearchFields;

  constructor(public payload: any) {
  }
}

export class FacetOperatorChanged implements Action {
  readonly type = FormActionTypes.FacetOperatorChanged;

  constructor(public payload: { facet: string, value: string }) {
  }
}

export class UpdateFacetOperator implements Action {
  readonly type = FormActionTypes.UpdateFacetOperator;

  constructor(public payload: { facet: string, value: string }) {
  }
}

export class RangeBoundariesChanged implements Action {
  readonly type = FormActionTypes.RangeBoundariesChanged;

  constructor(public payload: {
    key: string,
    from: number,
    to: number,
  }) {
  }
}

export class UpdateRangeBoundaries implements Action {
  readonly type = FormActionTypes.UpdateRangeBoundaries;

  constructor(public payload: {
    key: string,
    from: number,
    to: number,
  }) {
  }
}

export class ResetRange implements Action {
  readonly type = FormActionTypes.ResetRange;

  constructor(public payload: string) {
  }
}

export class RangeReset implements Action {
  readonly type = FormActionTypes.RangeReset;

  constructor(public payload: string) {
  }
}

export class ShowMissingValuesInRange implements Action {
  readonly type = FormActionTypes.ShowMissingValuesInRange;

  constructor(public payload: string) {
  }
}


export type FormActions
  = FiltersUpdated
  | UpdateFilters
  | SearchFieldUpdated
  | UpdateSearchField
  | FacetOperatorChanged
  | UpdateFacetOperator
  | RangeBoundariesChanged
  | UpdateRangeBoundaries
  | ResetRange
  | RangeReset
  | ShowMissingValuesInRange;
