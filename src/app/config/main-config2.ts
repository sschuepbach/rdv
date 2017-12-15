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

    //BWSTS-Filter
    filterFields = {
        "institution": {
            "label": "Einrichtung",
            "field": "mode_all_facet",
            "url": "http://localhost/bwsts/web/export.php",
            "options": []
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

    //Config fuer Merkliste
    basketConfig = {
        "rows": 10,
        "sortField": "id_int",
        "sortDir": "asc"
    };

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id_int",
            "label": "ID",
            "sort": "id_int",
            "css": "col-sm-2 col-lg-2 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "rdvname_string",
            "label": "Repo",
            "sort": "rdvname_string",
            "css": "col-sm-2 col-lg-2 text-left",
        },
        {
            "field": "person_all_string",
            "label": "Person",
            "sort": "person_sort_string",
            "css": "col-sm-2 col-lg-2 text-left",
        },
        {
            "field": "ti_all_string",
            "label": "Titel",
            "sort": "ti_sort_string",
            "css": "col-sm-3 col-lg-4 text-left",
        },
        {
            "field": "py_int",
            "label": "Jahr",
            "sort": "py_int",
            "css": "col-sm-2 col-lg-1 text-sm-center",
        }
    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {
        "id": {
            "field": "id",
            "label": "vollständige ID",
            "display": "text"
        },
        "url": {
            "field": "url_all_string",
            "label": "URL",
            "display": "link"
        }
    };
}