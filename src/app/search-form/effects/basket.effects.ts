import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { flatMap } from 'rxjs/operators';
import { BasketActionTypes, BasketSelected, SelectBasket } from '../actions/basket.actions';
import { MakeBasketRequest } from '../actions/query.actions';


@Injectable()
export class BasketEffects {

  @Effect()
  basketSelected$ = this.actions$.pipe(
    ofType(BasketActionTypes.BasketSelected),
    flatMap((action: BasketSelected) => [
      new SelectBasket(action.payload),
      new MakeBasketRequest()
    ])
  );

  constructor(private actions$: Actions) {
  }
}
