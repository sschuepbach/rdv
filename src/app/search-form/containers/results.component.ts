import { Component, Input } from '@angular/core';
import { UpdateQueryService } from '../services/update-query.service';
import { BasketsService } from '../services/baskets.service';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BackendSearchService } from '../../shared/services/backend-search.service';
import { QueryFormat } from "../../shared/models/query-format";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import * as fromSearch from '../reducers';
import * as fromBasketActions from '../actions/basket.actions';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {

  @Input() parentFormGroup: FormGroup;

  exportListData;
  count = 0;
  //docs Bereich der Server-Antwort (abgeleitet von results) fuer Treffertabelle
  docs: any[];

  //Nach welcher Spalte wird gerade sortiert bei Trefferliste / Merkliste fuer farbliche Hinterlegung der Spalte
  sortColumnSearch = 0;
  sortColumnBasket = 0;

  //Eintragsdetails (abstract,...) zwischenspeichern, damit sie nicht immer geholt werden muessen
  detailDataArray: any[] = [];

  //docs Bereich der Server-Antwort (abgeleitet von results) fuer Merklistentabelle
  basketDocs: any[];

  query: QueryFormat;
  tableFields: any;
  extraInfos: any;
  tableFieldsDisplayLandingpage: boolean;
  tableFieldsDisplayExtraInfo: boolean;
  private readonly numberOfDisplayedBasketRows: number;

  numberOfBaskets$: Observable<number>;
  currentBasket$: Observable<any>;
  private currentBasket: any;
  showExportListTable: boolean;
  showExportListBasket: boolean;
  private numberOfBaskets: number;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.count / this.query.queryParams.rows);
  }

  //Anzahl der Merklisten-Seiten gesamt
  get basketPages(): number {

    //Anzahl der Merklisten-Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.currentBasket.ids.length / this.numberOfDisplayedBasketRows);
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.query.queryParams.start / this.query.queryParams.rows) + 1;
  }

  //aktuelle Merklisten-Seite beim Blaettern
  get basketPage(): number {

    return this.numberOfBaskets ?
      //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
      Math.floor(this.currentBasket.queryParams.start / this.numberOfDisplayedBasketRows) + 1 :
      0;
  }

  constructor(private basketsService: BasketsService,
              private updateQueryService: UpdateQueryService,
              private backendSearchService: BackendSearchService,
              private sanitizer: DomSanitizer,
              private searchState: Store<fromSearch.State>) {
    this.extraInfos = environment.extraInfos;
    this.tableFields = environment.tableFields;
    this.showExportListTable = environment.showExportList.table;
    this.showExportListBasket = environment.showExportList.basket;
    this.numberOfDisplayedBasketRows = environment.basketConfig.queryParams.rows;

    this.tableFieldsDisplayLandingpage = environment.tableFields.reduce((agg, field) =>
      !agg && field.hasOwnProperty('landingpage') && field['landingpage'],
      false);
    this.tableFieldsDisplayExtraInfo = environment.tableFields.reduce((agg, field) =>
      !agg && field.hasOwnProperty('extraInfo') && field['extraInfo']
      , false);

    this.numberOfBaskets$ = searchState.pipe(select(fromSearch.getBasketCount));
    this.numberOfBaskets$.subscribe(no => this.numberOfBaskets = no);
    this.currentBasket$ = searchState.pipe(select(fromSearch.getCurrentBasket));
    this.currentBasket$.subscribe(basket => this.currentBasket = basket);

    updateQueryService.query$.subscribe(q => this.query = q);
    updateQueryService.response$.subscribe(res => {
        this.count = res.response.numFound;
        this.docs = res.response.docs;
        //Spalte herausfinden, nach der die Trefferliste gerade sortiert wird
      this.setSortColumnIndexForSearch();
      }
    );

    // TODO: Replace
    //Suche anmelden: Bei Aenderungen der aktiven Merkliste
    /*    basketsService.basketSearchTerms$
          .switchMap((basket: Basket) => this.backendSearchService.getBackendDataBasket(basket))
          .subscribe((res: any) => {
            //Spalte herausfinden, nach der die Merkliste gerade sortiert wird
            this.setSortColumnIndexForBasket();
            //Array der Treffer-Dokumente
            this.basketDocs = res.response.docs;
          });*/
  }

  // TODO: Used by search
  //Blaettern in Trefferliste / Merkliste
  setSearchOffset(offset) {
    //neuen Startwert berechnen
    let newStart: number;

    //auf letzte Seite springen
    if (offset === 'last') {
      newStart = (this.query.queryParams.rows * (this.pages - 1));
    } else if (offset === 'first') {
      newStart = 0;
    } else {
      newStart = this.query.queryParams.start +
        (offset * this.query.queryParams.rows);
    }

    //Start anpassen
    const query = JSON.parse(JSON.stringify(this.query));
    query.queryParams.start = newStart;
    this.updateQueryService.updateQuery(query);
  }

  // TODO: Used by basket
  setBasketOffset(offset) {
    let newStart: number;
    //auf letzte Seite springen
    if (offset === 'last') {
      newStart = (this.numberOfDisplayedBasketRows * (this.basketPages - 1));
    } else if (offset === 'first') {
      newStart = 0;
    } else {
      newStart = this.currentBasket.queryParams.start + (offset * this.numberOfDisplayedBasketRows);
    }

    //Start anpassen
    this.searchState.dispatch(new fromBasketActions.UpdateBasket({
      basket: {
        ...this.currentBasket,
        queryParams: {
          ...this.currentBasket.queryParams,
          start: newStart
        }
      }
    }));

    // FIXME: Replace
    // this.basketsService.propagateBasketSearchTermsFromActiveBasket();
  }

  // TODO: Used by both
  //in Treffertabelle / Merkliste pruefen, ob Wert in Ergebnis-Liste ein Einzelwert, ein Multi-Wert (=Array) oder gar nicht gesetzt ist
  // noinspection JSMethodCanBeStatic
  private getType(obj) {

    //Wert ist nicht gesetzt
    if (!obj) {
      return 'unset';
    } else if (obj.constructor === Array) {
      return "multi";
    } else {
      return "single";
    }
  }

  // TODO: Used by both
  exportList(docs) {
    let dataString = "data:application/octet-stream,";

    // Header hinzufügen
    for (const field of this.tableFields) {
      dataString += encodeURIComponent(field.label) + "%09";
    }
    dataString += "%0A";

    // Daten hinzufügen
    for (const doc of docs) {
      for (const field of this.tableFields) {
        switch (this.getType(doc[field.field])) {
          case 'unset':
            dataString += "ohne%09";
            break;
          case 'single':
            dataString += encodeURIComponent(doc[field.field]) + "%09";
            break;
          case 'multi':
            dataString += encodeURIComponent(doc[field.field].join("; ")) + "%09";
            break;
        }
      }
      dataString += "%0A";
    }

    this.exportListData = this.sanitizer.bypassSecurityTrustUrl(dataString);
  }

  // TODO: Used by search
  //Spalte herausfinden nach welcher gerade sortiert wird fuer farbliche Hinterlegung der Trefferliste / Merkliste
  private setSortColumnIndexForSearch() {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
      if (item.sort === this.query.queryParams.sortField) {

        //diesen Index merken
        this.sortColumnSearch = index;
      }
    });
  }

  // TODO: Used by basket
  private setSortColumnIndexForBasket() {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Merkliste gerade sortiert wird
      if (item.sort === this.currentBasket.queryParams.sortField) {

        //diesen Index merken
        this.sortColumnBasket = index;
      }
    });
  }

  // TODO: Used by both
  //Werte fuer Darstellung in Trefferliste formattieren
  // noinspection JSMethodCanBeStatic
  formatValue(value, display) {

    //von normalem Text ausgehen
    let output = value;

    //Wenn es ein spezieller Modus ist
    switch (display) {

      //Link-Modus
      case 'link':

        //Link erstellen
        output = "<a href=" + value + ">" + value + " <i class='fa fa-external-link'></i></a>";
        break;
    }

    //formattierten Wert zurueckgeben
    return output;
  }

  // TODO: Used by search
  getSortBySymbol(field: string) {
    return field === this.query.queryParams.sortField ?
      this.query.queryParams.sortDir === "asc" ? "fa-sort-asc" : "fa-sort-desc" :
      'fa-sort';
  }

  // TODO: Used by both
  //Detailinfo holen und Ansicht toggeln
  getFullData(id: string) {

    //Wenn es noch keine Detailinfos (abstract,...) dieser ID gibt
    if (this.detailDataArray[id] === undefined) {

      //Infos aus Backend holen und lokal speichern. Eintrag sichtbar machen
      this.backendSearchService.getBackendDetailData(id, false).subscribe(
        res => this.detailDataArray[id] = {"data": res, "visible": true});
    } else {

      //Sichtbarkeit toggeln
      this.detailDataArray[id]["visible"] = !this.detailDataArray[id]["visible"];
    }
  }


  // TODO: Used by search
  //Treffertabelle / Merkliste sortieren
  sortSearchTable(sortField: string) {
    const query = JSON.parse(JSON.stringify(this.query));

    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this.query.queryParams.sortField) {
      query.queryParams.sortDir = this.query.queryParams.sortDir === "desc" ? "asc" : "desc";
    } else {
      query.queryParams.sortField = sortField;
      query.queryParams.sortDir = 'asc';
    }

    //Trefferliste wieder von vorne anzeigen
    query.queryParams.start = 0;
    this.updateQueryService.updateQuery(query);
  }

  // TODO: Used by basket
  sortBasketTable(sortField: string) {
    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this.currentBasket.queryParams.sortField) {
      this.searchState.dispatch(new fromBasketActions.UpdateBasket({
        basket: {
          ...this.currentBasket,
          queryParams: {
            ...this.currentBasket.queryParams,
            sortField: sortField,
            sortDir: this.currentBasket.queryParams.sortDir === 'desc' ? 'asc' : 'desc',
          }
        }
      }));
    } else {
      this.searchState.dispatch(new fromBasketActions.UpdateBasket({
        basket: {
          ...this.currentBasket,
          queryParams: {
            ...this.currentBasket.queryParams,
            sortField: sortField,
            sortDir: 'asc',
          }
        }
      }));
    }

    //Suche starten
    // FIXME: Replace
    // this.basketsService.propagateBasketSearchTermsFromActiveBasket();
  }

  // TODO: Used by both
  addOrRemoveRecordInBasket(id: string) {
    this.searchState.dispatch(new fromBasketActions.UpdateBasket(
      {
        basket: {
          ...this.currentBasket,
          ids:
            this.currentBasket.ids.includes(id) ?
              this.currentBasket.ids.filter(rec => rec !== id) :
              this.currentBasket.ids.concat(id)
        }
      }
    ));
  }
}
