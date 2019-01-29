import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";

import {environment} from "../../../environments/environment";
import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';

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

  readonly showExportList = environment.showExportList.basket;
  sortColumn = 0;
  readonly tableFields = environment.tableFields;

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
}
