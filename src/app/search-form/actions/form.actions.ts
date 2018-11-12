import { Action } from '@ngrx/store';

export enum FormActionTypes {
  SerializedFormDataLoaded = '[Form] Serialized form data has been loaded',
  UpdateEntireForm = '[Form] Update entire form',
  FilterValueChanged = '[Form] Filter in form changed',
  ToggleFilterValue = '[Form] Toggle filter in form model',
  SearchFieldTypeUpdated = '[Form] Search field type in form updated',
  UpdateSearchFieldType = '[Form] Update search field type in form model',
  SearchFieldValueUpdated = '[Form] Search field value in form updated',
  UpdateSearchFieldValue = '[Form] Update search field value in form model',
  FacetOperatorChanged = '[Form] Facets Field in Form Updated',
  UpdateFacetOperator = '[Form] Update Facets in Form Model',
  RangeBoundariesChanged = '[Form] Boundaries for range in form changed',
  UpdateRangeBoundaries = '[Form] Set new boundaries for range in form model',
  ResetRange = '[Form] Propagate Reset Ranges',
  RangeReset = '[Form] Reset Ranges in Form Model',
  ShowMissingValuesInRange = '[Form] Toggle Show Missing Values',
}

export class SerializedFormDataLoaded implements Action {
  readonly type = FormActionTypes.SerializedFormDataLoaded;

  constructor(public payload: any) {
  }
}

export class UpdateEntireForm implements Action {
  readonly type = FormActionTypes.UpdateEntireForm;

  constructor(public payload: any) {
  }
}

export class FilterValueChanged implements Action {
  readonly type = FormActionTypes.FilterValueChanged;

  constructor(public payload: { filter: string, value: string }) {
  }
}

export class ToggleFilterValue implements Action {
  readonly type = FormActionTypes.ToggleFilterValue;

  constructor(public payload: { filter: string, value: string }) {
  }
}

export class SearchFieldTypeUpdated implements Action {
  readonly type = FormActionTypes.SearchFieldTypeUpdated;

  constructor(public payload: { field: string, type: string }) {
  }
}

export class UpdateSearchFieldType implements Action {
  readonly type = FormActionTypes.UpdateSearchFieldType;

  constructor(public payload: { field: string, type: string }) {
  }
}

export class SearchFieldValueUpdated implements Action {
  readonly type = FormActionTypes.SearchFieldValueUpdated;

  constructor(public payload: { field: string, value: string }) {
  }
}

export class UpdateSearchFieldValue implements Action {
  readonly type = FormActionTypes.UpdateSearchFieldValue;

  constructor(public payload: { field: string, value: string }) {
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
  = SerializedFormDataLoaded
  | UpdateEntireForm
  | FilterValueChanged
  | ToggleFilterValue
  | SearchFieldTypeUpdated
  | UpdateSearchFieldType
  | SearchFieldValueUpdated
  | UpdateSearchFieldValue
  | FacetOperatorChanged
  | UpdateFacetOperator
  | RangeBoundariesChanged
  | UpdateRangeBoundaries
  | ResetRange
  | RangeReset
  | ShowMissingValuesInRange;
