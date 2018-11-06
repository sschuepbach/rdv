import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as fromFormActions from '../actions/form.actions';
import * as fromSearch from '../reducers';
import { UpdateQueryService } from '../services/update-query.service';
import { QueryFormat } from '../../shared/models/query-format';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-filters',
  template: `
    <div [formGroup]="form" *ngIf="form">
      <div *ngFor="let filter of form.controls | objectKeys" class="filterBlock" [formGroupName]="filter">
        <div class="h6">{{filter}}</div>
        <app-option-selector [formControlName]="filterData" [label]="filterData"
                             *ngFor="let filterData of form.get(filter).controls | objectKeys">
        </app-option-selector>
      </div>
    </div>
  `,
  styles: [`
    label {
      margin-bottom: 0;
    }

    .filterBlock + .filterBlock {
      margin-top: 10px;
    }
  `],
})
export class FiltersComponent {
  @Input() filterFieldsOptionsConfig: any;
  @Input() parentFormGroup: FormGroup;

  form: FormGroup;
  private query: QueryFormat;
  filterFieldsByKey$: Observable<(x: any) => any>;
  filterFields$: Observable<any>;


  constructor(private formBuilder: FormBuilder,
              private rootState: Store<fromRoot.State>,
              private searchState: Store<fromSearch.State>,
              private updateQueryService: UpdateQueryService) {
    updateQueryService.query$.subscribe(q => this.query = q);
    this.filterFields$ = rootState.pipe(select(fromRoot.getFilterFields));
    this.filterFields$.subscribe(x => this.createForm(x));
    this.filterFieldsByKey$ = rootState.pipe(select(fromRoot.getFilterFieldsByKey))
  }

  private createForm(filters: any) {
    if (Object.keys(filters).length) {
      this.form = this.formBuilder.group({});
    }

    for (const filter of Object.keys(filters)) {
      //FormGroup anlegen pro Filter (z.B. 1. Filter Institutionsauswahl, 2. Filter mit/ohne Datei-Auswahl)
      this.form.addControl(filter, new FormGroup({}));

      filters[filter].options.forEach(item => {

        (this.form.get(filter) as FormGroup).setControl(item.value, this.formBuilder.control(false));

        // TODO: Method is only needed when loading from URL or localStorage. So move it to respective loader function
        //pruefen, ob Filter im QueryFormat als ausgewaehlt hinterlegt ist
        //const isChecked = this.query.filterFields[filter].values.indexOf(item.value) > -1;
        //FormControl fuer moeligche Filterwerte als Checkbox (z.B. Instiutionen: [UB Freiburg, KIT,...])
        //(this.form.controls[filter] as FormArray).push(this.formBuilder.control(isChecked));

      });
    }

    this.form.valueChanges.subscribe(x => this.searchState.dispatch(new fromFormActions.FiltersUpdated(x)));
  }

  /*  private watchControlForChanges(control: FormControl, filterName: string, index: number) {
      control.valueChanges.subscribe(
        (val: boolean) => {
          this.searchState.dispatch(
            new fromFormActions.FilterFieldUpdated({filterName: filterName, optionIndex: index, value: val})
          );
        }
      )
    }*/

  getValue(filterName: string, optionName: string) {
    return (this.form.get([filterName, optionName]) as FormControl).value;
  }

}
