import { Action } from '@ngrx/store';

export enum QueryActionTypes {
  MakeSearchRequest = '[Query] Make search request',
  MakeBasketRequest = '[Query] Make basket request',
  SetOffset = '[Query] Set offset of result view',
  SetSortField = '[Query] Set sort field',
  SetSortOrder = '[Query] Set sort order',
  SearchSuccess = '[Query] Search successful',
  SearchFailure = '[Query] Search failed',
}

export class MakeSearchRequest implements Action {
  readonly type = QueryActionTypes.MakeSearchRequest;

  constructor(public payload: any) {
  }
}

export class MakeBasketRequest implements Action {
  readonly type = QueryActionTypes.MakeBasketRequest;

  constructor(public payload: any) {
  }
}

export class SetOffset implements Action {
  readonly type = QueryActionTypes.SetOffset;

  constructor(public payload: number) {
  }
}

export class SetSortOrder implements Action {
  readonly type = QueryActionTypes.SetSortOrder;

  constructor(public payload: string) {
  }
}

export class SetSortField implements Action {
  readonly type = QueryActionTypes.SetSortField;

  constructor(public payload: string) {
  }
}

export class SearchSuccess implements Action {
  readonly type = QueryActionTypes.SearchSuccess;

  constructor(public payload: any) {
  }
}

export class SearchFailure implements Action {
  readonly type = QueryActionTypes.SearchFailure;

  constructor(public payload: string) {
  }
}

export type QueryActions
  = MakeSearchRequest
  | SetOffset
  | SetSortField
  | SetSortOrder
  | SearchSuccess
  | SearchFailure;
