import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {Result} from '../models/result.model';

export enum ResultActionTypes {
  LoadResults = '[Result] Load Results',
  AddResult = '[Result] Add Result',
  UpsertResult = '[Result] Upsert Result',
  AddResults = '[Result] Add Results',
  UpsertResults = '[Result] Upsert Results',
  UpdateResult = '[Result] Update Result',
  UpdateResults = '[Result] Update Results',
  DeleteResult = '[Result] Delete Result',
  DeleteResults = '[Result] Delete Results',
  ClearResults = '[Result] Clear Results'
}

export class LoadResults implements Action {
  readonly type = ResultActionTypes.LoadResults;

  constructor(public payload: { results: Result[] }) {
  }
}

export class AddResult implements Action {
  readonly type = ResultActionTypes.AddResult;

  constructor(public payload: { result: Result }) {
  }
}

export class UpsertResult implements Action {
  readonly type = ResultActionTypes.UpsertResult;

  constructor(public payload: { result: Result }) {
  }
}

export class AddResults implements Action {
  readonly type = ResultActionTypes.AddResults;

  constructor(public payload: { results: Result[] }) {
  }
}

export class UpsertResults implements Action {
  readonly type = ResultActionTypes.UpsertResults;

  constructor(public payload: { results: Result[] }) {
  }
}

export class UpdateResult implements Action {
  readonly type = ResultActionTypes.UpdateResult;

  constructor(public payload: { result: Update<Result> }) {
  }
}

export class UpdateResults implements Action {
  readonly type = ResultActionTypes.UpdateResults;

  constructor(public payload: { results: Update<Result>[] }) {
  }
}

export class DeleteResult implements Action {
  readonly type = ResultActionTypes.DeleteResult;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteResults implements Action {
  readonly type = ResultActionTypes.DeleteResults;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearResults implements Action {
  readonly type = ResultActionTypes.ClearResults;
}

export type ResultActions =
  LoadResults
  | AddResult
  | UpsertResult
  | AddResults
  | UpsertResults
  | UpdateResult
  | UpdateResults
  | DeleteResult
  | DeleteResults
  | ClearResults;
