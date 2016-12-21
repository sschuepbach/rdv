<?php

/**
 * Transforms the given data from a ods file to a solr index.
 */

header("Content-Type: text/html; charset=utf-8");

$FredsFilePath = "fred-s.ods";
$spreadsheetsFilePath = "fred-v4.ods";

$FulltextPath = "../../files/fred/text/";

require_once('../_plugins/Solr/Service.php');
require_once('../_plugins/SpreadsheetReader/SpreadsheetReaderFactory.php');

$solr = new Apache_Solr_Service("localhost", "8080", "solr/fred");

$solr->deleteByQuery("*:*");
$solr->commit();
$solr->optimize();

$freds_reader = SpreadsheetReaderFactory::reader($FredsFilePath);
$freds_sheets = $freds_reader->read($FredsFilePath);

// Collect in array what values are in FRED's. These are then marked with a specific flag
$freds_array = array();

for ($i = 1; $i <= 144; $i++) {

    //Get the mutliple fields
    $file_string = $freds_sheets[0][$i][1];

    $files = explode(",", $file_string);

    foreach ($files as $file) {
        $freds_array[] = $file;
    }
}

// Remove duplicated values ​​(faster search later)
$freds_array = array_unique($freds_array);

// Prepare ODS reader
$reader = SpreadsheetReaderFactory::reader($spreadsheetsFilePath);
$sheets = $reader->read($spreadsheetsFilePath);

// How many rows and columns does the document have?
$sheet0 = &$sheets[0];
$cols = 23;

// Create Index
$start = 1;

// Possibly. Lines themselves
$rows = 433;

// Go through data records, omit the first line (= column name)
for ($i = $start; $i <= $rows; $i++) {

    echo $i . "\n";

    // Create SOLR document
    $document = new Apache_Solr_Document();

    // ID = current Excel line
    $document->setField("id", $i);

    // Go over individual data records
    for ($j = 0; $j < $cols; $j++) {

        // Get and trim the value
        $value = trim($sheets[0][$i][$j]);

        // Field name is in line 1 of the same column
        $field = $sheets[0][0][$j];

        switch ($field) {

            //FILE can be a multiple field
            case "TEXTS":

                $files = explode(",", $value);

                foreach ($files as $file) {

                    $mode = "FRED";

                    if (in_array($file, $freds_array)) {
                        $mode = "FRED-S";
                    }

                    $document->setField("mode_sort_string", $mode);
                    $document->setField("mode_string", $mode);
                    $document->setField("mode_all_facet", $mode);

                    $document->setMultiValue($field . "_all_string", $file);

                    //Fulltext indexing. Check whether TXT file exists
                    $path = $FulltextPath . $file . ".txt";

                    if (is_file($path)) {

                        $myfile = fopen($path, "r");

                        $full_text = "";

                        while (!feof($myfile)) {
                            $full_text .= fgets($myfile);
                        }

                        fclose($myfile);

                        $document->setMultiValue("fulltext_all_text", $full_text);
                        $document->setMultiValue("all_text", $full_text);
                    }

                    $document->setMultiValue("file_all_string", $file);
                }

                $document->setField("file_sort_string", join(",", $files));
                break;

            case "ONLINE":

                $states = explode(",", $value);

                foreach ($states as $state) {

                    $document->setMultiValue("online_all_string", trim($state));
                }
                break;

            case 'SPEAKER_AGE':

                if ($value == "") {

                    $value = 0;
                }

                $document->setMultiValue("py_sort_string", $value);
                $document->setMultiValue("py_all_facet", $value);
                break;

            case 'LOC_CLEAN':

                //Create facet tree search value as a comboed area-county location name
                $county = $document->getField("COUNTY_CLEAN_all_string")["value"][0];
                $area = $document->getField("AREA_CLEAN_all_string")["value"][0];

                $document->setMultiValue($field . "_all_string", $value);
                $document->setMultiValue($field . "_all_text", $value);
                $document->setMultiValue($field . "_sort_string", $value);

                //For the facet-tree search, take the combined value
                $document->setMultiValue($field . "_all_facet", $area . "-" . $county . "-" . $value);

                //For number display in the tree search also save the ID of the county node
                $document->setMultiValue($field . "_all_facet", $area . "-" . $county);

                // For number display in the tree search also save the ID of the area node
                $document->setMultiValue($field . "_all_facet", $area);
                break;

            default:

                $document->setMultiValue($field . "_all_string", $value);
                $document->setMultiValue($field . "_all_text", $value);
                $document->setMultiValue($field . "_all_facet", $value);
                $document->setMultiValue($field . "_sort_string", $value);
                break;
        }
    }

    $solr->addDocument($document);
}

$solr->commit();
$solr->optimize();
