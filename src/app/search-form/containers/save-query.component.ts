import { Component, Input } from '@angular/core';
import { QueriesService } from '../services/queries.service';
import { FormGroup } from '@angular/forms';

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
                 [formControl]="parentFormGroup.get('saveQuery')"
                 type="text"
                 #saveQueryInput
                 placeholder="Name der Suche">

          <!-- "UserQuery speichern" Button, disabled, wenn Textfeld nicht valide -->
          <span class="input-group-btn">
                <button class="btn btn-primary fa fa-floppy-o"
                        type="button"
                        [disabled]="parentFormGroup.controls['saveQuery'].invalid"
                        (click)="saveUserQuery(saveQueryInput.value)"></button>
              </span>
        </div>

        <!-- Info bei Fehler im Namensfeld von "UserQuery speichern" -->
        <div class="input-group ml-md-2 mt-1 mt-md-0"
             *ngIf="parentFormGroup.controls['saveQuery'].errors">
          <div class="bg-danger px-2 rounded"
               *ngIf="parentFormGroup.controls['saveQuery'].errors.uniqueQueryName">Name muss eindeutig sein
          </div>
          <div class="bg-danger px-2 rounded"
               *ngIf="parentFormGroup.controls['saveQuery'].errors.required">Name ist Pflichtfeld
          </div>
          <div class="bg-danger px-2 rounded"
               *ngIf="parentFormGroup.controls['saveQuery'].errors.minlength">Mindestlänge
            {{parentFormGroup.controls['saveQuery'].errors.minlength.requiredLength}}
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

  @Input() parentFormGroup: FormGroup;

  constructor(private queriesService: QueriesService) {
  }

  saveUserQuery(name: string) {
    this.queriesService.save(name);
  }

}
