import {Action} from '@ngrx/store';
import {QueryFormat} from '../../shared/models/query-format';

export enum QueryActionTypes {
  MakeSearchRequest = '[Query] Make search request',
  MakeBasketRequest = '[Query] Make basket request',
  SerializeQuery = '[Query] Serialize query',
  ParseQuery = '[Query] Load serialized query',
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

export class SerializeQuery implements Action {
  readonly type = QueryActionTypes.SerializeQuery;
}

export class LoadQuery implements Action {
  readonly type = QueryActionTypes.ParseQuery;

  constructor(public payload: { query: QueryFormat }) {
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
  | SerializeQuery
  | LoadQuery
  | SearchSuccess
  | SearchFailure;
