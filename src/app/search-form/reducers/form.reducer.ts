import { FormActions, FormActionTypes } from '../actions/form.actions';
import { environment } from '../../../environments/environment';

export interface State {
  facetFields: any;
  filterFields: any;
  rangeFields: any;
  searchFields: any;
}

export const initialState: State = {
  facetFields: Object.keys(environment.facetFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.facetFields[k].field,
      values: environment.facetFields[k].values,
      operator: environment.facetFields[k].operator,
    };
    return agg;
  }, {}),
  filterFields: Object.keys(environment.filterFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.filterFields[k].field,
      values: environment.filterFields[k].options.map(x => x.value),
    };
    return agg;
  }, {}),
  rangeFields: Object.keys(environment.rangeFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.rangeFields[k].field,
      min: environment.rangeFields[k].min,
      from: environment.rangeFields[k].from,
      to: environment.rangeFields[k].to,
      max: environment.rangeFields[k].max,
      showMissingValues: environment.rangeFields[k].showMissingValues,
    };
    return agg;
  }, {}),
  searchFields: Object.keys(environment.searchFields).reduce((agg, k) => {
    agg[k] = {
      field: environment.searchFields[k].field,
      value: environment.searchFields[k].value,
    };
    return agg;
  }, {}),
};


export function reducer(state = initialState, action: FormActions): State {
  switch (action.type) {

    case FormActionTypes.UpdateFilters:
      return {
        ...state,
        filterFields: action.payload,
      };

    case FormActionTypes.UpdateSearchFields:
      return {
        ...state,
        searchFields: action.payload,
      };

    case FormActionTypes.UpdateFacets:
      return {
        ...state,
        facetFields: action.payload,
      };

    case FormActionTypes.UpdateRangeBoundaries:
      return {
        ...state,
        rangeFields: Object.keys(state['rangeFields']).reduce((agg, k) => {
          agg[k] = k === action.payload.key ?
            {...state.rangeFields[k], from: action.payload.from, to: action.payload.to} :
            state['rangeFields'][k];
          return agg;
        }, {}),
      };

    case FormActionTypes.ShowMissingValuesInRange:
      return {
        ...state,
        rangeFields: Object.keys(state['rangeFields']).reduce((agg, k) => {
          agg[k] = k === action.payload ?
            {...state.rangeFields[k], showMissingValues: !state.rangeFields[k].showMissingValues} :
            state['rangeFields'][k];
          return agg;
        }, {})
      };

    case FormActionTypes.RangeReset:
      return {
        ...state,
        rangeFields: Object.keys(environment.rangeFields).reduce((agg, k) => {
          agg[k] = action.payload === k ? {
              field: environment.rangeFields[k].field,
              min: environment.rangeFields[k].min,
              from: environment.rangeFields[k].from,
              to: environment.rangeFields[k].to,
              max: environment.rangeFields[k].max,
              showMissingValues: environment.rangeFields[k].showMissingValues,
            } :
            state.rangeFields[k];
          return agg;
        }, {}),
      };

    default:
      return state;
  }
}
