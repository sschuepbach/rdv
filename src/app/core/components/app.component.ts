import { Component } from "@angular/core";

@Component({
  selector: 'app-root',
  template: `
    <app-header></app-header>
    <router-outlet class="no-gutters"></router-outlet>
    <app-footer></app-footer>
  `,
})

export class AppComponent {

}
