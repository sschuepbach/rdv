<?php

//Configuration array
$config_array = [];

//Piwik ID
$config_array["piwik_id"] = 16;

//Features
$config_array["features"] = ["backlinks", "diagram", "filter", "facet", "tree"];

//Header
$config_array["banner_label"] = "Freiburg Corpus of English Dialects (FRED) - Interactive Database";

//Open label for all nodes in tree
$config_array["tree_open_all_label"] = "show all";

//Close all nodes label
$config_array["tree_close_all_label"] = "collapse all";

//Placeholder fuer Tree-Suche
$config_array["tree_search_placeholder"] = "search";

// diagram label
$config_array["diagram_label"] = "Age";

// Back links
$config_array["backlink_array"] = [
    ["Zugehöriger Eintrag in FreiDok plus", "https://www.freidok.uni-freiburg.de/data/10206"]
];

// Filter
$config_array["filter_array"] = [
    [
        "name" => "Corpus filter",
        "field" => "mode_all_facet",
        "values" => [
            "FRED-S" => "FRED-S",
            "FRED" => "FRED"
        ]
    ]
];

// Facetten fields
$config_array["facet_array"] = [
    'SPEAKER_SEX_CLEAN_all_facet' => 'Sex',
];

// search tree
$config_array["tree_array"] = [
    'LOC_CLEAN_all_facet' => 'Area - County - Location'
];

// Heading of the table (2 values: heading and solr_Sortierfeld vs. only 1 value: heading and field not soriterable)
$config_array["table_array"] = [
    ["Age", "py_sort_string"],
    ["Sex", "SPEAKER_SEX_sort_string"],
    ["Location", "LOC_sort_string"],
    ["Corpus", "mode_sort_string"],
    ["Preview"],
    ["Text"],
    ["Download"],
    ["Full audio online"]
];

// Solr
$config_array["solr_search"] = '*';
$config_array["solr_extra_data"] = '*';
