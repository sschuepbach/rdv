<?php

/**
 * Replaces break br to \n 
 * @param string $input
 * @return string
 */
function br2nl($input) {
    return preg_replace('/<br(\s+)?\/?>/i', "\r\n", $input);
}

// file type (txt, bib ...)
$file_type = $_POST["file_type"];

// add current date to files nameIn Dateinaem das aktue
$date = date("Y-m-d");

header('Cache-Control: no-store, no-cache, must-revalidate, private, post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');
header("Content-Type: application/octet-stream");
header("Content-Disposition: attachment; filename=merkliste_$date.$file_type");

$file_content = $_POST["file_content"];

echo br2nl($file_content);
