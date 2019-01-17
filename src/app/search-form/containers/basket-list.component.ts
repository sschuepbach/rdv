import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

import * as fromBasketActions from '../actions/basket.actions';
import * as fromSearch from '../reducers';
import {environment} from '../../../environments/environment';
import {randomHashCode} from '../../shared/utils';

@Component({
  selector: 'app-basket-list',
  template: `
    <div class="mt-2 no-gutters">
      <div class="h6">Meine Merklisten</div>
      <button class="btn btn-primary btn-sm fa fa-plus mb-2" (click)="createBasket()"></button>

      <!-- Liste der gespeicherten Baskets -->
      <div class="no-gutters">
        <div *ngFor="let i of basketIds$ | async"
             class="input-group input-group-sm col-md-10 mt-1">

          <!-- Button "Merkliste laden" -->
          <span class="input-group-btn">
              <button class="btn btn-primary fa fa-circle-o"
                      [class.fa-dot-circle-o]="i === (currentBasketId$ | async)"
                      type="button"
                      (click)="loadBasket(i)"></button>
            </span>

          <!-- Name des Baskets -->
          <input type="text"
                 #basketName
                 class="form-control col-md-5"
                 title="Name des Baskets"
                 [value]="(basketEntities$ | async)[i].name"
                 (keyup)="updateBasketName(i, basketName.value)">

          <!-- Anzahl der Titel in dieser Merkliste -->
          <span class="btn btn-sm">
              {{(basketEntities$ | async)[i].ids.length + ' Titel'}}
            </span>

          <!-- Button "Link kopieren" -->
          <span class="input-group-btn">
              <app-copy-link [data]="(basketEntities$ | async)[i]" [mode]="'basket'"></app-copy-link>
            </span>

          <!-- Button "Merkliste loeschen" -->
          <span class="input-group-btn">
              <button class="btn btn-danger fa fa-trash"
                      type="button"
                      (click)="deleteBasket(i)"></button>
            </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-group-btn select {
      border-color: #ccc;
    }
  `],
})
export class BasketListComponent {

  basketEntities$: Observable<any>;
  private basketEntities: any;
  basketIds$: Observable<any>;
  currentBasketId$: Observable<any>;
  private nextId: number;
  private currentBasketId: string;
  private basketIds: string[];

  constructor(private searchState: Store<fromSearch.State>) {
    this.basketEntities$ = this.searchState.pipe(select(fromSearch.getBasketEntities));
    this.basketEntities$.subscribe(entities => this.basketEntities = entities);
    this.basketIds$ = this.searchState.pipe(select(fromSearch.getBasketIds));
    this.basketIds$.subscribe((ids: string[]) => {
      this.basketIds = ids;
      this.nextId = ids.length;
    });
    this.currentBasketId$ = this.searchState.pipe(select(fromSearch.getCurrentBasketId));
    this.currentBasketId$.subscribe(id => this.currentBasketId = id)
  }

  loadBasket(index: string) {
    this.searchState.dispatch(new fromBasketActions.SelectBasket({id: index}));
  }

  createBasket() {
    const hash = randomHashCode();
    this.searchState.dispatch(new fromBasketActions.AddBasket(
      {
        basket: {
          id: hash,
          name: 'Meine Merkliste ' + this.nextId,
          ids: [],
          queryParams: {
            rows: environment.queryParams.rows,
            start: environment.queryParams.start,
            sortField: environment.queryParams.sortField,
            sortDir: environment.queryParams.sortDir,
          }
        }
      }
    ));
    this.searchState.dispatch(new fromBasketActions.SelectBasket({id: hash}));
    // this.basketsService.createBasket();
  }

  deleteBasket(index: string) {
    if (index === this.currentBasketId) {
      if (this.basketIds.length <= 1) {
        this.createBasket();
      } else {
        this.searchState.dispatch(new fromBasketActions.SelectBasket({
          id: this.basketIds.filter(id => id !== index)[0]
        }))
      }
    }
    this.searchState.dispatch(new fromBasketActions.DeleteBasket({id: index}));
  }

  updateBasketName(index: number, name: string) {
    this.searchState.dispatch(new fromBasketActions.UpsertBasket({
      basket: {
        ...this.basketEntities[index],
        name: name,
      }
    }));
  }
}
