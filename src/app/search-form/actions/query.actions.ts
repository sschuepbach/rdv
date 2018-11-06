import { Action } from '@ngrx/store';
import { QueryFormat } from '../../shared/models/query-format';

export enum QueryActionTypes {
  MakeRequest = '[Query] Make request',
  SerializeQuery = '[Query] Serialize query',
  ParseQuery = '[Query] Load serialized query',
}

export class MakeRequest implements Action {
  readonly type = QueryActionTypes.MakeRequest;
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
  = MakeRequest
  | SerializeQuery
  | LoadQuery;
