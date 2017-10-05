import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SolrSearchService } from "app/solr-search.service";
import { ObjectKeysPipe } from './object-keys.pipe';

import { ChartsModule } from 'ng2-charts';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    ObjectKeysPipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    ChartsModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule
  ],
  providers: [SolrSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
