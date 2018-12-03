import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { SavedQuery } from '../models/saved-query.model';
import { SavedQueryActions, SavedQueryActionTypes } from '../actions/saved-query.actions';

export interface State extends EntityState<SavedQuery> {
}

export const adapter: EntityAdapter<SavedQuery> = createEntityAdapter<SavedQuery>();

export const initialState: State = adapter.getInitialState({});

export function reducer(
  state = initialState,
  action: SavedQueryActions
): State {
  switch (action.type) {
    case SavedQueryActionTypes.AddSavedQuery: {
      return adapter.addOne(action.payload.savedQuery, state);
    }

    case SavedQueryActionTypes.UpsertSavedQuery: {
      return adapter.upsertOne(action.payload.savedQuery, state);
    }

    case SavedQueryActionTypes.AddSavedQueries: {
      return adapter.addMany(action.payload.savedQueries, state);
    }

    case SavedQueryActionTypes.UpsertSavedQueries: {
      return adapter.upsertMany(action.payload.savedQueries, state);
    }

    case SavedQueryActionTypes.UpdateSavedQuery: {
      return adapter.updateOne(action.payload.savedQuery, state);
    }

    case SavedQueryActionTypes.UpdateSavedQueries: {
      return adapter.updateMany(action.payload.savedQueries, state);
    }

    case SavedQueryActionTypes.DeleteSavedQuery: {
      return adapter.removeOne(action.payload.id, state);
    }

    case SavedQueryActionTypes.DeleteSavedQueries: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case SavedQueryActionTypes.LoadSavedQueries: {
      return adapter.addAll(action.payload.savedQueries, state);
    }

    case SavedQueryActionTypes.ClearSavedQueries: {
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
