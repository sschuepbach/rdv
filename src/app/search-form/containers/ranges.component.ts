import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonRangeSliderComponent } from 'ng2-ion-range-slider';
import { Observable } from 'rxjs/Rx';
import { SliderService } from '../services/slider.service';
import { QueryFormat } from '../../shared/models/query-format';
import { select, Store } from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { UpdateQueryService } from '../services/update-query.service';
import * as fromRoot from "../../reducers/index";
import * as fromSearch from "../reducers";
import * as fromFormActions from "../actions/form.actions";

@Component({
  selector: 'app-ranges',
  template: `
    <ng-container *ngFor="let key of rangeFieldConfig | objectKeys">
      <!-- DIV pro Range (Jahr, Anzahl Seiten,...) mit Histogramm und Slider -->
      <div *ngIf="(shownFacetOrRange$ | async) === 'facet-pills-' + key"
           class="tab-pane list-group"
           [class.active]="rangeFieldConfig[key].order == 1"
           [id]="'facet-pills-' + key"
           role="tabpanel"
           aria-labelledby="'facet-pills-' + key + '-tab'">

        <!-- Button "x Eintraege ohne Merkmal y" anzeigen (z.B. Titel ohne Jahr) -->
        <label class="btn btn-sm btn-outline-primary px-2 py-1 mb-3"
               [class.active]="(rangeValuesByKey$ | async)(key).showMissingValues" (click)="toggleMissingValues(key)">

          <!-- Anhak-Symbol -->
          <span class="fa"
                [class.fa-check-circle]="(rangeValuesByKey$ | async)(key).showMissingValues"
                [class.fa-circle-thin]="!(rangeValuesByKey$ | async)(key).showMissingValues"></span>

          <!-- Text "x Titel ohne Jahr anzeigen" -->
          <span>Zeige {{getMissingCount(key)}} Titel ohne {{rangeData[key].label}}</span>

        </label>

        <!-- Chart -->
        <div style="height: 180px;">
          <canvas baseChart
                  [chartType]="'bar'"
                  [datasets]="rangeData[key].chartData"
                  [labels]="rangeData[key].chartLabels"
                  [options]="rangeData[key].chartOptions"
                  [legend]="false">
          </canvas>
        </div>

        <!-- Vorhang ueber Chart -->
        <div class="curtain_div">
          <div class="curtain_container">
            <div class="curtain"
                 style="background-color: rgba(10, 10, 10, .3); left: 0"
                 [style.width]="rangeData[key].curtainLeft"></div>
            <div class="curtain"
                 style="background-color: rgba(10, 10, 10, .3); right: 0"
                 [style.width]="rangeData[key].curtainRight"></div>
          </div>
        </div>

        <!-- Slider -->
        <div class="rangeslider_div">
          <ion-range-slider #sliderElement
                            [id]="key"
                            type="double"
                            [min]="rangeData[key].min"
                            [from]="rangeData[key].from"
                            [to]="rangeData[key].to"
                            [max]="rangeData[key].max"
                            [grid]="true"
                            [grid_num]="10"
                            [prefix]="rangeData[key].label + ' '"
                            [prettify_enabled]="false"
                            [hide_min_max]="true"
                            (onChange)="updateSlider($event, key)">
          </ion-range-slider>
        </div>
      </div>
    </ng-container>
  `,
  styles: [`
    select {
      width: auto;
    }

    .curtain_div {
      position: relative;
      opacity: .5;
      margin-left: 40px;
      margin-right: 40px;
    }

    .curtain_container {
      height: 138px;
      width: 100%;
      /*background-color: grey; */
      position: absolute;
      top: -174px;
    }

    .curtain {
      display: inline-block;
      position: absolute;
      width: 10%;
      height: 128px;
    }

    .rangeslider_div {
      margin-left: 30px;
      margin-right: 30px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangesComponent implements OnInit {

  //Variable fuer SliderElemente -> bei Reset zuruecksetzen
  @ViewChildren('sliderElement') sliderElement: QueryList<IonRangeSliderComponent>;

  //Ranges (leere Wert, z.B. Titel ohne Jahr fuer Checkbox, abgeleitet von results)
  private rangeMissingValues = {};

  //Ranges (fuer Chart, abgeleitet von results)
  private ranges;

  //Daten fuer Slider und Diagrammerzeugunge
  rangeData = {};
  query: QueryFormat;
  rangeFieldsByKey$: Observable<any>;
  rangeFieldConfig: any;

  private rangeFieldsConfig: any;
  private shownFacetOrRange$: Observable<string>;
  private rangeValues$: Observable<any>;
  private rangeValues: any;
  private rangeValuesByKey$: Observable<any>;

  constructor(private sliderService: SliderService,
              private updateQueryService: UpdateQueryService,
              private rootState: Store<fromRoot.State>,
              private searchState: Store<fromSearch.State>) {
    this.rangeFieldConfig = environment.rangeFields;
    this.rangeFieldsByKey$ = rootState.pipe(select(fromRoot.getRangeFieldsByKey));
    this.rangeFieldsByKey$.subscribe(x => this.rangeFieldsConfig = x);

    this.rangeValues$ = searchState.pipe(select(fromSearch.getRangeValues));
    this.rangeValues$.subscribe(x => this.rangeValues = x);
    this.rangeValuesByKey$ = searchState.pipe(select(fromSearch.getRangeValuesByKey));
    this.shownFacetOrRange$ = searchState.pipe(select(fromSearch.getShownFacetOrRange));

    // updateQueryService.query$.subscribe(q => this.query = q);
    updateQueryService.response$.subscribe(res => {
      //Facetten-Ranges Werte
      this.ranges = res.facet_counts.facet_ranges;
      //Werte fuer nicht existirende Range-Werte (z.B. Eintraege ohne Jahr)
      this.rangeMissingValues = res.facet_counts.facet_queries;
      //Facetten-Werte
      this.createCharts()
    });

  }

  ngOnInit() {
    //min- / max-Werte fuer Slider, Labels und Optionen fuer Chart setzen
    this.setRangeData();
    //Slider Werte setzen
    this.sliderService.resetSlider$.subscribe(res => this.sliderInit(res));
    this.sliderService.resetSlider();
  }

  toggleMissingValues(k: string) {
    this.searchState.dispatch(new fromFormActions.ShowMissingValuesInRange(k))
  }

  //min- / max-Werte fuer Ranges setzen
  private setRangeData() {

    //Ueber Felder des Abfrage-Formats gehen
    for (const key of Object.keys(this.rangeValues)) {

      //leeren Wert fuer rangeMissingValues anlegen (da sonst undefined)
      this.rangeMissingValues['{!ex=' + this.rangeValues[key].field + '}' +
      this.rangeValues[key].field + ':0'] = 0;

      //Objekt fuer diese Range (z.B. Jahr) anelegen
      this.rangeData[key] = {};

      //Min und Max-Werte aus Query-Format holen
      this.rangeData[key].min = this.rangeValues[key].min;
      this.rangeData[key].max = this.rangeValues[key].max;

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
      this.rangeData[key].label = this.rangeFieldsConfig(key).label;

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
  private createCharts() {

    //Chartdata erstellen
    for (const key of Object.keys(this.rangeValues)) {

      //Werte sammeln
      const barData = [];
      const backendData = this.ranges[this.rangeValues[key].field].counts;

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
  private sliderInit(key?) {

    if (this.sliderElement) {
      this.sliderElement.toArray().forEach(value => value.reset());
    }

    //Wenn key uebergeben wird, nur diesen bearbeiten, ansonsten alle keys
    const keys = key ? [key] : Object.keys(this.rangeValues);

    //Ueber Rangewerte gehen
    for (const k of keys) {

      //Von und bis Werte fuer Slider setzen
      this.rangeData[k].from = this.rangeValues[k].from;
      this.rangeData[k].to = this.rangeValues[k].to;

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

    // const query = JSON.parse(JSON.stringify(this.query));
    this.searchState.dispatch(new fromFormActions.RangeBoundariesChanged({
      key: key,
      from: $event.from,
      to: $event.to,
    }));

    // TODO: Reactivate later probably
    // query.queryParams.start = 0;
  }

  //Anzahl der Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr)
  getMissingCount(key) {

    //lokal gespeicherten Wert zurueckliefern
    return this.rangeMissingValues['{!ex=' + this.rangeValues[key].field + '}' +
    this.rangeValues[key].field + ':0'];
  }


}
