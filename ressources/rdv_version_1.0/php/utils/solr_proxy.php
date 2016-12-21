<?php

// Get solr properties
require_once('../../config/main.php');
require_once('../../config/' . $projectName . '/' . $projectName . '_main.php');
require_once('utils.php');

// Pass URL with finished request
$query = $_POST["query"];
$mode = $_POST["mode"];

// no special solr parameters
$base_string = "";

// Special solr parameters for some modules (diagram and facetts)
if ($mode == "search") {

    if (has_feature("diagram")) {

        // Get all values for a year
        $base_string .= "facet=true&facet.limit=50&facet.mincount=1&facet.field={!ex=py_all_facet}py_all_facet&f.py_all_facet.facet.limit=-1";
    }

    // If Facets or tree search existss
    if (has_feature("facet") || has_feature("tree")) {

        // active faceting. Do not show 0 values
        $base_string .= "&facet=true&facet.limit=50&facet.mincount=1";
    }
}

// Build URL
$url = 'http://localhost:' . $solrPort . "/solr/" . $projectName . "/select?" . $base_string .
        "&omitHeader=true&wt=json&json.nl=map&fl=" . $configArray["solr_" . $mode] . "&q=" .
        $query . "&debugQuery=" . $debug_query;

//If there are facets to be sorted alphabetically and not not frequency
if (isset($configArray["facet_index_sort_array"])) {

    foreach ($configArray["facet_index_sort_array"] as $facet) {

        // Insert feature to query
        $url .= "&f." . $facet . ".facet.sort=index";
    }
}

echo file_get_contents($url);
