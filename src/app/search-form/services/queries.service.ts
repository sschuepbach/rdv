import {Injectable} from '@angular/core';
import {QueriesStoreService} from './queries-store.service';
import {FormService} from './form.service';
import {UpdateQueryService} from './update-query.service';
import {SliderService} from './slider.service';
import {SavedQueryFormat} from '../models/saved-query';
import {QueryFormat} from "../../shared/models/query-format";

@Injectable({
  providedIn: 'root'
})
export class QueriesService {
  private query: QueryFormat;

  constructor(private formService: FormService,
              private updateQueryService: UpdateQueryService,
              private sliderService: SliderService,
              private queriesStoreService: QueriesStoreService) {
    updateQueryService.query$.subscribe(q => this.query = q);
  }

  //Nutzeranfrage speichern
  save(name: string) {

    //deep deepCopy von Anfrage-Format erstellen (nicht einfach Referenz zuordnen!)
    const query = JSON.parse(JSON.stringify(this.query));

    //Name der gespeicherten Suchanfragen und Anfrage-Format in Objekt packen
    const userQuery = new SavedQueryFormat(name, query);

    //Objekt in Array einfuegen
    this.queriesStoreService.savedQueries = [...this.queriesStoreService.savedQueries, userQuery];

    //Namensfeld fuer Nutzerabfrage mit Standard-Wert belegen ("Meine Suche 2")
    this.formService.searchForm.controls['saveQuery'].setValue('Meine Suche ' + (this.queriesStoreService.savedQueries.length + 1));
  }

  //Nutzeranfrage laden
  load(index: number) {

    //Anfrage-Format an passender Stelle aus Array holen
    this.updateQueryService.updateQuery(JSON.parse(JSON.stringify(this.queriesStoreService.savedQueries[index].query)));

    //Werte in Input Feldern setzen
    this.formService.setFormInputValues();

    //Slider-Werte setzen
    this.sliderService.resetSlider();
  }

  delete(index: number) {

    //Suchanfrage an passender Stelle loeschen
    // TODO: Test if working
    this.queriesStoreService.savedQueries.splice(index, 1);
    this.formService.searchForm.controls['saveQuery'].updateValueAndValidity();
  }

}
