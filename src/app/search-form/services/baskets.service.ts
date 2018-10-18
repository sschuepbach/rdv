import { Injectable } from '@angular/core';
import { BasketsStoreService } from './baskets-store.service';
import { FormService } from './form.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import { Basket } from '../models/basket';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';

@Injectable({
  providedIn: 'root'
})
export class BasketsService {

  private _activeBasket: Basket;
  private _indexOfActiveBasket = 0;

  private indexOfActiveBasketSource = new BehaviorSubject<number>(0);
  private activeBasketSource = new ReplaySubject<Basket>(1);
  private basketSearchTermsSource = new BehaviorSubject<Basket>(this._activeBasket);

  indexOfActiveBasket$ = this.indexOfActiveBasketSource.asObservable();
  activeBasket$ = this.activeBasketSource.asObservable();
  basketSearchTerms$ = this.basketSearchTermsSource.asObservable();
  private basketQueryParamsSortField: string;
  private basketQueryParamsSortDir: string;
  private basketQueryParamsRows: number;


  get basketSize(): number {
    return this.basketsStoreService.savedBasketItems.length ? this._activeBasket.ids.length : 0;
  }

  constructor(private formService: FormService,
              private basketsStoreService: BasketsStoreService,
              private rootState: Store<fromRoot.State>) {
    rootState.pipe(select(fromRoot.getBasketQueryParamsSortField)).subscribe(x => this.basketQueryParamsSortField = x);
    rootState.pipe(select(fromRoot.getBasketQueryParamsSortDir)).subscribe(x => this.basketQueryParamsSortDir = x);
    rootState.pipe(select(fromRoot.getBasketQueryParamsRows)).subscribe(x => this.basketQueryParamsRows = x);
    this.indexOfActiveBasket$.subscribe(res => this.pickBasket(res));
    this.activeBasket$.subscribe(res => {
      this.basketSearchTermsSource.next(res);
      this._activeBasket = res;
    });
  }

  private loadBasketByIndex(index: number) {
    this.indexOfActiveBasketSource.next(index);
  }

  private loadBasketByBasket(basket: Basket) {
    this.activeBasketSource.next(basket);
  }

  private initializeBasketSearch() {
    this.basketSearchTermsSource.next(this._activeBasket);
  }

  basketsExist() {
    return !!this.basketsStoreService.savedBasketItems.length;
  }

  pickBasket(index: number) {
    if (this.basketsStoreService.savedBasketItems.length < this._indexOfActiveBasket - 1) {
      // TODO: Implement better error handling
      console.log("ERROR: New basket index is out of bounds!")
    } else {
      this.loadBasketByBasket(this.basketsStoreService.savedBasketItems[index]);
    }
  }

  // TODO: Better naming
  propagateBasketSearchTermsFromActiveBasket() {
    this.initializeBasketSearch();
  }

  loadBasket(index: number) {
    this.loadBasketByIndex(index);
  }

  addOrRemoveBasketItem(id: string) {

    //Wenn ID bereits in der Merkliste ist
    if (this.itemIsInBasket(id)) {

      //ID aus aktiver Merkliste loeschen
      this._activeBasket.ids.splice(this._activeBasket.ids.indexOf(id), 1);
    } else {

      //ID in aktive Merkliste einfuegen
      this._activeBasket.ids.push(id);
    }

    this.initializeBasketSearch();
  }

  //pruefen ob eine ID in der aktiven Merkliste ist
  itemIsInBasket(id: string) {

    //Wenn es keine Merklisten gibt
    if (this.basketsStoreService.savedBasketItems.length === 0) {

      //kann Eintrag in keiner Merkliste sein
      return false;
    } else {

      //pruefen ob ID in aktiver Merkliste bereits vorkommt
      return (this._activeBasket.ids.indexOf(id) > -1)
    }
  }

  createBasket(init: boolean = false, basket: Basket = null) {

    const newBasket = basket ? basket : new Basket("Meine Merkliste " + (this.formService.baskets.length + 1),
      this.basketQueryParamsSortField,
      this.basketQueryParamsSortDir,
      this.basketQueryParamsRows);

    //Merkliste in Array der lokalen Merklisten einfuegen
    this.basketsStoreService.savedBasketItems.push(newBasket);

    this.formService.addBasketToFormArray(newBasket);

    //Neuer Basket (ganz hinten einfuegt) ist gleich aktiv
    this.loadBasketByIndex(this.formService.baskets.length - 1);

    if (!init) {
      //Merklisten-Suche abschicken (liefert leere Treffermenge, da noch keine ID in Merkliste gespeichert ist)
      this.initializeBasketSearch();
    }
  }

  removeBasket(index: number) {
    //Merkliste in savedBaskets loeschen
    this.basketsStoreService.savedBasketItems.splice(index, 1);

    //Wenn der geloeschte Basket vor dem aktivem Basket kommt
    if (index < this._indexOfActiveBasket) {
      this.loadBasketByIndex(this._indexOfActiveBasket - 1);
    } else if (index === this._indexOfActiveBasket) {
      this.loadBasketByIndex(0);
    }

    //Wenn es nach dem Loeschen noch Merklisten gibt
    if (this.basketsStoreService.savedBasketItems.length) {
      this.initializeBasketSearch();
    } else {
      this.createBasket();
    }

  }


}
