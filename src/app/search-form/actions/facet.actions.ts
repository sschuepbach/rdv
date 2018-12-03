import {Action} from '@ngrx/store';

export enum FacetActionTypes {
  ResetAll = '[Facet] Reset all',
  UpdateFacetFields = '[Facet] Update facet fields',
  UpdateFacetRanges = '[Facet] Update facet ranges',
  UpdateFacetQueries = '[Facet] Update facet queries',
}

export class UpdateFacetFields {
  readonly type = FacetActionTypes.UpdateFacetFields;

  constructor(public payload: any) {
  }
}

export class UpdateFacetRanges {
  readonly type = FacetActionTypes.UpdateFacetRanges;

  constructor(public payload: any) {
  }
}

export class UpdateFacetQueries {
  readonly type = FacetActionTypes.UpdateFacetQueries;

  constructor(public payload: any) {
  }
}

export class ResetAll implements Action {
  readonly type = FacetActionTypes.ResetAll;
}

export type FacetActions
  = ResetAll
  | UpdateFacetFields
  | UpdateFacetRanges
  | UpdateFacetQueries;
