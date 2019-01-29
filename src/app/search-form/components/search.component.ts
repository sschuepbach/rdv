import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import {ActivatedRoute} from '@angular/router';
import {select, Store} from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import * as fromBasketActions from '../actions/basket.actions';
import * as fromBasketResultActions from '../actions/basket-result.actions'
import * as fromSavedQueryActions from '../actions/saved-query.actions';
import {environment} from '../../../environments/environment';
import {randomHashCode} from '../../shared/utils';
import {filter} from "rxjs/operators";

declare var LZString: any;


@Component({
  selector: 'app-search',
  template: `
    <div class="container mt-2">
      <app-manage-search></app-manage-search>
      <app-search-params></app-search-params>
      <app-result-lists></app-result-lists>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SearchComponent implements OnInit, OnDestroy {
  private _baskets: any;
  private _savedQueries: any;
  private _combinedQuery: any;

  private static _loadQueryFromUrl(params: any) {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("search")));
  }

  private static _loadQueryFromLocalStorage() {
    return JSON.parse(localStorage.getItem("userQuery"));
  }

  constructor(private _route: ActivatedRoute,
              private _rootStore: Store<fromRoot.State>,
              private _searchStore: Store<fromSearch.State>) {

    _searchStore.pipe(select(fromSearch.getCombinedQuery))
      .subscribe(vals => {
        this._combinedQuery = vals;
        this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(vals));
      });
    _searchStore.pipe(select(fromSearch.getCurrentBasket),
      filter(x => !!x))
      .subscribe(basket => {
        this._searchStore.dispatch(new fromBasketResultActions.ClearBasketResults());
        this._searchStore.dispatch(new fromQueryActions.MakeBasketSearchRequest(basket));
      });
    _searchStore.pipe(select(fromSearch.getAllBaskets)).subscribe(baskets => this._baskets = baskets);
    _searchStore.pipe(select(fromSearch.getAllSavedQueries)).subscribe(savedQueries => this._savedQueries = savedQueries);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this._writeToLocalStorage();
  }

  ngOnInit() {
    this._route.queryParamMap.subscribe(params => {
      if (params.get("search")) {
        this._searchRequestFromUrl(params);
      } else if (localStorage.getItem("userQuery")) {
        this._searchRequestFromLocalStorage();
      }

      if (params.get("basket")) {
        this._loadBasketFromUrl(params);
      } else if (localStorage.getItem("savedBaskets") && JSON.parse(localStorage.getItem("savedBaskets")).length) {
        this._loadBasketFromLocalStorage();
      } else {
        this._generateInitialBasket();
      }
    });

    this._loadSavedSearchQueries();
  }

  ngOnDestroy(): void {
    this._writeToLocalStorage();
  }

  private _searchRequestFromUrl(params) {
    this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent._loadQueryFromUrl(params)));
  }

  private _searchRequestFromLocalStorage() {
    this._searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent._loadQueryFromLocalStorage()));
  }

  private _loadBasketFromUrl(params) {
    const compressedBasket = params.get("basket");
    const basketFromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedBasket));
    const hash = randomHashCode();
    this._searchStore.dispatch(new fromBasketActions.ClearBaskets());
    this._searchStore.dispatch(new fromBasketActions.AddBasket({basket: {...basketFromLink, id: hash}}));

    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
  }

  private _loadSavedSearchQueries() {
    const localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");
    if (localStorageSavedUserQueries) {
      this._searchStore.dispatch(new fromSavedQueryActions.AddSavedQueries({savedQueries: JSON.parse(localStorageSavedUserQueries)}));
    }
  }

  private _loadBasketFromLocalStorage() {
    const parsedBaskets = JSON.parse(localStorage.getItem("savedBaskets")).map((x: any) => {
      return {...x, id: randomHashCode()}
    });
    this._searchStore.dispatch(new fromBasketActions.ClearBaskets());
    this._searchStore.dispatch(new fromBasketActions.AddBaskets({baskets: parsedBaskets}));
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: parsedBaskets[0].id}));
  }

  private _generateInitialBasket() {
    const hash = randomHashCode();
    this._searchStore.dispatch(new fromBasketActions.AddBasket({
      basket: {
        id: hash,
        name: 'Meine Merkliste 1',
        ids: [],
        queryParams: {
          rows: environment.queryParams.rows,
          start: environment.queryParams.start,
          sortField: environment.queryParams.sortField,
          sortDir: environment.queryParams.sortDir,
        }
      }
    }));
    this._searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
  }

  private _writeToLocalStorage() {
    localStorage.setItem("userQuery", JSON.stringify(this._combinedQuery));
    localStorage.setItem("savedUserQueries", JSON.stringify(this._savedQueries));
    localStorage.setItem("savedBaskets", JSON.stringify(this._baskets));
  }
}

//Bug: Enter in Suchfeld

//TODO kann Suche immer angestossen werden, wenn Wert in queryFormat angepasst wird? -> Fkt. / Service
//TODO Slider / Chart
//TODO elasticsearch vs. solr-service -> data-service mit useconfig
//TODO i18n AND OR -> UND / ODER
//TODO Baum-Suche
//TODO Merklisten / Anfragen umsortieren

//Bereiche ein- / ausblenden

//TODO debounce + distinct bei Suchanfrage
//TODO style zu CSS umarbeiten
//TODO Merklisten Export
//TODO Trefferliste pills / paging mit position absolute
//Mehrfach-Abfrage verhindern bei Laden einer Query  this.term.setValue(choice, {emitEvent: false});
//We write the choice in the term to see it in the input
//Filters als property (FormGroup)
//mehrere Felder für Sortierung
//Filter in Uebersicht oben anzeigen
//Overflow bei Facetten scroll-y
