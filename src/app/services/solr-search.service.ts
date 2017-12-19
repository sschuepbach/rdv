//Config anpassen
import { MainConfig } from "app/config/main-config-freidok";
//import { MainConfig } from "app/config/main-config-bwsts";

import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { QueryFormat } from "app/config/query-format";

import { BasketFormat } from 'app/config/basket-format';

@Injectable()
export class BackendSearchService {

  //URL auf PHP-Proxy
  private proxyUrl: string;

  //Felder, die bei normaler Suche fuer die Treffertabelle geholt werden, schon direkt als koma-getrennter String -> id,person_all_string,ti_all_string,py_string
  tableFields: string;

  //Felder, die bei der Detailsuche geholt werden, schon direkt als komma-getrenner String -> keyword_all_string,source_title_all_string,pages_string
  detailFields: string;

  //Anzahl der Treffer pro Merklisten-Anfrage
  basketRows: number;

  //Http Service injekten
  constructor(private http: Http) {

    //Main-Config laden
    let mainConfig = new MainConfig();

    //proxyUrl setzen
    this.proxyUrl = mainConfig.proxyUrl;

    //Table-Felder in Array sammeln
    let tempArray = [];

    //Felder sammeln, die bei normaler Suche geholt werden sollen
    for (let field of mainConfig.tableFields) {

      //Feld-Namen in tempArray sammeln
      tempArray.push(field.field);
    }

    //Falls ID-Feld nicht in Tabelle angzeigt wird
    if (tempArray.indexOf("id") === -1) {

      //ID-Feld trotzdem in fl-Liste hinzufuegen, da ueber die ID zusaetzliche Infos geholt werden und der Basket gefuellt wird
      tempArray.push("id");
    }

    //Array joinen per ,
    this.tableFields = tempArray.join(",");

    //Detail-Felder in Array sammeln
    tempArray = [];

    //Felder sammeln, die bei Detailsuche geholt werden sollen
    for (let key of Object.keys(mainConfig.extraInfos)) {

      //Feld-Namen in tempArray sammeln
      tempArray.push(mainConfig.extraInfos[key].field);
    }

    //Array joinen per ,
    this.detailFields = tempArray.join(",");

    //Anzahl der Treffer pro Merklisten-Anfrage speichern
    this.basketRows = mainConfig.basketConfig.queryParams.rows;
  }

  //Daten in Solr suchen
  getBackendDataComplex(queryFormat: QueryFormat): Observable<any> {

    //Suchparameter sammeln und dem Proxy-Skript uebergeben
    let myParams = new URLSearchParams();

    //Suchanfrage zusammenbauen
    let queryArray = [];

    //Ueber Anfrage-Formate gehen
    for (let key of Object.keys(queryFormat.searchFields)) {

      //Schnellzugriff auf dieses Suchfeld
      let searchfield_data = queryFormat.searchFields[key];

      //Wenn Wert gesetzt ist (z.B. bei all fuer all_text-Suche)
      if (searchfield_data.value.trim()) {

        //Anfrage fuer dieses Feld speichern
        queryArray.push(searchfield_data.field + ":(" + searchfield_data.value.trim() + "*)");
      }
    }

    //Sucheanfragen aus Anfragen der Einzelfelder zusammenbauen oder *:* Abfrage, wenn Felder leer
    let query = queryArray.length ? queryArray.join(" ") : "*:*";
    myParams.set("q", encodeURI(query));

    //Ueber Filterfelder gehen
    for (let key of Object.keys(queryFormat.filterFields)) {

      //Schnellzugriff auf Infos dieses Filters
      let filter_data = queryFormat.filterFields[key];

      //Feld als Solr-Facette in URL anmelden (damit ueberhaupt Daten geliefert werden), # wird von PHP wieder zu . umgewandelt
      myParams.append("facet#field[]", filter_data.field);

      //Wenn es Werte bei diesem Filter gibt
      if (filter_data.values.length) {

        //Einzelwerte dieser Facette operator (OR vs. AND) verknuepfen (ger OR eng) und in Array sammeln
        myParams.append("fq[]", encodeURI(filter_data.field + ":(" + filter_data.values.join(" OR ") + ")"));
      }
    }

    //Ueber Facettenfelder gehen
    for (let key of Object.keys(queryFormat.facetFields)) {

      //Schnellzugriff auf Infos dieser Facette
      let facet_data = queryFormat.facetFields[key];

      //Bei AND Verknuepfung innerhalb einer Facette keine Extra-Behandlung, bei OR-Verknuepfung muss sichergestellt sein, dass andere Werte auch sichtbar sind (Auswahl ger -> auch Facettenwert eng anzeigen fuer ger OR eng)
      let extra_tag = facet_data.operator === "AND" ? ["", ""] : ["{!ex=" + facet_data.field + "}", "{!tag=" + facet_data.field + "}"];

      //Feld als Solr-Facette in URL anmelden (damit ueberhaupt Daten geliefert werden), # wird von PHP wieder zu . umgewandelt
      myParams.append("facet#field[]", (extra_tag[0] + facet_data.field));

      //Wenn es Werte bei einem Facettenfeld gibt (z.B. bei language fuer language_all_facet)
      if (facet_data.values.length) {

        //Einzelwerte dieser Facette operator (OR vs. AND) verknuepfen (ger OR eng) und in Array sammeln
        myParams.append("fq[]", encodeURI(extra_tag[1] + facet_data.field + ":(" + facet_data.values.join(" " + facet_data.operator + " ") + ")"));
      }
    }

    //Ueber Rangefelder gehen
    for (let key of Object.keys(queryFormat.rangeFields)) {

      //Schnellzugriff auf Infos dieser Range
      let range_data = queryFormat.rangeFields[key];

      //Feld als Solr-Facette in URL anmelden und Range-Optionen aktivieren, # wird von PHP wieder zu . umgewandelt
      myParams.append("facet#query[]", "{!ex=" + range_data.field + "}" + range_data.field + ":0");
      myParams.append("facet#range[]", "{!ex=" + range_data.field + "}" + range_data.field);
      myParams.append("f#" + range_data.field + "#facet#range#start", range_data.min);
      myParams.append("f#" + range_data.field + "#facet#range#end", range_data.max + 1);
      myParams.append("f#" + range_data.field + "#facet#range#gap", "1");
      myParams.append("f#" + range_data.field + "#facet#mincount", "0");

      //Range-Anfrage
      let range_query = "{!tag=" + range_data.field + "}" + range_data.field + ":[" + range_data.from + " TO " + range_data.to + "]"

      //ggf. Treffer ohne Wert dieser Range (z.B. ohne Jahr) einfuegen
      range_query += range_data.showMissingValues ? " OR " + range_data.field + ":0" : "";
      myParams.append("fq[]", encodeURI(range_query));
    }

    //Weitere Suchparameter setzen
    myParams.set('start', queryFormat.queryParams.start.toString());
    myParams.set('rows', queryFormat.queryParams.rows.toString());
    myParams.set('fl', this.tableFields);
    myParams.set('sort', encodeURI(queryFormat.queryParams.sortField + " " + queryFormat.queryParams.sortDir));

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit Suchparametern
      .get(this.proxyUrl, { params: myParams })

      //Antwort als JSON weiterreichen
      .map(response => response.json() as any);
  }

  //Detail-Daten aus Solr holen (abstract,...)
  getBackendDetailData(id: string): Observable<any> {

    //Suchparameter sammeln und dem Proxy-Skript uebergeben
    let myParams = new URLSearchParams();

    //Doppelpunkt in ID für Solr-Abfrage escapen (oai:opus.uni-hohenheim.de:1 -> oai\:opus.uni-hohenheim.de\:1)
    let clean_id = id.toString().replace(/:/g, "\\:");

    //Suche nach ID
    myParams.set("q", "id:" + clean_id);

    //Feldliste
    myParams.set("fl", this.detailFields);

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(this.proxyUrl, { params: myParams })

      //das 1. Dokument als JSON weiterreichen
      .map(response => response.json().response.docs[0] as any);
  }

  //Merklisten-Daten in Solr suchen
  getBackendDataBasket(basket: BasketFormat): Observable<any> {

    //Suchparameter sammeln und dem Proxy-Skript uebergeben
    let myParams = new URLSearchParams();

    //ID sammeln
    let idArray = [];

    //Ueber IDs gehen
    for (let id of basket.ids) {

      //Doppelpunkt in ID für Solr-Abfrage escapen (oai:opus.uni-hohenheim.de:1 -> oai\:opus.uni-hohenheim.de\:1)
      let clean_id = id.toString().replace(/:/g, "\\:");

      //ID merken
      idArray.push("id:(" + clean_id + ")");
    }

    //Wenn es IDs gibt, kombinierte ID Anfrage bauen (id: 10 OR id:12 OR...) ansonsten leere Treffermenge (-id:*)
    let query = idArray.length ? idArray.join(" OR ") : "-id:*"
    myParams.set("q", encodeURI(query));

    //Ab welchem Treffer soll gesucht werden?
    let start = basket.queryParams.start ? basket.queryParams.start : 0;
    myParams.set("start", start.toString());

    //weitere Parameter setzen
    myParams.set('rows', this.basketRows.toString());
    myParams.set('fl', this.tableFields);
    myParams.set('sort', encodeURI(basket.queryParams.sortField + " " + basket.queryParams.sortDir));

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(this.proxyUrl, { params: myParams })

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json() as any);
  }

}

//facet#field in if packen