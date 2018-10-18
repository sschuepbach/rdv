import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';

import * as fromActions from '../actions/user-config.actions';

@Injectable()
export class UserConfigEffects {

  @Effect()
  remoteFilterFieldOptions$ = this.actions$.pipe(
    ofType(fromActions.UserConfigActionTypes.GetRemoteFilterFieldOptions),
    map((action: fromActions.GetRemoteFilterFieldOptions) =>
      this.http.get(action.payload.url)
        .subscribe(
          (res: string) => new fromActions.SetRemoteFilterFieldOptions({filterFieldKey: action.payload.filterFieldKey, option: res}),
          (err) => new fromActions.OptionRetrieveError(err))));

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
