import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromForm from './form.reducer';
import * as fromLayout from './layout.reducer';
import * as fromRoot from '../../reducers';
import {memoize} from '../../shared/utils';
import * as fromBasket from './basket.reducer';
import * as fromSavedQuery from './saved-query.reducer';
import * as fromFacet from './facet.reducer';
import * as fromResult from './result.reducer';
import * as fromQuery from './query.reducer';
import {environment} from '../../../environments/environment';
import * as fromBasketResult from './basket-result.reducer';


export interface SearchState {
  form: fromForm.State;
  layout: fromLayout.State;
  basket: fromBasket.State;
  savedQuery: fromSavedQuery.State;
  result: fromResult.State;
  facet: fromFacet.State;
  query: fromQuery.State;
  basketResult: fromBasketResult.State;
}

export interface State extends fromRoot.State {
  search: SearchState;
}

export const reducers: ActionReducerMap<SearchState> = {
  form: fromForm.reducer,
  layout: fromLayout.reducer,
  basket: fromBasket.reducer,
  savedQuery: fromSavedQuery.reducer,
  result: fromResult.reducer,
  facet: fromFacet.reducer,
  query: fromQuery.reducer,
  basketResult: fromBasketResult.reducer,
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

export const getBasketResults = createSelector(
  getSearch,
  (state) => state.basketResult,
);

export const getAllBasketResults = createSelector(
  getBasketResults,
  fromBasketResult.selectAll,
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

export const getFacetCounts = createSelector(
  getSearch,
  (search) => search.facet,
);

export const getFacetFieldCount = createSelector(
  getFacetCounts,
  (facetCount) => facetCount.facetFields,
);

export const getFacetFieldCountByKey = createSelector(
  getFacetFieldCount,
  (facetCounts) => memoize((key: string) => facetCounts[key])
);

export const getFacetRangeCount = createSelector(
  getFacetCounts,
  (facetCount) => facetCount.facetRanges,
);

export const getFacetQueryCount = createSelector(
  getFacetCounts,
  (facetCount) => facetCount.facetQueries,
);

export const getTotalCount = createSelector(
  getFacetCounts,
  (facetCount) => facetCount.total,
);

export const getResults = createSelector(
  getSearch,
  (search) => search.result,
);

export const getResultIds = createSelector(
  getResults,
  fromResult.selectIds,
);

export const getResultEntities = createSelector(
  getResults,
  fromResult.selectEntities,
);

export const getAllResults = createSelector(
  getResults,
  fromResult.selectAll,
);

export const getResultCount = createSelector(
  getResults,
  fromResult.selectTotal,
);

export const getQueryParams = createSelector(
  getSearch,
  (search) => search.query,
);

export const getResultOffset = createSelector(
  getQueryParams,
  (queryParams) => queryParams.offset,
);

export const getResultSortField = createSelector(
  getQueryParams,
  (queryParams) => queryParams.sortField,
);

export const getResultSortOrder = createSelector(
  getQueryParams,
  (queryParams) => queryParams.sortOrder,
);

export const getCombinedQuery = createSelector(
  getFacetValues,
  getRangeValues,
  getSearchValues,
  getFilterValues,
  getResultOffset,
  getResultSortField,
  getResultSortOrder,
  (facets, ranges, searchFields, filters, offset, sortField, sortOrder) => {
    return {
      facetFields: facets,
      rangeFields: ranges,
      searchFields: searchFields,
      filterFields: filters,
      queryParams: {
        start: offset,
        sortField: sortField,
        sortDir: sortOrder,
        rows: environment.queryParams.rows,
      }
    }
  }
);
