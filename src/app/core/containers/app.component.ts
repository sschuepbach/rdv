import { Component } from "@angular/core";
import { Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import * as fromRoot from '../../reducers';
import * as fromActions from '../actions/user-config.actions';

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet class="no-gutters"></router-outlet>
    <app-footer></app-footer>
  `,
})

export class AppComponent {

  constructor(private rootState: Store<fromRoot.State>) {
    this.initializeUserConfig();
  }

  private initializeUserConfig() {

    //vorhandene Filter dynamisch laden
    for (const key of Object.keys(environment.filterFields)) {
      //Wenn bei Filter eine URL hinterlegt ist, muessen Optionen dynamisch geholt werden
      if (environment.filterFields[key].url) {
        //Optionen per URL holen
        this.rootState.dispatch(
          new fromActions.GetRemoteFilterFieldOptions({filterFieldKey: key, url: environment.filterFields[key].url})
        );
      }
    }
  }

}
