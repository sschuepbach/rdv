import { Injectable } from '@angular/core';
import { QueryFormat } from '../models/query-format';
import { Observable } from 'rxjs/Rx';
import { BasketFormat } from '../search-form/models/basket-format';

@Injectable({
  providedIn: 'root'
})
export abstract class BackendSearchService {

  //Daten in Elasticsearch suchen
  abstract getBackendDataComplex(queryFormat: QueryFormat): Observable<any>;

  //Detail-Daten aus Elasticsearch fuer zusaetzliche Zeile holen (abstract,...)
  abstract getBackendDetailData(id: string, fullRecord: boolean): Observable<any>;

  //Merklisten-Daten in Elasticsearch suchen (ueber IDs)
  abstract getBackendDataBasket(basket: BasketFormat): Observable<any>;

}
