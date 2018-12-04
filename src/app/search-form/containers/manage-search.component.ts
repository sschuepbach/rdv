import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { select, Store } from '@ngrx/store';

import * as fromSearch from '../reducers';
import * as fromFormActions from '../actions/form.actions';

@Component({
  selector: 'app-manage-search',
  template: `
    <div class="query-overview bg-info text-white p-2 rounded">

      <button class="btn btn-default btn-sm"
              (click)="resetSearch()">Neue Suche
      </button>

      <hr>

      <!-- Uebersicht der aktuellen Suchparameter, Link der Suche, Suche speichern -->
      <div class="no-gutters">

        <app-params-set></app-params-set>

        <div class="d-flex no-gutters mh-lh">

          <label>Suche als Link:</label>
          <div class="col">
            Link kopieren
            <app-copy-link [data]="query$ | async" [small]="true"></app-copy-link>
          </div>
        </div>

        <app-save-query></app-save-query>

      </div>

      <app-list-saved-queries></app-list-saved-queries>

      <hr>

      <app-basket-list></app-basket-list>

    </div>
  `,
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    .query-overview label {
      width: 140px;
    }

    label {
      margin-bottom: 0;
    }
  `],
})
export class ManageSearchComponent {

  query$: Observable<any>;

  constructor(private searchState: Store<fromSearch.State>) {
    this.query$ = searchState.pipe(select(fromSearch.getFormValues));
  }

  resetSearch() {
    this.searchState.dispatch(new fromFormActions.ResetAll());
  }
}
