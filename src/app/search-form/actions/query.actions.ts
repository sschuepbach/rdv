import { Action } from '@ngrx/store';
import { QueryFormat } from '../../shared/models/query-format';

export enum QueryActionTypes {
  MakeSearchRequest = '[Query] Make search request',
  MakeBasketRequest = '[Query] Make basket request',
  SerializeQuery = '[Query] Serialize query',
  ParseQuery = '[Query] Load serialized query',
}

export class MakeSearchRequest implements Action {
  readonly type = QueryActionTypes.MakeSearchRequest;

  constructor(public  payload: any) {
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

export type QueryActions
  = MakeSearchRequest
  | SerializeQuery
  | LoadQuery;
