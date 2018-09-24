import { Injectable } from '@angular/core';
import { BasketsStoreService } from './baskets-store.service';
import { FormService } from './form.service';
import { UserConfigService } from '../../services/user-config.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs/Rx';
import { Basket } from '../models/basket';

@Injectable({
  providedIn: 'root'
})
export class BasketsService {

  //Config-Objekt (z.B. Felder der Trefferliste)
  mainConfig = {
    ...environment,
    generatedConfig: {}
  };

  private indexOfActiveBasketSource = new BehaviorSubject<number>(0);
  private activeBasketSource = new ReplaySubject<Basket>(1);
  private basketSearchTermsSource = new Subject<Basket>();

  indexOfActiveBasket$ = this.indexOfActiveBasketSource.asObservable();
  activeBasket$ = this.activeBasketSource.asObservable();
  basketSearchTerms$ = this.basketSearchTermsSource.asObservable();

  private _activeBasket: Basket;
  private _indexOfActiveBasket = 0;

  get basketSize(): number {
    return this.basketsStoreService.savedBasketItems.length ? this._activeBasket.ids.length : 0;
  }

  constructor(private formService: FormService,
              private userConfigService: UserConfigService,
              private basketsStoreService: BasketsStoreService) {
    userConfigService.config$.subscribe(res => this.mainConfig = res);
    this.indexOfActiveBasket$.subscribe(res => this.pickBasket(res));
    this.activeBasket$.subscribe(res => {
      this.basketSearchTermsSource.next(res);
      this._activeBasket = res;
    });
  }

  basketsExist() {
    return !!this.basketsStoreService.savedBasketItems.length;
  }

  pickBasket(index: number) {
    if (this.basketsStoreService.savedBasketItems.length < this._indexOfActiveBasket - 1) {
      // TODO: Implement better error handling
      console.log("ERROR: New basket index is out of bounds!")
    } else {
      this.activeBasketSource.next(this.basketsStoreService.savedBasketItems[index]);
    }
  }

  // TODO: Better naming
  // FIXME: Replace this.activeBasket with Observable
  propagateBasketSearchTermsFromActiveBasket() {
    this.basketSearchTermsSource.next(this._activeBasket);
  }

  //Merkliste laden
  loadBasket(index: number) {

    //Diese Merkliste zur aktiven machen
    this.indexOfActiveBasketSource.next(index);

    //Merklisten-Suche starten
    this.basketSearchTermsSource.next(this._activeBasket);
  }

  //ID zu Merkliste hinzufuegen oder entfernen
  addOrRemoveBasketItem(id: string) {

    //Wenn ID bereits in der Merkliste ist
    if (this.itemIsInBasket(id)) {

      //ID aus aktiver Merkliste loeschen
      this._activeBasket.ids.splice(this._activeBasket.ids.indexOf(id), 1);
    } else {

      //ID in aktive Merkliste einfuegen
      this._activeBasket.ids.push(id);
    }

    //Suchanfrage abschicken
    this.basketSearchTermsSource.next(this._activeBasket);
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
      this.mainConfig.basketConfig.queryParams.sortField,
      this.mainConfig.basketConfig.queryParams.sortDir,
      this.mainConfig.basketConfig.queryParams.rows);

    //Merkliste in Array der lokalen Merklisten einfuegen
    this.basketsStoreService.savedBasketItems.push(newBasket);

    this.formService.addBasketToFormArray(newBasket);

    //Neuer Basket (ganz hinten einfuegt) ist gleich aktiv
    this.indexOfActiveBasketSource.next(this.formService.baskets.length - 1);

    //Wenn es sich nicht um den Init-Aufruf handelt
    if (!init) {

      //Merklisten-Suche abschicken (liefert leere Treffermenge, da noch keine ID in Merkliste gespeichert ist)
      this.propagateBasketSearchTermsFromActiveBasket();
    }
  }

  removeBasket(index: number) {
    //Merkliste in savedBaskets loeschen
    this.basketsStoreService.savedBasketItems.splice(index, 1);

    //Wenn der geloeschte Basket vor dem aktivem Basket kommt
    if (index < this._indexOfActiveBasket) {

      //Variable noch unten anpassen
      this.indexOfActiveBasketSource.next(this._indexOfActiveBasket - 1);
    } else if (index === this._indexOfActiveBasket) {

      //1. Basket aktiv stellen
      this.indexOfActiveBasketSource.next(0);
    }

    //Wenn es nach dem Loeschen noch Merklisten gibt
    if (this.basketsStoreService.savedBasketItems.length) {
      this.propagateBasketSearchTermsFromActiveBasket();
    } else {
      this.createBasket();
    }

  }


}
