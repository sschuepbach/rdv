import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter-search',
  template: `
    <div [formGroup]="parentFormGroup">

      <!-- Ueber Filter gehen (z.B. Institionenauswahl, mit/ohne Datei-Auswahl) -->
      <div *ngFor="let filter of mainConfig.filterFields | objectKeys"
           formGroupName="filters"
           class="filterBlock">

        <!-- Name des Filter -->
        <div class="h6">{{mainConfig.filterFields[filter].label}}</div>

        <!-- Auswahlmoeglichkeiten dieses Filters (z.B. [Uni Freiburg, KIT,...]) -->
        <label [formArrayName]="filter"
               class="btn btn-sm btn-outline-primary mr-1"
               [class.active]="filterCheckbox.checked"
               *ngFor="let filter_data of mainConfig.filterFields[filter].options; index as i">

          <!-- Anhak-Symbol -->
          <span class="fa"
                [class.fa-check-circle]="filterCheckbox.checked"
                [class.fa-circle-thin]="!filterCheckbox.checked"></span>

          <!-- Name der Filteroption -->
          <span>{{filter_data.label}}</span>

          <!-- unsichtbare Checkbox -->
          <input class="d-none"
                 #filterCheckbox
                 [formControlName]="i"
                 type="checkbox">
        </label>
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
export class FilterSearchComponent {
  @Input() mainConfig: any;
  @Input() parentFormGroup: FormGroup;
}