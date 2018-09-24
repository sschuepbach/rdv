import { Injectable } from '@angular/core';
import { SavedQueryFormat } from '../models/saved-query';

@Injectable({
  providedIn: 'root'
})
export class QueriesStoreService {

  private _savedQueries: SavedQueryFormat[] = [];

  get savedQueries() {
    return this._savedQueries;
  }

  set savedQueries(savedQueries: SavedQueryFormat[]) {
    this._savedQueries = savedQueries;
  }
}
