import {ChangeDetectionStrategy, Component} from '@angular/core';
import {select, Store} from "@ngrx/store";

import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-search-results-list',
  templateUrl: './search-results-list.component.html',
  styleUrls: ['./search-results-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsListComponent {
  count$: Observable<number>;
  currentBasket$: Observable<any>;
  docs$: Observable<any>;
  offset$: Observable<number>;

  readonly rowOpts = environment.rowOpts;
  readonly showExportList = environment.showExportList.table;
  sortColumn = 0;
  readonly tableFields = environment.tableFields;
  readonly rowsPerPage = environment.queryParams.rows;

  private _count: number;
  private _offset: number;
  private _sortField: string;
  private _sortOrder: string;


  constructor(private _searchStore: Store<fromSearch.State>) {
    this.docs$ = _searchStore.pipe(select(fromSearch.getAllResults));

    this.count$ = _searchStore.pipe(select(fromSearch.getTotalResultsCount));
    this.count$.subscribe(count => {
      this._count = count;
    });

    this.offset$ = _searchStore.pipe(select(fromSearch.getResultOffset));
    this.offset$.subscribe(offset => this._offset = offset);

    _searchStore.pipe(select(fromSearch.getResultSortField)).subscribe(x => {
      this._sortField = x;
      this._setSortColumnIndex(x);
    });

    _searchStore.pipe(select(fromSearch.getResultSortOrder)).subscribe(x => this._sortOrder = x);

    this.currentBasket$ = _searchStore.pipe(select(fromSearch.getCurrentBasket));

  }

  setSearchOffset(offset) {
    this._searchStore.dispatch(new fromQueryActions.SetOffset(offset));
  }

  // TODO: Used by search
  //Treffertabelle / Merkliste sortieren
  sortSearchTable(sortField: string) {
    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this._sortField) {
      this._searchStore.dispatch(new fromQueryActions.SetSortOrder(this._sortOrder === "desc" ? "asc" : "desc"));
    } else {
      this._searchStore.dispatch(new fromQueryActions.SetSortField(sortField));
      this._searchStore.dispatch(new fromQueryActions.SetSortOrder('asc'));
    }
    this._searchStore.dispatch(new fromQueryActions.SetOffset(0));
  }

  // TODO: Used by search
  getSortBySymbol(field: string) {
    return field === this._sortField ?
      this._sortOrder === "asc" ? "fa-sort-asc" : "fa-sort-desc" :
      'fa-sort';
  }

  // TODO: Used by search
  //Spalte herausfinden nach welcher gerade sortiert wird fuer farbliche Hinterlegung der Trefferliste / Merkliste
  private _setSortColumnIndex(sortField: string) {
    //Ueber Felder der Tabelle gehen
    this.tableFields.forEach((item, index) => {

      //Wenn das aktuelle Feld das ist nach dem die Trefferliste gerade sortiert wird
      if (item.sort === sortField) {

        //diesen Index merken
        this.sortColumn = index;
      }
    });
  }
}
