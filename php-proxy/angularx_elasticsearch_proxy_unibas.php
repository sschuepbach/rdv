<?php

//CORS
header("Access-Control-Allow-Origin: *");

//Plugins laden
require 'vendor/autoload.php';

//ES-Proxy
use Elasticsearch\ClientBuilder;

//welcher Index/Type soll abgefragt werden?
//$index = 'slider18';
//$type = 'doc';
$index = 'afrikaportal_v6';
$type = 'document';

//Debugausgabe?
//$debug = true;

$client = ClientBuilder::create()->build();

//Mapping-Funktion um ElasticSearch-Reponse-Docs zu transformieren, damit Angular es direkt nutzen kann (Format entspricht etwa dem Solr-Format)
function es_map($hit) {

    //Array fuer einzelnes doc
    $doc = [];

    //ID steht auf oberster Ebene
    $doc["id"] = $hit["_id"];

    //in _source werden die Werte gesamelt
    foreach ($hit["_source"] as $field => $value) {

        //Die Werte 1 Ebene nach oben schieben
        $doc[$field] = $value;
    }

    //neues Array zurueckgeben
    return $doc;
}

//Mapping-Funktion um Facettenwerte / -anzahl-Paare auf passendes Format zu mappen (~Solr-Format)
function bucket_map($bucket) {

    //["Artikel", 4]
    return [$bucket["key"], $bucket["doc_count"]];
}

//POST-Daten lesen und in PHP-Arrays umwandeln
$postdata = file_get_contents('php://input');
$request = json_decode($postdata, true);

//Body der Suche-Anfrage befuellen
$body = [];

//Mainquery merken fuer die Filterung innerhalb der Facetten / Ranges
$main_query = "";

//Ist es eine komplexe Suche (=Suchfelder ausgefuellt)?
if (isset($request["query"])) {

    //Query wird bereits von Angular korrekt geliefert
    $main_query = $request["query"];
    $body["query"] = $request["query"];
}

//Ist es eine *:* Suche (= keine Suchfelder ausgefuellt)?
if (isset($request["match_all"])) {

    //match_all query aufbauen, da dieses wegen {} Objekten in JS nicht direkt geliefert werden kann
    $body["query"] = ["bool" => ["must" => [["match_all" => new \stdClass()]]]];
    $main_query = ["bool" => ["must" => [["match_all" => new \stdClass()]]]];
}

//Filterquery merken fuer die Filterung innerhlab der Facetten / Ranges
$filter_query = "";

//Wenn Filter gesetzt sind
if (isset($request["filter"])) {

    //Filter in Boolquery setzen
    $filter_query = $request["filter"];
    $body["query"]["bool"]["filter"] = $request["filter"];
}

//Wenn Facet oder Range gesetzt ist
if (isset($request["facet"]) || isset($request["range"])) {

    //Global-Filter setzen, damit nicht auf gefilterte Dokumente aggregiert wird
    $body["aggs"]["all_facets"]["global"] = new \stdClass();
}

//Facettenanfragen sammeln, im Aggs-Bereich muessen bei OR-Abfragen z.B. bei der Filterung der color-Facette alle anderen Facetten (doctype, language,...) bei color angewendet werden, aber nicht die color-Suche selbst (sonst wuerde man die nicht ausgewaehlte Werte dieser Facette nicht sehen)
$full_facet_term_query_array = [];

//Wenn Facetten gesetzt sind (z.B. nicht bei basket-id query)
if (isset($request["facet"])) {

    //Facettenanfragen der Facetten merken (z.B. Doctype:Artikel)
    $facet_term_query_array = [];

    //Ueber Facetten gehen (doctype, language, color,...)
    foreach ($request["facet"] as $key => $facet_data) {

        //festlegen ob einzelne Werte einer Facette per OR (should => Helfer, Martin OR Borel, Franck) oder AND (must => Helfer, Martin AND Borel, Franck) verknuepft werden
        $operator = $facet_data["operator"] === "OR" ? "should" : "must";

        //Facettenanfragen dieser Facette merken [[term: "Helfer, Martin]], [term: "Borel, Franck"]], hier noch ohne Operatorverknuepfung
        $facet_term_query_array[$key] = [];

        //Ueber einzelne Werte ("Helfer, Martin", "Borel, Franck",...) dieser Facette ("Personen") gehen
        foreach ($facet_data["values"] as $facet_value) {

            //Wert in bool-query einfuegen als term-query (=exakte Suche auf keyword)
            $facet_term_query_array[$key][] = ["term" => [$facet_data["field"] => $facet_value]];
        }

        //Jetzt die Facettenanfrage dieser Facette in Hauptsuche (bei Filter) einfuegen
        if ($facet_term_query_array[$key]) {

            //Facettenabfrage dieser Facette mit operator merken fuer spaeter (z.B. Person = must/should => ["Helfer, Martin", "Borel, Franck"])
            $full_facet_term_query_array[$key] = [$operator => $facet_term_query_array[$key]];

            //in bool-must-query in filter einfuegen als bool-query (bool => must/should => ["Helfer, Martin", "Borel, Franck"]), damit sie per AND mit den anderen Bereichen (Suchfelder, Filter) verknuepft wird
            $body["query"]["bool"]["filter"]["bool"]["must"][] = ["bool" => $full_facet_term_query_array[$key]];
        }
    }

    //jetzt nochmal ueber Facetten gehen und Filter im Agg Bereich setzen, dazu mussten erstmal alle Facet-Termqueries gesammelt werden
    foreach ($request["facet"] as $key => $facet_data) {

        //Jetzt noch die Facet-Termqueries der ANDEREN FACETTEN hier einfuegen, eigene facet-term-Query dabei ignorieren (sonst wuerde man die anderen Optionen dieser Facette nicht sehen)
        //Kopie aller Term queries holen
        $copy_facet_term_query_array = $full_facet_term_query_array;

        //Wenn die Facettenwerte eine Facette per OR verknuepft werden
        if ($facet_data["operator"] === "OR") {

            //den eigenen Schluessel entfernen, damit diese anderen Optionen angezeigt werden, ansonsten wird die Facettenanfrage auch angewandt und man hat den gewuenschten AND-Effekt
            unset($copy_facet_term_query_array[$key]);
        }

        //jetzt mit den verbleibenden keys die sub-agg fuer diese Facette bauen
        foreach ($copy_facet_term_query_array as $other_facet_query) {

            //andere Facetqueryies einfuegen, Bsp. color per OR -> hier nur noch die Facettenanfragen von doctype und language einfuegen, bei AND waere auch die color-Facettenanfrage dabei
            $body["aggs"]["all_facets"]["aggs"][$key]["filter"]["bool"]["must"][] = ["bool" => $other_facet_query];
        }

        //Hauptquery einfuegen (Suchefelder oder *:*) bei Facette
        $body["aggs"]["all_facets"]["aggs"][$key]["filter"]["bool"]["must"][] = $main_query;

        //Filterquery einfuegen bei Facette, wenn gesetzt
        if ($filter_query !== "") {
            $body["aggs"]["all_facets"]["aggs"][$key]["filter"]["bool"]["must"][] = $filter_query;
        }

        //jetzt noch die tatsaechliche Aggreation einfuegen, terms-Aggregation = Facettierung
        $body["aggs"]["all_facets"]["aggs"][$key]["aggs"] = ["filtered_" . $key => ["terms" => ["field" => $facet_data["field"]]]];
    }
}

//Rangeabfragen sammeln (s. Facetten oben)
$full_range_term_query_array = [];

//Wenn Ranges gesetzt sind (z.B. nicht bei basket-id query)
if (isset($request["range"])) {

    //Ueber Ranges gehen (year, pages,...)
    foreach ($request["range"] as $key => $range_data) {

        //Range query aufbauen, zunachest from to query
        $range_query = ["bool" => ["should" => [["range" => [$range_data["field"] => ["gte" => $range_data["from"], "lte" => $range_data["to"]]]]]]];

        //Wenn auch Eintraege mit fehlmendem Wert (z.B. ohne Jahr) angezeigt werden sollen
        if ($range_data["showMissingValues"]) {

            //OR "year is missing" Anfrage hinzufuegen bisherigen zur Rangequery (1992 TO 1998)
            $range_query["bool"]["should"][] = ["bool" => ["must_not" => ["exists" => ["field" => $range_data["field"]]]]];
        }

        //Range-Query merken ("1992 TO 1998" OR "year is missing")
        $full_range_term_query_array[$key] = $range_query;

        //Range-Query in Haupt-Suche einfuegen (zusaetzlich zu Suchfeldern, Facetten,...)
        $body["query"]["bool"]["must"][] = $full_range_term_query_array[$key];
    }

    //jetzt nochmal ueber Ranges gehen und Filter im Agg Bereich setzen, dazu mussten erstmal alle Range-Termqueries gesammelt werden
    foreach ($request["range"] as $key => $range_data) {

        //Jetzt noch die Range-Termqueries der ANDEREN RANGES hier einfuegen, eigene range-term-Query dabei ignorieren (sonst wuerde man die anderen Optionen dieser Range nicht sehen, also z.B. Jahreswerte ausserhalb des ausgewaehlte Bereichs)
        //Kopie aller Term queries holen
        $copy_range_term_query_array = $full_range_term_query_array;

        //den eigenen Schluessel entfernen, damit die anderen Optionen angezeigt werden (z.B. Titel ausserhalb des ausgewaehlte Rangebereichs)
        unset($copy_range_term_query_array[$key]);

        //jetzt mit den verbleibenden keys den Filter fuer diese Range bauen
        foreach ($copy_range_term_query_array as $other_range_query) {

            //andere Rangequeries einfuegen, Bsp. fuer year-Histogram nur die Werte zulassen, die mit den ausgewaehlten Werten der pages-range zusammenfallen, es gibt dabei immer 2 Bereiche. from to agg und missing agg
            $body["aggs"]["all_facets"]["aggs"]["histogram_" . $key]["filter"]["bool"]["must"][] = $other_range_query;
            $body["aggs"]["all_facets"]["aggs"]["missing_" . $key]["filter"]["bool"]["must"][] = $other_range_query;
        }

        //Hauptquery einfuegen (Suchefelder oder *:*) bei histogram-Filter und missing-Filter
        $body["aggs"]["all_facets"]["aggs"]["histogram_" . $key]["filter"]["bool"]["must"][] = $main_query;
        $body["aggs"]["all_facets"]["aggs"]["missing_" . $key]["filter"]["bool"]["must"][] = $main_query;

        //Filterquery einfuegen bei histogram-Filter und missing-Filter, wenn gesetzt
        if ($filter_query !== "") {
            $body["aggs"]["all_facets"]["aggs"]["histogram_" . $key]["filter"]["bool"]["must"][] = $filter_query;
            $body["aggs"]["all_facets"]["aggs"]["missing_" . $key]["filter"]["bool"]["must"][] = $filter_query;
        }

        //jetzt noch die tatsaechliche Aggreation einfuegen, histogram- fuer 1992 TO 1998
        $body["aggs"]["all_facets"]["aggs"]["histogram_" . $key]["aggs"] = ["filtered_histogram_" . $key => ["histogram" => ["field" => $range_data["field"], "interval" => 1, "extended_bounds" => ["min" => $range_data["min"], "max" => $range_data["max"]]]]];

        //missing aggregation fuer Anzahl der Titel ohne Jahr
        $body["aggs"]["all_facets"]["aggs"]["missing_" . $key]["aggs"] = ["filtered_missing_" . $key => ["missing" => ["field" => $range_data["field"]]]];
    }
}

//Bei Ranges die Facettenanfragen in Filter einbauen (mussten erst gesammelt werden)
//Wenn Ranges gesetzt sind (z.B. nicht bei basket-id query)
if (isset($request["range"])) {

    //ueber Ranges gehen
    foreach ($request["range"] as $key => $range_data) {

        //Ueber Facettenabfragen gehen
        foreach ($full_facet_term_query_array as $facet_query) {

            //und diese bei histogramm-Filter und missing-Filter einbauen
            $body["aggs"]["all_facets"]["aggs"]["histogram_" . $key]["filter"]["bool"]["must"][] = ["bool" => $facet_query];
            $body["aggs"]["all_facets"]["aggs"]["missing_" . $key]["filter"]["bool"]["must"][] = ["bool" => $facet_query];
        }
    }
}

//Bei Facetten die Rangeanfragen in Filter einbauen (mussten erst gesammelt werden)
//Wenn Facets gesetzt sind (z.B. nicht bei basket-id query)
if (isset($request["facet"])) {

    //ueber Facetten gehen
    foreach ($request["facet"] as $key => $facet_data) {

        //Ueber Rangeabfragen gehen
        foreach ($full_range_term_query_array as $range_query) {

            //und diese bei Facetten-Filter einbauen
            $body["aggs"]["all_facets"]["aggs"][$key]["filter"]["bool"]["must"][] = $range_query;
        }
    }
}

//var_dump(json_encode($body["aggs"]["all_facets"]["aggs"], JSON_PRETTY_PRINT));
//return;
//Ist es eine ID query (Basket)? Hier keine Filter, Facetten, etc.
if (isset($request["ids"])) {

    //ID-Query erstellen mit den zu shcnendne IDs
    $body["query"] = ["ids" => ["values" => $request["ids"]]];
}

//Wenn Sortierfeld gesetzt ist (bei Detailsuche z.B. nicht gesetzt)
if (isset($request["queryParams"]["sortField"])) {

    //Sortierfeld und -richtung setzen
    $body["sort"] = [$request["queryParams"]["sortField"] => $request["queryParams"]["sortDir"]];
}

//Wenn Startoffset setzt ist (bei Detailsuche z.B. nicht gesetzt)
if (isset($request["queryParams"]["start"])) {

    //Offset setzten (z.B. bei Paging)
    $body["from"] = $request["queryParams"]["start"];
}

//Wenn Anzahl der Treffer gesetzt ist (bei Detailsuche z.B. nicht gesetzt)
if (isset($request["queryParams"]["rows"])) {

    //Anzahl Treffer setzen
    $body["size"] = $request["queryParams"]["rows"];
}

//Wenn nur gewisse Felder geholt werden sollen (sonst werden alle Felder geholt)
if (isset($request["sourceFields"])) {

    //Auswahl der Felder (~fl bei solr) setzen
$body["_source"] = $request["sourceFields"];
}

//Parameter fuer Suche = index, type + query-body
$params = [
    'index' => $index,
    'type' => $type,
    'body' => $body
];

//Suche starten
$result = $client->search($params);

//Treffer-Array transformieren fuer Oberflaeche
$hits = array_map("es_map", $result["hits"]["hits"]);

//Ausgabe-Variable fuer Ergebnisse
$output = [];

//Anzahl der Treffer
$output["response"]["numFound"] = $result["hits"]["total"];

//Array der (transformierten) Docs
$output["response"]["docs"] = $hits;

//Facetten
$output["facet_counts"]["facet_fields"] = [];

//Wenn es Facetten gibt
if (isset($request["facet"])) {

    //Ueber Facetten gehen
    foreach ($request["facet"] as $key => $facet_data) {

        //Facettenwerte ins passende Weiterverarbeitungsformat transformieren
        $buckets = array_map("bucket_map", $result["aggregations"]["all_facets"][$key]["filtered_" . $key]["buckets"]);
        $output["facet_counts"]["facet_fields"][$facet_data["field"]] = $buckets;
    }
}

//Ranges
$output["facet_counts"]["facet_ranges"] = [];
$output["facet_counts"]["facet_queries"] = [];

//Wenn es Ranges gibt
if (isset($request["range"])) {

    //Ueber Ranges gehen
    foreach ($request["range"] as $key => $range_data) {

        //Rangewerte [from to query] ins passende Weiterverarbeitungsformat transformieren
        //$buckets = array_map("bucket_map", $result["aggregations"]["all_facets"]["histogram_" . $key]["filtered_histogram_" . $key]["buckets"]);
        //$output["facet_counts"]["facet_ranges"][$range_data["field"]]["counts"] = $buckets;

                //Rangewerte [from to query] ins passende Weiterverarbeitungsformat transformieren
                
                $buckets = $result["aggregations"]["all_facets"]["histogram_" . $key]["filtered_histogram_" . $key]["buckets"];
        
                foreach($buckets as $bucket) {
        
                    if ($bucket["key"] >= 1950 && $bucket["key"] <= 2018) {
        
                    $output["facet_counts"]["facet_ranges"][$range_data["field"]]["counts"][] = [$bucket["key"], $bucket["doc_count"]];
                    }
                }
                

        //Anzahl der Missing-Werte holen
        $output["facet_counts"]["facet_queries"]["{!ex=" . $range_data["field"] . "}" . $range_data["field"] . ":0"] = $result["aggregations"]["all_facets"]["missing_" . $key]["filtered_missing_" . $key]["doc_count"];
    }
}

//Debug
if (isset($debug)) {
    print("<pre>" . print_r(json_encode($body, JSON_PRETTY_PRINT), true) . "</pre>");
    print("<pre>" . print_r(json_encode($output, JSON_PRETTY_PRINT), true) . "</pre>");
    print("<pre>" . print_r($result, true) . "</pre>");
}

//Produktiv
else {

    //Ergebnisse als JSON ausgeben
    echo json_encode($output, JSON_PRETTY_PRINT);
}