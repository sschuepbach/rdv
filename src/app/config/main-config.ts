export class MainConfig {

    //Welche Felder sind durchsuchbar
    searchFields = {
        "all_text": "Freitext",
        "ti_all_text": "Titel",
        "person_all_text": "Person",
        "py_string": "Jahr"
    };

    //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
    //order gilt fuer Facetten und Ranges
    facetFields = {
        "corporate": {
            "label": "Institution",
            "operators": ["OR", "AND"],
            "order": 5
        },
        "language": {
            "label": "Sprache",
            "operators": ["OR", "AND"],
            "order": 2
        },
        "doctype": {
            "label": "Dokumenttyp",
            "operators": ["OR"],
            "order": 3
        }
    };

    //Infos zu Ranges (z.B. Label)
    //order gilt fuer Facetten und Ranges
    rangeFields = {
        "year": {
            "label": "Jahr",
            "order": 4
        },
        "pages": {
            "label": "Seitenzahl",
            "order": 1
        }
    };

    //Optionen fuer Anzahl der Treffer Treffertabelle
    rowOpts = [5, 10, 20, 50];

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id",
            "label": "ID",
            "multi": false,
            "sort": "id_int",
            "css": "col-sm-2 col-lg-1 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "person_all_string",
            "label": "Person",
            "multi": true,
            "sort": "person_sort_string",
            "css": "col-sm-4 col-lg-5 text-left",
        },
        {
            "field": "ti_all_string",
            "label": "Titel",
            "multi": true,
            "sort": "ti_sort_string",
            "css": "col-sm-4 col-lg-5 text-left",
        },
        {
            "field": "py_string",
            "label": "Jahr",
            "multi": false,
            "sort": "py_string",
            "css": "col-sm-2 col-lg-1 text-sm-center",
        }
    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {
        "keywords": {
            "field": "keyword_all_string",
            "label": "Schlagwörter"
        },
        "source": {
            "field": "source_title_all_string",
            "label": "Quelle"
        }
    };
}
