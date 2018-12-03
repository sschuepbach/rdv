import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { SavedQuery } from '../models/saved-query.model';

export enum SavedQueryActionTypes {
  LoadSavedQueries = '[SavedQuery] Load SavedQueries',
  AddSavedQuery = '[SavedQuery] Add SavedQuery',
  UpsertSavedQuery = '[SavedQuery] Upsert SavedQuery',
  AddSavedQueries = '[SavedQuery] Add SavedQueries',
  UpsertSavedQueries = '[SavedQuery] Upsert SavedQueries',
  UpdateSavedQuery = '[SavedQuery] Update SavedQuery',
  UpdateSavedQueries = '[SavedQuery] Update SavedQueries',
  DeleteSavedQuery = '[SavedQuery] Delete SavedQuery',
  DeleteSavedQueries = '[SavedQuery] Delete SavedQueries',
  ClearSavedQueries = '[SavedQuery] Clear SavedQueries',
}

export class LoadSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.LoadSavedQueries;

  constructor(public payload: { savedQueries: SavedQuery[] }) {
  }
}

export class AddSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.AddSavedQuery;

  constructor(public payload: { savedQuery: SavedQuery }) {
  }
}

export class UpsertSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.UpsertSavedQuery;

  constructor(public payload: { savedQuery: SavedQuery }) {
  }
}

export class AddSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.AddSavedQueries;

  constructor(public payload: { savedQueries: SavedQuery[] }) {
  }
}

export class UpsertSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.UpsertSavedQueries;

  constructor(public payload: { savedQueries: SavedQuery[] }) {
  }
}

export class UpdateSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.UpdateSavedQuery;

  constructor(public payload: { savedQuery: Update<SavedQuery> }) {
  }
}

export class UpdateSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.UpdateSavedQueries;

  constructor(public payload: { savedQueries: Update<SavedQuery>[] }) {
  }
}

export class DeleteSavedQuery implements Action {
  readonly type = SavedQueryActionTypes.DeleteSavedQuery;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.DeleteSavedQueries;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearSavedQueries implements Action {
  readonly type = SavedQueryActionTypes.ClearSavedQueries;
}

export type SavedQueryActions =
  LoadSavedQueries
  | AddSavedQuery
  | UpsertSavedQuery
  | AddSavedQueries
  | UpsertSavedQueries
  | UpdateSavedQuery
  | UpdateSavedQueries
  | DeleteSavedQuery
  | DeleteSavedQueries
  | ClearSavedQueries;
