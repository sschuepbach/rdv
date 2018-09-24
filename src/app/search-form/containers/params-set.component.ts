import { Component, Input } from '@angular/core';
import { UpdateQueryService } from '../services/update-query.service';
import { SliderService } from '../services/slider.service';
import { UserConfigService } from '../../services/user-config.service';
import { environment } from '../../../environments/environment';
import { FormService } from '../services/form.service';
import { FormGroup } from '@angular/forms';

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

  mainConfig = {
    ...environment,
    generatedConfig: {},
  };

  //speichert den Zustand, ob mind. 1 Textsuchfeld nicht leer ist
  searchFieldsAreEmpty = true;

  constructor(public updateQueryService: UpdateQueryService,
              private sliderService: SliderService,
              private userConfigService: UserConfigService,
              private formService: FormService) {
    userConfigService.getConfig();
    userConfigService.config$.subscribe(res => this.mainConfig = res);
    this.searchFieldsAreEmpty = formService.checkIfSearchFieldsAreEmpty();
  }

  //Facette entfernen
  removeFacet(field, value) {

    //Index der ausgewaehlten Facette finden anhand des Namens
    const index = this.updateQueryService.queryFormat.facetFields[field]["values"].indexOf(value);

    //TODO an Start der Trefferliste springen?

    //in Array loeschen
    this.updateQueryService.queryFormat.facetFields[field]["values"].splice(index, 1);

    //Suche starten
    this.updateQueryService.getData();
  }

  //Slider auf Anfangswerte zuruecksetzen
  resetRange(key) {

    //Wert in Queryformat anpassen
    this.updateQueryService.queryFormat.rangeFields[key].from = this.updateQueryService.queryFormat.rangeFields[key].min;
    this.updateQueryService.queryFormat.rangeFields[key].to = this.updateQueryService.queryFormat.rangeFields[key].max;

    this.sliderService.resetSlider(key);

    //Suche starten
    this.updateQueryService.getData();
  }

  resetTerm(key) {
    this.parentFormGroup.controls['searchField_' + key].setValue('');
  }

  resetRangeValues(key) {
    this.parentFormGroup.controls['showMissing_' + key].setValue(false);
  }
}
