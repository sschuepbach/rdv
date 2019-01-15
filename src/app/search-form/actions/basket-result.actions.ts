import {Action} from '@ngrx/store';
import {Update} from '@ngrx/entity';
import {BasketResult} from '../models/basket-result.model';

export enum BasketResultActionTypes {
  LoadBasketResults = '[BasketResult] Load BasketResults',
  AddBasketResult = '[BasketResult] Add BasketResult',
  UpsertBasketResult = '[BasketResult] Upsert BasketResult',
  AddBasketResults = '[BasketResult] Add BasketResults',
  UpsertBasketResults = '[BasketResult] Upsert BasketResults',
  UpdateBasketResult = '[BasketResult] Update BasketResult',
  UpdateBasketResults = '[BasketResult] Update BasketResults',
  DeleteBasketResult = '[BasketResult] Delete BasketResult',
  DeleteBasketResults = '[BasketResult] Delete BasketResults',
  ClearBasketResults = '[BasketResult] Clear BasketResults'
}

export class LoadBasketResults implements Action {
  readonly type = BasketResultActionTypes.LoadBasketResults;

  constructor(public payload: { basketResults: BasketResult[] }) {
  }
}

export class AddBasketResult implements Action {
  readonly type = BasketResultActionTypes.AddBasketResult;

  constructor(public payload: { basketResult: BasketResult }) {
  }
}

export class UpsertBasketResult implements Action {
  readonly type = BasketResultActionTypes.UpsertBasketResult;

  constructor(public payload: { basketResult: BasketResult }) {
  }
}

export class AddBasketResults implements Action {
  readonly type = BasketResultActionTypes.AddBasketResults;

  constructor(public payload: { basketResults: BasketResult[] }) {
  }
}

export class UpsertBasketResults implements Action {
  readonly type = BasketResultActionTypes.UpsertBasketResults;

  constructor(public payload: { basketResults: BasketResult[] }) {
  }
}

export class UpdateBasketResult implements Action {
  readonly type = BasketResultActionTypes.UpdateBasketResult;

  constructor(public payload: { basketResult: Update<BasketResult> }) {
  }
}

export class UpdateBasketResults implements Action {
  readonly type = BasketResultActionTypes.UpdateBasketResults;

  constructor(public payload: { basketResults: Update<BasketResult>[] }) {
  }
}

export class DeleteBasketResult implements Action {
  readonly type = BasketResultActionTypes.DeleteBasketResult;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteBasketResults implements Action {
  readonly type = BasketResultActionTypes.DeleteBasketResults;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearBasketResults implements Action {
  readonly type = BasketResultActionTypes.ClearBasketResults;
}

export type BasketResultActions =
  LoadBasketResults
  | AddBasketResult
  | UpsertBasketResult
  | AddBasketResults
  | UpsertBasketResults
  | UpdateBasketResult
  | UpdateBasketResults
  | DeleteBasketResult
  | DeleteBasketResults
  | ClearBasketResults;
