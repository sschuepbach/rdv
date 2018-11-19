import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UpdateQueryService } from '../services/update-query.service';
import { QueryFormat } from "../../shared/models/query-format";
import * as fromSearch from "../reducers";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../../environments/environment';
import * as fromFormActions from "../actions/form.actions";

@Component({
  selector: 'app-params-set',
  template: `
    <div class="h6">Aktuelle Suche</div>

    <!-- Info "Alle Titel suchen" anzeigen, wenn kein sonstiges Textfeld belegt ist -->
    <div class="d-flex no-gutters mh-lh" *ngIf="searchFieldsAreEmpty">
      <label>Suche:</label>
      <div class="col">alle Titel anzeigen</div>
    </div>

    <div *ngFor="let key of searchFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Wenn in diesem Suchfeld etwas steht -->
      <ng-container *ngIf="(searchFieldByKey$ | async)(key).value.length > 0">

        <!-- Name des ausgewaehlte Suchfelds (Freitext: ) -->
        <label>{{searchFieldsConfig.options[(searchFieldByKey$ | async)(key).field]}}:</label>

        <!-- Suchwert -->
        <div class="col">
          <span>{{(searchFieldByKey$ | async)(key).value}}</span>
          <!-- Undo-Button -->
          <button (click)="resetTerm(key)"
                  class="btn p-1 fa fa-trash"></button>
        </div>
      </ng-container>
    </div>

    <!-- Ausgewaehlte Ranges: Ueber Rangefelder gehen -->
    <div *ngFor="let key of rangeFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Label (Jahr:) -->
      <label>{{rangeFieldsConfig[key].label}}:</label>

      <!-- Div mit aktuellem Wertebereich (1955-1972) -->
      <div class="col">

        <!-- Range-Bereich -->
        <span>{{(rangeFieldByKey$ | async)(key).from}} - {{(rangeFieldByKey$ | async)(key).to}}</span>

        <!-- Reset-Button (Range wieder auf Extrem-Werte setzen) -->
        <button
          *ngIf="(rangeFieldByKey$ | async)(key).from != (rangeFieldByKey$ | async)(key).min ||
           (rangeFieldByKey$ | async)(key).to != (rangeFieldByKey$ | async)(key).max"
          (click)="resetRange(key)"
          class="btn p-1 fa fa-undo"></button>

        <span *ngIf="(rangeFieldByKey$ | async)(key).showMissingValues">
              <span> / auch Einträge ohne {{rangeFieldsConfig[key].label}} anzeigen</span>

          <!-- Undo-Button -->
              <button (click)="toggleShowMissingValues(key)" class="btn p-1 fa fa-trash"></button>
            </span>
      </div>
    </div>

    <!-- Ausgewaehlte Facetenwerte: Ueber Facettenfelder gehen -->
    <div *ngFor="let key of facetFields$ | async | objectKeys"
         class="d-flex no-gutters mh-lh">

      <!-- Wenn es ausgewaehlte Werte dieser Facette gibt -->
      <ng-container *ngIf="(facetFieldByKey$ | async)(key).values.length > 0">

        <!-- Name der Facette (Dokumenttyp: ) -->
        <label>{{facetFieldsConfig[key].label}}:</label>

        <!-- Div mit Werten -->
        <div class="col">

          <!-- Ueber Werte der Facetten gehen -->
          <ng-container *ngFor="let facetVal of (facetFieldByKey$ | async)(key).values; first as first">

            <!-- ab 2. Eintrag Operator ausgeben (... OR eng) -->
            <span *ngIf="!first">{{(facetFieldByKey$ | async)(key).operator}}</span>

            <!-- Facettenwert -->
            <span>{{facetVal}}</span>

            <!-- Remove-Button -->
            <button (click)="removeFacet(key, facetVal)"
                    class="btn p-1 fa fa-trash"></button>
          </ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    label {
      margin-bottom: 0;
    }
  `]
})
export class ParamsSetComponent {

  @Input() parentFormGroup: FormGroup;

  //speichert den Zustand, ob mind. 1 Textsuchfeld nicht leer ist
  searchFieldsAreEmpty = true;
  query: QueryFormat;

  facetFieldsConfig: any;
  rangeFieldsConfig: any;
  searchFieldsConfig: any;

  searchFields$: Observable<any>;
  searchFieldByKey$: Observable<any>;
  rangeFields$: Observable<any>;
  rangeFieldByKey$: Observable<any>;
  facetFields$: Observable<any>;
  facetFieldByKey$: Observable<any>;

  private static checkIfSearchFieldsAreEmpty(fields: any) {
    for (const field of fields) {
      if (field.value) {
        return false;
      }
    }
    return true;
  }

  constructor(public updateQueryService: UpdateQueryService,
              private searchState: Store<fromSearch.State>) {
    updateQueryService.query$.subscribe(q => this.query = q);

    this.searchFields$ = searchState.pipe(select(fromSearch.getSearchValues));
    this.searchFields$.subscribe(fields => this.searchFieldsAreEmpty = ParamsSetComponent.checkIfSearchFieldsAreEmpty(fields));
    this.searchFieldByKey$ = searchState.pipe(select(fromSearch.getSearchValuesByKey));
    this.rangeFields$ = searchState.pipe(select(fromSearch.getRangeValues));
    this.rangeFieldByKey$ = searchState.pipe(select(fromSearch.getRangeValuesByKey));
    this.facetFields$ = searchState.pipe(select(fromSearch.getFacetValues));
    this.facetFieldByKey$ = searchState.pipe(select(fromSearch.getFacetValuesByKey));

    this.facetFieldsConfig = environment.facetFields;
    this.rangeFieldsConfig = environment.rangeFields;
    this.searchFieldsConfig = environment.searchFields;
  }

  //Facette entfernen
  removeFacet(field, value) {

    //Index der ausgewaehlten Facette finden anhand des Namens
    const index = this.query.facetFields[field]["values"].indexOf(value);

    //TODO an Start der Trefferliste springen?

    const query = JSON.parse(JSON.stringify(this.query));
    query.facetFields[field]["values"].splice(index, 1);
    this.updateQueryService.updateQuery(query);
  }

  resetRange(key) {
    this.searchState.dispatch(new fromFormActions.RangeReset(key));
  }

  resetTerm(key) {
    this.searchState.dispatch(new fromFormActions.SearchFieldValueUpdated({field: key, value: ''}));
  }

  toggleShowMissingValues(key) {
    this.searchState.dispatch(new fromFormActions.ShowMissingValuesInRange(key));
  }
}
