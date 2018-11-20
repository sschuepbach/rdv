import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../services/form.service';
import { QueriesStoreService } from '../services/queries-store.service';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromSearch from '../reducers';
import * as fromFormActions from '../actions/form.actions';
import * as fromQueryActions from '../actions/query.actions';
import * as fromBasketActions from '../actions/basket.actions';
import { environment } from '../../../environments/environment';
import { hashCode } from '../../shared/utils';

//Komprimierung von Link-Anfragen (Suchanfragen, Merklisten)
declare var LZString: any;


@Component({
  selector: 'app-search',
  template: `
    <div class="container mt-2">

      <form *ngIf="formService.searchForm"
            [formGroup]="formService.searchForm"
            class="mt-2">

        <!-- <pre style="position: fixed; right: 10px; top: 10px">{{updateQueryService.queryFormat | json}}</pre> -->
        <!-- <pre style="position: fixed; right: 10px; top: 10px">{{savedBaskets | json}}</pre> -->

        <app-manage-search [parentFormGroup]="formService.searchForm" (resetSearch)="resetSearch()"></app-manage-search>

        <app-search-params></app-search-params>

        <app-results [parentFormGroup]="formService.searchForm">
        </app-results>

      </form>
    </div>
  `,
})

export class SearchComponent implements OnInit, OnDestroy {

  private formData: any;
  private baskets: any;

  private static loadQueryFromUrl(params: any) {
    return JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("search")));
  }

  private static loadQueryFromLocalStorage() {
    return JSON.parse(localStorage.getItem("userQuery"));
  }

  constructor(private queriesStoreService: QueriesStoreService,
              public formService: FormService,
              private route: ActivatedRoute,
              private rootStore: Store<fromRoot.State>,
              private searchStore: Store<fromSearch.State>) {

    searchStore.pipe(select(fromSearch.getFormValues))
      .subscribe(vals => {
        this.formData = vals;
        this.searchStore.dispatch(new fromQueryActions.MakeSearchRequest({...vals, queryParams: environment.queryParams}));
      });
    searchStore.pipe(select(fromSearch.getCurrentBasket))
      .subscribe(basket => {
        this.searchStore.dispatch(new fromQueryActions.MakeBasketRequest(basket))
      });
    searchStore.pipe(select(fromSearch.getAllBaskets)).subscribe(baskets => this.baskets = baskets);
  }

  //Bevor die Seite verlassen wird (z.B. F5 druecken)
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler() {
    this.writeToLocalStorage();
  }

  ngOnDestroy(): void {
    this.writeToLocalStorage();
  }

  ngOnInit() {

    let initialBasketsExist = false;

    this.route.queryParamMap.subscribe(params => {
      if (params.get("search")) {
        this.searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent.loadQueryFromUrl(params)));
      } else if (localStorage.getItem("userQuery")) {
        this.searchStore.dispatch(new fromQueryActions.MakeSearchRequest(SearchComponent.loadQueryFromLocalStorage()));
      }

      if (params.get("basket")) {
        const compressedBasket = params.get("basket");
        const basketFromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(compressedBasket));
        const hash = hashCode();
        this.searchStore.dispatch(new fromBasketActions.AddBasket({basket: {...basketFromLink, id: hash}}));

        this.searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
        initialBasketsExist = true;
      }
    });

    //gespeicherte Suchanfragen aus localstorage laden -> vor Form-Erstellung, damit diese queries fuer den Validator genutzt werden koennen
    const localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");
    if (localStorageSavedUserQueries) {
      // TODO: Implement store slice for savedQueries
      this.queriesStoreService.savedQueries = JSON.parse(localStorageSavedUserQueries);
    }

    //versuchen gespeicherte Merklisten aus localstorage zu laden -> nach Form-Erstellung
    const localStorageSavedUserBaskets = localStorage.getItem("savedBaskets");
    if (localStorageSavedUserBaskets && JSON.parse(localStorageSavedUserBaskets).length) {
      const parsedBaskets = JSON.parse(localStorageSavedUserBaskets).map((x: any) => {
        return {...x, id: hashCode()}
      });
      this.searchStore.dispatch(new fromBasketActions.AddBaskets({baskets: parsedBaskets}));
      this.searchStore.dispatch(new fromBasketActions.SelectBasket({id: parsedBaskets[0].id}));
      initialBasketsExist = true;
    }

    if (!initialBasketsExist) {
      const hash = hashCode();
      this.searchStore.dispatch(new fromBasketActions.AddBasket({
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
      this.searchStore.dispatch(new fromBasketActions.SelectBasket({id: hash}));
    }
  }

  resetSearch() {
    this.searchStore.dispatch(new fromFormActions.ResetAll());
  }

  //Werte wie aktuelle Anfrage oder gespeicherte Anfragen in den localstroage schreiben (z.B. wenn Seite verlassen wird)
  private writeToLocalStorage() {
    //aktuelle UserQuery speichern
    localStorage.setItem("userQuery", JSON.stringify({...this.formData, queryParams: environment.queryParams}));

    //Array der gespeicherten UserQueries speichern
    // TODO: Implement store slice for savedQueries
    localStorage.setItem("savedUserQueries", JSON.stringify(this.queriesStoreService.savedQueries));

    //Array der Merklisten speichern
    localStorage.setItem("savedBaskets", JSON.stringify(this.baskets));
  }

}

//Bug: Enter in Suchfeld

//TODO kann Suche immer angestossen werden, wenn Wert in queryFormat angepasst wird? -> Fkt. / Service
//TODO Slider / Chart
//TODO elasticsearch vs. solr-service -> data-service mit useconfig
//TODO i18n AND OR -> UND / ODER
//TODO Baum-Suche
//TODO Merklisten / Anfragen umsortieren
//TODO Aufteilung in einzelne Komponenten

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
