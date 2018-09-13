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
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchFormModule {
}
