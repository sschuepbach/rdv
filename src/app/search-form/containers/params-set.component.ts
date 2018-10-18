import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UpdateQueryService } from '../services/update-query.service';
import { SliderService } from '../services/slider.service';
import { FormService } from '../services/form.service';
import { QueryFormat } from "../../shared/models/query-format";
import * as fromRoot from "../../reducers";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-params-set',
  templateUrl: './params-set.component.html',
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

  rangeFieldsByKey$: Observable<any>;
  searchFieldsOptions$: Observable<any>;
  facetFieldsByKey$: Observable<any>;

  constructor(public updateQueryService: UpdateQueryService,
              private sliderService: SliderService,
              private formService: FormService,
              private rootState: Store<fromRoot.State>) {
    updateQueryService.query$.subscribe(q => this.query = q);
    this.searchFieldsAreEmpty = formService.checkIfSearchFieldsAreEmpty();
    this.rangeFieldsByKey$ = rootState.pipe(select(fromRoot.getRangeFieldsByKey));
    this.facetFieldsByKey$ = rootState.pipe(select(fromRoot.getFacetFieldsByKey));
    this.searchFieldsOptions$ = rootState.pipe(select(fromRoot.getSearchFieldsOptionsByKey))
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

  //Slider auf Anfangswerte zuruecksetzen
  resetRange(key) {

    //Wert in Queryformat anpassen
    const query = JSON.parse(JSON.stringify(this.query));
    query.rangeFields[key].from = this.query.rangeFields[key].min;
    query.rangeFields[key].to = this.query.rangeFields[key].max;

    this.sliderService.resetSlider(key);

    //Suche starten
    this.updateQueryService.updateQuery(query);
  }

  resetTerm(key) {
    this.parentFormGroup.controls['searchField_' + key].setValue('');
  }

  resetRangeValues(key) {
    this.parentFormGroup.controls['showMissing_' + key].setValue(false);
  }
}
