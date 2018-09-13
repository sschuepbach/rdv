//Fuer Config anpassen
//import { BackendSearchService } from "app/services/solr-search.service";
import { BackendSearchService } from "app/services/elastic-search.service";
import { environment } from '../../../environments/environment';

import { Component, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
//Forms
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
//eigene Format-Klassen
import { QueryFormat } from "app/models/query-format";
import { SavedQueryFormat } from "app/search-form/models/saved-query-format";
import { BasketFormat } from 'app/search-form/models/basket-format';
//Config
import { UserConfigService } from 'app/services/user-config.service';
//Slider-Plugin
import { IonRangeSliderComponent } from "ng2-ion-range-slider";
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

//Komprimierung von Link-Anfragen (Suchanfragen, Merklisten)
declare var LZString: any;

//Validator-Funktion stellt sicher, dass jede gespeicherte Suche einen eindeutigen Namen hat
function uniqueQueryNameValidator(savedQueries: SavedQueryFormat[]) {
  return (control: FormControl) => {

    //Error-Objekt
    let error = null;

    //Ueber gespeicherte Anfragen gehen
    savedQueries.forEach(function (query) {

      //Wenn Name bereits vorhanden
      if (control.value === query.name) {

        //Fehlerobjekt setzen
        error = {
          uniqueQueryName: {valid: false}
        };
      }
    });

    //Fehlerobjekt zurueckgeben (null, wenn kein Fehler)
    return error;
  }
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy {

  //Variable fuer SliderElemente -> bei Reset zuruecksetzen
  @ViewChildren('sliderElement') sliderElement: QueryList<IonRangeSliderComponent>;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.count / this.queryFormat.queryParams.rows);
  }

  //Anzahl der Merklisten-Seiten gesamt
  get basketPages(): number {

    //Anzahl der Merklisten-Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.ceil(this.basketSize / this.mainConfig.basketConfig.queryParams.rows);
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.queryFormat.queryParams.start / this.queryFormat.queryParams.rows) + 1;
  }

  //aktuelle Merklisten-Seite beim Blaettern
  get basketPage(): number {

    //Wenn es Merklisten gibt
    if (this.savedBaskets.length) {

      //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
      return Math.floor(this.activeBasket.queryParams.start / this.mainConfig.basketConfig.queryParams.rows) + 1;
    } else {

      //0 zurueck
      return 0;
    }
  }

  //property: aktive Merkliste
  get activeBasket(): BasketFormat {

    //passenden Index des Merklisten-Arrays zurueckgeben
    return this.savedBaskets[this.activeBasketIndex];
  }

  //property: Anzahl der Treffer in der Merkliste
  get basketSize(): number {

    //Wenn es Merklisten gibt
    if (this.savedBaskets.length) {

      //Anzahl der IDs in aktiver Merkliste zurueckgeben
      return this.activeBasket.ids.length;
    } else {

      //0 zurueck
      return 0;
    }
  }

  //Config-Objekt (z.B. Felder der Trefferliste)
  mainConfig = {
    ...environment,
    generatedConfig: {}
  };

  //Such-Form
  searchForm: FormGroup;

  //Name-Input fuer Suche speichern
  saveQuery: FormControl;

  //Alle Infos zu Suchanfrage hier speichern
  queryFormat: QueryFormat;

  //Array der gespeicherten Suchanfragen
  savedQueries: SavedQueryFormat[] = [];

  //Index, welche Merkliste gerade aktiv ist. Zu Beginn soll erste Merkliste aktiv sein
  activeBasketIndex = 0;

  //Aray der Merklisten
  savedBaskets: BasketFormat[] = [];

  //Liste der Merklistennamen erhalten
  get baskets(): FormArray {

    //als FormArray zureuckgeben, damit .push() angeboten wird
    return this.searchForm.get("baskets") as FormArray;
  }

  //Results der Suchanfrage als Observable
  results: Observable<any>;

  //Results der Merkliste als Observable
  basketResults: Observable<any>;

  //docs Bereich der Server-Antwort (abgeleitet von results) fuer Treffertabelle
  docs: any[];

  //docs Bereich der Server-Antwort (abgeleitet von results) fuer Merklistentabelle
  basketDocs: any[];

  //Facetten (abgeleitet von results)
  facets = {};

  //Ranges (fuer Chart, abgeleitet von results)
  ranges;

  //Ranges (leere Wert, z.B. Titel ohne Jahr fuer Checkbox, abgeleitet von results)
  rangeMissingValues = {};

  //Daten fuer Slider und Diagrammerzeugunge
  rangeData = {};

  //Trefferanzahl der Backend-Antwort. Zu Beginn 0 Treffer (spaeter abgeleitet von results)
  count = 0;

  //speichert den Zustand, ob mind. 1 Textsuchfeld nicht leer ist
  searchFieldsAreEmpty = true;

  //Nach welcher Spalte wird gerade sortiert bei Trefferliste / Merkliste fuer farbliche Hinterlegung der Spalte
  sortColumnSearch = 0;
  sortColumnBasket = 0;

  //BehaviorSubject speichert Such-Anfragen
  private complexSearchTerms: BehaviorSubject<QueryFormat>;

  //BehaviorSubject speichert Merklisten-Anfragen
  private basketSearchTerms: BehaviorSubject<BasketFormat>;

  //Eintragsdetails (abstract,...) zwischenspeichern, damit sie nicht immer geholt werden muessen
  detailDataArray: any[] = [];

  //Infos aus Link laden, verhindern, dass Link-Query von localStorage ueberschrieben wird
  loadFromLink = false;
  basketFromLinkData = "";
  exportListData;

  //BackendSearch, FormBuilder, ActivedRoute, UserConfigService injecten
  constructor(private backendSearchService: BackendSearchService,
              private _fb: FormBuilder,
              private route: ActivatedRoute,
              private userConfigService: UserConfigService,
              private sanitizer: DomSanitizer) {
    userConfigService.getConfig();
    userConfigService.config$.subscribe(res => this.mainConfig = res);
  }

  //Bevor die Seite verlassen wird (z.B. F5 druecken)
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {

    //Werte in Localstorage speichern, damit sie beim Zurueckkehren wieder da sind
    this.writeToLocalStorage();
  }

  //Bei Wegnavigieren (z.B. auf Beschreibungsseite)
  ngOnDestroy(): void {

    //Werte im Localstorage speichern, damit sie beim Zurueckkehren wieder da sind
    this.writeToLocalStorage();
  }

  //Component-Init
  ngOnInit() {

    //QueryFormat erzeugen lassen
    this.queryFormat = this.userConfigService.getQueryFormat();

    //Behavior-Subjekt anlegen mit Initialwert queryFormat (enthaelt ggf. Werte, die aus localstorage geladen werden)
    this.complexSearchTerms = new BehaviorSubject<QueryFormat>(this.queryFormat);

    //Suche anmelden: Bei Aenderungen des Suchfeld-BehaviorSubjekts searchTerms
    this.results = this.complexSearchTerms

    //Term an Suchanfrage weiterleiten -> Ergebnis wird in Docs gespeichert
      .switchMap((query: QueryFormat) => this.backendSearchService.getBackendDataComplex(query));

    //Aenderungen bei results (=Backend-Suche-Anfrage) und Werte extrahieren
    this.results.subscribe(results => {

      //Array der Treffer-Dokumente
      this.docs = results.response.docs;

      //Anzahl der Treffer
      this.count = results.response.numFound;

      //Facetten-Werte
      this.facets = results.facet_counts.facet_fields;

      //Facetten-Ranges Werte
      this.ranges = results.facet_counts.facet_ranges;

      //Werte fuer nicht existirende Range-Werte (z.B. Eintraege ohne Jahr)
      this.rangeMissingValues = results.facet_counts.facet_queries;

      //Spalte herausfinden, nach der die Trefferliste gerade sortiert wird
      this.setSortColumnIndex();

      //Jahres-Chart erstellen
      this.createCharts();
    });


    //Query-Parameter aus URL auslesen
    this.route.queryParamMap.subscribe(params => {

      //Wenn Query-Parameter gesetzt ist (?search=dfewjSDFjklh)
      if (params.get("search")) {

        //diesen zu queryFormat dekodieren
        this.queryFormat = JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("search")));

        //Flag setzen, damit nicht Wert aus localstorage genommen wird
        this.loadFromLink = true;
      }

      //Wenn Merklisten-Parameter gesetzt ist (?basket=WEdszuig)
      if (params.get("basket")) {
        this.basketFromLinkData = params.get("basket");
      }
    });

    //Wenn keine Anfrage per Link geschickt wurde
    if (!this.loadFromLink) {

      //versuchen letzte Suche aus localstorage zu laden
      const localStorageUserQuery = localStorage.getItem("userQuery");

      //Wenn Suchanfrage aus localstorage geladen werden konnte
      if (localStorageUserQuery) {

        //Anfrage-Format laden
        this.queryFormat = JSON.parse(localStorageUserQuery);
      }
    }

    //gespeicherte Suchanfragen aus localstorage laden -> vor Form-Erstellung, damit diese queries fuer den Validator genutzt werden koennen
    const localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");

    //wenn gespeicherte Suchen aus localstorage geladen wurden
    if (localStorageSavedUserQueries) {

      //gespeicherte Suchen aus localstorage holen
      this.savedQueries = JSON.parse(localStorageSavedUserQueries);
    }

    //Reactive Forms fuer Suchfelder und Suche erstellen, dabei werden die initialen Wert gesetzt und die onChange-Methoden definiert
    this.createForms();

    //min- / max-Werte fuer Slider, Labels und Optionen fuer Chart setzen
    this.setRangeData();

    //Slider Werte setzen
    this.sliderInit();

    //versuchen gespeicherte Merklisten aus localstorage zu laden -> nach Form-Erstellung
    const localStorageSavedUserBaskets = localStorage.getItem("savedBaskets");

    //wenn es ein Merklisten-Merkmal im localstorage gibt
    if (localStorageSavedUserBaskets) {

      //Wenn es Merklisten im localstorage gibt (kein leeres Array)
      if (JSON.parse(localStorageSavedUserBaskets).length) {

        //gespeicherte Suchen aus localstorage holen
        const lsBaskets = JSON.parse(localStorageSavedUserBaskets);

        //Ueber gespeicherte Merklisten gehen
        for (const lsBasket of lsBaskets) {

          //damit Merkliste anlegen
          this.createBasket(true, lsBasket);
        }
      }
    }

    if (this.basketFromLinkData !== "") {

      //diesen dekodieren
      const basketFromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(this.basketFromLinkData));

      //daraus Merkliste erstellen
      this.createBasket(true, basketFromLink);
    }

    //Merkliste anlegen (falls keine aus localstorage geladen wurden oder per Link importiert wurde)
    if (!this.savedBaskets.length) {

      //Leere Merkliste anlegen
      this.createBasket(true);
    }

    //Behavior-Subject anlegen fuer Merklisten anlegen mit Intitalwert = derzeit aktiver Merkliste
    this.basketSearchTerms = new BehaviorSubject<BasketFormat>(this.activeBasket);

    //Suche anmelden: Bei Aenderungen der aktiven Merkliste
    this.basketResults = this.basketSearchTerms

    //Merklistenanfrage mit IDs und Sortierinfo abschicken
      .switchMap((basket: BasketFormat) => this.backendSearchService.getBackendDataBasket(basket));

    //Aenderungen bei results (=Backend-Suche-Anfrage) und Werte extrahieren
    this.basketResults.subscribe(basketResults => {

      //Array der Treffer-Dokumente der Merkliste
      this.basketDocs = basketResults.response.docs;

      //Spalte herausfinden, nach der die Merkliste gerade sortiert wird
      this.setSortColumnIndex('basket');
    });

    this.checkIfSearchFieldsAreEmpty();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //FormControls fuer Suchanfragen und Speicherung von Suchanfragen anlgen
  createForms(): any {

    //Such-Form
    this.searchForm = this._fb.group({

      //Anzahl der Zeilen in der Treffertabelle mit Wert aus queryFormat belegen
      rows: this.queryFormat.queryParams.rows,

      //Merklisten als FormArray
      baskets: this._fb.array([]),

      //Objekt fuer Filter (Filter 1: Auswahl der Einrichtung, Filter 2 mit/ohne Upload,...)
      filters: this._fb.group({}),

      //Eingabefeld fuer Name der zu speichernden Suche
      saveQuery: [
        'Meine Suche ' + (this.savedQueries.length + 1),
        [Validators.required, Validators.minLength(3), uniqueQueryNameValidator(this.savedQueries)]
      ]
    });

    //Wenn Anzahl der Zeilen in Treffertabelle geandert wird
    this.searchForm.controls["rows"].valueChanges.subscribe(rows => {

      //Zeilen-Anzahl in Abfrage-Format setzen
      this.queryFormat.queryParams.rows = rows;

      //Trefferliste wieder von vorne anzeigen
      this.queryFormat.queryParams.start = 0;

      //Suche starten
      this.complexSearchTerms.next(this.queryFormat);
    });

    //FormControls fuer Suchfelder und deren Auswahlselects festlegen
    for (const key of Object.keys(this.queryFormat.searchFields)) {

      //Select-Feld fuer Auswahl des Feldes (z.B. Freitext, Titel, Person,...) und direkt mit Wert belegen
      this.searchForm.addControl('selectSearchField_' + key, new FormControl(this.queryFormat.searchFields[key].field));

      //Bei Aenderung des Selects
      this.searchForm.controls['selectSearchField_' + key].valueChanges.subscribe(value => {

        //Wert in queryFormat speichern
        this.queryFormat.searchFields[key].field = value;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
      });

      //Suchfeld einfuegen und direkt mit Wert belegen
      this.searchForm.addControl('searchField_' + key, new FormControl(this.queryFormat.searchFields[key].value));

      //Bei Aenderung des Suchfelds
      this.searchForm.controls['searchField_' + key].valueChanges.subscribe(value => {

        //Wert in Query-Format anpassen
        this.queryFormat.searchFields[key].value = value;

        //Start der Trefferliste auf Anfang setzen
        this.queryFormat.queryParams.start = 0;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);

        //Pruefen, ob alle Suchfelder leer sind (in diesem Fall wird oben der Hinweis "alle Titel anzeigen" angezeigt)
        this.checkIfSearchFieldsAreEmpty();
      });
    }

    //FormControls fuer Checkenboxen erstellen, die festlegen, ob Titel ohne ein Merkmal (z.B. Titel ohne Jahr) angezeigt werden sollen
    for (const key of Object.keys(this.queryFormat.rangeFields)) {

      //FormControl fuer Checkbox anlegen und direkt anhaken (falls gesetzt)
      this.searchForm.addControl('showMissing_' + key, new FormControl(this.queryFormat.rangeFields[key].showMissingValues));

      //Bei Aenderung der Checkbox
      this.searchForm.controls['showMissing_' + key].valueChanges.subscribe(checked => {

        //Wert setzen
        this.queryFormat.rangeFields[key].showMissingValues = checked;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
      });
    }

    //FormControls fuer Selects erstellen, die festlegen wie die Werte einer Facette kombiniert werden (ger and eng) vs (ger or eng)
    for (const key of Object.keys(this.queryFormat.facetFields)) {

      //FormControl nur erstellen, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.mainConfig.facetFields[key].operators.length > 1) {

        //FormControl anlegen und direkt mit Wert belegen
        this.searchForm.addControl('operatorSelect_' + key, new FormControl(this.queryFormat.facetFields[key].operator));

        //Bei Anederung des Selects
        this.searchForm.controls['operatorSelect_' + key].valueChanges.subscribe(value => {

          //Wert in queryFormat speichern
          this.queryFormat.facetFields[key].operator = value;

          //Suche starten
          this.complexSearchTerms.next(this.queryFormat);
        })
      }
    }

    //FormControls fuer Filter selbst (=FormArray) und einzelne Checkboxen der Filterauswahlmoeglichkeiten (=FormControl) setzen
    for (const filter of Object.keys(this.mainConfig.filterFields)) {

      //FormArray anlegen pro Filter (z.B. 1. Filter Institutionsauswahl, 2. Filter mit/ohne Datei-Auswahl)
      (this.searchForm.controls['filters'] as FormGroup).addControl(filter, new FormArray([]));

      //Ueber moegliche Filterwerte dieses Filters gehen
      for (const filter_data of this.mainConfig.filterFields[filter].options) {

        //pruefen, ob Filter im QueryFormat als ausgewaehlt hinterlegt ist
        const checked = this.queryFormat.filterFields[filter].values.indexOf(filter_data.value) > -1;

        //FormControl fuer moeligche Filterwerte als Checkbox (z.B. Instiutionen: [UB Freiburg, KIT,...])
        ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).push(this._fb.control(checked));

        //Aenderungen des Checkbox-Inputs verfolgen, dazu ueber Controls gehen
        ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.forEach(control => {

          //Bei letztem Control = neue eingefuegtes
          if (((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.indexOf(control) ===
            ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.length - 1) {

            //Aenderungen verfolgen
            control.valueChanges.subscribe(
              () => {

                //Index des Controls in FormArray finden
                const index = ((this.searchForm.controls['filters'] as FormGroup).controls[filter] as FormArray).controls.indexOf(control);

                //Ueber den Index den konkreten Suchewert in Config finden, der an Backend geschickt wird
                const value = this.mainConfig.filterFields[filter].options[index].value;

                //Wenn Checkbox angehakt wurde
                if (control.value) {

                  //Suchwert in QueryFormat speichern
                  this.queryFormat.filterFields[filter].values.push(value);
                } else {

                  //Stelle in QueryFormat finden, wo der Suchwert steht
                  const removeIndex = this.queryFormat.filterFields[filter].values.indexOf(value);

                  //Suchwert aus QueryFormat entfernen
                  this.queryFormat.filterFields[filter].values.splice(removeIndex, 1);
                }

                //Neue Suchabschicken
                this.complexSearchTerms.next(this.queryFormat);
              }
            )
          }
        });
      }
    }
  }

  //Facette speichern
  selectFacet(field, value) {

    //Facettenwert in Array speichern
    this.queryFormat.facetFields[field]["values"].push(value);

    //Start der Trefferliste auf Anfang setzen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Facette entfernen
  removeFacet(field, value) {

    //Index der ausgewaehlten Facette finden anhand des Namens
    const index = this.queryFormat.facetFields[field]["values"].indexOf(value);

    //TODO an Start der Trefferliste springen?

    //in Array loeschen
    this.queryFormat.facetFields[field]["values"].splice(index, 1);

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Suche zuruecksetzen
  resetSearch() {

    //Anfrage-Format neu erzeugen lassen
    this.queryFormat = this.userConfigService.getQueryFormat();

    //Input-Felder in Template zureucksetzen
    this.setFormInputValues();

    //Ueber Slider gehen
    this.sliderElement.toArray().forEach((value) => {

      //Werte zuruecksetzen
      value.reset();
    });

    //Slider zuruecksetzen
    this.sliderInit();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Detailinfo holen und Ansicht toggeln
  getFullData(id: string) {

    //Wenn es noch keine Detailinfos (abstract,...) dieser ID gibt
    if (this.detailDataArray[id] === undefined) {

      //Infos aus Backend holen und lokal speichern. Eintrag sichtbar machen
      this.backendSearchService.getBackendDetailData(id).subscribe(
        res => this.detailDataArray[id] = {"data": res, "visible": true});
    } else {

      //Sichtbarkeit toggeln
      this.detailDataArray[id]["visible"] = !this.detailDataArray[id]["visible"];
    }
  }

  //Werte des Abfrage-Formats in Input-Felder im Template schreiben
  setFormInputValues() {

    //aktuellen Startwert merken (dieser wird beim Setzen der Felder auf 0 gesetzt) und ganz am Ende setzen
    const start = this.queryFormat.queryParams.start;

    //Ueber Felder des Abfrage-Formats gehen
    for (const key of Object.keys(this.queryFormat.searchFields)) {

      //das ausgewaehlte Suchefeld in Template setzen (z.B. Freitext, Titel, Person,...) -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get('selectSearchField_' + key).setValue(this.queryFormat.searchFields[key].field, {emitEvent: false});

      //Wert in Input-Feld im Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get('searchField_' + key).setValue(this.queryFormat.searchFields[key].value, {emitEvent: false})
    }

    //Operator bei Verknuepfung der Facettenwerte setzen
    for (const key of Object.keys(this.queryFormat.facetFields)) {

      //Es existiert nur dann ein FormControl, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.mainConfig.facetFields[key].operators.length > 1) {

        //Wert aus QueryFormat holen und in Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
        this.searchForm.get('operatorSelect_' + key).setValue(this.queryFormat.facetFields[key].operator, {emitEvent: false});
      }
    }

    //Checkboxen anhaken, bei welchen Ranges auch Titel ohne Merkmal gesucht werden sollen (z.B. Titel ohne Jahr)
    for (const key of Object.keys(this.queryFormat.rangeFields)) {

      //Wert aus QueryFormat holen und in Template setzen -> kein Event ausloesen, da sonst Mehrfachsuche
      this.searchForm.get("showMissing_" + key).setValue(this.queryFormat.rangeFields[key].showMissingValues, {emitEvent: false});
    }

    //Checkboxen bei Filtern anhaken, dazu ueber Filter gehen (Filter 1: Institutionsfilter, Filter 2: mit/ohne Datei-Filter,...)
    for (const key of Object.keys(this.mainConfig.filterFields)) {

      //Ueber moegliche Filterwerte eines Filters gehen (Institutionen: [UB Freiburg, KIT,...])
      this.mainConfig.filterFields[key].options.forEach((filter_data, index) => {

        //Pruefen ob Wert in QueryFormat angehakt ist
        const checked = this.queryFormat.filterFields[key].values.indexOf(filter_data.value) > -1;

        //Checkbox anhakden (falls gesetzt) -> kein Event ausloesen, da sonst Mehrfach-Anfrage an Backend
        ((this.searchForm.controls['filters'] as FormGroup).controls[key] as FormArray).at(index).setValue(checked, {emitEvent: false});
      });
    }

    //Anzahl der Treffer in Select im Template auswaehlen -> kein Event ausloesen, da sonst Mehrfachsuche
    this.searchForm.get("rows").setValue(this.queryFormat.queryParams.rows, {emitEvent: false});

    //gemerkten Startwert wieder setzen (war zwischenzeitlich auf 0 gesetzt worden)
    this.queryFormat.queryParams.start = start;
  }

  //Neue Merkliste anlegen
  createBasket(init: boolean = false, basket: BasketFormat = null) {

    //Variable fuer Basket
    let newBasket;

    //Wenn kein BasketFormat-Objekt mitgeschickt wurde
    if (basket === null) {

      //Neues BasketFormat-Objekt anlegen mit Namen "Meine Merkliste X" + Sortierkriterium
      newBasket = new BasketFormat("Meine Merkliste " + (this.baskets.length + 1),
        this.mainConfig.basketConfig.queryParams.sortField,
        this.mainConfig.basketConfig.queryParams.sortDir,
        this.mainConfig.basketConfig.queryParams.rows);
    } else {

      //dieses verwenden
      newBasket = basket;
    }

    //Merkliste in Array der lokalen Merklisten einfuegen
    this.savedBaskets.push(newBasket);

    //Neue Merkliste in FormArray eintragen (fuer Names-Input)
    this.baskets.push(this._fb.control(newBasket.name));

    //Aenderungen des Namens-Inputs verfolgen, dazu ueber Controls gehen
    this.baskets.controls.forEach(control => {

      //Bei letztem Control = neue eingefuegtes
      if (this.baskets.controls.indexOf(control) === this.baskets.controls.length - 1) {

        //Aenderungen verfolgen
        control.valueChanges.subscribe(
          () => {

            //Index im Formarray finden, damit passende Stelle in savedBasket-Array gefunden wird
            const index = this.baskets.controls.indexOf(control);

            //an passender Stelle in savedBaskets den Wert angleichen
            this.savedBaskets[index].name = control.value;
          }
        )
      }
    });

    //Neuer Basket (ganz hinten einfuegt) ist gleich aktiv
    this.activeBasketIndex = this.baskets.length - 1;

    //Wenn es sich nicht um den Init-Aufruf handelt
    if (!init) {

      //Merklisten-Suche abschicken (liefert leere Treffermenge, da noch keine ID in Merkliste gespeichert ist)
      this.basketSearchTerms.next(this.activeBasket);
    }
  }

  //Merkliste laden
  loadBasket(index: number) {

    //Diese Merkliste zur aktiven machen
    this.activeBasketIndex = index;

    //Merklisten-Suche starten
    this.basketSearchTerms.next(this.activeBasket);
  }

  //Merkliste loeschen
  deleteBasket(index: number) {

    //Merkliste in savedBaskets loeschen
    this.savedBaskets.splice(index, 1);

    //Merkliste an passender Stelle loeschen aus FormArray (Namens-Input)
    this.baskets.removeAt(index);

    //Wenn der geloeschte Basket vor dem aktivem Basket kommt
    if (index < this.activeBasketIndex) {

      //Variable noch unten anpassen
      this.activeBasketIndex--;
    } else if (index === this.activeBasketIndex) {

      //1. Basket aktiv stellen
      this.activeBasketIndex = 0;
    }

    //Wenn es nach dem Loeschen noch Merklisten gibt
    if (this.savedBaskets.length) {

      //Merklisten-Suche starten
      this.basketSearchTerms.next(this.savedBaskets[this.activeBasketIndex]);
    } else {

      //eine neue Merkliste anlegen
      this.createBasket();
    }
  }

  //ID zu Merkliste hinzufuegen oder entfernen
  toggleInBasket(id: string) {

    //Wenn ID bereits in der Merkliste ist
    if (this.isInBasket(id)) {

      //ID aus aktiver Merkliste loeschen
      this.activeBasket.ids.splice(this.activeBasket.ids.indexOf(id), 1);
    } else {

      //ID in aktive Merkliste einfuegen
      this.activeBasket.ids.push(id);
    }

    //Suchanfrage abschicken
    this.basketSearchTerms.next(this.activeBasket);
  }

  //pruefen ob eine ID in der aktiven Merkliste ist
  isInBasket(id: string) {

    //Wenn es keine Merklisten gibt
    if (this.savedBaskets.length === 0) {

      //kann Eintrag in keiner Merkliste sein
      return false;
    } else {

      //pruefen ob ID in aktiver Merkliste bereits vorkommt
      return (this.savedBaskets[this.activeBasketIndex].ids.indexOf(id) > -1)
    }
  }

  //Nutzeranfrage speichern
  saveUserQuery(name: string) {

    //deep copy von Anfrage-Format erstellen (nicht einfach Referenz zuordnen!)
    const qf = JSON.parse(JSON.stringify(this.queryFormat));

    //Name der gespeicherten Suchanfragen und Anfrage-Format in Objekt packen
    const userQuery = new SavedQueryFormat(name, qf);

    //Objekt in Array einfuegen
    this.savedQueries.push(userQuery);

    //Namensfeld fuer Nutzerabfrage mit Standard-Wert belegen ("Meine Suche 2")
    this.searchForm.controls['saveQuery'].setValue('Meine Suche ' + (this.savedQueries.length + 1));
  }

  //Nutzeranfrage laden
  loadUserQuery(index: number) {

    //Anfrage-Format an passender Stelle aus Array holen
    this.queryFormat = JSON.parse(JSON.stringify(this.savedQueries[index].query));

    //Werte in Input Feldern setzen
    this.setFormInputValues();

    //Slider-Werte setzen
    this.sliderInit();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //gespeicherte Nutzeranfrage loeschen
  deleteUserQuery(index: number) {

    //Suchanfrage an passender Stelle loeschen
    this.savedQueries.splice(index, 1);
    this.searchForm.controls['saveQuery'].updateValueAndValidity();
  }

  //Blaettern in Trefferliste / Merkliste
  updateStart(offset, mode: string = 'search') {

    //neuen Startwert berechnen
    let newStart: number;

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

        //auf letzte Seite springen
        if (offset === 'last') {
          newStart = (this.queryFormat.queryParams.rows * (this.pages - 1));
        } else if (offset === 'first') {
          newStart = 0;
        } else {
          newStart = this.queryFormat.queryParams.start + (offset * this.queryFormat.queryParams.rows);
        }

        //Start anpassen
        this.queryFormat.queryParams.start = newStart;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
        break;

      //Merklistentabelle
      case 'basket':

        //auf letzte Seite springen
        if (offset === 'last') {
          newStart = (this.mainConfig.basketConfig.queryParams.rows * (this.basketPages - 1));
        } else if (offset === 'first') {
          newStart = 0;
        } else {
          newStart = this.activeBasket.queryParams.start + (offset * this.mainConfig.basketConfig.queryParams.rows);
        }

        //Start anpassen
        this.activeBasket.queryParams.start = newStart;

        //Suche starten
        this.basketSearchTerms.next(this.activeBasket);
        break;
    }
  }

  //Treffertabelle / Merkliste sortieren
  sortTable(sortField: string, mode: string = 'search') {

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

        //wenn bereits nach diesem Feld sortiert wird
        if (sortField === this.queryFormat.queryParams.sortField) {

          //Sortierrichtung umdrehen
          this.queryFormat.queryParams.sortDir = this.queryFormat.queryParams.sortDir === "desc" ? "asc" : "desc";
        } else {

          //Sortierfeld setzen
          this.queryFormat.queryParams.sortField = sortField;

          //Sortierrichtung aufsteigend setzen
          this.queryFormat.queryParams.sortDir = 'asc';
        }

        //Trefferliste wieder von vorne anzeigen
        this.queryFormat.queryParams.start = 0;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
        break;

      //Merkliste
      case 'basket':

        //wenn bereits nach diesem Feld sortiert wird
        if (sortField === this.activeBasket.queryParams.sortField) {

          //Sortierrichtung umdrehen
          this.activeBasket.queryParams.sortDir = this.activeBasket.queryParams.sortDir === "desc" ? "asc" : "desc";
        } else {

          //Sortierfeld setzen
          this.activeBasket.queryParams.sortField = sortField;

          //Sortierrichtung aufsteigend setzen
          this.activeBasket.queryParams.sortDir = 'asc';
        }

        //Suche starten
        this.basketSearchTerms.next(this.activeBasket);
        break;
    }
  }

  //gibt eine CSS-Klasse zurueck, wenn nach dieser Spalte sortiert wird
  sortBy(field: string, mode: string = 'search') {

    //CSS-Klasse, davon ausgehen, dass gerade nicht nach diesem Feld sortiert wird
    //(fa-sort = rauf und runter-Symbol, welches anzeigt, dass es ein sortierbares Feld ist)
    let cssClass = "fa-sort";

    //Treffertabelle und Merklistetabelle unterscheiden
    switch (mode) {

      //Treffertabelle
      case 'search':

        //wenn nach diesem Feld sortiert wird
        if (field === this.queryFormat.queryParams.sortField) {

          //anhand der gesetzten Sortierrichtung eine CSS-Klasse setzen
          cssClass = this.queryFormat.queryParams.sortDir === "asc" ? "fa-sort-asc" : "fa-sort-desc";
        }
        break;

      //Merkliste
      case 'basket':

        //wenn nach diesem Feld sortiert wird
        if (field === this.savedBaskets[this.activeBasketIndex].queryParams.sortField) {

          //anhand der gesetzten Sortierrichtung eine CSS-Klasse setzen
          cssClass = this.savedBaskets[this.activeBasketIndex].queryParams.sortDir === "asc" ? "fa-sort-asc" : "fa-sort-desc";
        }
        break;
    }

    //fa-Klasse zurueckgeben
    return cssClass;
  }

  //min- / max-Werte fuer Ranges setzen
  setRangeData() {

    //Ueber Felder des Abfrage-Formats gehen
    for (const key of Object.keys(this.queryFormat.rangeFields)) {

      //leeren Wert fuer rangeMissingValues anlegen (da sonst undefined)
      this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' + this.queryFormat.rangeFields[key].field + ':0'] = 0;

      //Objekt fuer diese Range (z.B. Jahr) anelegen
      this.rangeData[key] = {};

      //Min und Max-Werte aus Query-Format holen
      this.rangeData[key].min = this.queryFormat.rangeFields[key].min;
      this.rangeData[key].max = this.queryFormat.rangeFields[key].max;

      //Leeres Datenarray anlegen
      this.rangeData[key].chartData = [{data: []}];

      //Labels erstellen
      const labelArray = [];

      //von min zu max Wert gehen
      for (let i = this.rangeData[key].min; i <= this.rangeData[key].max; i++) {

        //Werte sammeln (1950, 1951,..., 2017)
        labelArray.push(i);
      }

      //Labels sind aber unsichtbar (werden aber fuer Hover benoetigt)
      this.rangeData[key].chartLabels = labelArray;

      //Prefix fuer Slider
      this.rangeData[key].label = this.mainConfig.rangeFields[key].label;

      //Chart Optionen
      this.rangeData[key].chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            id: 'left',
            afterFit: function (scaleInstance) {
              scaleInstance.width = 40;
            },
            ticks: {
              beginAtZero: true,
              //nur ganze Zahlen bei Achsen-Label
              callback: function (value) {
                if (value % 1 === 0) {
                  return value;
                }
              }
            },
          },
            {
              id: 'right',
              position: 'right',
              display: false,
              afterFit: function (scaleInstance) {
                scaleInstance.width = 40;
              },
            }]
        }
      };
    }
  }

  //Chart erstellen
  createCharts() {

    //Chartdata erstellen
    for (const key of Object.keys(this.queryFormat.rangeFields)) {

      //Werte sammeln
      const barData = [];
      const backendData = this.ranges[this.queryFormat.rangeFields[key].field].counts;

      //Ranges kommen als Array von Arrays [["1800", 2]["1801", 0]["1802", 6],...],
      for (let i = 0; i < backendData.length; i++) {

        //nur den Zaehlwert speichern fuer Chart
        barData.push(backendData[i][1]);
      }

      //Daten fuer Chart speichern
      this.rangeData[key].chartData = [{data: barData}];
    }
  }

  //Slider initialisieren
  sliderInit(key?) {

    //Wenn key uebergeben wird, nur diesen bearbeiten, ansonsten alle keys
    const keys = key ? [key] : Object.keys(this.queryFormat.rangeFields);

    //Ueber Rangewerte gehen
    for (const k of keys) {

      //Von und bis Werte fuer Slider setzen
      this.rangeData[k].from = this.queryFormat.rangeFields[k].from;
      this.rangeData[k].to = this.queryFormat.rangeFields[k].to;

      //Vorhangwerte setzen
      this.rangeData[k].curtainLeft =
        ((1 - (this.rangeData[k].max - this.rangeData[k].from) / (this.rangeData[k].max - this.rangeData[k].min)) * 100) + '%';
      this.rangeData[k].curtainRight =
        ((this.rangeData[k].max - this.rangeData[k].to) / (this.rangeData[k].max - this.rangeData[k].min) * 100) + '%';
    }
  }

  //Beim Ziehen des Sliders
  updateSlider($event, key) {

    //Vorhangswerte setzen
    this.rangeData[key].curtainLeft = $event.from_percent + '%';
    this.rangeData[key].curtainRight = (100 - $event.to_percent) + '%';

    //fq-Werte setzen
    this.queryFormat.rangeFields[key].from = $event.from;
    this.queryFormat.rangeFields[key].to = $event.to;

    //Start der Trefferliste auf Anfang setzen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Anzahl der Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr)
  getMissingCount(key) {

    //lokal gespeicherten Wert zurueckliefern
    return this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' +
    this.queryFormat.rangeFields[key].field + ':0'];
  }

  //Slider auf Anfangswerte zuruecksetzen
  resetRange(key) {

    //Wert in Queryformat anpassen
    this.queryFormat.rangeFields[key].from = this.queryFormat.rangeFields[key].min;
    this.queryFormat.rangeFields[key].to = this.queryFormat.rangeFields[key].max;

    this.sliderInit(key);

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Werte wie aktuelle Anfrage oder gespeicherte Anfragen in den localstroage schreiben (z.B. wenn Seite verlassen wird)
  writeToLocalStorage() {

    //aktuelle UserQuery speichern
    localStorage.setItem("userQuery", JSON.stringify(this.queryFormat));

    //Array der gespeicherten UserQueries speichern
    localStorage.setItem("savedUserQueries", JSON.stringify(this.savedQueries));

    //Array der Merklisten speichern
    localStorage.setItem("savedBaskets", JSON.stringify(this.savedBaskets));
  }

  //Link einer Nutzeranfrage / Merkliste erstellen
  getQueryLink(jsonObject, mode: string = 'search'): string {

    //String aus JSON-Objekt erstellen (dies kann eine QueryFormat oder ein BasketFormat sein)
    const jsonString = JSON.stringify(jsonObject);

    //String komprimieren
    const lzString = LZString.compressToEncodedURIComponent(jsonString);

    //Link zurueckgeben mit Parameter search (Suchanfrage) oder basket (Merkliste)
    return this.mainConfig.baseUrl + "/search?" + mode + "=" + lzString;
  }

  //prueft, ob in mind. 1 der Text-Suchfelder etwas steht
  checkIfSearchFieldsAreEmpty() {

    //davon ausgehen, dass alle Suchefelder leer sind
    let allEmpty = true;

    //Ueber Suchfelder gehen gehen
    for (const key of Object.keys(this.queryFormat.searchFields)) {

      //Wenn Wert gesetzt ist (z.B. bei Freitext-Suche)
      if (this.queryFormat.searchFields[key].value) {

        //Flag aendern
        allEmpty = false;

        //Loop abbrechen (es reicht, dass 1 Feld gesetzt ist)
        break;
      }
    }

    //Wert in Variable setzen fuer die Oberflaeche
    this.searchFieldsAreEmpty = allEmpty;
  }

  //Spalte herausfinden nach welcher gerade sortiert wird fuer farbliche Hinterlegung der Trefferliste / Merkliste
  setSortColumnIndex(mode: string = 'search') {

    //nach Modus unterscheiden
    switch (mode) {

      //Trefferliste
      case 'search':

        //Ueber Felder der Tabelle gehen
        this.mainConfig.tableFields.forEach((item, index) => {

          //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
          if (item.sort === this.queryFormat.queryParams.sortField) {

            //diesen Index merken
            this.sortColumnSearch = index;
          }
        });
        break;

      //Merkliste
      case 'basket':

        //Ueber Felder der Tabelle gehen
        this.mainConfig.tableFields.forEach((item, index) => {

          //Wenn das aktuelle Feld das ist nach dem die Merkliste gerade sortiert wird
          if (item.sort === this.activeBasket.queryParams.sortField) {

            //diesen Index merken
            this.sortColumnBasket = index;
          }
        });
        break;
    }
  }

  //in Treffertabelle / Merkliste pruefen, ob Wert in Ergebnis-Liste ein Einzelwert, ein Multi-Wert (=Array) oder gar nicht gesetzt ist
  // noinspection JSMethodCanBeStatic
  getType(obj) {

    //Wert ist nicht gesetzt
    if (!obj) {
      return 'unset';
    } else if (obj.constructor === Array) {
      return "multi";
    } else {
      return "single";
    }
  }

  //Werte fuer Darstellung in Trefferliste formattieren
  // noinspection JSMethodCanBeStatic
  formatValue(value, display) {

    //von normalem Text ausgehen
    let output = value;

    //Wenn es ein spezieller Modus ist
    switch (display) {

      //Link-Modus
      case 'link':

        //Link erstellen
        output = "<a href=" + value + ">" + value + " <i class='fa fa-external-link'></i></a>";
        break;
    }

    //formattierten Wert zurueckgeben
    return output;
  }

  exportList(docs) {
    let dataString = "data:application/octet-stream,";

    // Header hinzufügen
    for (const field of this.mainConfig.tableFields) {
      dataString += encodeURIComponent(field.label) + "%09";
    }
    dataString += "%0A";

    // Daten hinzufügen
    for (const doc of docs) {
      for (const field of this.mainConfig.tableFields) {
        switch (this.getType(doc[field.field])) {
          case 'unset':
            dataString += "ohne%09";
            break;
          case 'single':
            dataString += encodeURIComponent(doc[field.field]) + "%09";
            break;
          case 'multi':
            dataString += encodeURIComponent(doc[field.field].join("; ")) + "%09";
            break;
        }
      }
      dataString += "%0A";
    }

    this.exportListData = this.sanitizer.bypassSecurityTrustUrl(dataString);
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
