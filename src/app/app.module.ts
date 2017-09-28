import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SolrSearchService } from "app/solr-search.service";
import { ObjectKeysPipe } from './object-keys.pipe';

import { CookieModule } from 'ngx-cookie';

import { NouisliderModule } from 'ng2-nouislider';

import { ChartsModule } from 'ng2-charts';

import { IonRangeSliderModule } from "ng2-ion-range-slider";

@NgModule({
  declarations: [
    AppComponent,
    ObjectKeysPipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    CookieModule.forRoot(),
    NouisliderModule,
    ChartsModule,
    IonRangeSliderModule
  ],
  providers: [SolrSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
