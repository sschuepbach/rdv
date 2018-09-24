import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './containers/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjectKeysPipe } from '../pipes/object-keys.pipe';
import { ChartsModule } from 'ng2-charts';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from 'ngx-clipboard';
import { RouterModule } from '@angular/router';
import { ParamsSetComponent } from './containers/params-set.component';
import { CopyLinkComponent } from './components/copy-link.component';
import { SaveQueryComponent } from './containers/save-query.component';
import { ListSavedQueriesComponent } from './components/list-saved-queries.component';
import { BasketListComponent } from './containers/basket-list.component';
import { ResultsComponent } from './containers/results.component';
import { FreeTextSearchComponent } from './components/free-text-search.component';
import { FilterSearchComponent } from './components/filter-search.component';
import { VisualSearchComponent } from './components/visual-search.component';
import { QueriesStoreService } from './services/queries-store.service';
import { BasketsService } from './services/baskets.service';
import { BasketsStoreService } from './services/baskets-store.service';
import { FormService } from './services/form.service';
import { QueriesService } from './services/queries.service';
import { UpdateQueryService } from './services/update-query.service';
import { SliderService } from './services/slider.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChartsModule,
    IonRangeSliderModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ClipboardModule,
    RouterModule,
  ],
  declarations: [
    ObjectKeysPipe,
    SearchComponent,
    ParamsSetComponent,
    CopyLinkComponent,
    SaveQueryComponent,
    ListSavedQueriesComponent,
    BasketListComponent,
    ResultsComponent,
    FreeTextSearchComponent,
    FilterSearchComponent,
    VisualSearchComponent,
  ],
  exports: [
    SearchComponent
  ],
  providers: [
    BasketsService,
    BasketsStoreService,
    FormService,
    QueriesService,
    QueriesStoreService,
    SliderService,
    UpdateQueryService
  ]
})
export class SearchFormModule {
}
