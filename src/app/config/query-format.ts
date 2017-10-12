export class QueryFormat {
    searchFields = {
        "search1": {
            "field": "all_text",
            "value": ""
        },
        "search2": {
            "field": "ti_all_text",
            "value": ""
        },
        "search3": {
            "field": "person_all_text",
            "value": ""
        }
    };

    facetFields = {
        "language": {
            "field": "language_all_facet",
            "values": [],
            "operator": "AND"
        },
        "doctype": {
            "field": "doctype_string",
            "values": [],
            "operator": "OR"
        },
        "corporate": {
            "field": "corporate_id_all_string",
            "values": [],
            "operator": "OR"
        }
    };

    rangeFields = {
        "year": {
            "field": "py_int",
            "min": 1950,
            "from": 1950,
            "to": 2017,
            "max": 2017,
            "showMissingValues": true
        },
        "pages": {
            "field": "pages_int",
            "min": 1,
            "from": 1,
            "to": 20,
            "max": 20,
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