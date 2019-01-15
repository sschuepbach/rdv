import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {BasketResult} from '../models/basket-result.model';
import {BasketResultActions, BasketResultActionTypes} from '../actions/basket-result.actions';

export interface State extends EntityState<BasketResult> {
  // additional entities state properties
}

export const adapter: EntityAdapter<BasketResult> = createEntityAdapter<BasketResult>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: BasketResultActions
): State {
  switch (action.type) {
    case BasketResultActionTypes.AddBasketResult: {
      return adapter.addOne(action.payload.basketResult, state);
    }

    case BasketResultActionTypes.UpsertBasketResult: {
      return adapter.upsertOne(action.payload.basketResult, state);
    }

    case BasketResultActionTypes.AddBasketResults: {
      return adapter.addMany(action.payload.basketResults, state);
    }

    case BasketResultActionTypes.UpsertBasketResults: {
      return adapter.upsertMany(action.payload.basketResults, state);
    }

    case BasketResultActionTypes.UpdateBasketResult: {
      return adapter.updateOne(action.payload.basketResult, state);
    }

    case BasketResultActionTypes.UpdateBasketResults: {
      return adapter.updateMany(action.payload.basketResults, state);
    }

    case BasketResultActionTypes.DeleteBasketResult: {
      return adapter.removeOne(action.payload.id, state);
    }

    case BasketResultActionTypes.DeleteBasketResults: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case BasketResultActionTypes.LoadBasketResults: {
      return adapter.addAll(action.payload.basketResults, state);
    }

    case BasketResultActionTypes.ClearBasketResults: {
      return adapter.removeAll(state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
