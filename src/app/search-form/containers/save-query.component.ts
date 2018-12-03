import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as fromSearch from '../reducers';
import * as fromSavedQueryActions from '../actions/saved-query.actions';
import { hashCode } from '../../shared/utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-save-query',
  template: `
    <!-- Block: Suchanfrage speichern -->
    <div class="d-flex no-gutters align-items-start mt-1 mh-lh">

      <label>Suche speichern:</label>
      <div class="col no-gutters d-flex flex-column flex-md-row">

        <!-- Input fuer Namen + Button -->
        <div class="input-group input-group-sm col-8 col-md-4">

          <!-- "UserQuery speichern" Textfeld fuer Name -->
          <input class="form-control"
                 type="text"
                 #saveQueryInput
                 placeholder="Name der Suche">

          <!-- "UserQuery speichern" Button, disabled, wenn Textfeld nicht valide -->
          <span class="input-group-btn">
                <button class="btn btn-primary fa fa-floppy-o"
                        type="button"
                        [disabled]="hasErrors(saveQueryInput.value)"
                        (click)="saveUserQuery(saveQueryInput.value)"></button>
              </span>
        </div>

        <!-- Info bei Fehler im Namensfeld von "UserQuery speichern" -->
        <div class="input-group ml-md-2 mt-1 mt-md-0"
             *ngIf="hasErrors(saveQueryInput.value)">
          <div class="bg-danger px-2 rounded"
               *ngIf="isAmbiguous(saveQueryInput.value)">Name muss eindeutig sein
          </div>
          <div class="bg-danger px-2 rounded"
               *ngIf="!saveQueryInput.value">Name ist Pflichtfeld
          </div>
          <div class="bg-danger px-2 rounded" *ngIf="saveQueryInput.value && saveQueryInput.value.length < 3">
            Mindestlänge 3
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    label {
      margin-bottom: 0;
    }
  `],
})
export class SaveQueryComponent {

  private formValues: any;
  private savedQueries: any[];

  constructor(private searchState: Store<fromSearch.State>) {
    searchState.pipe(select(fromSearch.getFormValues)).subscribe(formValues => this.formValues = formValues);
    searchState.pipe(select(fromSearch.getAllSavedQueries)).subscribe(savedQueries => this.savedQueries = savedQueries);
  }

  saveUserQuery(name: string) {
    this.searchState.dispatch(new fromSavedQueryActions.AddSavedQuery({
      savedQuery: {
        id: hashCode(),
        name: name,
        query: {...this.formValues, queryParams: environment.queryParams},
      }
    }));
  }

  hasErrors(name: string) {
    return this.isAmbiguous(name) || name.length < 3 || !name;
  }

  isAmbiguous(name: string) {
    return this.savedQueries.filter(x => x.name === name).length > 0
  }

}
