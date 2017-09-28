import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { QueryFormat } from "app/query-format";

@Injectable()
export class SolrSearchService {

  //Solr-Suche
  private url = `
/solr/freidok_core/
select?wt=json
&indent=true
&facet=true
&facet.field=doctype_string
&facet.field=language_all_facet
&facet.mincount=1
&facet.query={!ex=py_int}py_int:0
&facet.range={!ex=py_int}py_int
&f.py_int.facet.range.start=1950
&f.py_int.facet.range.end=2018
&f.py_int.facet.range.gap=1
&f.py_int.facet.mincount=0
&facet.query={!ex=pages_int}pages_int:0
&facet.range={!ex=pages_int}pages_int
&f.pages_int.facet.range.start=1
&f.pages_int.facet.range.end=21
&f.pages_int.facet.range.gap=1
&f.pages_int.facet.mincount=0
&json.nl=arrarr
&fl=id,person_all_string,ti_all_string,py_string`;

  //Http Service injekten
  constructor(private http: Http) { }

  //Daten in Solr suchen
  getSolrDataComplex(queryFormat: QueryFormat): Observable<any> {

    //Suchanfrage zusammenbauen
    let queryArray = [];

    //Ueber Anfrage-Formate gehen
    for (let key of Object.keys(queryFormat.searchFields)) {

      //Wenn Wert gesetzt ist (z.B. bei all fuer all_text-Suche)
      if (queryFormat["searchFields"][key]["value"]) {

        //Anfrage fuer dieses Feld speichern
        queryArray.push(queryFormat["searchFields"][key]["field"] + ":(" + queryFormat["searchFields"][key]["value"] + "*)");
      }
    }

    //Sucheanfragen aus Anfragen der Einzelfelder zusammenbauen oder *:* Abfrage, wenn Felder leer
    let query = queryArray.length ? "&q=" + queryArray.join(" ") : "&q=*:*";

    //FilterQuery-Anfrage zusammenbauen
    let fqArray = [];

    //Ueber Facettenfelder gehen
    for (let key of Object.keys(queryFormat.facetFields)) {

      //Wenn es Werte bei einem Facettenfeld gibt (z.B. bei language fuer language_all_facet)
      if (queryFormat["facetFields"][key]["values"].length) {

        //Einzelwerte dieser Facette per AND verknuepfen (ger AND eng) und in Array sammeln
        fqArray.push("&fq=" + queryFormat["facetFields"][key]["field"] + ":(" + queryFormat["facetFields"][key]["values"].join(" AND ") + ")");
      }
    }

    //FilterQuery aus einzelnen Filterqueries zusammenbauen oder leer, wenn keine Facetten ausgewaehlt sind
    let fq = fqArray.length ? fqArray.join("") : "";

    //FilterQuery-Array fuer Range-Anfragen
    let fqRangeArray = [];

    //Ueber Rangefelder gehen
    for (let key of Object.keys(queryFormat.rangeFields)) {

      //Range-Anfrage
      let range_query = "&fq={!tag=" + queryFormat.rangeFields[key].field + "}" + queryFormat.rangeFields[key].field + ":[" + queryFormat.rangeFields[key].from + " TO " + queryFormat.rangeFields[key].to + "]"

      //ggf. Treffer ohne Wert dieser Range (z.B. ohne Jahr) einfuegen
      range_query += queryFormat.rangeFields[key].showMissingValues ? " OR " + queryFormat.rangeFields[key].field + ":0" : "";

      //alle Rangequeries in Array sammeln
      fqRangeArray.push(range_query)
    }

    //Range-Filterquery aus einzelnen Anfragen zusammenbauen oder leer
    let fq_range = fqRangeArray.length ? fqRangeArray.join("") : "";

    //Suchanfrage zusammenbauen, dabei auch Anzahl der Treffer setzen
    let queryUrl = this.url
      + query
      + fq
      + fq_range
      + "&rows=" + queryFormat.queryParams.rows
      + "&start=" + queryFormat.queryParams.start
      + "&sort=" + queryFormat.queryParams.sortField + " " + queryFormat.queryParams.sortDir;


    //  console.log(queryUrl);

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(queryUrl)

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json() as any);
  }

  //Detail-Daten aus Solr holen (abstract,...)
  getSolrDetailData(id: number): Observable<any> {

    //Suchanfrage zusammenbauen, dabei auch Anzahl der Treffer setzen
    let queryUrl = this.url + "&q=id:" + id + "&fl=keyword_all_string, source_title_all_string"
    //console.log(queryUrl);

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(queryUrl)

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json().response.docs[0] as any);
  }
}