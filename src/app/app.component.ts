import { Component, ViewChildren, QueryList, AfterViewInit, OnInit, HostListener } from '@angular/core';

//Solr Service
import { SolrSearchService } from "app/solr-search.service";

// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

//Forms
import { FormBuilder } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";

//eigene Format-Klassen
import { QueryFormat } from "app/query-format";
import { SavedQueryFormat } from "app/saved-query-format";

//Slider-Plugin
import { IonRangeSliderComponent } from "ng2-ion-range-slider";

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
          uniqueQueryName: { valid: false }
        }
      }
    });

    //Fehlerobjekt zurueckgeben (null, wenn kein Fehler)
    return error;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  view: any[] = [300, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  single = [
    {
      "name": "Germany",
      "value": 12
    },
    {
      "name": "USA",
      "value": 16
    },
    {
      "name": "France",
      "value": 4
    }
  ];



  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    localStorage.setItem("userQuery", JSON.stringify(this.queryFormat));
    localStorage.setItem("savedUserQueries", JSON.stringify(this.savedQueries));
  }

  //Variable fuer SliderElemente -> bei Reset zuruecksetzen
  @ViewChildren('sliderElement') sliderElement: QueryList<IonRangeSliderComponent>;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.floor(this.count / this.queryFormat.queryParams.rows) + 1;
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.queryFormat.queryParams.start / this.queryFormat.queryParams.rows) + 1
  }

  //Such-Form
  searchForm: FormGroup;

  //Name-Input fuer Suche speichern
  saveQuery: FormControl;

  //Alle Infos zu Suchanfrage hier speichern
  queryFormat = new QueryFormat();

  //Array der gespeicherten Suchanfragen
  savedQueries: SavedQueryFormat[] = [];

  //Results als Observable
  results: Observable<any>;

  //docs Bereich der Solr-Antwort (abgeleitet von results)
  docs: any[];

  //Facetten (abgeleitet von results)
  facets = {};

  //Ranges (fuer Chart, abgeleitet von results)
  ranges;

  //Ranges (leere Wert, z.B. Titel ohne Jahr fuer Checkbox, abgeleitet von results)
  rangeMissingValues = {};

  //Daten fuer Slider und Diagrammerzeugunge
  rangeData = {};

  //Trefferanzahl der Solr-Antwort. Zu Beginn 0 Treffer (spaeter abgeleitet von results)
  count: number = 0;

  //Optionen fuer Auswahl der Treffermenge
  rowOpts: number[] = [5, 10, 20];

  //Optionen fuer Auswahl der Suchfelder
  searchFieldOpts: any[] = [
    ["all_text", "Freitext"],
    ["ti_all_text", "Titel"],
    ["person_all_text", "Personen"]];

  //BehaviorSubject speichert Anfragen, zu Beginn leere Anfrage schicken, damit *:* Suche gestartet wird
  private complexSearchTerms: BehaviorSubject<QueryFormat>;

  //Eintragsdetails (abstract,...) zwischenspeichern, damit sie nicht immer geholt werden muessen
  detailDataArray: any[] = [];

  //SolrSearchService injenten
  constructor(private solrSearchService: SolrSearchService, private _fb: FormBuilder) { }

  //Component-Init
  ngOnInit() {

    //gespeicherte Suchanfrage aus localstorage laden -> vor Form-Erstellung, damit diese queries fuer den Validator genutzt werden koennen
    let localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");

    //wenn gespeicherte Suchen aus localstorage geladen wurden
    if (localStorageSavedUserQueries) {

      //gespeicherte Suchen aus localstorage holen
      this.savedQueries = JSON.parse(localStorageSavedUserQueries);
    }

    //Reactive Forms fuer Suchfelder und Suche speichern
    this.createForms();

    //min- / max-Werte fuer Slider, Labels und Optionen fuer Chart setzen
    this.setRangeData();

    //letzte Suche aus localstorage laden
    let localStorageUserQuery = localStorage.getItem("userQuery");

    //Wenn Suchanfrage aus localstorage geladen wurde
    if (localStorageUserQuery) {

      //Anfrage-Format laden
      this.queryFormat = JSON.parse(localStorageUserQuery);

      //Input-Felder in Template setzen
      this.setFormInputValues();
    }

    //Behavior-Subjekt anlegen mit Initialwert queryFormat (enthaelt ggf. Werte, die aus localstorage geladen werden)
    this.complexSearchTerms = new BehaviorSubject<QueryFormat>(this.queryFormat);

    //Suche anmelden: Bei Aenderungen des Suchfeld-BehaviorSubjekts searchTerms
    this.results = this.complexSearchTerms

      //TODO debounce + distinct
      //Term an Suchanfrage weiterleiten -> Ergebnis wird in Docs gespeichert
      .switchMap((query: QueryFormat) => this.solrSearchService.getSolrDataComplex(query))

    //Aenderungen bei results (=Solr-Suche-Anfrage) und Werte extrahieren
    this.results.subscribe(results => {

      //Array der Treffer-Dokumente
      this.docs = results.response.docs

      //Anzahl der Treffer
      this.count = results.response.numFound;

      //Solr-Facetten Werte
      this.facets = results.facet_counts.facet_fields;

      //Solr-Facetten-Ranges Werte
      this.ranges = results.facet_counts.facet_ranges;

      //Werte fuer nicht existirende Range-Werte (z.B. Eintraege ohne Jahr)
      this.rangeMissingValues = results.facet_counts.facet_queries;

      //Jahres-Chart erstellen
      this.createCharts();
    });

    //Slider Werte setzen
    this.sliderInit();
  }

  //FormControls fuer Suchanfragen und Speicherung von Suchanfragen anlgen
  createForms(): any {

    //Such-Form
    this.searchForm = this._fb.group({
      rows: this.rowOpts[0],
    });

    //FormControls fuer searchFields festlegen
    for (let key of Object.keys(this.queryFormat.searchFields)) {

      //Select-Feld fuer Auswahl des Feldes (z.B. Freitext, Titel, Person,...)
      this.searchForm.addControl('selectSearchField_' + key, new FormControl(this.queryFormat.searchFields[key].field));

      //Suchfeld
      this.searchForm.addControl(key, new FormControl());
    }

    //FormControls fuer Checkenboxen erstellen, die festlegen, ob Titel ohne ein Merkmal (z.B. Titel ohne Jahr) angezeigt werden sollen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      this.searchForm.addControl('showMissing_' + key, new FormControl());
    }

    //Input fuer "Suche speichern". Name = Pflichtfeld und muss eindeutig sein, "Meine Suche2"
    this.saveQuery = new FormControl('Meine Suche ' + (this.savedQueries.length + 1), [Validators.required, Validators.minLength(3), uniqueQueryNameValidator(this.savedQueries)]);
  }

  //Bei Suche in Eingabefeld
  searchComplex(field: string, value: string): void {

    //Wert in Query-Format anpassen
    this.queryFormat["searchFields"][field]["value"] = value;

    //Start der Trefferliste auf Anfang setzen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
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
    let index = this.queryFormat.facetFields[field]["values"].indexOf(value);

    //TODO an Start der Trefferliste springen?

    //in Array loeschen
    this.queryFormat.facetFields[field]["values"].splice(index, 1);

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Suche zuruecksetzen
  resetSearch() {

    //Anfrage-Format leeren
    this.queryFormat = new QueryFormat();

    //Input-Felder in Template zureucksetzen
    this.setFormInputValues();

    //Ueber Slider gehen
    this.sliderElement.toArray().forEach((value, index) => {

      //Werte zuruecksetzen
      value.restore();
    })

    //Slider zuruecksetzen
    this.sliderInit();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Detailinfo holen und Ansicht toggeln
  getFullData(id: number) {

    //Wenn es noch keine Detailinfos (abstract,...) dieser ID gibt
    if (this.detailDataArray[id] === undefined) {

      //Infos aus Solr holen und lokal speichern. Eintrag sichtbar machen
      this.solrSearchService.getSolrDetailData(id).subscribe(
        res => this.detailDataArray[id] = { "data": res, "visible": true });
    }

    //die Infos sind bereits lokal gespeichert
    else {

      //Sichtbarkeit toggeln
      this.detailDataArray[id]["visible"] = !this.detailDataArray[id]["visible"];
    }
  }

  //Werte des Abfrage-Formats in Input-Felder im Template schreiben
  setFormInputValues() {

    //Ueber Felder des Abfrage-Formats gehen
    for (let key of Object.keys(this.queryFormat.searchFields)) {

      //das ausgewaehlte Suchefeld setzen (z.B. Freitext, Titel, Person,...)
      this.searchForm.get('selectSearchField_' + key).setValue(this.queryFormat.searchFields[key].field);

      //Wert in Input-Feld im Template setzen
      this.searchForm.get(key).setValue(this.queryFormat.searchFields[key].value)
    }

    //Anzahl der Treffer in Select im Template auswaehlen
    this.searchForm.get("rows").setValue(this.queryFormat.queryParams.rows);

    //Checkboxen anhaken, bei welchen Ranges auch Titel ohne Merkmal gesucht werden sollen (z.B. Titel ohne Jahr)
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //Wert aus QueryFormat holen und setzen
      this.searchForm.get("showMissing_" + key).setValue(this.queryFormat.rangeFields[key].showMissingValues);
    }
  }

  //Nutzeranfrage speichern
  saveUserQuery(name: string) {

    //deep copy von Anfrage-Format erstellen (nicht einfach Referenz zuordnen!)
    let qf = JSON.parse(JSON.stringify(this.queryFormat));

    //Name der gespeicherten Suchanfragen und Anfrage-Format in Objekt packen
    let userQuery = new SavedQueryFormat(name, qf);

    //Objekt in Array einfuegen
    this.savedQueries.push(userQuery);

    //Namensfeld fuer Nutzerabfrage mit Standard-Wert belegen ("Meine Suche2")
    this.saveQuery.setValue('Meine Suche ' + (this.savedQueries.length + 1));
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
  }

  //Anzahl der Treffer in Suche anpassen
  setRows(rows: number) {

    //Zeilen-Anzahl in Abfrage-Format setzen
    this.queryFormat.queryParams.rows = rows;

    //Trefferliste wieder von vorne anzeigen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Blaettern in Trefferliste
  updateStart(offset) {

    //neuen Startwert berechnen
    let newStart: number;

    //auf letzte Seite springen
    if (offset === 'last') {
      newStart = (this.queryFormat.queryParams.rows * (this.pages - 1));
    }

    //auf 1. Seite springen
    else if (offset === 'first') {
      newStart = 0;
    }

    //1 Schritt nach vorne oder hinten blaetten
    else {
      newStart = this.queryFormat.queryParams.start + (offset * this.queryFormat.queryParams.rows);
    }

    //Start anpassen
    this.queryFormat.queryParams.start = newStart;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Tabelle sortieren
  sortTable(sortField: string) {

    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this.queryFormat.queryParams.sortField) {

      //Sortierrichtung umdrehen
      this.queryFormat.queryParams.sortDir = this.queryFormat.queryParams.sortDir === "desc" ? "asc" : "desc";
    }

    //es wird derzeit nach einem anderen Feld sortiert
    else {

      //Sortierfeld setzen
      this.queryFormat.queryParams.sortField = sortField;

      //Sortierrichtung aufsteigend setzen
      this.queryFormat.queryParams.sortDir = 'asc';
    }

    //Trefferliste wieder von vorne anzeigen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //gibt eine CSS-Klasse zurueck, wenn nach dieser Spalte sortiert wird
  sortBy(field: string) {

    //wenn nach diesem Feld sortiert wird
    if (field === this.queryFormat.queryParams.sortField) {

      //anhander der gesetzten Sortierrichtung eine CSS-Klasse ausgeben
      return this.queryFormat.queryParams.sortDir === "asc" ? "sort_asc" : "sort_desc";
    }
  }

  //min- / max-Werte fuer Ranges setzen
  setRangeData() {

    //Ueber Felder des Abfrage-Formats gehen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //leeren Wert fuer rangeMissingValues anlegen (da sonst undefined)
      this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' + this.queryFormat.rangeFields[key].field + ':0'] = 0;

      //Objekt fuer diese Range (z.B. Jahr) anelegen
      this.rangeData[key] = {};

      //Min und Max-Werte aus Query-Format holen
      this.rangeData[key].min = this.queryFormat.rangeFields[key].min;
      this.rangeData[key].max = this.queryFormat.rangeFields[key].max;

      //Leeres Datenarray anlegen
      this.rangeData[key].chartData = [{ data: [] }];

      //Labels erstellen
      let labelArray = [];

      //von min zu max Wert gehen
      for (let i = this.rangeData[key].min; i <= this.rangeData[key].max; i++) {

        //Werte sammeln (1950, 1951,..., 2017)
        labelArray.push(i);
      }

      //Labels sind aber unsichtbar (werden aber fuer Hover benoetigt)
      this.rangeData[key].chartLabels = labelArray;

      //Prefix fuer Slider
      this.rangeData[key].label = this.queryFormat.rangeFields[key].label;

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
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //Werte sammeln
      let barData = [];
      let solrData = this.ranges[this.queryFormat.rangeFields[key].field].counts;

      //Ranges kommen als Array von Arrays [["1800", 2]["1801", 0]["1802", 6],...],
      for (let i = 0; i < solrData.length; i++) {

        //nur den Zaehlwert speichern fuer Chart
        barData.push(solrData[i][1]);
      }

      //Daten fuer Chart speichern
      this.rangeData[key].chartData = [{ data: barData }];
    }
  }

  //Slider initialieiseren
  sliderInit() {

    //Ueber Rangewerte gehen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //Von und bis Werte fuer Slider setzen
      this.rangeData[key].from = this.queryFormat.rangeFields[key].from;
      this.rangeData[key].to = this.queryFormat.rangeFields[key].to;

      //Vorhangwerte setzen
      this.rangeData[key].curtainLeft = ((1 - (this.rangeData[key].max - this.rangeData[key].from) / (this.rangeData[key].max - this.rangeData[key].min)) * 100) + '%';
      this.rangeData[key].curtainRight = ((this.rangeData[key].max - this.rangeData[key].to) / (this.rangeData[key].max - this.rangeData[key].min) * 100) + '%';
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

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Anzahl der Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr)
  getMissingCount(key) {

    //lokal gespeicherten Wert zurueckliefern
    return this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' + this.queryFormat.rangeFields[key].field + ':0'];
  }

  //Checkbox anpassen, ob Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr) anzeigen
  updateRangeMissing(key, checked) {

    //Wert setzen
    this.queryFormat.rangeFields[key].showMissingValues = checked;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Auswahl des durchsuchten Feldes anpassen
  updateSearchField(field, value) {

    //Wert in queryFormat speichern
    this.queryFormat.searchFields[field].field = value;

    this.single = [
      {
        "name": "Germany",
        "value": 30
      },
      {
        "name": "USA",
        "value": 2
      },
      {
        "name": "France",
        "value": 13
      }
    ];

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }
}

//TODO kann Suche immer angestossen werden, wenn Wert in queryFormat angepasst wird?
//TODO rowOpts configurierbar
//TODO searchFields configurierbar