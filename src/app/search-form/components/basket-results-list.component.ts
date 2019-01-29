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
  currentBasket$: Observable<any>;
  currentBasketResults$: Observable<any>;
  currentBasketResults: any;
  numberOfBaskets$: Observable<number>;
  numberOfBasketResults$: Observable<number>;

  readonly showExportList = environment.showExportList.basket;
  sortColumn = 0;
  readonly tableFields = environment.tableFields;
  readonly rowsPerPage = environment.basketConfig.queryParams.rows;

  private _currentBasket: any;
  private _numberOfBaskets: number;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.numberOfBaskets$ = _searchStore.pipe(select(fromSearch.getBasketCount));
    this.numberOfBaskets$.subscribe(no => this._numberOfBaskets = no);
    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));
    this.currentBasket$.subscribe(basket => {
      this._currentBasket = basket;
    });
    this.currentBasketResults$ = _searchStore.pipe(select(fromSearch.getAllBasketResults));
    this.currentBasketResults$.subscribe(res => this.currentBasketResults = res);
    this.numberOfBasketResults$ = _searchStore.pipe(select(fromSearch.getCurrentBasketElementsCount));
  }

  setBasketOffset(offset) {
    this._searchStore.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this._currentBasket,
        queryParams: {
          ...this._currentBasket.queryParams,
          start: offset,
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
