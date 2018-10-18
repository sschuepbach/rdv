import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import * as fromRoot from '../../reducers';
import { UpdateQueryService } from '../services/update-query.service';
import { QueryFormat } from '../../shared/models/query-format';

@Component({
  selector: 'app-search-params',
  template: `
    <div class="d-flex flex-column flex-md-row no-gutters mt-2">

      <div class="col-md p-2 mr-md-2 mb-2 mb-md-0 d-flex flex-column justify-content-between no-gutters"
           style="border: 1px solid grey; border-radius:3px; margin-right: 20px;">

        <app-free-text-search
          [searchFieldsOptionsConfig]="searchFieldsOptionsConfig$ | async"
          [parentFormGroup]="parentFormGroup"
          [searchFields]="query.searchFields">
        </app-free-text-search>

        <app-filter-search
          [filterFieldsOptionsConfig]="filterFieldsConfig$ | async"
          [parentFormGroup]="parentFormGroup">
        </app-filter-search>

      </div>

      <!-- Facetten/Ranges-Bereich als Tabs (Pills) -->
      <div class="d-flex flex-column p-2 col-md"
           style="border: 1px solid grey; border-radius:3px;">

        <app-visual-search [parentFormGroup]="parentFormGroup">
        </app-visual-search>

      </div>

    </div>
  `
})
export class SearchParamsComponent {
  @Input() parentFormGroup: FormGroup;

  filterFieldsConfig$: Observable<any>;
  searchFieldsOptionsConfig$: Observable<any>;
  query: QueryFormat;

  constructor(private rootState: Store<fromRoot.State>,
              private updateQueryService: UpdateQueryService) {
    this.filterFieldsConfig$ = rootState.pipe(select(fromRoot.getFilterFields));
    this.searchFieldsOptionsConfig$ = rootState.pipe(select(fromRoot.getSearchFieldsOptions));
    updateQueryService.query$.subscribe(q => this.query = q);
  }
}
