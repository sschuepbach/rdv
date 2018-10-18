import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-free-text-search',
  template: `
    <div [formGroup]="parentFormGroup">
      <div class="h6">Suche</div>

      <div class="input-group searchfieldrow"
           *ngFor="let field of searchFields | objectKeys">

        <!-- Auswahl des Suchfeldtyps (Freitext, Titel, Person,...) -->
        <div class="input-group-btn">
          <select class="btn btn-sm" title="Suchfeldtyp"
                  [formControlName]="'selectSearchField_' + field">
            <option *ngFor="let key of searchFieldsOptionsConfig | objectKeys"
                    [value]="key">{{searchFieldsOptionsConfig[key]}}
            </option>
          </select>
        </div>

        <!-- Suchfeld -->
        <input class="form-control form-control-sm"
               type="text"
               (keyup.esc)="parentFormGroup.controls['searchField_' + field].setValue('')"
               [formControlName]="'searchField_' + field"
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
export class FreeTextSearchComponent {
  @Input() searchFieldsOptionsConfig: any;
  @Input() parentFormGroup: FormGroup;
  @Input() searchFields: any;
}
