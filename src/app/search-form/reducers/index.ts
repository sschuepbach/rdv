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
import * as fromDetailedResult from './detailed-basket-result.reducer';


export interface SearchState {
  form: fromForm.State;
  layout: fromLayout.State;
  basket: fromBasket.State;
  savedQuery: fromSavedQuery.State;
  result: fromResult.State;
  facet: fromFacet.State;
  query: fromQuery.State;
  basketResult: fromBasketResult.State;
  detailedResult: fromDetailedResult.State;
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
  detailedResult: fromDetailedResult.reducer,
};


const _getSearch = createFeatureSelector<State, SearchState>('search');


const _getLayout = createSelector(
  _getSearch,
  (state) => state.layout,
);

export const getShownFacetOrRange = createSelector(
  _getLayout,
  (state) => state.shownFacetOrRange,
);


export const getFormValues = createSelector(
  _getSearch,
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

export const getSearchValues = createSelector(
  getFormValues,
  (formValues) => formValues.searchFields,
);

export const getSearchValuesByKey = createSelector(
  getSearchValues,
  (searchFields) => memoize((key: string) => searchFields[key]),
);

const _getFilterValues = createSelector(
  getFormValues,
  (formValues) => formValues.filterFields,
);

export const getFilterValuesByKey = createSelector(
  _getFilterValues,
  (filters) => memoize((key: string) => filters[key])
);


const _getBaskets = createSelector(
  _getSearch,
  (state) => state.basket,
);

export const getBasketCount = createSelector(
  _getBaskets,
  fromBasket.selectTotal,
);

export const getBasketIds = createSelector(
  _getBaskets,
  fromBasket.selectIds,
);

export const getAllBaskets = createSelector(
  _getBaskets,
  fromBasket.selectAll,
);

export const getBasketEntities = createSelector(
  _getBaskets,
  fromBasket.selectEntities,
);

export const getCurrentBasketId = createSelector(
  _getBaskets,
  fromBasket.selectCurrentBasketId,
);

export const getCurrentBasket = createSelector(
  getBasketEntities,
  getCurrentBasketId,
  (entities, id) => entities[id],
);

export const getCurrentBasketElementsCount = createSelector(
  getCurrentBasket,
  (basket) => basket.ids.length,
);


const _getBasketResults = createSelector(
  _getSearch,
  (state) => state.basketResult,
);

export const getAllBasketResults = createSelector(
  _getBasketResults,
  fromBasketResult.selectAll,
);


const _getSavedQueries = createSelector(
  _getSearch,
  (state) => state.savedQuery,
);

export const getAllSavedQueries = createSelector(
  _getSavedQueries,
  fromSavedQuery.selectAll
);

export const getSavedQueryEntities = createSelector(
  _getSavedQueries,
  fromSavedQuery.selectEntities
);

export const getSavedQueriesCount = createSelector(
  _getSavedQueries,
  fromSavedQuery.selectTotal,
);


const _getFacetCounts = createSelector(
  _getSearch,
  (search) => search.facet,
);

const _getFacetFieldCount = createSelector(
  _getFacetCounts,
  (facetCount) => facetCount.facetFields,
);

export const getFacetFieldCountByKey = createSelector(
  _getFacetFieldCount,
  (facetCounts) => memoize((key: string) => facetCounts[key])
);

export const getFacetRangeCount = createSelector(
  _getFacetCounts,
  (facetCount) => facetCount.facetRanges,
);

export const getFacetQueryCount = createSelector(
  _getFacetCounts,
  (facetCount) => facetCount.facetQueries,
);

export const getTotalResultsCount = createSelector(
  _getFacetCounts,
  (facetCount) => facetCount.total,
);


const _getResults = createSelector(
  _getSearch,
  (search) => search.result,
);

export const getAllResults = createSelector(
  _getResults,
  fromResult.selectAll,
);


const _getQueryParams = createSelector(
  _getSearch,
  (search) => search.query,
);

export const getResultOffset = createSelector(
  _getQueryParams,
  (queryParams) => queryParams.offset,
);

export const getResultSortField = createSelector(
  _getQueryParams,
  (queryParams) => queryParams.sortField,
);

export const getResultSortOrder = createSelector(
  _getQueryParams,
  (queryParams) => queryParams.sortOrder,
);

export const getCombinedQuery = createSelector(
  getFacetValues,
  getRangeValues,
  getSearchValues,
  _getFilterValues,
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


const _getDetailedResults = createSelector(
  _getSearch,
  (state) => state.detailedResult,
);

export const getDetailedResultsIds = createSelector(
  _getDetailedResults,
  fromDetailedResult.selectIds,
);

export const getAllDetailedResults = createSelector(
  _getDetailedResults,
  fromDetailedResult.selectEntities,
);
