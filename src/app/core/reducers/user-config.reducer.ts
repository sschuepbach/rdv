import { UserConfigActions, UserConfigActionTypes } from '../actions/user-config.actions';
import { environment } from '../../../environments/environment';
import { mergeDeep } from '../../shared/utils';

// FIXME: Adjust reducer to only handle dynamic filter settings changes

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

/**
 * @ignore
 */
export function reducer(state = initialState, action: UserConfigActions): State {
  switch (action.type) {

    case UserConfigActionTypes.SetRemoteFilterFieldOptions:
      return mergeDeep(state, setFilterOption(action.payload.key, action.payload.value));

    case UserConfigActionTypes.OptionRetrieveError:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
