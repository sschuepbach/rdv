import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Result} from '../models/result.model';
import {ResultActions, ResultActionTypes} from '../actions/result.actions';

export interface State extends EntityState<Result> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Result> = createEntityAdapter<Result>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state = initialState,
  action: ResultActions
): State {
  switch (action.type) {
    case ResultActionTypes.AddResult: {
      return adapter.addOne(action.payload.result, state);
    }

    case ResultActionTypes.UpsertResult: {
      return adapter.upsertOne(action.payload.result, state);
    }

    case ResultActionTypes.AddResults: {
      return adapter.addMany(action.payload.results, state);
    }

    case ResultActionTypes.UpsertResults: {
      return adapter.upsertMany(action.payload.results, state);
    }

    case ResultActionTypes.UpdateResult: {
      return adapter.updateOne(action.payload.result, state);
    }

    case ResultActionTypes.UpdateResults: {
      return adapter.updateMany(action.payload.results, state);
    }

    case ResultActionTypes.DeleteResult: {
      return adapter.removeOne(action.payload.id, state);
    }

    case ResultActionTypes.DeleteResults: {
      return adapter.removeMany(action.payload.ids, state);
    }

    case ResultActionTypes.LoadResults: {
      return adapter.addAll(action.payload.results, state);
    }

    case ResultActionTypes.ClearResults: {
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
