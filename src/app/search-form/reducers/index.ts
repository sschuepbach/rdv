import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromForm from './form.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRoot from '../../reducers';
import { memoize } from '../../shared/utils';


export interface SearchState {
  form: fromForm.State;
  layout: fromLayout.State;
}

export interface State extends fromRoot.State {
  search: SearchState;
}

export const reducers: ActionReducerMap<SearchState> = {
  form: fromForm.reducer,
  layout: fromLayout.reducer,
};

export const getSearch = createFeatureSelector<State, SearchState>('search');

export const getLayout = createSelector(
  getSearch,
  (state) => state.layout,
);

export const getFormValues = createSelector(
  getSearch,
  (state) => state.form,
);

export const getRangesValues = createSelector(
  getFormValues,
  (v) => v.rangeFields,
);

export const getRangeValuesByKey = createSelector(
  getRangesValues,
  (rangeFields) => memoize((key: string) => rangeFields[key]),
);

export const getShownFacetOrRange = createSelector(
  getLayout,
  (state) => state.shownFacetOrRange,
);
