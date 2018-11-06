import { Component } from '@angular/core';
import { UpdateQueryService } from '../services/update-query.service';
import { SliderService } from '../services/slider.service';
import { QueryFormat } from "../../shared/models/query-format";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import * as fromRoot from "../../reducers/index";
import * as fromSearch from "../reducers";
import * as fromLayoutActions from "../actions/layout.actions";

@Component({
  selector: 'app-visual-search',
  template: `
    <!-- DIV-Container fuer Tab-Links -->
    <nav class="nav nav-pills"
         id="facet-pills-tab"
         role="tablist">

      <!-- Tab-Ueberschriften fuer Facetten als Pills-Link -->
      <a *ngFor="let key of (query$ | async).facetFields | objectKeys"
         class="nav-link text-sm-center px-2 py-0"
         [ngClass]="'order-' + (facetFieldsByKey$ | async)(key).order"
         [class.active]="(facetFieldsByKey$ | async)(key).order == 1"
         [id]="'facet-pills-'+key+'-tab'"
         data-toggle="pill"
         href="#"
         (click)="changeView('facet-pills-'+key)"
         role="tab"
         aria-controls="'pills-'+key"
         aria-expanded="true">{{(facetFieldsByKey$ | async)(key).label}}</a>

      <!-- Tab-Ueberschriften fuer Ranges als Pills-Link -->
      <a *ngFor="let key of rangeFields$ | async | objectKeys"
         class="nav-link text-sm-center px-2 py-0"
         [ngClass]="'order-' + (rangeFieldsByKey$ | async)(key).order"
         [class.active]="(rangeFieldsByKey$ | async)(key).order == 1"
         id="facet-pills-{{key}}-tab"
         data-toggle="pill"
         href="#"
         (click)="changeView('facet-pills-'+key)"
         role="tab"
         aria-controls="'facet-pills-'+key"
         aria-expanded="true">{{(rangeFieldsByKey$ | async)(key).label}}</a>
    </nav>

    <!-- DIV-Container fuer Tab-Inhalte -->
    <div style="height: 300px; overflow-y: scroll;"
         class="tab-content mt-2"
         id="facet-pills-tabContent">
      <app-facets></app-facets>
      <app-ranges></app-ranges>
    </div>
  `,
})
export class VisualSearchComponent {

  query$: Observable<QueryFormat>;
  facetFieldsByKey$: Observable<any>;
  rangeFieldsByKey$: Observable<any>;
  private rangeFields$: Observable<any>;

  constructor(private sliderService: SliderService,
              private updateQueryService: UpdateQueryService,
              private rootState: Store<fromRoot.State>,
              private searchState: Store<fromSearch.State>) {
    this.facetFieldsByKey$ = rootState.pipe(select(fromRoot.getFacetFieldsByKey));
    this.rangeFieldsByKey$ = rootState.pipe(select(fromRoot.getRangeFieldsByKey));
    this.rangeFields$ = rootState.pipe(select(fromRoot.getRangeFields));

    this.query$ = updateQueryService.query$;
  }

  changeView(view: string) {
    this.searchState.dispatch(new fromLayoutActions.ShowFacetOrRange(view));
  }

}
