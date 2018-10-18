import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './components/about.component';
import { AppComponent } from './containers/app.component';
import { LandingPageComponent } from './containers/landing-page.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';

const COMPONENTS = [
  AboutComponent,
  AppComponent,
  FooterComponent,
  HeaderComponent,
  LandingPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: 'doc/:id', component: LandingPageComponent},
      {path: 'about', component: AboutComponent},
    ]),
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule { }
