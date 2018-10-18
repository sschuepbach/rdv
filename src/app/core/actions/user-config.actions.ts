import { Action } from '@ngrx/store';

export enum UserConfigActionTypes {
  SetTableFieldsDisplayExtraInfo = '[UserConfig] Set Field TableFieldsDisplayExtraInfo',
  SetTableFieldsDisplayLandingpage = '[UserConfig] Set Field TableFieldsDisplayLandingpage',
  GetRemoteFilterFieldOptions = '[UserConfig] Get Remote Filter Field Options',
  SetRemoteFilterFieldOptions = '[UserConfig] Set Remote Filter Field Options',
  OptionRetrieveError = '[UserConfig] Option Retrieve Error',
}


export class TableFieldsDisplayExtraInfo implements Action {
  readonly type = UserConfigActionTypes.SetTableFieldsDisplayExtraInfo;

  constructor(public payload = true) {
  }
}

export class TableFieldsDisplayLandingpage implements Action {
  readonly type = UserConfigActionTypes.SetTableFieldsDisplayLandingpage;

  constructor(public payload = true) {
  }
}

export class GetRemoteFilterFieldOptions implements Action {
  readonly type = UserConfigActionTypes.GetRemoteFilterFieldOptions;

  constructor(public payload: { filterFieldKey: string, url: string }) {
  }
}

export class SetRemoteFilterFieldOptions implements Action {
  readonly type = UserConfigActionTypes.SetRemoteFilterFieldOptions;

  constructor(public payload: { filterFieldKey: string, option: string }) {
  }
}

export class OptionRetrieveError implements Action {
  readonly type = UserConfigActionTypes.OptionRetrieveError;

  constructor(public payload: any) {
  }
}


export type UserConfigActions
  = TableFieldsDisplayExtraInfo
  | TableFieldsDisplayLandingpage
  | GetRemoteFilterFieldOptions
  | SetRemoteFilterFieldOptions
  | OptionRetrieveError;
