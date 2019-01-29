import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";

import {environment} from "../../../environments/environment";
import * as fromBasketActions from '../actions/basket.actions';
import * as fromQueryActions from '../actions/query.actions';
import * as fromSearch from '../reducers';
import * as fromDetailedResultActions from '../actions/detailed-result.actions';

@Component({
  selector: 'app-basket-results-list',
  templateUrl: './basket-results-list.component.html',
  styleUrls: ['./basket-results-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketResultsListComponent {
  //Anzahl der Merklisten-Seiten gesamt
  get basketPages(): number {

    //Anzahl der Merklisten-Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this._currentBasket.ids.length / this._numberOfDisplayedRows);
  }


  //aktuelle Merklisten-Seite beim Blaettern
  get basketPage(): number {

    return this._numberOfBaskets ?
      //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
      Math.floor(this._currentBasket.queryParams.start / this._numberOfDisplayedRows) + 1 :
      0;
  }

  currentBasket$: Observable<any>;
  currentBasketResults$: Observable<any>;
  currentBasketResults: any;
  numberOfBaskets$: Observable<number>;
  detailedView$: Observable<any>;

  readonly extraInfos = environment.extraInfos;
  readonly showExportList = environment.showExportList.basket;
  sortColumn = 0;
  readonly tableFields = environment.tableFields;
  readonly tableFieldsDisplayLandingpage = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('landingpage') && field['landingpage'],
    false);
  readonly tableFieldsDisplayExtraInfo = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('extraInfo') && field['extraInfo']
    , false);

  private _detailedViewIds: any;
  private _currentBasket: any;
  private _numberOfBaskets: number;
  private readonly _numberOfDisplayedRows = environment.basketConfig.queryParams.rows;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.numberOfBaskets$ = _searchStore.pipe(select(fromSearch.getBasketCount));
    this.numberOfBaskets$.subscribe(no => this._numberOfBaskets = no);
    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));
    this.currentBasket$.subscribe(basket => {
      this._currentBasket = basket;
    });
    this.currentBasketResults$ = _searchStore.pipe(select(fromSearch.getAllBasketResults));
    this.currentBasketResults$.subscribe(res => this.currentBasketResults = res);

    this.detailedView$ = _searchStore.pipe(select(fromSearch.getAllDetailedResults));
    _searchStore.pipe(select(fromSearch.getDetailedResultsIds))
      .subscribe(ids => this._detailedViewIds = ids);

  }

  // TODO: Used by basket
  setBasketOffset(page) {
    let newOffset: number;
    //auf letzte Seite springen
    if (page === 'last') {
      newOffset = (this._numberOfDisplayedRows * (this.basketPages - 1));
    } else if (page === 'first') {
      newOffset = 0;
    } else {
      newOffset = this._currentBasket.queryParams.start + (page * this._numberOfDisplayedRows);
    }

    //Start anpassen
    this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this._currentBasket,
        queryParams: {
          ...this._currentBasket.queryParams,
          start: newOffset,
        }
      }
    }));

  }

  // TODO: Used by basket
  sortBasketTable(sortField: string) {
    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this._currentBasket.queryParams.sortField) {
      this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
        basket: {
          ...this._currentBasket,
          queryParams: {
            ...this._currentBasket.queryParams,
            sortField: sortField,
            sortDir: this._currentBasket.queryParams.sortDir === 'desc' ? 'asc' : 'desc',
          }
        }
      }));
    } else {
      this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
        basket: {
          ...this._currentBasket,
          queryParams: {
            ...this._currentBasket.queryParams,
            sortField: sortField,
            sortDir: 'asc',
          }
        }
      }));
    }
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
      this._searchStore.dispatch(new fromQueryActions.MakeDetailedSearchRequest(id));
    } else {
      this._searchStore.dispatch(new fromDetailedResultActions.DeleteDetailedResult({id: id}));
    }
  }

  hasDetailedViewOpen(id: string) {
    return this._detailedViewIds.indexOf(id) > -1;
  }

  // TODO: Used by basket
  private _setSortColumnIndexForBasket() {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Merkliste gerade sortiert wird
      if (item.sort === this._currentBasket.queryParams.sortField) {

        //diesen Index merken
        this.sortColumn = index;
      }
    });
  }
}
