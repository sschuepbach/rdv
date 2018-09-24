import { Component, Input } from '@angular/core';
import { BasketsStoreService } from '../services/baskets-store.service';
import { BasketsService } from '../services/baskets.service';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-basket-list',
  template: `
    <div [formGroup]="parentFormGroup">
      <div class="mt-2 no-gutters" formArrayName="baskets">

        <!-- Ueberschrift -->
        <div class="h6">Meine Merklisten</div>

        <!-- neue Merkliste anlegen -->
        <button class="btn btn-primary btn-sm fa fa-plus mb-2"
                (click)="createBasket()"></button>

        <!-- Liste der gespeicherten Baskets -->
        <div class="no-gutters">
          <div *ngFor="let i of countToBasketListLength()"
               class="input-group input-group-sm col-md-10 mt-1">

            <!-- Button "Merkliste laden" -->
            <span class="input-group-btn">
              <button class="btn btn-primary fa fa-circle-o"
                      [class.fa-dot-circle-o]="i == activeBasketIndex"
                      type="button"
                      (click)="loadBasket(i)"></button>
            </span>

            <!-- Name des Baskets -->
            <input type="text"
                   class="form-control col-md-5"
                   title="Name des Baskets"
                   [formControlName]="i">

            <!-- Anzahl der Titel in dieser Merkliste -->
            <span class="btn btn-sm">
              {{getBaskets()[i].ids.length + ' Titel'}}
            </span>

            <!-- Button "Link kopieren" -->
            <span class="input-group-btn">
              <app-copy-link [data]="getBaskets()[i]" [mode]="'basket'"></app-copy-link>
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
    </div>
  `,
  styles: [`
    .input-group-btn select {
      border-color: #ccc;
    }
  `],
})
export class BasketListComponent {

  activeBasketIndex: number;

  @Input() parentFormGroup: FormGroup;

  constructor(private basketStoreService: BasketsStoreService,
              private basketsService: BasketsService) {
    this.basketsService.indexOfActiveBasket$.subscribe(res => this.activeBasketIndex = res);
  }

  loadBasket(index: number) {
    this.basketsService.loadBasket(index)
  }

  createBasket() {
    this.basketsService.createBasket();
  }

  deleteBasket(index: number) {
    (this.parentFormGroup.get('baskets') as FormArray).removeAt(index);
    this.basketsService.removeBasket(index);
  }

  getBaskets() {
    return this.basketStoreService.savedBasketItems;
  }

  countToBasketListLength() {
    return Array.from((this.parentFormGroup.get('baskets') as FormArray).controls.keys());
  }

}
