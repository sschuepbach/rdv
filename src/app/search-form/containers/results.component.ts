import {Component} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

import {BackendSearchService} from '../../shared/services/backend-search.service';
import * as fromSearch from '../reducers';
import * as fromBasketActions from '../actions/basket.actions';
import * as fromQueryActions from '../actions/query.actions';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {

  exportListData;
  count = 0;
  count$: Observable<number>;
  docs: any[];

  //Nach welcher Spalte wird gerade sortiert bei Trefferliste / Merkliste fuer farbliche Hinterlegung der Spalte
  sortColumnSearch = 0;
  sortColumnBasket = 0;

  //Eintragsdetails (abstract,...) zwischenspeichern, damit sie nicht immer geholt werden muessen
  detailDataArray: any[] = [];

  //docs Bereich der Server-Antwort (abgeleitet von results) fuer Merklistentabelle
  basketDocs: any[];

  tableFields: any;
  extraInfos: any;
  tableFieldsDisplayLandingpage: boolean;
  tableFieldsDisplayExtraInfo: boolean;
  private readonly numberOfDisplayedBasketRows: number;
  rowOpts: number[];

  numberOfBaskets$: Observable<number>;
  currentBasket$: Observable<any>;
  private currentBasket: any;
  showExportListTable: boolean;
  showExportListBasket: boolean;
  private numberOfBaskets: number;
  private numberOfRows: number;
  offset$: Observable<number>;
  private offset: number;
  private sortField: string;
  private sortOrder: string;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.count / this.numberOfRows);
  }

  //Anzahl der Merklisten-Seiten gesamt
  get basketPages(): number {

    //Anzahl der Merklisten-Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.currentBasket.ids.length / this.numberOfDisplayedBasketRows);
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.offset / this.numberOfRows) + 1;
  }

  //aktuelle Merklisten-Seite beim Blaettern
  get basketPage(): number {

    return this.numberOfBaskets ?
      //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
      Math.floor(this.currentBasket.queryParams.start / this.numberOfDisplayedBasketRows) + 1 :
      0;
  }

  constructor(private backendSearchService: BackendSearchService,
              private sanitizer: DomSanitizer,
              private searchState: Store<fromSearch.State>) {
    this.extraInfos = environment.extraInfos;
    this.tableFields = environment.tableFields;
    this.showExportListTable = environment.showExportList.table;
    this.showExportListBasket = environment.showExportList.basket;
    this.numberOfDisplayedBasketRows = environment.basketConfig.queryParams.rows;
    this.numberOfRows = environment.queryParams.rows;
    this.rowOpts = environment.rowOpts;

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

    this.offset$ = searchState.pipe(select(fromSearch.getResultOffset));
    this.offset$.subscribe(x => this.offset = x);
    searchState.pipe(select(fromSearch.getResultSortField)).subscribe(x => {
      this.sortField = x;
      this.setSortColumnIndexForSearch(x);
    });
    searchState.pipe(select(fromSearch.getResultSortOrder)).subscribe(x => this.sortOrder = x);

    this.count$ = searchState.pipe(select(fromSearch.getTotalCount));
    this.count$.subscribe(x => this.count = x);

    searchState.pipe(select(fromSearch.getAllResults)).subscribe(x => this.docs = x)


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
      newStart = (this.numberOfRows * (this.pages - 1));
    } else if (offset === 'first') {
      newStart = 0;
    } else {
      newStart = this.offset +
        (offset * this.numberOfRows);
    }

    this.searchState.dispatch(new fromQueryActions.SetOffset(newStart));
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
  private setSortColumnIndexForSearch(sortField: string) {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
      if (item.sort === sortField) {

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
    return display === 'link' ?
      "<a href=" + value + ">" + value + " <i class='fa fa-external-link'></i></a>" :
      value;
  }

  // TODO: Used by search
  getSortBySymbol(field: string) {
    return field === this.sortField ?
      this.sortOrder === "asc" ? "fa-sort-asc" : "fa-sort-desc" :
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
    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this.sortField) {
      this.searchState.dispatch(new fromQueryActions.SetSortOrder(this.sortOrder === "desc" ? "asc" : "desc"));
    } else {
      this.searchState.dispatch(new fromQueryActions.SetSortField(sortField));
      this.searchState.dispatch(new fromQueryActions.SetSortOrder('asc'));
    }
    this.searchState.dispatch(new fromQueryActions.SetOffset(0));
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
          id: this.currentBasket.id,
          changes: {
            ...this.currentBasket,
            ids:
              this.currentBasket.ids.includes(id) ?
                this.currentBasket.ids.filter(rec => rec !== id) :
                this.currentBasket.ids.concat(id)
          }
        }
      }
    ));
  }
}
