import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from "@ngrx/store";

import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import * as fromDetailedResultActions from '../actions/detailed-result.actions';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-results-list',
  templateUrl: './search-results-list.component.html',
  styleUrls: ['./search-results-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsListComponent {
  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this._count / this._numberOfRows);
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this._offset / this._numberOfRows) + 1;
  }

  count$: Observable<number>;
  currentBasket$: Observable<any>;
  docs$: Observable<any>;
  offset$: Observable<number>;
  detailedView$: Observable<any>;
  detailedViewIds$: Observable<any>;

  readonly extraInfos = environment.extraInfos;
  readonly rowOpts = environment.rowOpts;
  readonly showExportList = environment.showExportList.table;
  sortColumn = 0;
  readonly tableFields = environment.tableFields;
  readonly tableFieldsDisplayLandingpage = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('landingpage') && field['landingpage'],
    false);
  readonly tableFieldsDisplayExtraInfo = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('extraInfo') && field['extraInfo']
    , false);

  private _count: number;
  private _offset: number;
  private readonly _numberOfRows = environment.queryParams.rows;
  private _sortField: string;
  private _sortOrder: string;
  private _detailedViewIds: any;


  constructor(private searchState: Store<fromSearch.State>) {
    this.docs$ = searchState.pipe(select(fromSearch.getAllResults));

    this.count$ = searchState.pipe(select(fromSearch.getTotalResultsCount));
    this.count$.subscribe(count => {
      this._count = count;
    });

    this.offset$ = searchState.pipe(select(fromSearch.getResultOffset));
    this.offset$.subscribe(offset => this._offset = offset);

    searchState.pipe(select(fromSearch.getResultSortField)).subscribe(x => {
      this._sortField = x;
      this.setSortColumnIndex(x);
    });

    searchState.pipe(select(fromSearch.getResultSortOrder)).subscribe(x => this._sortOrder = x);

    this.currentBasket$ = searchState.pipe(select(fromSearch.getCurrentBasket));

    this.detailedView$ = searchState.pipe(select(fromSearch.getAllDetailedResults));
    this.detailedViewIds$ = searchState.pipe(select(fromSearch.getDetailedResultsIds));
    this.detailedViewIds$.subscribe(ids => this._detailedViewIds = ids);
  }

  // TODO: Used by search
  //Blaettern in Trefferliste / Merkliste
  setSearchOffset(offset) {
    //neuen Startwert berechnen
    let newStart: number;

    //auf letzte Seite springen
    if (offset === 'last') {
      newStart = (this._numberOfRows * (this.pages - 1));
    } else if (offset === 'first') {
      newStart = 0;
    } else {
      newStart = this._offset +
        (offset * this._numberOfRows);
    }

    this.searchState.dispatch(new fromQueryActions.SetOffset(newStart));
  }

  // TODO: Used by search
  //Treffertabelle / Merkliste sortieren
  sortSearchTable(sortField: string) {
    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this._sortField) {
      this.searchState.dispatch(new fromQueryActions.SetSortOrder(this._sortOrder === "desc" ? "asc" : "desc"));
    } else {
      this.searchState.dispatch(new fromQueryActions.SetSortField(sortField));
      this.searchState.dispatch(new fromQueryActions.SetSortOrder('asc'));
    }
    this.searchState.dispatch(new fromQueryActions.SetOffset(0));
  }

  // TODO: Used by search
  //Spalte herausfinden nach welcher gerade sortiert wird fuer farbliche Hinterlegung der Trefferliste / Merkliste
  private setSortColumnIndex(sortField: string) {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
      if (item.sort === sortField) {

        //diesen Index merken
        this.sortColumn = index;
      }
    });
  }

  // TODO: Used by search
  getSortBySymbol(field: string) {
    return field === this._sortField ?
      this._sortOrder === "asc" ? "fa-sort-asc" : "fa-sort-desc" :
      'fa-sort';
  }

  // TODO: Used by both
  //in Treffertabelle / Merkliste pruefen, ob Wert in Ergebnis-Liste ein Einzelwert, ein Multi-Wert (=Array) oder gar nicht gesetzt ist
  // noinspection JSMethodCanBeStatic
  getType(obj) {

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
  //Detailinfo holen und Ansicht toggeln
  getFullData(id: string) {
    if (!this.hasDetailedViewOpen(id)) {
      this.searchState.dispatch(new fromQueryActions.MakeDetailedSearchRequest(id));
    } else {
      this.searchState.dispatch(new fromDetailedResultActions.DeleteDetailedResult({id: id}));
    }
  }

  hasDetailedViewOpen(id: string) {
    return this._detailedViewIds.indexOf(id) > -1;
  }

}
