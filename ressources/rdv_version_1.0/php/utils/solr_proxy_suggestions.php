<?php

header('Content-Type: text/html; charset=utf-8');

// Trims and endodes the search term, so that spaces are displayed correctly

$term = urlencode(trim($_GET["term"]));

//Which field is searched?
$type = trim($_GET["type"]);

// How many hits should be shown?
$limit = trim($_GET["limit"]);

// Request only if Term is long enough
if (strlen($term) > 0) {

    // Get Solr properties
    require_once('../../config/main.php');

    $url = 'http://localhost:' . $solrPort . "/solr/" . $projectName . '/terms?terms.fl=' . $type . '&terms.regex=' . $term . '.*&terms.regex.flag=case_insensitive&wt=json&json.nl=arrarr&omitHeader=true&terms.limit=' . $limit;

    // get data from solr
    $result = json_decode(file_get_contents($url), true);

    // liste of the values
    $list = $result["terms"][$type];

    $return = array();

    foreach ($list as $doc) {
        $return[] = $doc[0];
    }

    echo(json_encode($return));
}