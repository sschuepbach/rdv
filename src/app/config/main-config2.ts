export class MainConfig {

    //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
    searchFields = {
        "options": {
            "all_text": "Freitext",
            "ti_all_text": "Titel",
            "person_all_text": "Person"
        },
        "preselect": ["ti_all_text", "person_all_text", "all_text"]
    };

    //BWSTS-Filter
    filterFields = {
        "institution": {
            "label": "Einrichtung",
            "field": "mode_all_facet",
            "url": "http://localhost/bwsts/web/export.php",
            "data": []
        }
    }

    //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
    //order gilt fuer Facetten und Ranges
    facetFields = {};

    //Infos zu Ranges (z.B. Label)
    //order gilt fuer Facetten und Ranges
    rangeFields = {
        "year": {
            "field": "py_int",
            "label": "Jahr",
            "order": 1,
            "min": 1950,
            "from": 1950,
            "to": 2017,
            "max": 2017,
            "showMissingValues": true
        }
    };

    //Wo liegt Proxy-Skript, das mit Solr spricht?
    proxyUrl = "http://localhost/mh1018/test/php/solr/angularx_solr_proxy_bwsts.php";

    //Optionen fuer Anzahl der Treffer Treffertabelle
    rowOpts = [5, 10, 20, 50];

    queryParams = {
        "rows": this.rowOpts[2],
        "start": 0,
        "sortField": "id_int",
        "sortDir": "asc"
    }

    //Anzahl der Treffer pro Seite in Merklisten-Treffertabelle
    basketRows = 10;

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id",
            "label": "ID",
            "multi": false,
            "sort": false,
            "css": "col-sm-2 col-lg-2 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "rdvname_string",
            "label": "Repo",
            "multi": false,
            "sort": "rdvname_string",
            "css": "col-sm-2 col-lg-2 text-left",
        },
        {
            "field": "person_all_string",
            "label": "Person",
            "multi": true,
            "sort": "person_sort_string",
            "css": "col-sm-2 col-lg-2 text-left",
        },
        {
            "field": "ti_all_string",
            "label": "Titel",
            "multi": true,
            "sort": "ti_sort_string",
            "css": "col-sm-3 col-lg-4 text-left",
        },
        {
            "field": "py_int",
            "label": "Jahr",
            "multi": false,
            "sort": "py_int",
            "css": "col-sm-2 col-lg-1 text-sm-center",
        }
    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {
        "url": {
            "field": "url_all_string",
            "label": "URL"
        }
    };
}