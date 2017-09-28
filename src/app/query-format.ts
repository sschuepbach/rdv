export class QueryFormat {
    searchFields = {
        "search1": {
            "value": "",
            "field": "all_text"
        },
        "search2": {
            "value": "",
            "field": "ti_all_text"
        },
        "search3": {
            "value": "",
            "field": "person_all_text"
        },

    };

    facetFields = {
        "doctype": {
            "values": [],
            "field": "doctype_string"
        },
        "language": {
            "values": [],
            "field": "language_all_facet"
        }
    };

    rangeFields = {
        "year": {
            "min": 1950,
            "from": 1950,
            "to": 2017,
            "max": 2017,
            "field": "py_int",
            "prefix": "Jahr ",
            "showMissingValues": true
        },
        "pages": {
            "min": 1,
            "from": 1,
            "to": 20,
            "max": 20,
            "field": "pages_int",
            "prefix": "Seitenanzahl ",
            "showMissingValues": true
        }
    };

    queryParams = {
        "rows": 10,
        "start": 0,
        "sortField": "id_int",
        "sortDir": "asc"
    };

    constructor() { }
}