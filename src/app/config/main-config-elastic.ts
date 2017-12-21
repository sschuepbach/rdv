export class MainConfig {

    //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
    searchFields = {
        "options": {
            "all_text": "Freitext",
            "Titel": "Titel",
            "fct_location.search": "Ort",
            "Verlag": "Verlag"
        },
        "preselect": ["all_text", "Titel", "Verlag"]
    };

    //Infos zu Filtern (z.B. Filterung nach Einrichtung)
    filterFields = {
        "institution": {
            "label": "Ort",
            "field": "hidden_analysis_fct_location",
            "options": [
                {
                    "value": "Ort",
                    "label": "Ort"
                },
                {
                    "value": "Druckort",
                    "label": "Druckort"
                },
                {
                    "value": "Aushangsort",
                    "label": "Aushangsort"
                }
            ]
        },
        "type": {
            "label": "Typ",
            "field": "fct_type",
            "options": [
                {
                    "value": "Apartheid",
                    "label": "Apartheid"
                },
                {
                    "value": "Kunst",
                    "label": "Kunst"
                },
                {
                    "value": "Widerstand",
                    "label": "Wiederstand"
                }
            ]
        }
    };

    //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
    //order gilt fuer Facetten und Ranges
    facetFields = {
        "topic": {
            "field": "fct_topic",
            "label": "Topic",
            "operators": ["OR", "AND"],
            "operator": "AND",
            "order": 1
        },
        "country": {
            "field": "fct_countrycode",
            "label": "Country",
            "operators": ["OR"],
            "operator": "OR",
            "order": 3
        }
    };

    //Infos zu Ranges (z.B. Label)
    //order gilt fuer Facetten und Ranges
    rangeFields = {};

    //Wo liegt Proxy-Skript, das mit Solr spricht?
    proxyUrl = "http://localhost/mh1018/test/php/elasticsearch/angularx_elasticsearch_proxy_unibas.php";

    //Optionen fuer Anzahl der Treffer Treffertabelle
    rowOpts = [5, 10, 20, 50];

    queryParams = {
        "rows": 10,
        "start": 0,
        "sortField": "_uid",
        "sortDir": "asc"
    }

    //Config fuer Merkliste
    basketConfig = {
        "queryParams": {
            "rows": 10,
            "sortField": "_uid",
            "sortDir": "asc"
        }
    };

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id",
            "label": "ID",
            "sort": "_uid",
            "css": "col-sm-2 col-lg-1 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "hidden_analysis_fct_location",
            "label": "Region",
            "sort": "hidden_analysis_fct_location",
            "css": "col-sm-2 col-lg-2 text-left",
        },
        {
            "field": "Titel",
            "label": "Titel",
            "sort": "Titel.keyword",
            "css": "col-sm-5 col-lg-6 text-left",
        },
        {
            "field": "fct_type",
            "label": "Type",
            "sort": "fct_type",
            "css": "col-sm-2 col-lg-2 text-left",
        }

    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {
        "date": {
            "field": "Anfangsdatum",
            "label": "Anfangsdatum",
            "display": "text"
        },
        "number": {
            "field": "Inventarnummer",
            "label": "Inventarnummer",
            "display": "text"
        }
    };
}