import { Component, Input } from '@angular/core';
import { Basket } from '../models/basket';
import { UpdateQueryService } from '../services/update-query.service';
import { BasketsService } from '../services/baskets.service';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BackendSearchService } from '../../shared/services/backend-search.service';
import { QueryFormat } from "../../shared/models/query-format";
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { Observable } from 'rxjs/Rx';

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

  private activeBasket: Basket;
  query: QueryFormat;
  extraInfos$: Observable<any>;
  extraInfosByKey$: Observable<any>;
  showExportListTable$: Observable<any>;
  showExportListBasket$: Observable<any>;
  tableFields$: Observable<any>;
  tableFieldsDisplayLandingpage$: Observable<boolean>;
  tableFieldsDisplayExtraInfo$: Observable<boolean>;
  private tableFields: any;
  private basketQueryParamsRows: number;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.count / this.query.queryParams.rows);
  }

  //Anzahl der Merklisten-Seiten gesamt
  get basketPages(): number {

    //Anzahl der Merklisten-Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.basketsService.basketSize / this.basketQueryParamsRows);
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.query.queryParams.start / this.query.queryParams.rows) + 1;
  }

  //aktuelle Merklisten-Seite beim Blaettern
  get basketPage(): number {

    if (this.basketsService.basketsExist()) {

      //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
      return Math.floor(this.activeBasket.queryParams.start / this.basketQueryParamsRows) + 1;
    } else {

      //0 zurueck
      return 0;
    }
  }

  constructor(private basketsService: BasketsService,
              private updateQueryService: UpdateQueryService,
              private backendSearchService: BackendSearchService,
              private sanitizer: DomSanitizer,
              private rootState: Store<fromRoot.State>) {
    this.extraInfos$ = rootState.pipe(select(fromRoot.getExtraInfos));
    this.extraInfosByKey$ = rootState.pipe(select(fromRoot.getExtraInfosByKey));
    this.showExportListTable$ = rootState.pipe(select(fromRoot.getShowExportListTable));
    this.showExportListBasket$ = rootState.pipe(select(fromRoot.getShowExportListBasket));
    this.tableFields$ = rootState.pipe(select(fromRoot.getTableFields));
    this.tableFieldsDisplayLandingpage$ = rootState.pipe(select(fromRoot.getTableFieldsDisplayLandingpage));
    this.tableFieldsDisplayExtraInfo$ = rootState.pipe(select(fromRoot.getTableFieldsDisplayExtraInfo));
    this.tableFields$.subscribe(x => this.tableFields = x);
    rootState.pipe(select(fromRoot.getBasketQueryParamsRows)).subscribe(x => this.basketQueryParamsRows = x);

    updateQueryService.query$.subscribe(q => this.query = q);
    updateQueryService.response$.subscribe(res => {
        this.count = res.response.numFound;
        this.docs = res.response.docs;
        //Spalte herausfinden, nach der die Trefferliste gerade sortiert wird
        this.setSortColumnIndex();
      }
    );
    basketsService.activeBasket$.subscribe(res => this.activeBasket = res);
    //Suche anmelden: Bei Aenderungen der aktiven Merkliste
    basketsService.basketSearchTerms$
      .switchMap((basket: Basket) => this.backendSearchService.getBackendDataBasket(basket))
      .subscribe((res: any) => {
        //Spalte herausfinden, nach der die Merkliste gerade sortiert wird
        this.setSortColumnIndex('basket');
        //Array der Treffer-Dokumente
        // this.docs = res.response.docs;
        console.log(res.response.docs);
        this.basketDocs = res.response.docs;
      });
  }

  //Blaettern in Trefferliste / Merkliste
  updateStart(offset, mode: string = 'search') {

    //neuen Startwert berechnen
    let newStart: number;

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

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
        break;

      //Merklistentabelle
      case 'basket':

        //auf letzte Seite springen
        if (offset === 'last') {
          newStart = (this.basketQueryParamsRows * (this.basketPages - 1));
        } else if (offset === 'first') {
          newStart = 0;
        } else {
          newStart = this.activeBasket.queryParams.start + (offset * this.basketQueryParamsRows);
        }

        //Start anpassen
        this.activeBasket.queryParams.start = newStart;

        //Suche starten
        this.basketsService.propagateBasketSearchTermsFromActiveBasket();
        break;
    }
  }

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

  //Spalte herausfinden nach welcher gerade sortiert wird fuer farbliche Hinterlegung der Trefferliste / Merkliste
  private setSortColumnIndex(mode: string = 'search') {

    //nach Modus unterscheiden
    switch (mode) {

      //Trefferliste
      case 'search':

        //Ueber Felder der Tabelle gehen
        this.tableFields.forEach((item, index) => {

          //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
          if (item.sort === this.query.queryParams.sortField) {

            //diesen Index merken
            this.sortColumnSearch = index;
          }
        });
        break;

      //Merkliste
      case 'basket':

        //Ueber Felder der Tabelle gehen
        this.tableFields.forEach((item, index) => {

          //Wenn das aktuelle Feld das ist nach dem die Merkliste gerade sortiert wird
          if (item.sort === this.activeBasket.queryParams.sortField) {

            //diesen Index merken
            this.sortColumnBasket = index;
          }
        });
        break;
    }
  }

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

  //gibt eine CSS-Klasse zurueck, wenn nach dieser Spalte sortiert wird
  sortBy(field: string, mode: string = 'search') {

    //CSS-Klasse, davon ausgehen, dass gerade nicht nach diesem Feld sortiert wird
    //(fa-sort = rauf und runter-Symbol, welches anzeigt, dass es ein sortierbares Feld ist)
    let cssClass = "fa-sort";

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

        //wenn nach diesem Feld sortiert wird
        if (field === this.query.queryParams.sortField) {

          //anhand der gesetzten Sortierrichtung eine CSS-Klasse setzen
          cssClass = this.query.queryParams.sortDir === "asc" ? "fa-sort-asc" : "fa-sort-desc";
        }
        break;

      //Merkliste
      case 'basket':

        //wenn nach diesem Feld sortiert wird
        if (field === this.activeBasket.queryParams.sortField) {

          //anhand der gesetzten Sortierrichtung eine CSS-Klasse setzen
          cssClass =
            this.activeBasket.queryParams.sortDir === "asc"
              ? "fa-sort-asc" : "fa-sort-desc";
        }
        break;
    }

    //fa-Klasse zurueckgeben
    return cssClass;
  }

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


  //Treffertabelle / Merkliste sortieren
  sortTable(sortField: string, mode: string = 'search') {

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

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
        break;

      //Merkliste
      case 'basket':

        //wenn bereits nach diesem Feld sortiert wird
        if (sortField === this.activeBasket.queryParams.sortField) {

          //Sortierrichtung umdrehen
          this.activeBasket.queryParams.sortDir = this.activeBasket.queryParams.sortDir === "desc" ? "asc" : "desc";
        } else {

          //Sortierfeld setzen
          this.activeBasket.queryParams.sortField = sortField;

          //Sortierrichtung aufsteigend setzen
          this.activeBasket.queryParams.sortDir = 'asc';
        }

        //Suche starten
        this.basketsService.propagateBasketSearchTermsFromActiveBasket();
        break;
    }
  }

  itemIsInBasket(id: string) {
    return this.basketsService.itemIsInBasket(id);
  }

  addOrRemoveBasketItem(id: string) {
    return this.basketsService.addOrRemoveBasketItem(id);
  }

  getBasketSize() {
    return this.basketsService.basketSize;
  }
}
