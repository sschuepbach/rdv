import { Injectable } from '@angular/core';
import { Basket } from '../models/basket.model';

@Injectable({
  providedIn: 'root'
})
export class BasketsStoreService {

  private _savedBasketItems: Basket[] = [];

  get savedBasketItems() {
    return this._savedBasketItems;
  }

  set savedBasketItems(savedBasketItems: Basket[]) {
    this._savedBasketItems = savedBasketItems;
  }

}
