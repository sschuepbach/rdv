import { Component, Input } from '@angular/core';
import { QueriesService } from '../services/queries.service';
import { QueriesStoreService } from '../services/queries-store.service';
import { FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-list-saved-queries',
  template: `
    <hr *ngIf="getSavedQueries().length">
    <div class="mt-2" *ngIf="getSavedQueries().length">
      <div class="h6">Meine Suchen</div>
      <div class="no-gutters">
        <div *ngFor="let savedQuery of getSavedQueries(); index as i"
             class="input-group input-group-sm col-md-6 mt-1">
      <span class="input-group-btn">
              <button class="btn btn-primary fa fa-play"
                      type="button"
                      (click)="loadUserQuery(i)">
              </button>
            </span>
          <input type="text"
                 class="form-control"
                 disabled
                 title="Name der Query"
                 [value]=savedQuery.name>
          <span class="input-group-btn">
              <app-copy-link
                [baseUrl]="baseUrl$ | async"
                [data]="savedQuery.query">
              </app-copy-link>
            </span>
          <span class="input-group-btn">
              <button class="btn btn-danger fa fa-trash"
                      type="button"
                      (click)="deleteUserQuery(i)"></button>
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-group-btn select {
      border-color: #ccc;
    }
  `],
})
export class ManageSavedQueriesComponent {

  @Input() parentFormGroup: FormGroup;
  baseUrl$: Observable<string>;

  constructor(private queriesService: QueriesService,
              private queriesStoreService: QueriesStoreService,
              private rootState: Store<fromRoot.State>) {
    this.baseUrl$ = rootState.pipe(select(fromRoot.getBaseUrl));
  }

  loadUserQuery(index: number) {
    this.queriesService.load(index);
  }

  deleteUserQuery(index: number) {
    this.queriesService.delete(index);
  }

  getSavedQueries() {
    return this.queriesStoreService.savedQueries;
  }

}
