export class MainConfig {

    //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
    searchFields = {
        "options": {
            "all_text": "Freitext",
            "ti_all_text": "Titel",
            "person_all_text": "Person"
        },
        "preselect": ["all_text", "ti_all_text", "person_all_text"]
    };

    //Infos zu Filtern (z.B. Filterung nach Einrichtung)
    filterFields = {};

    //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
    //order gilt fuer Facetten und Ranges
    facetFields = {};

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
        "sortField": "id_int",
        "sortDir": "asc"
    }

    //Config fuer Merkliste
    basketConfig = {
        "rows": 10,
        "sortField": "id_int",
        "sortDir": "asc"
    };

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id",
            "label": "ID",
            "sort": "id_int",
            "css": "col-sm-2 col-lg-1 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "fct_person_organisation",
            "label": "Person",
            "sort": "ti_sort_string",
            //"css": "col-sm-4 col-lg-5 text-left",
            "css": "col-sm-4 col-lg-4 text-left",
        },
        {
            "field": "Titel",
            "label": "Titel",
            "sort": "ti_sort_string",
            //"css": "col-sm-4 col-lg-5 text-left",
            "css": "col-sm-5 col-lg-6 text-left",
        }

    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {};
}