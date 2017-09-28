<?php
/**
 * Creates hierachical area country location data set. Uses therefor an ods file.
 * The result is saved in the file /../../config/fred/fred_tree.js
 */

$spreadsheetsFilePath = "fred-v4.ods";

require_once('../_plugins/SpreadsheetReader/SpreadsheetReaderFactory.php');

$reader = SpreadsheetReaderFactory::reader($spreadsheetsFilePath);
$sheets = $reader->read($spreadsheetsFilePath);

//How many rows?
$rows = 433;

// Mapping short names to long names of the areas
$area_name_array = [
    "Heb" => "Hebrides",
    "MAN" => "Isle of Man",
    "Mid" => "Midlands",
    "N" => "North",
    "SCH" => "Scottish Highlands",
    "SCL" => "Scottish Lowlands",
    "SE" => "South East",
    "SW" => "South West",
    "Wal" => "Wales"
];

$area_array = [];
$county_array = [];
$location_array = [];

for ($i = 1; $i <= $rows; $i++) {

    $area = trim($sheets[0][$i][4]);
    $area_array[] = $area;
    $county = trim($sheets[0][$i][6]);

    $county_key = $area . "-" . $county;
    $county_array[$county_key] = $area;
    $location = trim($sheets[0][$i][8]);
    $location_key = $area . "-" . $county . "-" . $location;

    $location_array[$location_key] = $county_key;
}

$json_string_array = [];
$area_array = array_unique($area_array);

foreach ($area_array as $area) {
    $json_string_array[$area] = '
            {
                "id": "' . $area . '",
                "text": "' . $area_name_array[$area] . '",
                "parent": "#",
                "icon": false
            }';
}

ksort($county_array);

foreach ($county_array as $county => $area) {

    $county_text = substr($county, strrpos($county, "-") + 1);
    $json_string_array[$county] = '
            {
                "id": "' . $county . '",
                "text": "' . $county_text . '",
                "parent": "' . $area . '",
                "icon": false
            }';
}

ksort($location_array);

foreach ($location_array as $location => $county) {

    $location_text = substr($location, strrpos($location, "-") + 1);
    $json_string_array[$location] = '
            {
                "id": "' . $location . '",
                "text": "' . $location_text . '",
                "parent": "' . $county . '",
                "icon": false
            }';
}

$tree_file = __DIR__ . "/../../config/fred/fred_tree.js";

$content = "//Daten auf hierarschichen Baum\n";
$content .= "var tree_data_array = [];\n";
$content .= "tree_data_array['LOC_CLEAN_all_facet'] = [" . join(",", $json_string_array) . "];";

file_put_contents($tree_file, $content);
