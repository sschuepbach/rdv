import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './core/components/app.component';
import { SearchComponent } from './search-form/containers/search.component';

import { UserConfigService } from 'app/services/user-config.service';
import { SearchFormModule } from './search-form/search-form.module';
import { backendSearchServiceProvider } from './services/backend-search.service.provider';
import { StoreModule } from '@ngrx/store';
import { metaReducers, reducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    SearchFormModule,
    CoreModule,
    RouterModule.forRoot([
      {path: '', component: SearchComponent},
      {path: '**', component: SearchComponent}
    ]),
    StoreModule.forRoot(reducers, {metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    backendSearchServiceProvider,
    UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
