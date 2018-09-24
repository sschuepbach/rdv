import { Injectable } from '@angular/core';
import { QueriesStoreService } from './queries-store.service';
import { FormService } from './form.service';
import { UpdateQueryService } from './update-query.service';
import { SliderService } from './slider.service';
import { SavedQueryFormat } from '../models/saved-query';

@Injectable({
  providedIn: 'root'
})
export class QueriesService {

  constructor(private formService: FormService,
              private updateQueryService: UpdateQueryService,
              private sliderService: SliderService,
              private queriesStoreService: QueriesStoreService) {
  }

  //Nutzeranfrage speichern
  save(name: string) {

    //deep copy von Anfrage-Format erstellen (nicht einfach Referenz zuordnen!)
    const qf = JSON.parse(JSON.stringify(this.updateQueryService.queryFormat));

    //Name der gespeicherten Suchanfragen und Anfrage-Format in Objekt packen
    const userQuery = new SavedQueryFormat(name, qf);

    //Objekt in Array einfuegen
    this.queriesStoreService.savedQueries = [...this.queriesStoreService.savedQueries, userQuery];

    //Namensfeld fuer Nutzerabfrage mit Standard-Wert belegen ("Meine Suche 2")
    this.formService.searchForm.controls['saveQuery'].setValue('Meine Suche ' + (this.queriesStoreService.savedQueries.length + 1));
  }

  //Nutzeranfrage laden
  load(index: number) {

    //Anfrage-Format an passender Stelle aus Array holen
    this.updateQueryService.queryFormat = JSON.parse(JSON.stringify(this.queriesStoreService.savedQueries[index].query));

    //Werte in Input Feldern setzen
    this.formService.setFormInputValues();

    //Slider-Werte setzen
    this.sliderService.resetSlider();

    //Suche starten
    this.updateQueryService.getData();
  }

  delete(index: number) {

    //Suchanfrage an passender Stelle loeschen
    // TODO: Test if working
    this.queriesStoreService.savedQueries.splice(index, 1);
    this.formService.searchForm.controls['saveQuery'].updateValueAndValidity();
  }

}
