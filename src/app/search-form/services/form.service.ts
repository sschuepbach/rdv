import { Directive, forwardRef, Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, NG_VALIDATORS, Validators } from '@angular/forms';
import { UpdateQueryService } from './update-query.service';
import { QueriesStoreService } from './queries-store.service';
import { BasketsStoreService } from './baskets-store.service';
import { Basket } from '../models/basket.model';
import { QueryFormat } from '../../shared/models/query-format';
import * as fromRoot from '../../reducers';
import { select, Store } from '@ngrx/store';

function queryNameIsUniqueValidatorFactory(queriesStore: QueriesStoreService) {
  return (control: FormControl) => {
    return queriesStore.savedQueries.filter(q => q.name === control.value).length > 0 ?
      {uniqueQueryName: {valid: false}} : null;
  }
}

// For explanations on the reason why using a directive as validator see
// https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html#custom-validators-with-dependencies
@Directive({
  selector: '[app-validateUniqueQueryName][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => QueryNameIsUniqueValidatorDirective), multi: true}
  ]
})
export class QueryNameIsUniqueValidatorDirective {

  validator: Function;

  constructor(queriesStore: QueriesStoreService) {
    this.validator = queryNameIsUniqueValidatorFactory(queriesStore);
  }

  // noinspection JSUnusedGlobalSymbols
  validate(c: FormControl) {
    return this.validator(c);
  }
}

@Injectable({
  providedIn: 'root'
})
export class FormService {

  searchForm;
  private query: QueryFormat;
  private queryParamsRows: number;
  private facetFieldsByKey: any;
  private filterFields: any;
  private filterFieldsByKey: any;

  //Liste der Merklistennamen erhalten
  get baskets(): FormArray {

    //als FormArray zureuckgeben, damit .push() angeboten wird
    return this.searchForm.get("baskets") as FormArray;
  }


  constructor(private formBuilder: FormBuilder,
              private updateQueryService: UpdateQueryService,
              private basketsStoreService: BasketsStoreService,
              private queriesStoreService: QueriesStoreService,
              private rootState: Store<fromRoot.State>) {
    this.initializeForm();
    rootState.pipe(select(fromRoot.getQueryParamsRows)).subscribe(x => this.queryParamsRows = x);
    rootState.pipe(select(fromRoot.getFacetFieldsByKey)).subscribe(x => this.facetFieldsByKey = x);
    rootState.pipe(select(fromRoot.getFilterFields)).subscribe(x => this.filterFields = x);
    rootState.pipe(select(fromRoot.getFilterFieldsByKey)).subscribe(x => this.filterFieldsByKey = x);
    updateQueryService.query$.subscribe(
      q => {
        this.query = q;
        this.searchForm.patchValue({
          rows: q.queryParams.rows,
        })
      }
    );
    this.updateQueryOnRowNumChange();
  }

  private initializeForm() {
    this.searchForm = this.formBuilder.group({
      // TODO: Implement update from this.queriesStoreService.savedQueries.length + 1
      saveQuery: [
        'Meine Suche 1',
        [Validators.required, Validators.minLength(3), new QueryNameIsUniqueValidatorDirective(this.queriesStoreService)]
      ]
    });
  }

  private updateQueryOnRowNumChange() {
    // TODO: Remove comment signs
    /*    this.searchForm.controls["rows"].valueChanges.subscribe(rows => {
          const query = JSON.parse(JSON.stringify(this.query));
          query.queryParams.rows = rows;
          query.queryParams.start = 0;
          this.updateQueryService.updateQuery(query);
        });*/
  }

  //Werte des Abfrage-Formats in Input-Felder im Template schreiben
  setFormInputValues() {

    //aktuellen Startwert merken (dieser wird beim Setzen der Felder auf 0 gesetzt) und ganz am Ende setzen
    const start = this.query.queryParams.start;

    //Anzahl der Treffer in Select im Template auswaehlen -> kein Event ausloesen, da sonst Mehrfachsuche
    this.searchForm.get("rows").setValue(this.query.queryParams.rows, {emitEvent: false});

    //gemerkten Startwert wieder setzen (war zwischenzeitlich auf 0 gesetzt worden)
    this.query.queryParams.start = start;
  }


  addBasketToFormArray(basket: Basket) {
    const basketArray = this.searchForm.get("baskets") as FormArray;
    //Neue Merkliste in FormArray eintragen (fuer Names-Input)
    basketArray.push(this.formBuilder.control((basket.name)));

    //Aenderungen des Namens-Inputs verfolgen, dazu ueber Controls gehen
    // TODO: Simplify
    basketArray.controls.forEach(control => {

      //Bei letztem Control = neue eingefuegtes
      if (basketArray.controls.indexOf(control) === basketArray.controls.length - 1) {

        //Aenderungen verfolgen
        control.valueChanges.subscribe(
          () => {

            //Index im Formarray finden, damit passende Stelle in savedBasket-Array gefunden wird
            const index = basketArray.controls.indexOf(control);

            //an passender Stelle in savedBaskets den Wert angleichen
            this.basketsStoreService.savedBasketItems[index].name = control.value;
          }
        )
      }
    });
  }
}
