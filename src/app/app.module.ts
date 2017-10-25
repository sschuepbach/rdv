import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { SolrSearchService } from "app/services/solr-search.service";
import { SolrSearchProxyService } from 'app/services/solr-search-proxy.service';
import { UserConfigService } from 'app/config/user-config.service';

import { ObjectKeysPipe } from './pipes/object-keys.pipe';

import { ChartsModule } from 'ng2-charts';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SearchComponent } from './components/search/search.component';
import { AboutComponent } from './components/about/about.component'

import { ClipboardModule } from 'ngx-clipboard';


@NgModule({
  declarations: [
    AppComponent,
    ObjectKeysPipe,
    SearchComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', component: SearchComponent },
      { path: 'about', component: AboutComponent },
      { path: '**', component: SearchComponent }
    ]),
    ChartsModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ClipboardModule
  ],
  providers: [{
    provide: SolrSearchService,
    useClass: SolrSearchService
  }, UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
