import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromUserConfig from '../core/reducers/user-config.reducer';
import { memoize } from '../shared/utils';


export interface State {
  userConfig: fromUserConfig.State;
}

export const reducers: ActionReducerMap<State> = {
  userConfig: fromUserConfig.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];


export const getUserConfigState = createFeatureSelector<State, fromUserConfig.State>(
  'userConfig'
);

export const getBasketConfig = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.basketConfig,
);

export const getBasketQueryParams = createSelector(
  getBasketConfig,
  (basketConfig) => basketConfig.queryParams,
);

export const getBasketQueryParamsSortField = createSelector(
  getBasketQueryParams,
  (queryParams) => queryParams.sortField
);

export const getBasketQueryParamsSortDir = createSelector(
  getBasketQueryParams,
  (queryParams) => queryParams.sortDir,
);

export const getBasketQueryParamsRows = createSelector(
  getBasketQueryParams,
  (queryParams) => queryParams.rows,
);

export const getBaseUrl = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.baseUrl,
);

export const getQueryParams = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.queryParams,
);

export const getQueryParamsRows = createSelector(
  getQueryParams,
  (queryParams) => queryParams.rows,
);

export const getFacetFields = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.facetFields,
);

export const getFacetFieldsByKey = createSelector(
  getFacetFields,
  (facetFields) => memoize((key: string) => facetFields[key]),
);

export const getFilterFields = createSelector(
  getUserConfigState,
  (userConfig) => userConfig.filterFields,
);

export const getFilterFieldsByKey = createSelector(
  getFilterFields,
  (filterFields) => memoize((key: string) => filterFields[key]),
);
