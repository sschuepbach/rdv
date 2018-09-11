//Fuer Config anpassen
//import { BackendSearchService } from 'app/services/solr-search.service';
import { BackendSearchService } from 'app/services/elastic-search.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// FIXME: Replace HttpModule with HttpClient
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { AboutComponent } from './components/about/about.component'
import { LandingPageComponent } from './components/landing-page/landing-page.component';

import { UserConfigService } from 'app/services/user-config.service';
import { ObjectKeysPipe } from './pipes/object-keys.pipe';

import { ChartsModule } from 'ng2-charts';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AppComponent,
    ObjectKeysPipe,
    SearchComponent,
    AboutComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: 'doc/:id', component: LandingPageComponent},
      {path: 'about', component: AboutComponent},
      {path: '**', component: SearchComponent}
    ]),
    ChartsModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ClipboardModule
  ],
  providers: [
    BackendSearchService,
    UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
