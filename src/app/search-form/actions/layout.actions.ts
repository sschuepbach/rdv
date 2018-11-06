import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ShowFacetOrRange = '[Layout] Show Facet or Range'
}

export class ShowFacetOrRange implements Action {
  readonly type = LayoutActionTypes.ShowFacetOrRange;

  constructor(public payload: string) {
  }
}

export type LayoutActions = ShowFacetOrRange;
