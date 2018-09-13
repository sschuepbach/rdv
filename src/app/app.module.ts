//Fuer Config anpassen
//import { BackendSearchService } from 'app/services/solr-search.service';
import { BackendSearchService } from 'app/services/elastic-search.service';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SearchComponent } from './search-form/containers/search.component';
import { AboutComponent } from './components/about/about.component'
import { LandingPageComponent } from './containers/landing-page/landing-page.component';

import { UserConfigService } from 'app/services/user-config.service';
import { SearchFormModule } from './search-form/search-form.module';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LandingPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchFormModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: 'doc/:id', component: LandingPageComponent},
      {path: 'about', component: AboutComponent},
      {path: '**', component: SearchComponent}
    ]),
  ],
  providers: [
    BackendSearchService,
    UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
