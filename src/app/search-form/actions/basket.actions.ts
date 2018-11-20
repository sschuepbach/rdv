import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Basket } from '../models/basket.model';

export enum BasketActionTypes {
  LoadBaskets = '[Basket] Load Baskets',
  AddBasket = '[Basket] Add Basket',
  UpsertBasket = '[Basket] Upsert Basket',
  AddBaskets = '[Basket] Add Baskets',
  UpsertBaskets = '[Basket] Upsert Baskets',
  UpdateBasket = '[Basket] Update Basket',
  UpdateBaskets = '[Basket] Update Baskets',
  DeleteBasket = '[Basket] Delete Basket',
  DeleteBaskets = '[Basket] Delete Baskets',
  ClearBaskets = '[Basket] Clear Baskets',
  SelectBasket = '[Basket] Select Basket',
}

export class LoadBaskets implements Action {
  readonly type = BasketActionTypes.LoadBaskets;

  constructor(public payload: { baskets: Basket[] }) {
  }
}

export class AddBasket implements Action {
  readonly type = BasketActionTypes.AddBasket;

  constructor(public payload: { basket: Basket }) {
  }
}

export class UpsertBasket implements Action {
  readonly type = BasketActionTypes.UpsertBasket;

  constructor(public payload: { basket: Basket }) {
  }
}

export class AddBaskets implements Action {
  readonly type = BasketActionTypes.AddBaskets;

  constructor(public payload: { baskets: Basket[] }) {
  }
}

export class UpsertBaskets implements Action {
  readonly type = BasketActionTypes.UpsertBaskets;

  constructor(public payload: { baskets: Basket[] }) {
  }
}

export class UpdateBasket implements Action {
  readonly type = BasketActionTypes.UpdateBasket;

  constructor(public payload: { basket: Update<Basket> }) {
  }
}

export class UpdateBaskets implements Action {
  readonly type = BasketActionTypes.UpdateBaskets;

  constructor(public payload: { baskets: Update<Basket>[] }) {
  }
}

export class DeleteBasket implements Action {
  readonly type = BasketActionTypes.DeleteBasket;

  constructor(public payload: { id: string }) {
  }
}

export class DeleteBaskets implements Action {
  readonly type = BasketActionTypes.DeleteBaskets;

  constructor(public payload: { ids: string[] }) {
  }
}

export class ClearBaskets implements Action {
  readonly type = BasketActionTypes.ClearBaskets;
}

export class SelectBasket implements Action {
  readonly type = BasketActionTypes.SelectBasket;

  constructor(public payload: { id: string }) {
  }
}


export type BasketActions =
  LoadBaskets
  | AddBasket
  | UpsertBasket
  | AddBaskets
  | UpsertBaskets
  | UpdateBasket
  | UpdateBaskets
  | DeleteBasket
  | DeleteBaskets
  | ClearBaskets
  | SelectBasket;
