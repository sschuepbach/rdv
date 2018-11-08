import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QueryFormat } from '../../shared/models/query-format';
import { Observable } from 'rxjs/Rx';
import { SliderService } from '../services/slider.service';
import { UpdateQueryService } from '../services/update-query.service';
import { select, Store } from '@ngrx/store';

import * as fromSearch from "../reducers";
import * as fromFormActions from "../actions/form.actions"
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-facets',
  template: `
    <ng-container *ngFor="let key of facetFieldsConfig | objectKeys">
      <!-- DIV pro Facette fuer Facettenwerte -->
      <div *ngIf="(shownFacetOrRange$ | async) === 'facet-pills-' + key"
           [class.active]="facetFieldsConfig[key].order == 1"
           class="tab-pane list-group"
           id="facet-pills-{{key}}"
           role="tabpanel"
           aria-labelledby="'facet-pills-'+key+'-tab'">

        <!-- Select fuer Auswahl wie die Facetten-Werte kombiniert werden sollen (OR vs. AND) -->
        Werte werden per
        <!-- bei mehreren Operatoren ein Select anzeigen, sonst nur den Wert des Operators -->
        <div *ngIf="facetFieldsConfig[key].operators.length > 1;then operatorSelect else singleOperator"></div>

        <!-- Select wie Facettenwerte dieser Facette verknuepft werden sollen -->
        <ng-template #operatorSelect>
          <select title="Verknüpfungsart" class="btn btn-sm" #sel (click)="changeOperator(key, sel.value)">
            <option *ngFor="let operator of facetFieldsConfig[key].operators"
                    [value]="operator" [selected]="operator === (facetFieldByKey$ | async)(key).operator">{{operator}}
            </option>
          </select>
        </ng-template>

        <!-- Anzeige wie Facettenwerte dieser Facetten immer verknupeft werden -->
        <ng-template #singleOperator>{{facetFieldsConfig[key].operator}}</ng-template>

        verküpft

        <!-- Liste der Facettenwerte dieser Facette -->
        <ng-container *ngFor="let value of facets[query.facetFields[key].field]">

          <!-- Facettenwert (z.B. Dissertation) und Anzahl (43) anzeigen und Button zum Auswaehlen anbieten -->
          <button *ngIf="query.facetFields[key].values.indexOf(value[0]) == -1"
                  (click)="selectFacet(key, value[0])"
                  type="button"
                  class="list-group-item list-group-item-action p-1">
                <span class="justify-content-between align-items-center d-flex">
                  <span style="word-break: break-word">{{value[0]}}</span>
                  <span class="badge badge-pill badge-secondary">{{value[1]}}</span>
                </span>
          </button>
        </ng-container>
      </div>
    </ng-container>
  `,
  styles: [`
    select {
      width: auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetsComponent {

  //Facetten (abgeleitet von results)
  facets = {};

  //Daten fuer Slider und Diagrammerzeugunge
  query: QueryFormat;
  facetFieldsConfig: any;
  facetFieldByKey$: Observable<any>;
  private shownFacetOrRange$: Observable<string>;

  constructor(private sliderService: SliderService,
              private updateQueryService: UpdateQueryService,
              private searchState: Store<fromSearch.State>) {
    this.facetFieldsConfig = environment.facetFields;
    this.shownFacetOrRange$ = searchState.pipe(select(fromSearch.getShownFacetOrRange));
    this.facetFieldByKey$ = searchState.pipe(select(fromSearch.getFacetValuesByKey));

    updateQueryService.query$.subscribe(q => this.query = q);
    updateQueryService.response$.subscribe(res => {
      //Facetten-Werte
      this.facets = res.facet_counts.facet_fields;
    });
  }

  //Facette speichern
  selectFacet(field, value) {
    const query = JSON.parse(JSON.stringify(this.query));
    query.facetFields[field]["values"].push(value);
    query.queryParams.start = 0;
    this.updateQueryService.updateQuery(query);
  }

  changeOperator(facet: string, value: string) {
    this.searchState.dispatch(new fromFormActions.FacetOperatorChanged({facet: facet, value: value}));
  }

}
