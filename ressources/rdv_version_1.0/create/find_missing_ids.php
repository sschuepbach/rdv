<?php

//Mode
$mode = "presidents";

//Year numbers (usually the error is here)
$years = [1771, 1919];

//URL for query with year numbers
$url_fq = "http://localhost:8080/solr/" . $mode . "/select?q=*:*&fq=%7B!tag=py_all_facet%7Dpy_all_facet:%5B" . $years[0] . "%20TO%20" . $years[1] . "%5D%20OR%20py_all_facet:0&rows=100000&fl=id&sort=id_int+asc&wt=phps&omitHeader=true";
$serialized_response = file_get_contents($url_fq);
$response = unserialize($serialized_response);

//collect IDs
$id_all_array = [];

foreach ($response["response"]["docs"] as $doc) {
    $id_all_array[] = $doc["id"];
}

//URL for *:* requests
$url_all = "http://localhost:8080/solr/" . $mode . "/select?q=*:*&wt=phps&omitHeader=true&rows=100000&fl=id&sort=id_int+asc";
$serialized_response = file_get_contents($url_all);
$response = unserialize($serialized_response);

// Resolved output value
foreach ($response["response"]["docs"] as $doc) {

    //If ID is not found in another list
    if (!in_array($doc["id"], $id_all_array)) {
        echo $doc["id"] . " fehlt\n";
    }
}