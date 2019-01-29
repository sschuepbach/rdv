import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {select, Store} from "@ngrx/store";

import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';
import {Observable} from "rxjs";

@Component({
  selector: 'app-basket-icon',
  template: `
    <div class="col-sm-1 d-flex align-items-center no-gutters py-1 px-2"
         (click)="addOrRemoveRecordInBasket()">

      <!-- Label "Merken" nur bei kleinster Darstellung (vertikal) anzeigen -->
      <label class="d-sm-none font-weight-bold text-right mr-2">Add</label>

      <!-- Star-Symbol  -->
      <div class="col text-sm-center">
                    <span class="fa"
                          [ngClass]="(currentBasket$ | async).ids.includes(basketElement) ?
                          'fa-star text-warning' :
                          'fa-star-o'">
                    </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketIconComponent {
  @Input() basketElement: string;

  currentBasket$: Observable<any>;

  private _currentBasket: any;

  constructor(private _searchStore: Store<fromSearch.State>) {
    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));
    this.currentBasket$.subscribe(basket => {
      this._currentBasket = basket;
    });
  }

  addOrRemoveRecordInBasket() {
    this._searchStore.dispatch(new fromBasketActions.UpdateBasket(
      {
        basket: {
          id: this._currentBasket.id,
          changes: {
            ...this._currentBasket,
            ids:
              this._currentBasket.ids.includes(this.basketElement) ?
                this._currentBasket.ids.filter(rec => rec !== this.basketElement) :
                this._currentBasket.ids.concat(this.basketElement)
          }
        }
      }
    ));
  }
}
