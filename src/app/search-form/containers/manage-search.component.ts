import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import { UpdateQueryService } from '../services/update-query.service';
import { QueryFormat } from '../../shared/models/query-format';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-manage-search',
  template: `
    <div class="query-overview bg-info text-white p-2 rounded">

      <button class="btn btn-default btn-sm"
              (click)="resetSearch.emit(true)">Neue Suche
      </button>

      <hr>

      <!-- Uebersicht der aktuellen Suchparameter, Link der Suche, Suche speichern -->
      <div class="no-gutters">

        <app-params-set [parentFormGroup]="parentFormGroup"></app-params-set>

        <div class="d-flex no-gutters mh-lh">

          <label>Suche als Link:</label>
          <div class="col">
            Link kopieren
            <app-copy-link
              [data]="query"
              [small]="true">
            </app-copy-link>
          </div>
        </div>

        <app-save-query [parentFormGroup]="parentFormGroup"></app-save-query>

      </div>

      <app-list-saved-queries
        [parentFormGroup]="parentFormGroup">
      </app-list-saved-queries>

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
  @Input() parentFormGroup: FormGroup;
  @Output() resetSearch = new EventEmitter<boolean>();

  query: QueryFormat;
  baseUrl$: Observable<string>;


  constructor(private rootState: Store<fromRoot.State>,
              private updateQueryService: UpdateQueryService) {
    this.baseUrl$ = rootState.pipe(select(fromRoot.getBaseUrl));
    updateQueryService.query$.subscribe(q => this.query = q);
  }
}
