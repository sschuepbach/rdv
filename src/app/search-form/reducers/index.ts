import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromForm from './form.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRoot from '../../reducers';
import { memoize } from '../../shared/utils';
import * as fromBasket from './basket.reducer';
import * as fromSavedQuery from './saved-query.reducer';


export interface SearchState {
  form: fromForm.State;
  layout: fromLayout.State;
  basket: fromBasket.State;
  savedQuery: fromSavedQuery.State;
}

export interface State extends fromRoot.State {
  search: SearchState;
}

export const reducers: ActionReducerMap<SearchState> = {
  form: fromForm.reducer,
  layout: fromLayout.reducer,
  basket: fromBasket.reducer,
  savedQuery: fromSavedQuery.reducer,
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

export const getRangeValues = createSelector(
  getFormValues,
  (formValues) => formValues.rangeFields,
);

export const getRangeValuesByKey = createSelector(
  getRangeValues,
  (rangeFields) => memoize((key: string) => rangeFields[key]),
);

export const getFacetValues = createSelector(
  getFormValues,
  (formValues) => formValues.facetFields,
);

export const getFacetValuesByKey = createSelector(
  getFacetValues,
  (facetFields) => memoize((key: string) => facetFields[key]),
);

export const getShownFacetOrRange = createSelector(
  getLayout,
  (state) => state.shownFacetOrRange,
);

export const getSearchValues = createSelector(
  getFormValues,
  (formValues) => formValues.searchFields,
);

export const getSearchValuesByKey = createSelector(
  getSearchValues,
  (searchFields) => memoize((key: string) => searchFields[key]),
);

export const getFilterValues = createSelector(
  getFormValues,
  (formValues) => formValues.filterFields,
);

export const getFilterValuesByKey = createSelector(
  getFilterValues,
  (filters) => memoize((key: string) => filters[key])
);

export const getBaskets = createSelector(
  getSearch,
  (state) => state.basket,
);

export const getBasketCount = createSelector(
  getBaskets,
  fromBasket.selectTotal,
);

export const getBasketIds = createSelector(
  getBaskets,
  fromBasket.selectIds,
);

export const getBasketEntities = createSelector(
  getBaskets,
  fromBasket.selectEntities,
);

export const getAllBaskets = createSelector(
  getBaskets,
  fromBasket.selectAll,
);

export const getCurrentBasketId = createSelector(
  getBaskets,
  fromBasket.selectCurrentBasketId,
);

export const getCurrentBasket = createSelector(
  getBasketEntities,
  getCurrentBasketId,
  (entities, id) => entities[id],
);

export const getSavedQueries = createSelector(
  getSearch,
  (state) => state.savedQuery,
);

export const getAllSavedQueries = createSelector(
  getSavedQueries,
  fromSavedQuery.selectAll
);

export const getSavedQueryEntities = createSelector(
  getSavedQueries,
  fromSavedQuery.selectEntities
);

export const getSavedQueriesCount = createSelector(
  getSavedQueries,
  fromSavedQuery.selectTotal,
);
