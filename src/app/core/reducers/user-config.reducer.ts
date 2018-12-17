import { UserConfigActions, UserConfigActionTypes } from '../actions/user-config.actions';
import { environment } from '../../../environments/environment';
import { mergeDeep } from '../../shared/utils';


export interface State {
  production: boolean;
  backend: string;
  baseUrl: string;
  proxyUrl: string;
  searchFields: any;
  filterFields: any;
  facetFields: any;
  rangeFields: any;
  queryParams: any;
  basketConfig: any;
  rowOpts: number[];
  showExportList: any;
  tableFields: any[];
  extraInfos: any;
  error: any;
}


export const initialState: State = {
  ...environment,
  error: '',
};

function setFilterOption(key: string, value: string) {
  const filterFields = {filterFields: {}};
  filterFields[key] = {options: value};
  return filterFields;
}

export function reducer(state = initialState, action: UserConfigActions): State {
  switch (action.type) {

    case UserConfigActionTypes.SetRemoteFilterFieldOptions:
      return mergeDeep(state, setFilterOption(action.payload.filterFieldKey, action.payload.option));

    case UserConfigActionTypes.OptionRetrieveError:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

/*export function createQueryFormat(state: State): QueryFormat {

  //Neues QueryFormat-Geruest erstellen
  const queryFormat = new QueryFormat();

  //Ueber Suchfelder in der Config gehen
  state.searchFields.preselect.forEach((option, index) => {

    //Suchfeld search1, search2,... anlegen
    queryFormat.searchFields["search" + (index + 1)] = {
      "field": option,
      "value": ""
    }
  });

  //Ueber Fitlerfelder in der Config gehen
  for (const key of Object.keys(state.filterFields)) {

    //Filter anlegen in QueryFormat
    queryFormat.filterFields[key] = {
      "field": state.filterFields[key].field,
      "values": []
    }
  }

  //Ueber Facettenfelder in der Config gehen
  for (const key of Object.keys(state.facetFields)) {

    //Facette anlegen in QueryFormat
    queryFormat.facetFields[key] = {
      "field": state.facetFields[key].field,
      "values": [],
      "operator": state.facetFields[key].operator
    }
  }

  //Ueber Rangefelder in der Config gehen
  for (const key of Object.keys(state.rangeFields)) {

    //Range anlegen in QueryFormat
    queryFormat.rangeFields[key] = {
      "field": state.rangeFields[key].field,
      "min": state.rangeFields[key].min,
      "from": state.rangeFields[key].from,
      "to": state.rangeFields[key].to,
      "max": state.rangeFields[key].max,
      "showMissingValues": state.rangeFields[key].showMissingValues
    }
  }

  //QueryParams aus Config laden (z.B. rows, start, sort,...)
  queryFormat.queryParams = state.queryParams;

  //QueryFormat zurueckgeben
  return queryFormat;
}*/
