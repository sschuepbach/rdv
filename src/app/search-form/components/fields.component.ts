import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as fromSearch from '../reducers';
import * as fromFormActions from '../actions/form.actions';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-fields',
  template: `
    <div [formGroup]="form" *ngIf="form">
      <div class="h6">Suche</div>

      <div class="input-group searchfieldrow" *ngFor="let fields of formPairs; let i = index;">

        <!-- Auswahl des Suchfeldtyps (Freitext, Titel, Person,...) -->
        <div class="input-group-btn">
          <select class="btn btn-sm" title="Suchfeldtyp" [formControlName]="fields[0]">
            <option *ngFor="let key of (searchFieldsConfig$ | async).options | objectKeys" [value]="key">
              {{(searchFieldsConfig$ | async).options[key]}}
            </option>
          </select>
        </div>

        <!-- Suchfeld -->
        <input class="form-control form-control-sm"
               type="text"
               (keyup.esc)="form.get(fields[1]).setValue('')"
               [formControlName]="fields[1]"
               placeholder="Suchbegriff eingeben">
      </div>
    </div>
  `,
  styles: [`
    .searchfieldrow + .searchfieldrow {
      margin-top: 10px;
    }

    select {
      width: auto;
    }

    .input-group-btn select {
      border-color: #ccc;
    }
  `],
})
export class FieldsComponent {
  searchFieldsConfig$: Observable<any>;
  form: FormGroup;
  formPairs: any[];

  constructor(
    private formBuilder: FormBuilder,
    private rootState: Store<fromRoot.State>,
    private searchState: Store<fromSearch.State>) {
    this.searchFieldsConfig$ = rootState.pipe(select(fromRoot.getSearchFields));
    this.searchFieldsConfig$.subscribe(x => {
      this.createForm(x);
      this.formPairs = Object.keys(this.form.controls).reduce((acc, cur, idx) => {
        if (idx && idx % 2) {
          const lastElem = acc.pop();
          acc.push([lastElem, cur]);
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);
    });
  }

  private createForm(fields: any) {
    if (fields.options && Object.keys(fields.options).length) {
      this.form = this.formBuilder.group({});
    }

    fields.preselect.forEach((field, index) => {
      this.form.addControl('selectSearchField_' + index, this.formBuilder.control(field));
      this.form.addControl('searchField_' + index, this.formBuilder.control(''));
    });

    this.form.valueChanges.subscribe(x => this.searchState.dispatch(new fromFormActions.SearchFieldUpdated(x)));
  }

}
