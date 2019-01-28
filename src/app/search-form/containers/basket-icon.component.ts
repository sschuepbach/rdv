import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from "@ngrx/store";

import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';

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
                          [ngClass]="basket.ids.includes(basketElement) ?
                          'fa-star text-warning' :
                          'fa-star-o'">
                    </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketIconComponent {

  @Input() basket: any;
  @Input() basketElement: string;

  constructor(private searchState: Store<fromSearch.State>) {
  }

  addOrRemoveRecordInBasket() {
    this.searchState.dispatch(new fromBasketActions.UpdateBasket(
      {
        basket: {
          id: this.basket.id,
          changes: {
            ...this.basket,
            ids:
              this.basket.ids.includes(this.basketElement) ?
                this.basket.ids.filter(rec => rec !== this.basketElement) :
                this.basket.ids.concat(this.basketElement)
          }
        }
      }
    ));
  }

}
